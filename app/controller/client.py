from fastapi import APIRouter

from app.service import client as service_client

router = APIRouter(prefix="/client", tags=["Client"])

router.post("")(service_client.webhook)
