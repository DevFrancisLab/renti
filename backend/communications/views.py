import logging

from django.http import HttpResponse, HttpResponseNotAllowed
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist

from communications.sms import send_sms  # your Africa's Talking SMS helper
from tenants.models import Tenant, Property, MaintenanceRequest  # example models

logger = logging.getLogger(__name__)


@csrf_exempt
def ussd(request):
    # Some USSD gateways (including the AT simulator) issue the first
    # request as a GET rather than a POST.  ``HttpResponseNotAllowed``
    # results in a 405 which the simulator just displays as an error, and
    # this was the reason the menu "didn't work" earlier.  We accept
    # both POST and GET and simply read form values from the appropriate
    # dict below.
    if request.method not in ("POST", "GET"):
        return HttpResponseNotAllowed(["POST", "GET"])

    data = request.POST if request.method == "POST" else request.GET

    # log the incoming payload for debugging; the simulator can be
    # configured to POST or GET and sometimes sends slightly different
    # field names, so having the raw data in the logs makes investigations
    # easier.
    logger.debug(
        "USSD request method=%s data=%s",
        request.method,
        data.dict(),
    )

    session_id = data.get("sessionId")
    service_code = data.get("serviceCode")

    # if we have a configured service code we should reject requests that
    # don't match it; this prevents other gateways from accidentally
    # invoking our handler and makes debugging easier.
    from django.conf import settings as _settings
    expected = getattr(_settings, "AFRICAS_TALKING_SERVICE_CODE", None)
    if expected and service_code != expected:
        # log at info so we can see mismatches without triggering the
        # exception handler.  we still return 200 since AT treats anything
        # else as a gateway error.
        logger.info("received serviceCode %r but expected %r", service_code, expected)
        return HttpResponse("END Invalid service code", content_type="text/plain; charset=utf-8")
    phone_number = data.get("phoneNumber")

    # normalise a few common formats so lookups succeed later.  the AT
    # simulator may supply ``+254…`` (often urlencoded as ``%2B254``),
    # but our test device was sending the short local form ``0707274525``.
    # for now we treat the latter as an alias for ``+254707274525`` so the
    # menu can be exercised without having to create a tenant in the
    # database each time.  later this should be replaced by proper
    # validation/formatting logic (e.g. using ``phonenumbers``).
    if phone_number:
        phone_number = phone_number.strip()
        if phone_number.startswith(" ") and phone_number[1:].isdigit():
            phone_number = "+" + phone_number.lstrip()
        # convert common local prefix
        if phone_number.startswith("0") and phone_number[1:].isdigit():
            # assume Kenyan number; translate 0xxxx -> +2540xxxx
            phone_number = "+254" + phone_number[1:]

    # normalise the number; the AT simulator (and many USSD gateways)
    # send the payload using ``application/x-www-form-urlencoded``.  In a
    # URL the ``+`` character is interpreted as a space unless it is
    # percent-encoded, so we frequently see incoming values like
    # ``" 254700000000"`` when the real number is ``+254700000000``.  To
    # make our lookups more forgiving we strip whitespace and, if the
    # number begins with a space followed by digits, re‑prefix a ``+``.
    if phone_number:
        phone_number = phone_number.strip()
        # If urlencoded ``+`` became a space, reinstate it before lookup
        if phone_number.startswith(" ") and phone_number[1:].isdigit():
            phone_number = "+" + phone_number.lstrip()
    # Note: leaving ``phone_number`` as ``None`` when the parameter was
    # completely missing allows us to report a more helpful error later.
    text = (data.get("text") or "").strip()

    # debug helpers: log database path and tenant count so we can verify
    # the instance is looking at the same sqlite file that the shell sees.
    from django.conf import settings as _settings
    try:
        from django.db import connection as _conn
        _db_name = _settings.DATABASES["default"]["NAME"]
        logger.debug("using database %r, connection alias %s", _db_name, _conn.alias)
        # carefully import Tenant inside here to avoid circular import issues
        from tenants.models import Tenant as _Tenant
        logger.debug("tenant count (phone=%r) = %d",
                     phone_number,
                     _Tenant.objects.filter(phone_number=phone_number).count(),
        )
    except Exception:
        logger.exception("failed to log database debug info")

    user_response = text.split("*") if text else []

    # Helper: get tenant by phone number.  for development we allow a
    # fallback number so that testers can dial in without having to create
    # a record manually.
    try:
        tenant = Tenant.objects.get(phone_number=phone_number)
    except ObjectDoesNotExist:
        # if this is our hard‑coded test number, create a dummy tenant on
        # the fly.  we keep the name short so SMS confirmations still work.
        if phone_number in ("+254707274525",):
            tenant = Tenant.objects.create(name="Test User", phone_number=phone_number)
        else:
            response = "END Sorry, your number is not registered with Renti."
            send_sms(phone_number, f"Renti: Your number is not registered. Please contact your landlord.")
            return HttpResponse(response, content_type="text/plain; charset=utf-8")

    try:
        # MAIN MENU
        if len(user_response) == 0:
            response = (
                f"CON Karibu {tenant.name}!\n"
                "1. Check Rent Balance\n"
                "2. Report Maintenance"
            )

        # OPTION 1 — Check Rent Balance
        elif user_response[0] == "1":
            # Step 1: Ask for Property if not yet entered
            if len(user_response) == 1:
                response = "CON Enter Property Name or Number:"
            # Step 2: Verify Property
            elif len(user_response) == 2:
                property_name = user_response[1].strip()
                # use filter() here to avoid MultipleObjectsReturned and make intent clearer
                property_obj = (
                    Property.objects.filter(name__iexact=property_name, tenants=tenant)
                    .first()
                )
                if property_obj:
                    response = "CON Enter Room/Unit Number:"
                else:
                    response = "END Sorry, you are not registered for this property."
                    send_sms(
                        phone_number,
                        f"Renti: Dear {tenant.name}, you are not registered for {property_name}. Contact your landlord.",
                    )
            # Step 3: Verify Room and display balance
            elif len(user_response) == 3:
                property_name = user_response[1].strip()
                room_number = user_response[2].strip()
                property_obj = (
                    Property.objects.filter(name__iexact=property_name, tenants=tenant)
                    .first()
                )
                if property_obj and room_number in property_obj.get_rooms_for_tenant(tenant):
                    rent_balance = tenant.get_rent_balance(property_obj, room_number)
                    response = (
                        f"END Your rent balance for {property_obj.name}, Room {room_number} is {rent_balance}"
                    )
                    # Send SMS confirmation
                    send_sms(
                        phone_number,
                        f"Dear {tenant.name}, your rent balance for {property_obj.name}, Room {room_number} is {rent_balance}.",
                    )
                else:
                    response = "END Sorry, you are not registered for this room."
                    send_sms(
                        phone_number,
                        f"Renti: Dear {tenant.name}, you are not registered for Room {room_number} at {property_name}.",
                    )
            else:
                # catch excessive input segments to avoid unbound response
                response = "END Invalid selection."

        # OPTION 2 — Report Maintenance
        elif user_response[0] == "2":
            # Step 1: Property
            if len(user_response) == 1:
                response = "CON Enter Property Name or Number:"
            # Step 2: Room
            elif len(user_response) == 2:
                property_name = user_response[1].strip()
                try:
                    property_obj = Property.objects.get(name__iexact=property_name, tenants=tenant)
                    response = "CON Enter Room/Unit Number:"
                except ObjectDoesNotExist:
                    response = "END Sorry, you are not registered for this property."
                    send_sms(phone_number,
                             f"Renti: Dear {tenant.name}, you are not registered for {property_name}. Contact your landlord.")
            # Step 3: Issue Description
            elif len(user_response) == 3:
                property_name = user_response[1].strip()
                room_number = user_response[2].strip()
                try:
                    property_obj = Property.objects.get(name__iexact=property_name, tenants=tenant)
                    if room_number not in property_obj.get_rooms_for_tenant(tenant):
                        raise ObjectDoesNotExist
                    response = "CON Describe the issue (e.g., leaking tap, broken window):"
                except ObjectDoesNotExist:
                    response = "END Sorry, you are not registered for this room."
                    send_sms(phone_number,
                             f"Renti: Dear {tenant.name}, you are not registered for Room {room_number} at {property_name}.")
            # Step 4: Capture Issue and Confirm
            elif len(user_response) == 4:
                property_name = user_response[1].strip()
                room_number = user_response[2].strip()
                issue_description = user_response[3].strip()
                try:
                    property_obj = Property.objects.get(name__iexact=property_name, tenants=tenant)
                    if room_number not in property_obj.get_rooms_for_tenant(tenant):
                        raise ObjectDoesNotExist
                    # Save maintenance request
                    request_obj = MaintenanceRequest.objects.create(
                        tenant=tenant,
                        property=property_obj,
                        room_number=room_number,
                        description=issue_description
                    )
                    response = "END Maintenance request submitted successfully!"
                    send_sms(phone_number,
                             f"Dear {tenant.name}, your maintenance request has been received:\n"
                             f"Property: {property_obj.name}\nRoom: {room_number}\nIssue: {issue_description}\n"
                             "Reply with additional details if needed.")
                except ObjectDoesNotExist:
                    response = "END Sorry, you are not registered for this room."
                    send_sms(phone_number,
                             f"Renti: Dear {tenant.name}, you are not registered for Room {room_number} at {property_name}.")
            else:
                response = "END Invalid selection."

        else:
            response = "END Invalid option"

    except Exception:
        logger.exception("Error handling USSD request (session=%s phone=%s)", session_id, phone_number)
        response = "END An error occurred. Please try again later."

    return HttpResponse(response, content_type="text/plain; charset=utf-8")