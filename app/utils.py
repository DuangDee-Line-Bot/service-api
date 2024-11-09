from datetime import UTC, datetime
from typing import TypeVar

T = TypeVar("T")


def get_current_datetime() -> datetime:
    return datetime.now(tz=UTC)
