# pyright: reportUnannotatedClassAttribute=false
from datetime import datetime, timezone

from pydantic import BaseModel, Field
from sqlalchemy import CheckConstraint, DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.utils import Base


class Feedback(Base):
    __tablename__ = "feedbacks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    message: Mapped[str] = mapped_column(String(255), nullable=False)
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        CheckConstraint("rating >= 1 AND rating <= 5", name="rating_range"),
    )


class FeedbackCreate(BaseModel):
    name: str = Field(max_length=50)
    message: str = Field(max_length=255)
    rating: int = Field(ge=1, le=5)

    class Config:
        from_attributes = True


class FeedbackPublic(BaseModel):
    id: int
    name: str
    message: str
    rating: int
    created_at: datetime

    class Config:
        from_attributes = True
