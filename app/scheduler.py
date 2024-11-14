import logging

from app.service import otp as service_otp
from app.utils import get_current_datetime


async def delete_expired_otps():
    """Task to delete expired OTPs."""
    now = get_current_datetime()
    expired_otps = [otp for otp in service_otp.otp_db if otp.expired_at < now]

    if expired_otps:
        for otp in expired_otps:
            await service_otp.delete(value=otp.value)
            logging.debug(f"Deleted expired OTP: {otp.value}")
        logging.debug(f"Cronjob at {now} deleted {len(expired_otps)} expired OTPs.")
