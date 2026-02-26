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

from django.conf import settings

logger = logging.getLogger(__name__)

_sms_client = None


def _initialise_client() -> object:
    """Initialise and return an Africa's Talking SMS client.

    The SDK requires ``africastalking.initialize`` to be called before
    accessing ``africastalking.SMS``.  We cache the result so that the
    expensive initialisation only happens once per process.
    """

    import africastalking

    username = getattr(settings, "AFRICAS_TALKING_USERNAME", None)
    api_key = getattr(settings, "AFRICAS_TALKING_API_KEY", None)

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

    try:
        sms = _get_client()
        # prefer the new SMS-specific variable, but fall back to the legacy
        # name if it exists so existing .env files don't break immediately.
        sender = getattr(settings, "AFRICAS_TALKING_SMS_SHORTCODE", None)
        if sender is None:
            sender = getattr(settings, "AFRICAS_TALKING_SHORTCODE", None)
        # `sender` is optional; if not provided the default from the AT
        # dashboard will be used.
        return sms.send(message, [to], sender_id=sender)
    except Exception:
        # If the credentials are missing we log and swallow the error so
        # that development/test runs don't break when ``send_sms`` is
        # called.  The USSD view already handles logging for its own
        # exceptions, so this is purely defensive.
        logger.exception("failed to send sms to %s", to)
        return None
