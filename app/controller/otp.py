from fastapi import APIRouter

from app.service import otp as service_otp

router = APIRouter(prefix="/otp", tags=["Otp"])

router.get("")(service_otp.get_many)
router.get("/{value}")(service_otp.get_one)
router.post("")(service_otp.create)
router.patch("/{value}")(service_otp.update)
router.delete("/{value}")(service_otp.delete)
