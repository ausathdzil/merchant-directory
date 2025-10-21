from contextlib import asynccontextmanager
from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine

from app.config import settings


DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield
    engine.dispose()
