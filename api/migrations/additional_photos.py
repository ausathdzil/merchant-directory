"""
Seed script to upload additional merchant photos to Vercel Blob storage

This script:
1. Reads photos from data/additional_photos/{merchant_id}/ directories
2. Uploads them to Vercel Blob storage as "photo-1.{ext}", "photo-2.{ext}", etc.
3. Creates records in the photos table with is_primary=False

Usage:
    1. Make sure BLOB_READ_WRITE_TOKEN is set in your .env file
    2. Run migrations/recreate_photos_table.py and migrations/photos.py first
    3. Install dependencies: uv sync
    4. Run the script: uv run python -m migrations.additional_photos
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


def upload_to_vercel_blob(
    file_path: str, merchant_id: int, photo_number: int
) -> str:
    """
    Upload a photo to Vercel Blob and return the URL

    Args:
        file_path: Path to the local image file
        merchant_id: ID of the merchant
        photo_number: Sequential number for the photo (1, 2, 3, etc.)

    Returns:
        The URL of the uploaded blob
    """
    file_ext = Path(file_path).suffix  # e.g., ".jpg"

    # Use "photo-N" naming for additional photos
    blob_path = f"merchants/{merchant_id}/photo-{photo_number}{file_ext}"

    # Detect content type based on extension
    content_type = "image/jpeg" if file_ext.lower() in [".jpg", ".jpeg"] else "image/png"

    # Upload file using Vercel SDK
    uploaded = blob_client.upload_file(
        file_path,
        blob_path,
        access="public",
        content_type=content_type,
    )

    return uploaded.url


def seed_additional_photos_for_merchant(
    session: Session, merchant_id: int, photos_dir: Path
) -> int:
    """
    Upload additional photos for a merchant and update the database

    Args:
        session: Database session
        merchant_id: ID of the merchant
        photos_dir: Path to the directory containing photos

    Returns:
        Number of photos uploaded
    """
    # Check if merchant exists
    stmt = select(Merchant).where(Merchant.id == merchant_id)
    merchant = session.scalar(stmt)

    if not merchant:
        print(f"SKIP: Merchant with ID {merchant_id} not found")
        return 0

    name = merchant.display_name or merchant.name
    safe_name = name.encode("ascii", "replace").decode("ascii") if name else "Unknown"

    # Get all photo files in the directory (sorted)
    photo_files = sorted(
        photos_dir.glob("*"),
        key=lambda p: (int(p.stem) if p.stem.isdigit() else float("inf"), p.stem),
    )

    # Filter to only image files
    photo_files = [
        f for f in photo_files if f.suffix.lower() in [".jpg", ".jpeg", ".png"]
    ]

    if not photo_files:
        print(f"SKIP: No photos found for merchant {merchant_id} ({safe_name})")
        return 0

    print(
        f"Processing {len(photo_files)} additional photo(s) for merchant {merchant_id} ({safe_name})..."
    )

    uploaded_count = 0

    for idx, photo_file in enumerate(photo_files, start=1):
        try:
            # Get file extension
            file_ext = photo_file.suffix.lstrip(".")  # e.g., "jpg"

            # Upload to Vercel Blob
            blob_url = upload_to_vercel_blob(str(photo_file), merchant_id, idx)

            # Create new Photo record
            photo = Photo(
                merchant_id=merchant_id,
                vercel_blob_url=blob_url,
                file_extension=file_ext,
                is_primary=False,
                order=idx,  # order starts at 1 for additional photos
            )
            session.add(photo)
            session.commit()

            print(f"  [OK] Uploaded photo-{idx}.{file_ext}")
            uploaded_count += 1

        except Exception as e:
            print(f"  ERROR: Failed to upload {photo_file.name}: {e}")
            session.rollback()

    return uploaded_count


def main():
    """Main seed function"""
    print("\nStarting additional photos upload to Vercel Blob...\n")

    # Path to additional photos directory
    additional_photos_dir = Path("data/additional_photos")

    if not additional_photos_dir.exists():
        print(f"ERROR: Additional photos directory not found: {additional_photos_dir}")
        return

    # Get all merchant directories (directories with numeric names)
    merchant_dirs = [
        d
        for d in additional_photos_dir.iterdir()
        if d.is_dir() and d.name.isdigit()
    ]

    if not merchant_dirs:
        print(f"ERROR: No merchant directories found in {additional_photos_dir}")
        return

    # Sort by merchant ID
    merchant_dirs = sorted(merchant_dirs, key=lambda d: int(d.name))

    print(f"Found {len(merchant_dirs)} merchant directories\n")

    # Process each merchant directory
    with SessionLocal() as session:
        total_success = 0
        total_skip = 0
        total_error = 0

        for merchant_dir in merchant_dirs:
            merchant_id = int(merchant_dir.name)

            try:
                uploaded = seed_additional_photos_for_merchant(
                    session, merchant_id, merchant_dir
                )
                if uploaded > 0:
                    total_success += uploaded
                else:
                    total_skip += 1
            except Exception as e:
                print(f"ERROR: Failed to process merchant {merchant_id}: {e}")
                total_error += 1

        print(f"\n{'=' * 50}")
        print("Additional photos upload completed!")
        print(f"Success: {total_success} photos uploaded")
        print(f"Skipped: {total_skip} merchants")
        print(f"Errors: {total_error}")
        print(f"Total merchants: {len(merchant_dirs)}")
        print(f"{'=' * 50}\n")


if __name__ == "__main__":
    main()
