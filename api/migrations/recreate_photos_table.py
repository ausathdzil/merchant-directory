"""
Script to recreate the photos table with new schema for Vercel Blob photos

This script:
1. Drops all data from photos table
2. Recreates the table with new schema optimized for Vercel Blob storage

Usage:
    uv run python -m migrations.recreate_photos_table
"""

from sqlalchemy import text

from app.database import SessionLocal


def main():
    """Recreate photos table"""
    print("\nRecreating photos table...\n")

    with SessionLocal() as session:
        try:
            # Drop the existing photos table
            print("Dropping existing photos table...")
            session.execute(text("DROP TABLE IF EXISTS photos CASCADE"))
            session.commit()
            print("[OK] Dropped photos table")

            # Create new photos table with updated schema
            print("\nCreating new photos table with Vercel Blob schema...")
            session.execute(
                text("""
                CREATE TABLE photos (
                    id SERIAL PRIMARY KEY,
                    merchant_id INTEGER NOT NULL,
                    vercel_blob_url TEXT NOT NULL,
                    file_extension VARCHAR(10) NOT NULL,
                    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
                    "order" INTEGER NOT NULL DEFAULT 0,
                    CONSTRAINT fk_merchant
                        FOREIGN KEY (merchant_id)
                        REFERENCES merchants(id)
                        ON DELETE CASCADE
                )
                """)
            )
            session.commit()
            print("[OK] Created new photos table")

            # Create indexes
            print("\nCreating indexes...")
            session.execute(
                text(
                    "CREATE INDEX ix_photos_merchant_id ON photos(merchant_id)"
                )
            )
            session.execute(
                text(
                    "CREATE INDEX ix_photos_is_primary ON photos(is_primary)"
                )
            )
            session.commit()
            print("[OK] Created indexes")

            print("\n" + "=" * 50)
            print("SUCCESS: Photos table recreated successfully!")
            print("=" * 50 + "\n")

        except Exception as e:
            print(f"\nERROR: Failed to recreate photos table: {e}")
            session.rollback()
            raise


if __name__ == "__main__":
    main()
