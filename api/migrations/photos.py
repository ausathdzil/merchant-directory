"""
Seed script to upload merchant photos to Vercel Blob storage

This script:
1. Reads photos from data/merchant_photos/ directory
2. Uploads them to Vercel Blob storage
3. Updates the photos table with the vercel_blob_url
4. Updates the merchants table photo_url with the Vercel Blob URL

Usage:
    1. Make sure BLOB_READ_WRITE_TOKEN is set in your .env file
    2. Run migrations/add_photo_url.py first to add columns
    3. Install dependencies: uv sync
    4. Run the script: uv run python -m migrations.photos
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import select
from sqlalchemy.orm import Session
from vercel.blob import BlobClient

from app.database import SessionLocal
from app.models import Merchant, Photo

# Load environment variables
load_dotenv()

# Get Vercel Blob token from environment
BLOB_READ_WRITE_TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN")
if not BLOB_READ_WRITE_TOKEN:
    raise ValueError("BLOB_READ_WRITE_TOKEN not found in environment variables")

# Initialize Vercel Blob client
blob_client = BlobClient(token=BLOB_READ_WRITE_TOKEN)


def upload_to_vercel_blob(file_path: str, merchant_id: int) -> str:
    """
    Upload a photo to Vercel Blob and return the URL

    Args:
        file_path: Path to the local image file
        merchant_id: ID of the merchant

    Returns:
        The URL of the uploaded blob
    """
    filename = Path(file_path).name

    # Use merchant_id in the path for organization
    blob_path = f"merchants/{merchant_id}/{filename}"

    # Upload file using Vercel SDK
    uploaded = blob_client.upload_file(
        file_path,
        blob_path,
        access="public",
        content_type="image/jpeg",
    )

    return uploaded.url


def seed_photo_for_merchant(
    session: Session, merchant_id: int, photo_path: str
) -> None:
    """
    Upload a photo for a merchant and update the database

    Args:
        session: Database session
        merchant_id: ID of the merchant
        photo_path: Path to the photo file
    """
    # Check if merchant exists
    stmt = select(Merchant).where(Merchant.id == merchant_id)
    merchant = session.scalar(stmt)

    if not merchant:
        print(f"SKIP: Merchant with ID {merchant_id} not found")
        return

    # Get the primary photo for this merchant
    stmt = (
        select(Photo)
        .where(Photo.merchant_id == merchant_id, Photo.is_primary)
        .order_by(Photo.order)
        .limit(1)
    )
    existing_photo = session.scalar(stmt)

    name = merchant.display_name or merchant.name
    safe_name = name.encode("ascii", "replace").decode("ascii") if name else "Unknown"

    # Check if Vercel Blob URL already exists
    if existing_photo and existing_photo.vercel_blob_url:
        print(
            f"SKIP: Vercel Blob URL already set for merchant {merchant_id} ({safe_name})"
        )
        return

    try:
        print(f"Uploading photo for merchant {merchant_id} ({safe_name})...")

        # Upload to Vercel Blob
        blob_url = upload_to_vercel_blob(photo_path, merchant_id)

        if existing_photo:
            # Update existing photo record with Vercel Blob URL
            existing_photo.vercel_blob_url = blob_url
            print("  Updated existing photo record with Vercel Blob URL")
        else:
            # Create new Photo record
            photo = Photo(
                merchant_id=merchant_id,
                photo_reference=f"local/{merchant_id}.jpg",  # Placeholder reference
                vercel_blob_url=blob_url,
                width=None,  # Could use PIL to get dimensions if needed
                height=None,
                author_name=None,
                is_primary=True,  # First/only photo is primary
                order=0,
            )
            session.add(photo)
            print("  Created new photo record with Vercel Blob URL")

        # Update merchant's photo_url
        merchant.photo_url = blob_url

        session.commit()
        print(f"SUCCESS: Uploaded photo for merchant {merchant_id}")

    except Exception as e:
        print(f"ERROR: Failed to upload photo for merchant {merchant_id}: {e}")
        session.rollback()


def main():
    """Main seed function"""
    print("\nStarting photo upload to Vercel Blob...\n")

    # Path to merchant photos directory
    photos_dir = Path("data/merchant_photos")

    if not photos_dir.exists():
        print(f"ERROR: Photos directory not found: {photos_dir}")
        return

    # Get all jpg files
    photo_files = sorted(photos_dir.glob("*.jpg"))

    if not photo_files:
        print(f"ERROR: No .jpg files found in {photos_dir}")
        return

    print(f"Found {len(photo_files)} photo files\n")

    # Process each photo
    with SessionLocal() as session:
        success_count = 0
        skip_count = 0
        error_count = 0

        for photo_file in photo_files:
            # Extract merchant ID from filename (e.g., "1.jpg" -> 1)
            try:
                merchant_id = int(photo_file.stem)
            except ValueError:
                print(f"SKIP: Invalid filename format: {photo_file.name}")
                skip_count += 1
                continue

            result_before = session.execute(
                select(Photo.vercel_blob_url)
                .where(Photo.merchant_id == merchant_id)
                .limit(1)
            ).scalar()

            seed_photo_for_merchant(session, merchant_id, str(photo_file))

            result_after = session.execute(
                select(Photo.vercel_blob_url)
                .where(Photo.merchant_id == merchant_id)
                .limit(1)
            ).scalar()

            if result_after and result_after != result_before:
                success_count += 1
            else:
                skip_count += 1

        print(f"\n{'=' * 50}")
        print("Photo upload completed!")
        print(f"Success: {success_count}")
        print(f"Skipped: {skip_count}")
        print(f"Errors: {error_count}")
        print(f"Total: {len(photo_files)}")
        print(f"{'=' * 50}\n")


if __name__ == "__main__":
    main()
