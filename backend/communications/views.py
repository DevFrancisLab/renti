import logging

from django.http import HttpResponse, HttpResponseNotAllowed
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt

logger = logging.getLogger(__name__)


@csrf_exempt
def ussd(request):
    if request.method != "POST":
        return HttpResponseNotAllowed(["POST"]) 

    # Basic logging of incoming request for debugging (only when DEBUG=True)
    if getattr(settings, 'DEBUG', False):
        try:
            headers = {k: v for k, v in request.META.items() if k.startswith('HTTP_') or k in ('CONTENT_TYPE', 'CONTENT_LENGTH')}
            logger.debug('USSD request headers: %s', headers)
            logger.debug('USSD raw body (first 1024 bytes): %s', request.body[:1024].decode('utf-8', errors='replace'))
        except Exception:
            logger.exception('Failed to log incoming USSD request')

    session_id = request.POST.get("sessionId")
    service_code = request.POST.get("serviceCode")
    phone_number = request.POST.get("phoneNumber")
    text = (request.POST.get("text") or "").strip()

    # If provider sent JSON or request.POST is empty, try to parse raw body
    if not request.POST:
        raw = request.body.decode("utf-8", errors="replace")
        logger.info("USSD raw body: %s", raw)
        content_type = request.META.get("CONTENT_TYPE", "")
        if "application/json" in content_type:
            try:
                import json

                obj = json.loads(raw)
                session_id = obj.get("sessionId") or session_id
                service_code = obj.get("serviceCode") or service_code
                phone_number = obj.get("phoneNumber") or phone_number
                text = (obj.get("text") or text).strip()
            except Exception:
                logger.exception("Failed to parse JSON USSD body")
        else:
            # parse as urlencoded
            try:
                from urllib.parse import parse_qs

                parsed = parse_qs(raw)
                # parse_qs returns lists for values
                session_id = parsed.get("sessionId", [session_id])[0]
                service_code = parsed.get("serviceCode", [service_code])[0]
                phone_number = parsed.get("phoneNumber", [phone_number])[0]
                text = parsed.get("text", [text])[0].strip()
            except Exception:
                logger.exception("Failed to parse raw USSD body")

    user_response = text.split("*") if text else []
    first = user_response[0] if len(user_response) > 0 else None

    try:
        # Main Menu
        if text == "":
            response = (
                "CON Karibu Renti\n"
                "1. Check Rent Balance\n"
                "2. Report Maintenance"
            )

        # Option 1 — Rent Balance
        elif first == "1":
            rent_balance = "KES 12,000"  # TODO: fetch from DB using phone_number/session_id
            response = f"END Your rent balance is {rent_balance}"

        # Option 2 — Maintenance
        elif first == "2":
            if len(user_response) == 1:
                response = (
                    "CON Select Issue Type\n"
                    "1. Plumbing\n"
                    "2. Electricity\n"
                    "3. Other"
                )
            elif len(user_response) == 2:
                issue_map = {"1": "Plumbing", "2": "Electricity", "3": "Other"}
                issue = issue_map.get(user_response[1], "Other")
                # TODO: save maintenance request in DB (include phone_number/session_id)
                response = f"END Maintenance request for {issue} submitted successfully."
            else:
                response = "END Invalid selection"

        else:
            response = "END Invalid option"

    except Exception:
        logger.exception("Error handling USSD request (session=%s phone=%s)", session_id, phone_number)
        response = "END An error occurred. Please try again later."

    return HttpResponse(response, content_type="text/plain; charset=utf-8")