# pyright: reportUnannotatedClassAttribute=false
from datetime import datetime, timezone

from pydantic import BaseModel
from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.utils import Base


class Feedback(Base):
    __tablename__ = "feedbacks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )


class FeedbackCreate(BaseModel):
    name: str
    message: str

    class Config:
        from_attributes = True


class FeedbackPublic(BaseModel):
    id: int
    name: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
