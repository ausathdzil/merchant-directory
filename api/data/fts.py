# pyright: reportUnusedCallResult=false
"""
Migration script to add full-text search support to merchants table.

This migration:
1. Adds search_vector_en and search_vector_id columns to merchants table
2. Creates a function to generate tsvectors for both English and Indonesian
3. Creates a trigger to automatically update both search vectors
4. Creates GIN indexes on both search vectors for efficient searching
5. Populates both search vectors for existing merchants
"""

from sqlalchemy import text
from sqlalchemy.orm import Session


def upgrade(session: Session) -> None:
    """Apply the migration"""
    print("Adding search_vector columns...")
    session.execute(
        text(
            """
            ALTER TABLE merchants
            ADD COLUMN IF NOT EXISTS search_vector_en tsvector,
            ADD COLUMN IF NOT EXISTS search_vector_id tsvector;
        """
        )
    )

    print("Creating function to generate search vectors...")
    session.execute(
        text(
            """
            CREATE OR REPLACE FUNCTION merchants_search_vector_update()
            RETURNS TRIGGER AS $$
            BEGIN
                -- Generate English tsvector
                NEW.search_vector_en :=
                    setweight(to_tsvector('english', COALESCE(NEW.display_name, '')), 'A') ||
                    setweight(to_tsvector('english', COALESCE(NEW.short_address, '')), 'B');

                -- Generate Indonesian tsvector
                NEW.search_vector_id :=
                    setweight(to_tsvector('indonesian', COALESCE(NEW.display_name, '')), 'A') ||
                    setweight(to_tsvector('indonesian', COALESCE(NEW.short_address, '')), 'B');

                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        """
        )
    )

    print("Creating trigger to auto-update search vectors...")
    session.execute(
        text(
            """
            DROP TRIGGER IF EXISTS merchants_search_vector_trigger ON merchants;

            CREATE TRIGGER merchants_search_vector_trigger
            BEFORE INSERT OR UPDATE OF display_name, short_address ON merchants
            FOR EACH ROW
            EXECUTE FUNCTION merchants_search_vector_update();
        """
        )
    )

    print("Creating GIN indexes on search vectors...")
    session.execute(
        text(
            """
            CREATE INDEX IF NOT EXISTS merchants_search_vector_en_idx
            ON merchants USING GIN (search_vector_en);

            CREATE INDEX IF NOT EXISTS merchants_search_vector_id_idx
            ON merchants USING GIN (search_vector_id);
        """
        )
    )

    print("Populating search vectors for existing merchants...")
    session.execute(
        text(
            """
            UPDATE merchants
            SET search_vector_en =
                setweight(to_tsvector('english', COALESCE(display_name, '')), 'A') ||
                setweight(to_tsvector('english', COALESCE(short_address, '')), 'B'),
            search_vector_id =
                setweight(to_tsvector('indonesian', COALESCE(display_name, '')), 'A') ||
                setweight(to_tsvector('indonesian', COALESCE(short_address, '')), 'B');
        """
        )
    )

    session.commit()
    print("Migration completed successfully!")


def downgrade(session: Session) -> None:
    """Rollback the migration"""
    print("Dropping trigger...")
    session.execute(
        text("DROP TRIGGER IF EXISTS merchants_search_vector_trigger ON merchants;")
    )

    print("Dropping function...")
    session.execute(text("DROP FUNCTION IF EXISTS merchants_search_vector_update();"))

    print("Dropping indexes...")
    session.execute(text("DROP INDEX IF EXISTS merchants_search_vector_en_idx;"))
    session.execute(text("DROP INDEX IF EXISTS merchants_search_vector_id_idx;"))

    print("Dropping search_vector columns...")
    session.execute(
        text(
            "ALTER TABLE merchants DROP COLUMN IF EXISTS search_vector_en, DROP COLUMN IF EXISTS search_vector_id;"
        )
    )

    session.commit()
    print("Rollback completed successfully!")


def main():
    """Run the migration"""
    from app.database import SessionLocal

    print("\nStarting full-text search migration...\n")

    with SessionLocal() as session:
        try:
            upgrade(session)
        except Exception as e:
            print(f"\nError during migration: {e}")
            session.rollback()
            raise


if __name__ == "__main__":
    main()
