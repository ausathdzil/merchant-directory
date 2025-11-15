"""
Seed script to generate and populate blur_data_url for photos in the database

This script:
1. Adds a blur_data_url column to the photos table (if not exists)
2. Downloads each photo from Vercel Blob
3. Generates a small blur placeholder (10px width)
4. Converts it to base64 data URL format
5. Updates the photos table with the blur data

For Next.js Image component blurDataURL prop.

Usage:
    1. Make sure all dependencies are installed: uv sync
    2. Run the script: uv run python -m migrations.seed_blur_data
"""

import base64
import io

import requests
from dotenv import load_dotenv
from PIL import Image
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app.models import Photo

# Load environment variables
load_dotenv()


def add_blur_data_column():
    """Add blur_data_url column to photos table if it doesn't exist"""
    with engine.connect() as conn:
        # Check if column exists
        result = conn.execute(
            text(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name='photos' AND column_name='blur_data_url'
            """
            )
        )
        exists = result.fetchone() is not None

        if not exists:
            print("Adding blur_data_url column to photos table...")
            conn.execute(text("ALTER TABLE photos ADD COLUMN blur_data_url TEXT"))
            conn.commit()
            print("Column added successfully!")
        else:
            print("blur_data_url column already exists.")


def generate_blur_placeholder(image_url: str, blur_width: int = 10) -> str | None:
    """
    Download an image and generate a base64 blur placeholder

    Args:
        image_url: URL of the image to download
        blur_width: Width of the blur placeholder (default: 10px)

    Returns:
        Base64 data URL string for the blur placeholder
    """
    try:
        # Download the image
        response = requests.get(image_url, timeout=30)
        response.raise_for_status()

        # Open image with PIL
        img = Image.open(io.BytesIO(response.content))

        # Convert to RGB if necessary (handle PNGs with transparency)
        if img.mode in ("RGBA", "LA", "P"):
            # Create white background
            background = Image.new("RGB", img.size, (255, 255, 255))
            if img.mode == "P":
                img = img.convert("RGBA")
            background.paste(img, mask=img.split()[-1] if img.mode == "RGBA" else None)
            img = background
        elif img.mode != "RGB":
            img = img.convert("RGB")

        # Calculate height maintaining aspect ratio
        aspect_ratio = img.height / img.width
        blur_height = int(blur_width * aspect_ratio)

        # Resize to small dimensions for blur
        img_small = img.resize((blur_width, blur_height), Image.Resampling.LANCZOS)

        # Save to bytes buffer as JPEG
        buffer = io.BytesIO()
        img_small.save(buffer, format="JPEG", quality=70)
        buffer.seek(0)

        # Convert to base64
        img_base64 = base64.b64encode(buffer.read()).decode("utf-8")

        # Return as data URL
        return f"data:image/jpeg;base64,{img_base64}"

    except Exception as e:
        print(f"  ERROR generating blur for {image_url}: {e}")
        return None


def seed_blur_data(session: Session, photo: Photo) -> bool:
    """
    Generate and save blur data for a single photo

    Args:
        session: Database session
        photo: Photo model instance

    Returns:
        True if successful, False otherwise
    """
    try:
        # Skip if blur_data_url already exists
        if photo.blur_data_url:
            return False

        print(f"  Processing photo {photo.id} (merchant {photo.merchant_id})...")

        # Generate blur placeholder
        blur_data = generate_blur_placeholder(photo.vercel_blob_url)

        if blur_data:
            # Update the photo record
            photo.blur_data_url = blur_data
            session.commit()
            print(f"  [OK] Generated blur data for photo {photo.id}")
            return True
        else:
            print(f"  [SKIP] Could not generate blur data for photo {photo.id}")
            return False

    except Exception as e:
        print(f"  ERROR processing photo {photo.id}: {e}")
        session.rollback()
        return False


def main():
    """Main seed function"""
    print("\nStarting blur data generation for photos...\n")

    # Add column if needed
    add_blur_data_column()

    print("\nFetching photos from database...\n")

    # Get all photos
    with SessionLocal() as session:
        stmt = select(Photo).order_by(Photo.id)
        photos = session.scalars(stmt).all()

        if not photos:
            print("No photos found in database.")
            return

        print(f"Found {len(photos)} photos\n")

        success_count = 0
        skip_count = 0
        error_count = 0

        for photo in photos:
            # Check if already has blur data
            if photo.blur_data_url:
                skip_count += 1
                continue

            result = seed_blur_data(session, photo)
            if result:
                success_count += 1
            else:
                # Re-check if it was actually skipped due to error vs already existing
                session.refresh(photo)
                if photo.blur_data_url:
                    skip_count += 1
                else:
                    error_count += 1

        print(f"\n{'=' * 50}")
        print("Blur data generation completed!")
        print(f"Success: {success_count}")
        print(f"Skipped: {skip_count}")
        print(f"Errors: {error_count}")
        print(f"Total: {len(photos)}")
        print(f"{'=' * 50}\n")


if __name__ == "__main__":
    main()
