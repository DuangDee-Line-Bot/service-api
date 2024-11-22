import logging

from fastapi import Request
from linebot import LineBotApi

from app import config as cfg
from app import serializers
from app.serializers.otp import Otp
from app.service import otp as service_otp
from app.utils import reply_msg, transform_event

admin_channel_secret = cfg.ADMIN_CHANNEL_SECRET
admin_bot_api = LineBotApi(cfg.ADMIN_CHANNEL_ACCESS_TOKEN)

logger = logging.getLogger(__name__)


async def webhook(request: Request):
    try:
        events: serializers.Event = await transform_event(request=request)

        logging.debug(
            f"Source GroupId: {events.source.groupId}, Config GroupId: {cfg.GROUP_ID}"
        )

        # handle admin group
        if (events.source.groupId is None) or (events.source.groupId != cfg.GROUP_ID):
            msg = "ใช้ได้แค่ในกลุ่มของ Admin น้ะจ้ะ"
            reply_msg(bot_api=admin_bot_api, reply_token=events.replyToken, msg=msg)
            return serializers.Message(message="Unauthorized group")

        # generate otp
        if events.message.type == "text":
            # validate input otp
            try:
                quota = int(events.message.text)
            except Exception:
                msg = "ข้อมูลรับเฉพาะตัวเลขเท่านั้น"
                reply_msg(bot_api=admin_bot_api, reply_token=events.replyToken, msg=msg)
                return serializers.Message(message=msg)

            # create otp
            otp: Otp = await service_otp.create(quota=quota)
            reply_msg(
                bot_api=admin_bot_api, reply_token=events.replyToken, msg=otp.value
            )
            logger.debug(f"Generated OTP: {otp.value}")
            return serializers.Message(message="Generated OTP")
    except Exception as e:
        logger.exception(f"{type(e).__name__}: {e}")
