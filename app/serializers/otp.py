from datetime import datetime

from pydantic import BaseModel


class Otp(BaseModel):
    value: str
    created_at: datetime
    expired_at: datetime
    quota: int
    used_for: str | None = None


class CreateOtp(BaseModel):
    quota: int


class UpdateOtp(BaseModel):
    quota: int | None = None
    used_for: str | None = None
