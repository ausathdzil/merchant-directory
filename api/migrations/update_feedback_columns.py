"""
Migration script to update feedbacks table column types.

This migration:
1. Changes name column from TEXT/VARCHAR(255) to VARCHAR(50)
2. Changes message column from TEXT to VARCHAR(255)

Usage:
    uv run python -m migrations.update_feedback_columns
"""

from sqlalchemy import text
from sqlalchemy.orm import Session


def upgrade(session: Session) -> None:
    """Apply the migration"""
    print("Updating name column to VARCHAR(50)...")
    session.execute(
        text(
            """
            ALTER TABLE feedbacks
            ALTER COLUMN name TYPE VARCHAR(50);
        """
        )
    )

    print("Updating message column to VARCHAR(255)...")
    session.execute(
        text(
            """
            ALTER TABLE feedbacks
            ALTER COLUMN message TYPE VARCHAR(255);
        """
        )
    )

    session.commit()
    print("SUCCESS: Column types updated successfully!")


def downgrade(session: Session) -> None:
    """Rollback the migration"""
    print("Reverting message column to TEXT...")
    session.execute(
        text(
            """
            ALTER TABLE feedbacks
            ALTER COLUMN message TYPE TEXT;
        """
        )
    )

    print("Reverting name column to VARCHAR(255)...")
    session.execute(
        text(
            """
            ALTER TABLE feedbacks
            ALTER COLUMN name TYPE VARCHAR(255);
        """
        )
    )

    session.commit()
    print("SUCCESS: Column types reverted successfully!")


def main():
    """Run the migration"""
    from app.database import SessionLocal

    print("\nStarting feedback columns migration...\n")

    with SessionLocal() as session:
        try:
            upgrade(session)

            # Show column info
            result = session.execute(
                text(
                    """
                    SELECT
                        column_name,
                        data_type,
                        character_maximum_length
                    FROM information_schema.columns
                    WHERE table_name = 'feedbacks'
                    ORDER BY ordinal_position;
                """
                )
            )
            columns = result.fetchall()

            print("\nCurrent column types:")
            for col in columns:
                col_name, data_type, max_length = col
                if max_length:
                    print(f"  {col_name}: {data_type}({max_length})")
                else:
                    print(f"  {col_name}: {data_type}")

        except Exception as e:
            print(f"\nError during migration: {e}")
            session.rollback()
            raise


if __name__ == "__main__":
    main()
