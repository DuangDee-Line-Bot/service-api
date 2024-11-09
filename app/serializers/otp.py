from pydantic import BaseModel
from datetime import datetime


class Otp(BaseModel):
    value: str
    created_at: datetime
    expired_at: datetime
    is_authen: bool
    is_used: bool


class UpdateOtp(BaseModel):
    is_authen: bool | None = None
    is_used: bool | None = None
