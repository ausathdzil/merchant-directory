"""
Migration script to add photo_url column to merchants table and vercel_blob_url to photos table.

This migration:
1. Adds a vercel_blob_url column to the photos table (for Vercel Blob uploaded photos)
2. Adds a photo_url column to the merchants table (for quick access to merchant's primary photo)
3. Creates indexes for faster queries

Note: Run migrations/photos.py after this to populate vercel_blob_url with uploaded photos

Usage:
    uv run python -m migrations.add_photo_url
"""

from sqlalchemy import text
from sqlalchemy.orm import Session


def upgrade(session: Session) -> None:
    """Apply the migration"""
    print("Adding vercel_blob_url column to photos table...")
    session.execute(
        text("""
            ALTER TABLE photos
            ADD COLUMN IF NOT EXISTS vercel_blob_url TEXT;
        """)
    )

    print("Adding photo_url column to merchants table...")
    session.execute(
        text("""
            ALTER TABLE merchants
            ADD COLUMN IF NOT EXISTS photo_url TEXT;
        """)
    )

    print("Creating index on photos.vercel_blob_url...")
    session.execute(
        text("""
            CREATE INDEX IF NOT EXISTS photos_vercel_blob_url_idx
            ON photos (vercel_blob_url)
            WHERE vercel_blob_url IS NOT NULL;
        """)
    )

    print("Creating index on merchants.photo_url...")
    session.execute(
        text("""
            CREATE INDEX IF NOT EXISTS merchants_photo_url_idx
            ON merchants (photo_url)
            WHERE photo_url IS NOT NULL;
        """)
    )

    session.commit()
    print("SUCCESS: Columns and indexes created successfully!")


def downgrade(session: Session) -> None:
    """Rollback the migration"""
    print("Dropping indexes...")
    session.execute(text("DROP INDEX IF EXISTS merchants_photo_url_idx;"))
    session.execute(text("DROP INDEX IF EXISTS photos_vercel_blob_url_idx;"))

    print("Dropping columns...")
    session.execute(
        text("""
            ALTER TABLE merchants
            DROP COLUMN IF EXISTS photo_url;
        """)
    )
    session.execute(
        text("""
            ALTER TABLE photos
            DROP COLUMN IF EXISTS vercel_blob_url;
        """)
    )

    session.commit()
    print("SUCCESS: Columns removed successfully!")


def main():
    """Run the migration"""
    from app.database import SessionLocal

    print("\nStarting photo_url migration...\n")

    with SessionLocal() as session:
        try:
            upgrade(session)

            # Show statistics
            result = session.execute(
                text("""
                    SELECT
                        COUNT(*) as total_merchants,
                        COUNT(photo_url) as merchants_with_photos,
                        COUNT(*) - COUNT(photo_url) as merchants_without_photos
                    FROM merchants;
                """)
            )
            stats = result.fetchone()

            print(f"\nMigration Statistics:")
            print(f"  Total merchants: {stats[0]}")
            print(f"  Merchants with photos: {stats[1]}")
            print(f"  Merchants without photos: {stats[2]}")

        except Exception as e:
            print(f"\nError during migration: {e}")
            session.rollback()
            raise


if __name__ == "__main__":
    main()
