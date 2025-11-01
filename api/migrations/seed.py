# pyright: reportUnknownParameterType=false
# pyright: reportMissingTypeArgument=false
# pyright: reportAny=false
# pyright: reportUnknownVariableType=false
# pyright: reportUnknownMemberType=false
# pyright: reportUnknownArgumentType=false
"""
Seed script to populate the database with merchant data from data.json
"""

import json
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Amenity, Merchant, MerchantType, OpeningHours, Photo, Review


def load_data(file_path: str = "data.json") -> dict:
    """Load merchant data from JSON file"""
    print(f"Loading data from {file_path}...")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"Loaded {len(data.get('places', []))} places")
    return data


def parse_datetime(date_string: str | None) -> datetime | None:
    """Parse ISO datetime string to datetime object"""
    if not date_string:
        return None
    try:
        # Handle both formats: "2025-05-06T07:00:16.972296Z" and "2025-05-06T07:00:16Z"
        if "." in date_string:
            return datetime.fromisoformat(date_string.replace("Z", "+00:00"))
        else:
            return datetime.fromisoformat(date_string.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return None


def seed_merchant(session: Session, place_data: dict) -> Merchant | None:
    """Seed a single merchant and all related data"""
    google_place_id = place_data.get("id")
    if not google_place_id:
        print("WARNING: Skipping place without ID")
        return None

    # Check if merchant already exists
    stmt = select(Merchant).where(Merchant.google_place_id == google_place_id)
    existing = session.scalar(stmt)
    if existing:
        print(f"SKIP: Existing merchant: {existing.display_name or existing.name}")
        return existing

    # Create merchant
    try:
        merchant = Merchant(
            google_place_id=google_place_id,
            name=place_data.get("name", "").replace("places/", ""),
            display_name=place_data.get("displayName", {}).get("text"),
            primary_type=place_data.get("primaryType"),
            formatted_address=place_data.get("formattedAddress"),
            short_address=place_data.get("shortFormattedAddress"),
            phone_national=place_data.get("nationalPhoneNumber"),
            phone_international=place_data.get("internationalPhoneNumber"),
            website=place_data.get("websiteUri"),
            latitude=place_data.get("location", {}).get("latitude"),
            longitude=place_data.get("location", {}).get("longitude"),
            plus_code=place_data.get("plusCode", {}).get("globalCode"),
            rating=place_data.get("rating"),
            user_rating_count=place_data.get("userRatingCount"),
            business_status=place_data.get("businessStatus"),
            google_maps_uri=place_data.get("googleMapsUri"),
            is_open_now=place_data.get("regularOpeningHours", {}).get("openNow"),
        )

        session.add(merchant)
        session.flush()  # Get the merchant ID without committing

        # Use safe encoding for names with special characters
        name = merchant.display_name or merchant.name
        safe_name = (
            name.encode("ascii", "replace").decode("ascii") if name else "Unknown"
        )
        print(f"+ Created merchant: {safe_name}")

        # Seed merchant types
        types_count = seed_merchant_types(
            session, merchant, place_data.get("types", [])
        )

        # Seed photos (limit to first 10)
        photos_count = seed_photos(session, merchant, place_data.get("photos", [])[:10])

        # Seed reviews (limit to first 5)
        reviews_count = seed_reviews(
            session, merchant, place_data.get("reviews", [])[:5]
        )

        # Seed opening hours
        seed_opening_hours(session, merchant, place_data.get("regularOpeningHours", {}))

        # Seed amenities
        seed_amenities(session, merchant, place_data)

        print(
            f"  -> Added: {types_count} types, {photos_count} photos, {reviews_count} reviews"
        )

        return merchant

    except Exception as e:
        print(f"ERROR: Error seeding merchant {google_place_id}: {e}")
        session.rollback()
        return None


def seed_merchant_types(session: Session, merchant: Merchant, types: list[str]) -> int:
    """Seed merchant types"""
    count = 0
    for type_name in types:
        merchant_type = MerchantType(merchant_id=merchant.id, type_name=type_name)
        session.add(merchant_type)
        count += 1
    return count


def seed_photos(session: Session, merchant: Merchant, photos: list[dict]) -> int:
    """Seed merchant photos"""
    count = 0
    for idx, photo_data in enumerate(photos):
        try:
            author_name = None
            author_attrs = photo_data.get("authorAttributions", [])
            if author_attrs and len(author_attrs) > 0:
                author_name = author_attrs[0].get("displayName")

            photo = Photo(
                merchant_id=merchant.id,
                photo_reference=photo_data.get("name", ""),
                width=photo_data.get("widthPx"),
                height=photo_data.get("heightPx"),
                author_name=author_name,
                is_primary=(idx == 0),  # First photo is primary
                order=idx,
            )
            session.add(photo)
            count += 1
        except Exception as e:
            print(f"  WARNING: Error adding photo {idx}: {e}")
            continue
    return count


def seed_reviews(session: Session, merchant: Merchant, reviews: list[dict]) -> int:
    """Seed merchant reviews"""
    count = 0
    for review_data in reviews:
        try:
            google_review_id = review_data.get("name")
            if not google_review_id:
                continue

            # Check if review already exists
            stmt = select(Review).where(Review.google_review_id == google_review_id)
            existing = session.scalar(stmt)
            if existing:
                continue

            author_name = review_data.get("authorAttribution", {}).get("displayName")
            author_photo = review_data.get("authorAttribution", {}).get("photoUri")
            review_text = review_data.get("text", {}).get("text")
            published_at = parse_datetime(review_data.get("publishTime"))

            review = Review(
                merchant_id=merchant.id,
                google_review_id=google_review_id,
                rating=review_data.get("rating", 0),
                text=review_text,
                author_name=author_name,
                author_photo_uri=author_photo,
                published_at=published_at,
                relative_time=review_data.get("relativePublishTimeDescription"),
            )
            session.add(review)
            count += 1
        except Exception as e:
            print(f"  WARNING: Error adding review: {e}")
            continue
    return count


def seed_opening_hours(session: Session, merchant: Merchant, hours_data: dict) -> None:
    """Seed merchant opening hours"""
    if not hours_data:
        return

    weekday_descriptions = hours_data.get("weekdayDescriptions", [])

    # Parse weekday descriptions into individual days
    # Format: ["Monday: 7:00 AM – 10:00 PM", "Tuesday: 7:00 AM – 10:00 PM", ...]
    days = {
        "monday": None,
        "tuesday": None,
        "wednesday": None,
        "thursday": None,
        "friday": None,
        "saturday": None,
        "sunday": None,
    }

    for desc in weekday_descriptions:
        if not desc or ":" not in desc:
            continue

        day_name, hours = desc.split(":", 1)
        day_name = day_name.strip().lower()
        hours = hours.strip()

        if day_name in days:
            days[day_name] = hours

    opening_hours = OpeningHours(
        merchant_id=merchant.id,
        is_open_now=hours_data.get("openNow"),
        monday=days["monday"],
        tuesday=days["tuesday"],
        wednesday=days["wednesday"],
        thursday=days["thursday"],
        friday=days["friday"],
        saturday=days["saturday"],
        sunday=days["sunday"],
    )
    session.add(opening_hours)


def seed_amenities(session: Session, merchant: Merchant, place_data: dict) -> None:
    """Seed merchant amenities"""

    # Extract payment options
    payment_opts = place_data.get("paymentOptions", {})

    # Extract parking options
    parking_opts = place_data.get("parkingOptions", {})

    # Extract accessibility options
    accessibility_opts = place_data.get("accessibilityOptions", {})

    amenity = Amenity(
        merchant_id=merchant.id,
        # Service options
        takeout=place_data.get("takeout"),
        dine_in=place_data.get("dineIn"),
        outdoor_seating=place_data.get("outdoorSeating"),
        reservable=place_data.get("reservable"),
        # Dining options
        serves_breakfast=place_data.get("servesBreakfast"),
        serves_lunch=place_data.get("servesLunch"),
        serves_dinner=place_data.get("servesDinner"),
        serves_brunch=place_data.get("servesBrunch"),
        serves_beer=place_data.get("servesBeer"),
        serves_wine=place_data.get("servesWine"),
        serves_vegetarian_food=place_data.get("servesVegetarianFood"),
        # Suitability
        good_for_children=place_data.get("goodForChildren"),
        good_for_groups=place_data.get("goodForGroups"),
        # Payment options
        accepts_credit_cards=payment_opts.get("acceptsCreditCards"),
        accepts_debit_cards=payment_opts.get("acceptsDebitCards"),
        accepts_cash_only=payment_opts.get("acceptsCashOnly"),
        accepts_nfc=payment_opts.get("acceptsNfc"),
        # Parking options
        free_parking=parking_opts.get("freeParkingLot"),
        paid_parking=parking_opts.get("paidParkingLot"),
        valet_parking=parking_opts.get("valetParking"),
        # Accessibility options
        wheelchair_entrance=accessibility_opts.get("wheelchairAccessibleEntrance"),
        wheelchair_restroom=accessibility_opts.get("wheelchairAccessibleRestroom"),
        wheelchair_seating=accessibility_opts.get("wheelchairAccessibleSeating"),
        # Other amenities
        restroom=place_data.get("restroom"),
    )
    session.add(amenity)


def main():
    """Main seed function"""
    print("\nStarting database seed...\n")

    # Load data
    import sys
    file_path = sys.argv[1] if len(sys.argv) > 1 else "data/pondok-labu.json"
    data = load_data(file_path)

    # Create tables if they don't exist
    from app.database import engine
    from app.models.utils import Base

    Base.metadata.create_all(engine)

    # Seed data
    with SessionLocal() as session:
        total_places = len(data.get("places", []))
        success_count = 0

        for idx, place in enumerate(data.get("places", []), 1):
            print(f"\n[{idx}/{total_places}] Processing...")
            result = seed_merchant(session, place)
            if result:
                success_count += 1

        # Commit all changes
        try:
            session.commit()
            print("\nSeed completed successfully!")
            print(f"Total: {success_count}/{total_places} merchants seeded\n")
        except Exception as e:
            print(f"\nError committing transaction: {e}")
            session.rollback()


if __name__ == "__main__":
    main()
