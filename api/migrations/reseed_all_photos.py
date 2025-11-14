"""
Master script to run all photo migration steps in order

This script runs:
1. Cleanup Vercel Blob storage
2. Recreate photos table
3. Upload primary photos
4. Upload additional photos

Usage:
    1. Make sure BLOB_READ_WRITE_TOKEN is set in your .env file
    2. Run: uv run python -m migrations.reseed_all_photos
"""

import sys
from pathlib import Path

# Add the project root to the path
sys.path.insert(0, str(Path(__file__).parent.parent))

from migrations.cleanup_vercel_blob import main as cleanup_blob
from migrations.recreate_photos_table import main as recreate_table
from migrations.photos import main as upload_primary
from migrations.additional_photos import main as upload_additional


def main():
    """Run all migration steps"""
    print("\n" + "=" * 60)
    print("STARTING FULL PHOTO MIGRATION")
    print("=" * 60)

    try:
        # Step 1: Cleanup Vercel Blob
        print("\n[STEP 1/4] Cleaning up Vercel Blob storage...")
        cleanup_blob()

        # Step 2: Recreate photos table
        print("\n[STEP 2/4] Recreating photos table...")
        recreate_table()

        # Step 3: Upload primary photos
        print("\n[STEP 3/4] Uploading primary photos...")
        upload_primary()

        # Step 4: Upload additional photos
        print("\n[STEP 4/4] Uploading additional photos...")
        upload_additional()

        print("\n" + "=" * 60)
        print("[SUCCESS] ALL MIGRATION STEPS COMPLETED SUCCESSFULLY")
        print("=" * 60 + "\n")

    except Exception as e:
        print("\n" + "=" * 60)
        print(f"[FAILED] MIGRATION FAILED: {e}")
        print("=" * 60 + "\n")
        raise


if __name__ == "__main__":
    main()
