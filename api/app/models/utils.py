from datetime import datetime
from sqlmodel import SQLModel


class Message(SQLModel):
    message: str


class Status(SQLModel):
    ok: bool


class Token(SQLModel):
    token: str
    type: str


class TokenPayload(SQLModel):
    sub: str | None = None
    type: str | None = None
    exp: datetime | None = None
