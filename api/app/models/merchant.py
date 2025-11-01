from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, Relationship, SQLModel


# ============================================================================
# MERCHANT - Main business entity
# ============================================================================

class Merchant(SQLModel, table=True):
    """Main merchant/business table with core information"""
    __tablename__ = "merchants"

    id: int | None = Field(default=None, primary_key=True)
    google_place_id: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=500)
    display_name: str | None = Field(default=None, max_length=500)
    primary_type: str | None = Field(default=None, max_length=100, index=True)

    # Address information
    formatted_address: str | None = Field(default=None)
    short_address: str | None = Field(default=None)

    # Contact information
    phone_national: str | None = Field(default=None, max_length=50)
    phone_international: str | None = Field(default=None, max_length=50)
    website: str | None = Field(default=None)

    # Location coordinates
    latitude: float = Field(index=True)
    longitude: float = Field(index=True)
    plus_code: str | None = Field(default=None, max_length=50)

    # Rating and review metrics
    rating: float | None = Field(default=None, index=True)
    user_rating_count: int | None = Field(default=None)

    # Business status
    business_status: str | None = Field(default=None, max_length=50)
    google_maps_uri: str | None = Field(default=None)
    is_open_now: bool | None = Field(default=None)

    # Timestamps
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relationships
    types: list["MerchantType"] = Relationship(back_populates="merchant", cascade_delete=True)
    photos: list["Photo"] = Relationship(back_populates="merchant", cascade_delete=True)
    reviews: list["Review"] = Relationship(back_populates="merchant", cascade_delete=True)
    opening_hours: Optional["OpeningHours"] = Relationship(back_populates="merchant", cascade_delete=True)
    amenity: Optional["Amenity"] = Relationship(back_populates="merchant", cascade_delete=True)


# ============================================================================
# MERCHANT TYPES - Business categories/types
# ============================================================================

class MerchantType(SQLModel, table=True):
    """Junction table for merchant business types (many-to-many relationship)"""
    __tablename__ = "merchant_types"

    id: int | None = Field(default=None, primary_key=True)
    merchant_id: int = Field(foreign_key="merchants.id", ondelete="CASCADE", index=True)
    type_name: str = Field(max_length=100, index=True)

    # Relationships
    merchant: Merchant = Relationship(back_populates="types")


# ============================================================================
# PHOTOS - Business photos
# ============================================================================

class Photo(SQLModel, table=True):
    """Photos associated with merchants"""
    __tablename__ = "photos"

    id: int | None = Field(default=None, primary_key=True)
    merchant_id: int = Field(foreign_key="merchants.id", ondelete="CASCADE", index=True)

    # Photo metadata
    photo_reference: str = Field()
    width: int | None = Field(default=None)
    height: int | None = Field(default=None)
    author_name: str | None = Field(default=None, max_length=255)

    # Display settings
    is_primary: bool = Field(default=False, index=True)
    order: int = Field(default=0)

    # Relationships
    merchant: Merchant = Relationship(back_populates="photos")


# ============================================================================
# REVIEWS - Customer reviews
# ============================================================================

class Review(SQLModel, table=True):
    """Customer reviews for merchants"""
    __tablename__ = "reviews"

    id: int | None = Field(default=None, primary_key=True)
    merchant_id: int = Field(foreign_key="merchants.id", ondelete="CASCADE", index=True)
    google_review_id: str = Field(unique=True)

    # Review content
    rating: int = Field(ge=1, le=5, index=True)
    text: str | None = Field(default=None)

    # Author information
    author_name: str | None = Field(default=None, max_length=255)
    author_photo_uri: str | None = Field(default=None)

    # Timestamps
    published_at: datetime | None = Field(default=None, index=True)
    relative_time: str | None = Field(default=None, max_length=100)

    # Relationships
    merchant: Merchant = Relationship(back_populates="reviews")


# ============================================================================
# OPENING HOURS - Business operating hours
# ============================================================================

class OpeningHours(SQLModel, table=True):
    """Operating hours for merchants"""
    __tablename__ = "opening_hours"

    id: int | None = Field(default=None, primary_key=True)
    merchant_id: int = Field(foreign_key="merchants.id", ondelete="CASCADE", unique=True, index=True)

    # Current status
    is_open_now: bool | None = Field(default=None)

    # Weekly schedule
    monday: str | None = Field(default=None, max_length=100)
    tuesday: str | None = Field(default=None, max_length=100)
    wednesday: str | None = Field(default=None, max_length=100)
    thursday: str | None = Field(default=None, max_length=100)
    friday: str | None = Field(default=None, max_length=100)
    saturday: str | None = Field(default=None, max_length=100)
    sunday: str | None = Field(default=None, max_length=100)

    # Relationships
    merchant: Merchant = Relationship(back_populates="opening_hours")


# ============================================================================
# AMENITIES - Business features and services
# ============================================================================

class Amenity(SQLModel, table=True):
    """Amenities and features available at merchants"""
    __tablename__ = "amenities"

    id: int | None = Field(default=None, primary_key=True)
    merchant_id: int = Field(foreign_key="merchants.id", ondelete="CASCADE", unique=True, index=True)

    # Service options
    takeout: bool | None = Field(default=None)
    dine_in: bool | None = Field(default=None)
    outdoor_seating: bool | None = Field(default=None)
    reservable: bool | None = Field(default=None)

    # Dining options
    serves_breakfast: bool | None = Field(default=None)
    serves_lunch: bool | None = Field(default=None)
    serves_dinner: bool | None = Field(default=None)
    serves_brunch: bool | None = Field(default=None)
    serves_beer: bool | None = Field(default=None)
    serves_wine: bool | None = Field(default=None)
    serves_vegetarian_food: bool | None = Field(default=None)

    # Suitability
    good_for_children: bool | None = Field(default=None)
    good_for_groups: bool | None = Field(default=None)

    # Payment options
    accepts_credit_cards: bool | None = Field(default=None)
    accepts_debit_cards: bool | None = Field(default=None)
    accepts_cash_only: bool | None = Field(default=None)
    accepts_nfc: bool | None = Field(default=None)

    # Parking options
    free_parking: bool | None = Field(default=None)
    paid_parking: bool | None = Field(default=None)
    valet_parking: bool | None = Field(default=None)

    # Accessibility options
    wheelchair_entrance: bool | None = Field(default=None)
    wheelchair_restroom: bool | None = Field(default=None)
    wheelchair_seating: bool | None = Field(default=None)

    # Other amenities
    restroom: bool | None = Field(default=None)

    # Relationships
    merchant: Merchant = Relationship(back_populates="amenity")
