import random
import string
from datetime import timedelta

from app import config as cfg
from app import serializers
from app.utils import get_current_datetime

otp_db: list[serializers.Otp] = []
"""Get."""


async def get_one(value: str) -> serializers.Otp | None:
    """Get One."""
    return next((otp for otp in otp_db if otp.value == value), None)


async def get_one_by_used_for(used_for: str) -> list[serializers.Otp] | None:
    """Get One by using `user_id` property."""
    return [otp for otp in otp_db if otp.used_for == used_for and not otp.is_used]


async def get_many() -> list[serializers.Otp]:
    """Get Many."""
    return otp_db


"""Post"""


async def create() -> serializers.Otp:
    """Create a Otp."""
    otp = serializers.Otp(
        value=generate_otp(),
        created_at=get_current_datetime(),
        expired_at=(get_current_datetime() + timedelta(seconds=cfg.OTP_EXPIRY)),
        is_used=False,
        used_for=None,
    )
    otp_db.append(otp)
    return otp


"""Update"""


async def update(value: str, request: serializers.UpdateOtp) -> serializers.Otp | None:
    """Update an Otp by value."""
    otp = await get_one(value)
    if otp:
        # Update only provided fields (skip None values)
        for key, val in request.dict(exclude_none=True).items():
            setattr(otp, key, val)
        return otp
    return serializers.Message(message="Not Found Otp")


"""Delete"""


async def delete(value: str) -> serializers.Otp | serializers.Message:
    """Delete an Otp by value."""
    otp = await get_one(value)
    if otp is None:
        return serializers.Message(message="Not Found Otp")
    otp_db.remove(otp)
    return otp


def generate_otp() -> str:
    """Random Otp value."""
    return "".join(
        random.choices(string.ascii_uppercase + string.digits, k=cfg.OTP_LENGTH)
    )
