from fastapi import APIRouter

from app.controller.admin import router as admin_router
from app.controller.client import router as client_router
from app.controller.otp import router as otp_router

router = APIRouter(prefix="/v1")

router.include_router(otp_router)
router.include_router(admin_router)
router.include_router(client_router)
