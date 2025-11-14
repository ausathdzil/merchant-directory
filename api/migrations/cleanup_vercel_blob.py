"""
Script to delete all existing photos from Vercel Blob storage

This script:
1. Lists all files in the Vercel Blob store
2. Deletes all files in the merchants/ directory

Usage:
    1. Make sure BLOB_READ_WRITE_TOKEN is set in your .env file
    2. Run: uv run python -m migrations.cleanup_vercel_blob
"""

import os

from dotenv import load_dotenv
from vercel.blob import list_objects, delete

# Load environment variables
load_dotenv()

# Get Vercel Blob token from environment
BLOB_READ_WRITE_TOKEN = os.getenv("BLOB_READ_WRITE_TOKEN")
if not BLOB_READ_WRITE_TOKEN:
    raise ValueError("BLOB_READ_WRITE_TOKEN not found in environment variables")


def main():
    """Delete all photos from Vercel Blob"""
    print("\nDeleting all photos from Vercel Blob...\n")

    try:
        # List all blobs
        print("Fetching list of blobs...")
        result = list_objects(token=BLOB_READ_WRITE_TOKEN)
        blobs = result.blobs

        if not blobs:
            print("No blobs found in storage.")
            return

        print(f"Found {len(blobs)} blob(s) to delete\n")

        # Delete each blob
        deleted_count = 0
        error_count = 0

        for blob in blobs:
            try:
                print(f"Deleting: {blob.pathname}")
                delete(blob.url, token=BLOB_READ_WRITE_TOKEN)
                deleted_count += 1
            except Exception as e:
                print(f"ERROR: Failed to delete {blob.pathname}: {e}")
                error_count += 1

        print("\n" + "=" * 50)
        print("Cleanup completed!")
        print(f"Deleted: {deleted_count}")
        print(f"Errors: {error_count}")
        print(f"Total: {len(blobs)}")
        print("=" * 50 + "\n")

    except Exception as e:
        print(f"\nERROR: Failed to cleanup Vercel Blob: {e}")
        raise


if __name__ == "__main__":
    main()
