from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine

from app.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield
    engine.dispose()
