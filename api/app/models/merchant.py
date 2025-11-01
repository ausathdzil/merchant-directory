# pyright: reportExplicitAny=false
# pyright: reportAny=false
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, ClassVar

from sqlmodel import (
    Field,  # pyright: ignore[reportUnknownVariableType]
    Relationship,
    SQLModel,
)


class Merchant(SQLModel, table=True):
    __tablename__: ClassVar[Any] = "merchants"

    id: int | None = Field(default=None, primary_key=True)
    google_place_id: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=500)
    display_name: str | None = Field(default=None, max_length=500)
    primary_type: str | None = Field(default=None, max_length=100, index=True)

    formatted_address: str | None = Field(default=None)
    short_address: str | None = Field(default=None)

    phone_national: str | None = Field(default=None, max_length=50)
    phone_international: str | None = Field(default=None, max_length=50)
    website: str | None = Field(default=None)

    latitude: float = Field(index=True)
    longitude: float = Field(index=True)
    plus_code: str | None = Field(default=None, max_length=50)

    rating: float | None = Field(default=None, index=True)
    user_rating_count: int | None = Field(default=None)

    business_status: str | None = Field(default=None, max_length=50)
    google_maps_uri: str | None = Field(default=None)
    is_open_now: bool | None = Field(default=None)

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    types: list["MerchantType"] = Relationship(
        back_populates="merchant", cascade_delete=True
    )
    photos: list["Photo"] = Relationship(back_populates="merchant", cascade_delete=True)
    reviews: list["Review"] = Relationship(
        back_populates="merchant", cascade_delete=True
    )
    opening_hours: OpeningHours | None = Relationship(
        back_populates="merchant", cascade_delete=True
    )
    amenity: Amenity | None = Relationship(
        back_populates="merchant", cascade_delete=True
    )


class MerchantType(SQLModel, table=True):
    __tablename__: ClassVar[Any] = "merchant_types"

    id: int | None = Field(default=None, primary_key=True)
    merchant_id: int = Field(foreign_key="merchants.id", ondelete="CASCADE", index=True)
    type_name: str = Field(max_length=100, index=True)

    merchant: Merchant = Relationship(back_populates="types")


class Photo(SQLModel, table=True):
    __tablename__: ClassVar[Any] = "photos"

    id: int | None = Field(default=None, primary_key=True)
    merchant_id: int = Field(foreign_key="merchants.id", ondelete="CASCADE", index=True)

    photo_reference: str = Field()
    width: int | None = Field(default=None)
    height: int | None = Field(default=None)
    author_name: str | None = Field(default=None, max_length=255)

    is_primary: bool = Field(default=False, index=True)
    order: int = Field(default=0)

    merchant: Merchant = Relationship(back_populates="photos")


class Review(SQLModel, table=True):
    __tablename__: ClassVar[Any] = "reviews"

    id: int | None = Field(default=None, primary_key=True)
    merchant_id: int = Field(foreign_key="merchants.id", ondelete="CASCADE", index=True)
    google_review_id: str = Field(unique=True)

    rating: int = Field(ge=1, le=5, index=True)
    text: str | None = Field(default=None)

    author_name: str | None = Field(default=None, max_length=255)
    author_photo_uri: str | None = Field(default=None)

    published_at: datetime | None = Field(default=None, index=True)
    relative_time: str | None = Field(default=None, max_length=100)

    merchant: Merchant = Relationship(back_populates="reviews")


class OpeningHours(SQLModel, table=True):
    __tablename__: ClassVar[Any] = "opening_hours"

    id: int | None = Field(default=None, primary_key=True)
    merchant_id: int = Field(
        foreign_key="merchants.id", ondelete="CASCADE", unique=True, index=True
    )

    is_open_now: bool | None = Field(default=None)

    monday: str | None = Field(default=None, max_length=100)
    tuesday: str | None = Field(default=None, max_length=100)
    wednesday: str | None = Field(default=None, max_length=100)
    thursday: str | None = Field(default=None, max_length=100)
    friday: str | None = Field(default=None, max_length=100)
    saturday: str | None = Field(default=None, max_length=100)
    sunday: str | None = Field(default=None, max_length=100)

    merchant: Merchant = Relationship(back_populates="opening_hours")


class Amenity(SQLModel, table=True):
    __tablename__: ClassVar[Any] = "amenities"

    id: int | None = Field(default=None, primary_key=True)
    merchant_id: int = Field(
        foreign_key="merchants.id", ondelete="CASCADE", unique=True, index=True
    )

    takeout: bool | None = Field(default=None)
    dine_in: bool | None = Field(default=None)
    outdoor_seating: bool | None = Field(default=None)
    reservable: bool | None = Field(default=None)

    serves_breakfast: bool | None = Field(default=None)
    serves_lunch: bool | None = Field(default=None)
    serves_dinner: bool | None = Field(default=None)
    serves_brunch: bool | None = Field(default=None)
    serves_beer: bool | None = Field(default=None)
    serves_wine: bool | None = Field(default=None)
    serves_vegetarian_food: bool | None = Field(default=None)

    good_for_children: bool | None = Field(default=None)
    good_for_groups: bool | None = Field(default=None)

    accepts_credit_cards: bool | None = Field(default=None)
    accepts_debit_cards: bool | None = Field(default=None)
    accepts_cash_only: bool | None = Field(default=None)
    accepts_nfc: bool | None = Field(default=None)

    free_parking: bool | None = Field(default=None)
    paid_parking: bool | None = Field(default=None)
    valet_parking: bool | None = Field(default=None)

    wheelchair_entrance: bool | None = Field(default=None)
    wheelchair_restroom: bool | None = Field(default=None)
    wheelchair_seating: bool | None = Field(default=None)

    restroom: bool | None = Field(default=None)

    merchant: Merchant = Relationship(back_populates="amenity")
