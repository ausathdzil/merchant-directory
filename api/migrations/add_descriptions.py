# pyright: reportOptionalSubscript=false
"""
Migration script to add description columns to merchants table.

This migration:
1. Adds description_en column to the merchants table (English description)
2. Adds description_id column to the merchants table (Indonesian description)
3. Populates the descriptions from data/merchant_descriptions.csv
4. Creates indexes for better query performance

Usage:
    uv run python -m migrations.add_descriptions
"""

import csv
from pathlib import Path

from sqlalchemy import text
from sqlalchemy.orm import Session


def upgrade(session: Session) -> None:
    """Apply the migration"""
    print("Adding description_en column to merchants table...")
    session.execute(
        text("""
            ALTER TABLE merchants
            ADD COLUMN IF NOT EXISTS description_en TEXT;
        """)
    )

    print("Adding description_id column to merchants table...")
    session.execute(
        text("""
            ALTER TABLE merchants
            ADD COLUMN IF NOT EXISTS description_id TEXT;
        """)
    )

    print("Creating index on merchants.description_en...")
    session.execute(
        text("""
            CREATE INDEX IF NOT EXISTS merchants_description_en_idx
            ON merchants (description_en)
            WHERE description_en IS NOT NULL;
        """)
    )

    print("Creating index on merchants.description_id...")
    session.execute(
        text("""
            CREATE INDEX IF NOT EXISTS merchants_description_id_idx
            ON merchants (description_id)
            WHERE description_id IS NOT NULL;
        """)
    )

    session.commit()
    print("SUCCESS: Columns and indexes created successfully!")

    # Populate descriptions from CSV
    print("\nPopulating descriptions from CSV file...")
    csv_path = Path(__file__).parent.parent / "data" / "merchant_descriptions.csv"

    if not csv_path.exists():
        print(f"WARNING: CSV file not found at {csv_path}")
        return

    updated_count = 0
    skipped_count = 0

    with open(csv_path, "r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            merchant_id = row.get("id")
            description_id = row.get("description_id")
            description_en = row.get("description_en")

            if not merchant_id:
                skipped_count += 1
                continue

            # Update merchant with descriptions
            result = session.execute(
                text("""
                    UPDATE merchants
                    SET description_en = :desc_en,
                        description_id = :desc_id
                    WHERE id = :merchant_id
                """),
                {
                    "desc_en": description_en,
                    "desc_id": description_id,
                    "merchant_id": merchant_id,
                },
            )

            if result.rowcount > 0:  # pyright: ignore[reportAttributeAccessIssue]
                updated_count += 1
            else:
                skipped_count += 1
                print(f"  WARNING: Merchant ID {merchant_id} not found in database")

    session.commit()
    print("\nDescription population complete:")
    print(f"  Updated: {updated_count} merchants")
    print(f"  Skipped: {skipped_count} records")


def downgrade(session: Session) -> None:
    """Rollback the migration"""
    print("Dropping indexes...")
    session.execute(text("DROP INDEX IF EXISTS merchants_description_en_idx;"))
    session.execute(text("DROP INDEX IF EXISTS merchants_description_id_idx;"))

    print("Dropping columns...")
    session.execute(
        text("""
            ALTER TABLE merchants
            DROP COLUMN IF EXISTS description_en;
        """)
    )
    session.execute(
        text("""
            ALTER TABLE merchants
            DROP COLUMN IF EXISTS description_id;
        """)
    )

    session.commit()
    print("SUCCESS: Description columns removed successfully!")


def main():
    """Run the migration"""
    from app.database import SessionLocal

    print("\nStarting descriptions migration...\n")

    with SessionLocal() as session:
        try:
            upgrade(session)

            # Show statistics
            result = session.execute(
                text("""
                    SELECT
                        COUNT(*) as total_merchants,
                        COUNT(description_en) as merchants_with_desc_en,
                        COUNT(description_id) as merchants_with_desc_id,
                        COUNT(*) - COUNT(description_en) as merchants_without_desc
                    FROM merchants;
                """)
            )
            stats = result.fetchone()

            print("\nMigration Statistics:")
            print(f"  Total merchants: {stats[0]}")
            print(f"  Merchants with English descriptions: {stats[1]}")
            print(f"  Merchants with Indonesian descriptions: {stats[2]}")
            print(f"  Merchants without descriptions: {stats[3]}")

        except Exception as e:
            print(f"\nError during migration: {e}")
            session.rollback()
            raise


if __name__ == "__main__":
    main()
