import logging

from fastapi import Request
from linebot import LineBotApi

from app import config as cfg
from app import serializers
from app.service import db as service_db
from app.service import otp as service_otp
from app.utils import reply_msg, transform_event

client_channel_secret = cfg.CLIENT_CHANNEL_SECRET
client_bot_api = LineBotApi(cfg.CLIENT_CHANNEL_ACCESS_TOKEN)

logger = logging.getLogger(__name__)

# TODO:
# - cronjob: expire remove in the list
# - deployment
# - more testing workflow
# - change data souurce
# - deployment


async def webhook(request: Request):
    try:
        events: serializers.Event = await transform_event(request=request)

        exist_otp = await is_exist_otp(
            user_id=events.source.userId,
            reply_token=events.replyToken,
            msg=events.message.text,
        )
        if exist_otp:
            return serializers.Message(message="Generated Prediction.")
        elif exist_otp is None:
            return serializers.Message(message="Query does not correct.")

        otp: serializers.Otp | None = await service_otp.get_one(events.message.text)
        if is_not_exist_otp(otp=otp, reply_token=events.replyToken):
            return serializers.Message(message="OTP does not exist, used or expired!")
        else:
            await is_validate_otp(
                value=otp.value,
                user_id=events.source.userId,
                reply_token=events.replyToken,
            )
            return serializers.Message(message="Validated OTP")
    except Exception as e:
        logger.exception(f"{type(e).__name__}: {e}")


"""Validation"""


async def is_exist_otp(user_id: str, reply_token: str, msg: str) -> bool | None:
    """Find the exist otp owner user which will show the prediction result and
    update the otp unable to use."""
    owner_unuse_otp_list = await service_otp.get_one_by_used_for(used_for=user_id)
    if len(owner_unuse_otp_list) != 0:
        # select the latest otp
        latest_otp = owner_unuse_otp_list[0]

        if service_db.find_data(
            bot_api=client_bot_api, reply_token=reply_token, msg=msg
        ):
            # update when query correctly
            await service_otp.update(
                value=latest_otp.value,
                request=serializers.UpdateOtp(is_used=True, used_for=user_id),
            )
            return True
        else:
            # in case authen pass but query not right format
            return None
    return False


async def is_validate_otp(value: str, user_id: str, reply_token: str):
    """Validated OTP for specific user."""
    await service_otp.update(
        value=value, request=serializers.UpdateOtp(is_used=False, used_for=user_id)
    )
    msg = "OTP ของคุณถูกต้อง"
    reply_msg(bot_api=client_bot_api, reply_token=reply_token, msg=msg)


def is_not_exist_otp(otp: serializers.Otp | None, reply_token: str) -> bool:
    """Check if the OTP is invalid or already used, and reply with a
    corresponding message."""
    if otp is None:
        msg = "OTP ไม่ตรงกันหรืออาจหมดอายุ โปรดส่งรหัส OTP ใหม่อีกครั้ง"
    elif otp.is_used:
        msg = "OTP ถูกใช้งานไปแล้ว"
    else:
        return False

    reply_msg(bot_api=client_bot_api, reply_token=reply_token, msg=msg)
    return True
