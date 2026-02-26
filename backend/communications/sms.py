"""Simple Africa's Talking SMS helper for the Renti project.

This module provides a very small wrapper around the official
``africastalking`` Python SDK.  The USSD view only requires a
``send_sms`` function so that it can send confirmations and error
notifications; during local development the function is safe to call
even if the AT credentials are missing (it will just log instead of
raising).

If the production deployment has the usual environment variables set
(``AFRICAS_TALKING_USERNAME``, ``AFRICAS_TALKING_API_KEY`` and
``AFRICAS_TALKING_SHORTCODE``) the helper will initialize the SDK once
and reuse the ``SMS`` service object for subsequent calls.
"""

import logging
import os

from django.conf import settings

logger = logging.getLogger(__name__)

_sms_client = None

# Development mode: if USSD_SMS_MOCK is set, SMS will be logged but not actually sent
USSD_SMS_MOCK = os.getenv("USSD_SMS_MOCK", "false").lower() == "true"


def format_phone(phone: str) -> str:
    """Normalize common Kenyan phone formats to international form.

    - ``07XXXXXXXX`` -> ``+2547XXXXXXXX``
    - ``2547XXXXXXX`` -> ``+2547XXXXXXX``
    - ``+2547XXXXXXX`` -> unchanged

    This is a very lightweight helper used by ``send_sms`` so callers
    don't need to worry about formatting.
    """

    if not phone:
        return phone
    phone = phone.strip()
    if phone.startswith("+254"):
        return phone
    if phone.startswith("07") and len(phone) == 10 and phone[1:].isdigit():
        return "+254" + phone[1:]
    if phone.startswith("254") and phone[3:].isdigit():
        return "+" + phone
    return phone


def _initialise_client() -> object:
    """Initialise and return an Africa's Talking SMS client.

    The SDK requires ``africastalking.initialize`` to be called before
    accessing ``africastalking.SMS``.  We cache the result so that the
    expensive initialisation only happens once per process.
    """

    import africastalking

    # prefer sandbox credentials when available, falling back to the
    # production values.  These are loaded from environment variables
    # rather than Django settings so tests / CI can easily override
    # them.
    username = os.getenv("AFRICAS_TALKING_USERNAME_SANDBOX") or os.getenv(
        "AFRICAS_TALKING_USERNAME"
    )
    api_key = os.getenv("AFRICAS_TALKING_API_KEY_SANDBOX") or os.getenv(
        "AFRICAS_TALKING_API_KEY"
    )

    if not username or not api_key:
        raise RuntimeError("Africa's Talking credentials not configured")

    africastalking.initialize(username, api_key)
    return africastalking.SMS


def _get_client() -> object:
    global _sms_client
    if _sms_client is None:
        _sms_client = _initialise_client()
    return _sms_client


def send_sms(to: str, message: str) -> object | None:
    """Send an SMS to a single recipient.

    Parameters
    ----------
    to : str
        Phone number in international format (e.g. ``+254712345678``).
    message : str
        Text to transmit.  The Africa's Talking service will handle
        concatenation if the string is longer than the 160 character
        SMS limit.

    Returns
    -------
    object | None
        The raw response from the Africa's Talking SDK, or ``None`` if
        sending failed or the helper was running in stub mode.
    """

    # normalise the destination phone number first
    to = format_phone(to)

    # Mock/development mode: log SMS to file and logger
    if USSD_SMS_MOCK:
        log_entry = f"[MOCK] SMS to {to}: {message}"
        logger.info(log_entry)
        
        # Also write to a file for easier debugging
        try:
            with open('/tmp/renti_sms_log.txt', 'a') as f:
                from datetime import datetime
                timestamp = datetime.now().isoformat()
                f.write(f"{timestamp} | {log_entry}\n")
        except Exception as e:
            logger.warning("Failed to write SMS to log file: %s", e)
        
        return {"status": "mock", "message": "SMS logged in mock mode"}

    try:
        sms = _get_client()
        # prefer sandbox-specific sender ID first, then fall back to the
        # generic environment variable or settings value.
        sender = os.getenv("AFRICAS_TALKING_SMS_SHORTCODE_SANDBOX") or os.getenv(
            "AFRICAS_TALKING_SMS_SHORTCODE"
        )
        if not sender:
            sender = getattr(settings, "AFRICAS_TALKING_SMS_SHORTCODE", None)
            if not sender:
                sender = getattr(settings, "AFRICAS_TALKING_SHORTCODE", None)
        # `sender` is optional; if not provided the default from the AT
        # dashboard will be used.
        result = sms.send(message, [to], sender_id=sender)
        logger.info("SMS sent successfully to %s (result: %s)", to, result)
        return result
    except Exception as e:
        # If the credentials are missing or invalid we log and swallow the error so
        # that development/test runs don't break when ``send_sms`` is
        # called.  The USSD view already handles logging for its own
        # exceptions, so this is purely defensive.
        logger.warning("failed to send sms to %s: %s", to, str(e))
        logger.debug("SMS to %s would have contained: %s", to, message)
        return None
