from fastapi import APIRouter

from app.service import admin as service_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

router.post("")(service_admin.webhook)
