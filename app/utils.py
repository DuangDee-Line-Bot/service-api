from datetime import UTC, datetime
from typing import TypeVar

from fastapi import Request
from linebot import LineBotApi
from linebot.models import TextSendMessage

from app import serializers

T = TypeVar("T")


def get_current_datetime() -> datetime:
    return datetime.now(tz=UTC)


def reply_msg(bot_api: LineBotApi, reply_token: str, msg: str):
    bot_api.reply_message(reply_token, TextSendMessage(text=msg))


async def transform_event(request: Request) -> serializers.Event:
    """Collect the Event."""
    body = await request.body()
    body = body.decode("utf-8")
    payload = serializers.WebhookPayLoad.parse_raw(body)
    return payload.events[0]
