"""Password reset OTP delivery and verification helpers.

Provider credentials are read only from backend environment variables. OTP values
are never persisted or returned to callers.
"""

from __future__ import annotations

import hashlib
import hmac
import secrets
from dataclasses import dataclass

import httpx

from app.core.config import settings


class ResetDeliveryUnavailable(RuntimeError):
    """Raised when no configured provider can deliver the requested channel."""


@dataclass(frozen=True)
class DeliveryTarget:
    channel: str
    destination: str


def generate_otp() -> str:
    return f"{secrets.randbelow(1_000_000):06d}"


def digest_otp(otp: str) -> str:
    return hmac.new(
        settings.jwt_secret.encode("utf-8"),
        otp.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def otp_matches(otp: str, digest: str | None) -> bool:
    return bool(digest) and hmac.compare_digest(digest_otp(otp), digest)


def mask_destination(channel: str, destination: str) -> str:
    if channel == "email":
        local, _, domain = destination.partition("@")
        if len(local) <= 2:
            masked_local = "*" * len(local)
        else:
            masked_local = local[0] + "*" * (len(local) - 2) + local[-1]
        return f"{masked_local}@{domain}"
    digits = "".join(ch for ch in destination if ch.isdigit())
    return f"+{'*' * max(0, len(digits) - 4)}{digits[-4:]}"


def choose_target(user, requested_channel: str) -> DeliveryTarget:
    channel = requested_channel.lower().strip()
    email_ready = bool(user.email and settings.brevo_api_key and settings.brevo_sender_email)
    sms_ready = bool(user.phone and settings.msg91_authkey and settings.msg91_otp_template_id)
    if channel == "email" and email_ready:
        return DeliveryTarget("email", user.email.strip().lower())
    if channel == "sms" and sms_ready:
        return DeliveryTarget("sms", user.phone.strip())
    if channel in {"auto", ""}:
        if email_ready:
            return DeliveryTarget("email", user.email.strip().lower())
        if sms_ready:
            return DeliveryTarget("sms", user.phone.strip())
    raise ResetDeliveryUnavailable("No password reset delivery provider is configured for this account")


async def deliver_otp(target: DeliveryTarget, otp: str, name: str | None = None) -> None:
    if target.channel == "email":
        payload = {
            "sender": {"name": settings.brevo_sender_name, "email": settings.brevo_sender_email},
            "to": [{"email": target.destination, "name": name or "Civic Sathi user"}],
            "subject": "Civic Sathi password reset code",
            "textContent": (
                f"Your Civic Sathi password reset code is {otp}. "
                f"It expires in {settings.password_reset_otp_ttl_seconds // 60} minutes."
            ),
            "htmlContent": (
                "<p>Your Civic Sathi password reset code is "
                f"<strong>{otp}</strong>.</p><p>It expires in "
                f"{settings.password_reset_otp_ttl_seconds // 60} minutes.</p>"
            ),
        }
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                "https://api.brevo.com/v3/smtp/email",
                headers={"accept": "application/json", "api-key": settings.brevo_api_key or ""},
                json=payload,
            )
    else:
        response = None
        async with httpx.AsyncClient(timeout=15) as client:
            response = await client.post(
                "https://control.msg91.com/api/v5/otp",
                params={
                    "template_id": settings.msg91_otp_template_id,
                    "mobile": target.destination,
                    "authkey": settings.msg91_authkey,
                },
                headers={"content-type": "application/json"},
                json={"OTP": otp},
            )
    if response is None or response.status_code >= 300:
        detail = response.text[:300] if response is not None else "provider did not respond"
        raise RuntimeError(f"OTP provider rejected the delivery request: {detail}")
