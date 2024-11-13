from datetime import UTC, datetime
from typing import TypeVar

from linebot import LineBotApi
from linebot.models import TextSendMessage

T = TypeVar("T")


def get_current_datetime() -> datetime:
    return datetime.now(tz=UTC)


def reply_msg(bot_api: LineBotApi, reply_token: str, msg: str):
    bot_api.reply_message(reply_token, TextSendMessage(text=msg))
