"""
Seed script to upload primary merchant photos to Vercel Blob storage

This script:
1. Reads photos from data/merchant_photos/ directory
2. Uploads them to Vercel Blob storage as "primary.{ext}"
3. Creates records in the photos table
4. Updates the merchants table photo_url with the Vercel Blob URL

Usage:
    1. Make sure BLOB_READ_WRITE_TOKEN is set in your .env file
    2. Run migrations/recreate_photos_table.py first
    3. Install dependencies: uv sync
    4. Run the script: uv run python -m migrations.photos
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from PIL import Image
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
    file_ext = Path(file_path).suffix  # e.g., ".jpg"

    # Use "primary" naming for primary photos
    blob_path = f"merchants/{merchant_id}/primary{file_ext}"

    # Detect content type based on extension
    content_type = (
        "image/jpeg" if file_ext.lower() in [".jpg", ".jpeg"] else "image/png"
    )

    # Upload file using Vercel SDK
    uploaded = blob_client.upload_file(
        file_path,
        blob_path,
        access="public",
        content_type=content_type,
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

    # Check if primary photo already exists for this merchant
    stmt = (
        select(Photo).where(Photo.merchant_id == merchant_id, Photo.is_primary).limit(1)
    )
    existing_photo = session.scalar(stmt)

    name = merchant.display_name or merchant.name
    safe_name = name.encode("ascii", "replace").decode("ascii") if name else "Unknown"

    # Check if Vercel Blob URL already exists
    if existing_photo:
        print(
            f"SKIP: Primary photo already exists for merchant {merchant_id} ({safe_name})"
        )
        return

    try:
        print(f"Uploading primary photo for merchant {merchant_id} ({safe_name})...")

        # Get file extension
        file_ext = Path(photo_path).suffix.lstrip(".")  # e.g., "jpg"

        # Get image dimensions
        with Image.open(photo_path) as img:
            width, height = img.width, img.height

        # Upload to Vercel Blob
        blob_url = upload_to_vercel_blob(photo_path, merchant_id)

        # Create new Photo record
        photo = Photo(
            merchant_id=merchant_id,
            vercel_blob_url=blob_url,
            file_extension=file_ext,
            width=width,
            height=height,
            is_primary=True,
            order=0,
        )
        session.add(photo)

        # Update merchant's photo_url
        merchant.photo_url = blob_url

        session.commit()
        print(f"SUCCESS: Uploaded primary photo for merchant {merchant_id} ({width}x{height})")

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

            # Check if already exists before seeding
            existing = session.execute(
                select(Photo.id)
                .where(Photo.merchant_id == merchant_id, Photo.is_primary)
                .limit(1)
            ).scalar()

            if existing:
                skip_count += 1
                continue

            # Attempt to seed
            try:
                seed_photo_for_merchant(session, merchant_id, str(photo_file))

                # Verify it was created
                created = session.execute(
                    select(Photo.id)
                    .where(Photo.merchant_id == merchant_id, Photo.is_primary)
                    .limit(1)
                ).scalar()

                if created:
                    success_count += 1
                else:
                    skip_count += 1
            except Exception:
                error_count += 1

        print(f"\n{'=' * 50}")
        print("Photo upload completed!")
        print(f"Success: {success_count}")
        print(f"Skipped: {skip_count}")
        print(f"Errors: {error_count}")
        print(f"Total: {len(photo_files)}")
        print(f"{'=' * 50}\n")


if __name__ == "__main__":
    main()
