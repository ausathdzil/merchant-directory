# pyright: reportUnusedCallResult=false
"""
Migration script to enable pg_trgm extension and create trigram indexes.

This migration:
1. Enables the pg_trgm extension if not already enabled
2. Creates GIN indexes on display_name and short_address columns using gin_trgm_ops
3. These indexes enable fast trigram-based similarity searches
"""

from sqlalchemy import text
from sqlalchemy.orm import Session


def upgrade(session: Session) -> None:
    """Apply the migration"""
    print("Enabling pg_trgm extension...")
    session.execute(text("CREATE EXTENSION IF NOT EXISTS pg_trgm;"))

    print("Creating trigram indexes...")
    print("Creating GIN index on display_name...")
    session.execute(
        text("""
            CREATE INDEX IF NOT EXISTS merchants_display_name_trgm_idx
            ON merchants USING GIN (display_name gin_trgm_ops);
        """)
    )

    print("Creating GIN index on short_address...")
    session.execute(
        text("""
            CREATE INDEX IF NOT EXISTS merchants_short_address_trgm_idx
            ON merchants USING GIN (short_address gin_trgm_ops);
        """)
    )

    session.commit()
    print("pg_trgm extension and indexes created successfully!")


def downgrade(session: Session) -> None:
    """Rollback the migration"""
    print("Dropping trigram indexes...")
    session.execute(text("DROP INDEX IF EXISTS merchants_display_name_trgm_idx;"))
    session.execute(text("DROP INDEX IF EXISTS merchants_short_address_trgm_idx;"))

    print("Dropping pg_trgm extension...")
    session.execute(text("DROP EXTENSION IF EXISTS pg_trgm;"))

    session.commit()
    print("pg_trgm extension and indexes removed successfully!")


def main():
    """Run the migration"""
    from app.database import SessionLocal

    print("\nStarting pg_trgm extension and indexes migration...\n")

    with SessionLocal() as session:
        try:
            upgrade(session)
        except Exception as e:
            print(f"\nError during migration: {e}")
            session.rollback()
            raise


if __name__ == "__main__":
    main()
