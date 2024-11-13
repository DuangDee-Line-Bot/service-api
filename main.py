import logging

from fastapi import FastAPI

from app.controller import router

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

app = FastAPI()

app.include_router(router, prefix="/api")
