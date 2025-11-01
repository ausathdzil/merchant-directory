from datetime import datetime

from pydantic import BaseModel
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class Message(BaseModel):
    message: str


class Status(BaseModel):
    ok: bool


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    sub: str | None = None
    exp: datetime | None = None


class PaginationMeta(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool
