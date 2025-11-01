from datetime import datetime, timezone
from typing import Any, ClassVar

from pydantic import EmailStr
from sqlmodel import Field, SQLModel  # pyright: ignore[reportUnknownVariableType]


class UserBase(SQLModel):
    name: str = Field(max_length=255)
    email: EmailStr = Field(unique=True, index=True, max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=255)


class UserUpdate(SQLModel):
    name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)
    current_password: str
    new_password: str = Field(min_length=8, max_length=255)


class User(UserBase, table=True):
    __tablename__: ClassVar[Any] = "users"  # pyright: ignore[reportExplicitAny]

    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UserPublic(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime


class UserLogin(SQLModel):
    email: EmailStr
    password: str
