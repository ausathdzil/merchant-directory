"""
Migration script to add rating column to feedbacks table.

This migration:
1. Adds rating column to the feedbacks table (INTEGER, NOT NULL)
2. Adds a check constraint to ensure rating is between 1 and 5

Usage:
    uv run python -m migrations.add_feedback_rating
"""

from sqlalchemy import text
from sqlalchemy.orm import Session


def upgrade(session: Session) -> None:
    """Apply the migration"""
    # Check if column already exists
    result = session.execute(
        text(
            """
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'feedbacks' AND column_name = 'rating';
        """
        )
    )
    column_exists = result.fetchone() is not None

    if not column_exists:
        print("Adding rating column to feedbacks table...")
        # First add as nullable with default for existing rows
        session.execute(
            text(
                """
                ALTER TABLE feedbacks
                ADD COLUMN rating INTEGER DEFAULT 5;
            """
            )
        )

        # Update any NULL values to default (shouldn't happen but safe)
        session.execute(
            text(
                """
                UPDATE feedbacks
                SET rating = 5
                WHERE rating IS NULL;
            """
            )
        )

        # Now make it NOT NULL
        session.execute(
            text(
                """
                ALTER TABLE feedbacks
                ALTER COLUMN rating SET NOT NULL;
            """
            )
        )

        # Remove the default since we want it required for new rows
        session.execute(
            text(
                """
                ALTER TABLE feedbacks
                ALTER COLUMN rating DROP DEFAULT;
            """
            )
        )
    else:
        print("Rating column already exists, skipping column creation...")

    print("Adding check constraint for rating range (1-5)...")
    session.execute(
        text(
            """
            ALTER TABLE feedbacks
            DROP CONSTRAINT IF EXISTS rating_range;
        """
        )
    )
    session.execute(
        text(
            """
            ALTER TABLE feedbacks
            ADD CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5);
        """
        )
    )

    session.commit()
    print("SUCCESS: Rating column and constraint added successfully!")


def downgrade(session: Session) -> None:
    """Rollback the migration"""
    print("Dropping constraint...")
    session.execute(
        text("ALTER TABLE feedbacks DROP CONSTRAINT IF EXISTS rating_range;")
    )

    print("Dropping column...")
    session.execute(
        text(
            """
            ALTER TABLE feedbacks
            DROP COLUMN IF EXISTS rating;
        """
        )
    )

    session.commit()
    print("SUCCESS: Rating column removed successfully!")


def main():
    """Run the migration"""
    from app.database import SessionLocal

    print("\nStarting feedback rating migration...\n")

    with SessionLocal() as session:
        try:
            upgrade(session)

            # Show statistics
            result = session.execute(
                text(
                    """
                    SELECT
                        COUNT(*) as total_feedbacks,
                        AVG(rating) as avg_rating,
                        MIN(rating) as min_rating,
                        MAX(rating) as max_rating
                    FROM feedbacks;
                """
                )
            )
            stats = result.fetchone()

            print("\nMigration Statistics:")
            print(f"  Total feedbacks: {stats[0]}")
            if stats[1]:
                print(f"  Average rating: {stats[1]:.2f}")
                print(f"  Min rating: {stats[2]}")
                print(f"  Max rating: {stats[3]}")

        except Exception as e:
            print(f"\nError during migration: {e}")
            session.rollback()
            raise


if __name__ == "__main__":
    main()
