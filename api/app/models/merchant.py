# pyright: reportUnannotatedClassAttribute=false
from datetime import datetime, timezone

from pydantic import BaseModel
from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import TSVECTOR
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.utils import Base, PaginationMeta


class Merchant(Base):
    __tablename__ = "merchants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    google_place_id: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(500), nullable=False)
    display_name: Mapped[str | None] = mapped_column(String(500))
    primary_type: Mapped[str | None] = mapped_column(String(100), index=True)

    formatted_address: Mapped[str | None] = mapped_column(Text)
    short_address: Mapped[str | None] = mapped_column(Text)

    phone_national: Mapped[str | None] = mapped_column(String(50))
    phone_international: Mapped[str | None] = mapped_column(String(50))
    website: Mapped[str | None] = mapped_column(Text)
    photo_url: Mapped[str | None] = mapped_column(Text)

    description_en: Mapped[str | None] = mapped_column(Text)
    description_id: Mapped[str | None] = mapped_column(Text)

    latitude: Mapped[float] = mapped_column(Float, index=True, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, index=True, nullable=False)
    plus_code: Mapped[str | None] = mapped_column(String(50))

    rating: Mapped[float | None] = mapped_column(Float, index=True)
    user_rating_count: Mapped[int | None] = mapped_column(Integer)

    business_status: Mapped[str | None] = mapped_column(String(50))
    google_maps_uri: Mapped[str | None] = mapped_column(Text)
    is_open_now: Mapped[bool | None] = mapped_column(Boolean)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    search_vector_en: Mapped[TSVECTOR | None] = mapped_column(TSVECTOR, nullable=True)
    search_vector_id: Mapped[TSVECTOR | None] = mapped_column(TSVECTOR, nullable=True)

    # Relationships
    types: Mapped[list["MerchantType"]] = relationship(
        back_populates="merchant", cascade="all, delete-orphan"
    )
    photos: Mapped[list["Photo"]] = relationship(
        back_populates="merchant", cascade="all, delete-orphan"
    )
    reviews: Mapped[list["Review"]] = relationship(
        back_populates="merchant", cascade="all, delete-orphan"
    )
    opening_hours: Mapped["OpeningHours | None"] = relationship(
        back_populates="merchant", cascade="all, delete-orphan", uselist=False
    )
    amenity: Mapped["Amenity | None"] = relationship(
        back_populates="merchant", cascade="all, delete-orphan", uselist=False
    )


class MerchantType(Base):
    __tablename__ = "merchant_types"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    merchant_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("merchants.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    type_name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)

    merchant: Mapped["Merchant"] = relationship(back_populates="types")


class Photo(Base):
    __tablename__ = "photos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    merchant_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("merchants.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )

    vercel_blob_url: Mapped[str] = mapped_column(Text, nullable=False)
    file_extension: Mapped[str] = mapped_column(String(10), nullable=False)
    width: Mapped[int | None] = mapped_column(Integer)
    height: Mapped[int | None] = mapped_column(Integer)
    blur_data_url: Mapped[str | None] = mapped_column(Text)

    is_primary: Mapped[bool] = mapped_column(
        Boolean, index=True, default=False, nullable=False
    )
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    merchant: Mapped["Merchant"] = relationship(back_populates="photos")


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    merchant_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("merchants.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    google_review_id: Mapped[str] = mapped_column(Text, unique=True, nullable=False)

    rating: Mapped[int] = mapped_column(Integer, index=True, nullable=False)
    text: Mapped[str | None] = mapped_column(Text)

    author_name: Mapped[str | None] = mapped_column(String(255))
    author_photo_uri: Mapped[str | None] = mapped_column(Text)

    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), index=True
    )
    relative_time: Mapped[str | None] = mapped_column(String(100))

    merchant: Mapped["Merchant"] = relationship(back_populates="reviews")


class OpeningHours(Base):
    __tablename__ = "opening_hours"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    merchant_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("merchants.id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False,
    )

    is_open_now: Mapped[bool | None] = mapped_column(Boolean)

    monday: Mapped[str | None] = mapped_column(String(100))
    tuesday: Mapped[str | None] = mapped_column(String(100))
    wednesday: Mapped[str | None] = mapped_column(String(100))
    thursday: Mapped[str | None] = mapped_column(String(100))
    friday: Mapped[str | None] = mapped_column(String(100))
    saturday: Mapped[str | None] = mapped_column(String(100))
    sunday: Mapped[str | None] = mapped_column(String(100))

    merchant: Mapped["Merchant"] = relationship(back_populates="opening_hours")


class Amenity(Base):
    __tablename__ = "amenities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    merchant_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("merchants.id", ondelete="CASCADE"),
        unique=True,
        index=True,
        nullable=False,
    )

    takeout: Mapped[bool | None] = mapped_column(Boolean)
    dine_in: Mapped[bool | None] = mapped_column(Boolean)
    outdoor_seating: Mapped[bool | None] = mapped_column(Boolean)
    reservable: Mapped[bool | None] = mapped_column(Boolean)

    serves_breakfast: Mapped[bool | None] = mapped_column(Boolean)
    serves_lunch: Mapped[bool | None] = mapped_column(Boolean)
    serves_dinner: Mapped[bool | None] = mapped_column(Boolean)
    serves_brunch: Mapped[bool | None] = mapped_column(Boolean)
    serves_beer: Mapped[bool | None] = mapped_column(Boolean)
    serves_wine: Mapped[bool | None] = mapped_column(Boolean)
    serves_vegetarian_food: Mapped[bool | None] = mapped_column(Boolean)

    good_for_children: Mapped[bool | None] = mapped_column(Boolean)
    good_for_groups: Mapped[bool | None] = mapped_column(Boolean)

    accepts_credit_cards: Mapped[bool | None] = mapped_column(Boolean)
    accepts_debit_cards: Mapped[bool | None] = mapped_column(Boolean)
    accepts_cash_only: Mapped[bool | None] = mapped_column(Boolean)
    accepts_nfc: Mapped[bool | None] = mapped_column(Boolean)

    free_parking: Mapped[bool | None] = mapped_column(Boolean)
    paid_parking: Mapped[bool | None] = mapped_column(Boolean)
    valet_parking: Mapped[bool | None] = mapped_column(Boolean)

    wheelchair_entrance: Mapped[bool | None] = mapped_column(Boolean)
    wheelchair_restroom: Mapped[bool | None] = mapped_column(Boolean)
    wheelchair_seating: Mapped[bool | None] = mapped_column(Boolean)

    restroom: Mapped[bool | None] = mapped_column(Boolean)

    merchant: Mapped["Merchant"] = relationship(back_populates="amenity")


class MerchantListItem(BaseModel):
    id: int | None
    display_name: str | None
    name: str
    primary_type: str | None
    short_address: str | None
    rating: float | None
    user_rating_count: int | None
    type_count: int
    photo_url: str | None
    photo_width: int | None
    photo_height: int | None
    photo_blur_data_url: str | None


class MerchantsPublic(BaseModel):
    data: list[MerchantListItem]
    meta: PaginationMeta


class MerchantDetail(BaseModel):
    id: int
    display_name: str | None
    name: str
    primary_type: str | None
    formatted_address: str | None
    short_address: str | None
    phone_national: str | None
    phone_international: str | None
    website: str | None
    photo_url: str | None
    description: str | None
    latitude: float
    longitude: float
    rating: float | None
    user_rating_count: int | None

    class Config:
        from_attributes = True


class PhotoPublic(BaseModel):
    id: int
    vercel_blob_url: str
    file_extension: str
    width: int | None
    height: int | None
    blur_data_url: str | None
    is_primary: bool
    order: int

    class Config:
        from_attributes = True


class ReviewPublic(BaseModel):
    id: int
    google_review_id: str
    rating: int
    text: str | None
    author_name: str | None
    author_photo_uri: str | None
    published_at: datetime | None
    relative_time: str | None

    class Config:
        from_attributes = True


class MerchantTypePublic(BaseModel):
    id: int
    type_name: str

    class Config:
        from_attributes = True


class OpeningHoursPublic(BaseModel):
    id: int
    is_open_now: bool | None
    monday: str | None
    tuesday: str | None
    wednesday: str | None
    thursday: str | None
    friday: str | None
    saturday: str | None
    sunday: str | None

    class Config:
        from_attributes = True


class AmenityPublic(BaseModel):
    id: int
    takeout: bool | None
    dine_in: bool | None
    outdoor_seating: bool | None
    reservable: bool | None
    serves_breakfast: bool | None
    serves_lunch: bool | None
    serves_dinner: bool | None
    serves_brunch: bool | None
    serves_beer: bool | None
    serves_wine: bool | None
    serves_vegetarian_food: bool | None
    good_for_children: bool | None
    good_for_groups: bool | None
    accepts_credit_cards: bool | None
    accepts_debit_cards: bool | None
    accepts_cash_only: bool | None
    accepts_nfc: bool | None
    free_parking: bool | None
    paid_parking: bool | None
    valet_parking: bool | None
    wheelchair_entrance: bool | None
    wheelchair_restroom: bool | None
    wheelchair_seating: bool | None
    restroom: bool | None

    class Config:
        from_attributes = True
