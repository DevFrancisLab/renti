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
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"])

    session_id = request.POST.get("sessionId")
    service_code = request.POST.get("serviceCode")
    phone_number = request.POST.get("phoneNumber")
    text = (request.POST.get("text") or "").strip()

    user_response = text.split("*") if text else []

    # Helper: get tenant by phone number
    try:
        tenant = Tenant.objects.get(phone_number=phone_number)
    except ObjectDoesNotExist:
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