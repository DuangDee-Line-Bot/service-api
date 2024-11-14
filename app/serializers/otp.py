from datetime import datetime

from pydantic import BaseModel


class Otp(BaseModel):
    value: str
    created_at: datetime
    expired_at: datetime
    is_used: bool
    used_for: str | None = None


class UpdateOtp(BaseModel):
    is_used: bool | None = None
    used_for: str | None = None
