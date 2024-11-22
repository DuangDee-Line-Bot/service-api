import logging

from fastapi import Request
from linebot import LineBotApi

from app import config as cfg
from app import serializers
from app.serializers.message import Message
from app.serializers.otp import Otp
from app.service import db as service_db
from app.service import otp as service_otp
from app.utils import reply_msg, transform_event

client_channel_secret = cfg.CLIENT_CHANNEL_SECRET
client_bot_api = LineBotApi(cfg.CLIENT_CHANNEL_ACCESS_TOKEN)

logger = logging.getLogger(__name__)


async def webhook(request: Request) -> Message:
    """Handle webhook requests and process OTP validation."""
    try:
        # Transform and deserialize the incoming request
        events: serializers.Event = await transform_event(request=request)

        # Get Message Content
        user_id, reply_token, msg = (
            events.source.userId,
            events.replyToken,
            events.message.text,
        )
        # Get Exist OTP
        exist_quota_otp: int | None = await check_existing_otp(
            user_id=user_id, reply_token=reply_token, msg=msg
        )
        if exist_quota_otp > 0:
            return serializers.Message(message="Generated Prediction.")
        elif exist_quota_otp is None:
            return serializers.Message(message="Query is not correct.")

        # Retrieve OTP by message content
        otp: serializers.Otp | None = await service_otp.get_one(msg)
        if handle_invalid_otp(otp=otp, reply_token=reply_token):
            return serializers.Message(message="OTP does not exist, used, or expired!")

        # Validate the OTP
        await validate_otp(value=otp.value, user_id=user_id, reply_token=reply_token)
        return serializers.Message(message="Validated OTP")

    except Exception as e:
        logger.exception(f"Unhandled exception: {type(e).__name__}: {e}")
        return serializers.Message(message="An error occurred. Please try again later.")


"""Validation"""


async def check_existing_otp(user_id: str, reply_token: str, msg: str) -> int | None:
    """Check if a user has an existing unused OTP and process the prediction
    result."""
    owner_unuse_otp_list = await service_otp.get_one_by_used_for(used_for=user_id)

    if owner_unuse_otp_list:
        # Use the latest OTP
        latest_otp: Otp = owner_unuse_otp_list[0]

        if service_db.find_data(
            bot_api=client_bot_api, reply_token=reply_token, msg=msg
        ):
            # Update OTP status quota
            updated_quota: int = latest_otp.quota - 1
            await service_otp.update(
                value=latest_otp.value,
                request=serializers.UpdateOtp(quota=updated_quota, used_for=user_id),
            )
            return updated_quota
        else:
            # Query format is incorrect
            return None

    return 0


async def validate_otp(value: str, user_id: str, reply_token: str):
    """Validate OTP for a specific user and mark it as used."""
    await service_otp.update(
        value=value, request=serializers.UpdateOtp(used_for=user_id)
    )
    reply_msg(bot_api=client_bot_api, reply_token=reply_token, msg="OTP ของคุณถูกต้อง")


def handle_invalid_otp(otp: serializers.Otp | None, reply_token: str) -> bool:
    """Handle cases where the OTP is invalid, used, or expired."""
    if otp is None:
        msg = "OTP ไม่ตรงกันหรืออาจหมดอายุ โปรดส่งรหัส OTP ใหม่อีกครั้ง"
    elif otp == 0:
        msg = "OTP ถูกใช้งานไปแล้ว หรือครบโควต้าแล้ว"
    else:
        return False

    reply_msg(bot_api=client_bot_api, reply_token=reply_token, msg=msg)
    return True
