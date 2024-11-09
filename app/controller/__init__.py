from fastapi import APIRouter

from app.controller.otp import router as otp_router

router = APIRouter(prefix="/v1")

router.include_router(otp_router)
