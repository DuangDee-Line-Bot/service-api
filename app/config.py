import os

from dotenv import load_dotenv

from app._version import __version__

load_dotenv()

SV_NAME = "service-api"
VERSION = __version__
SV_HOST = os.getenv("SV_HOST", default="0.0.0.0")
SV_PORT = int(os.getenv("SV_PORT", default="8000"))

CLIENT_CHANNEL_ACCESS_TOKEN = os.getenv("CLIENT_CHANNEL_ACCESS_TOKEN", default="abc")
CLIENT_CHANNEL_SECRET = os.getenv("CLIENT_CHANNEL_SECRET", default="abc")
ADMIN_CHANNEL_ACCESS_TOKEN = os.getenv("ADMIN_CHANNEL_ACCESS_TOKEN", default="abc")
ADMIN_CHANNEL_SECRET = os.getenv("ADMIN_CHANNEL_SECRET", default="abc")

OTP_LENGTH = int(os.getenv("OTP_LENGTH", default=5))
OTP_EXPIRY = int(os.getenv("OTP_EXPIRY", default=180))  # 180 second

GROUP_ID = os.getenv("GROUP_ID", default="abc")
SERVICE_API_URL = os.getenv("SERVICE_API_URL", default="http://service-api:8000")
