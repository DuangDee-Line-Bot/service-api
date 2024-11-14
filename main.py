import logging

import uvicorn
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fastapi import FastAPI

from app.controller import router
from app.scheduler import delete_expired_otps

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

app = FastAPI()

app.include_router(router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    """Schedule cronjob to run every 24 hours."""
    scheduler = AsyncIOScheduler()
    scheduler.add_job(delete_expired_otps, "interval", minutes=1)
    scheduler.start()


if __name__ == "__main__":
    uvicorn.run(app=app)
