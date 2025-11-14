# Migration Scripts

This directory contains database migration and seeding scripts for the Merchant Directory API.

## Data Seeding Scripts

### Core Data
- **`seed.py`** - Seeds merchants, types, reviews, opening hours, and amenities from Google Maps API JSON data
  - Usage: `uv run python -m migrations.seed [path/to/data.json]`
  - Default: Uses `data/pondok-labu.json`
  - Note: Does not seed photos (photos table is now for Vercel Blob storage only)

### Photo Management
- **`reseed_all_photos.py`** - Master script to run all photo migration steps in order
  - Usage: `uv run python -m migrations.reseed_all_photos`
  - Runs: cleanup → recreate table → primary photos → additional photos

- **`cleanup_vercel_blob.py`** - Deletes all existing photos from Vercel Blob storage
  - Usage: `uv run python -m migrations.cleanup_vercel_blob`

- **`recreate_photos_table.py`** - Drops and recreates photos table with Vercel Blob schema
  - Usage: `uv run python -m migrations.recreate_photos_table`

- **`photos.py`** - Uploads primary merchant photos to Vercel Blob
  - Source: `data/merchant_photos/`
  - Naming: `merchants/{merchant_id}/primary.{ext}`
  - Updates: photos table (is_primary=True, order=0) and merchants.photo_url

- **`additional_photos.py`** - Uploads additional merchant photos to Vercel Blob
  - Source: `data/additional_photos/{merchant_id}/`
  - Naming: `merchants/{merchant_id}/photo-1.{ext}`, `photo-2.{ext}`, etc.
  - Updates: photos table (is_primary=False, order=1,2,3...)

## Database Schema Migrations

### Search Features
- **`fts.py`** - Adds full-text search support using PostgreSQL tsvector
- **`trgm.py`** - Adds trigram similarity search using pg_trgm extension

### Content
- **`add_descriptions.py`** - Adds description columns to merchants table

## Obsolete Files

- **`add_photo_url.py.old`** - Old migration for adding photo_url column (now recreated via recreate_photos_table.py)

## Photos Table Schema

The `photos` table now stores Vercel Blob uploaded photos only:

```sql
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    merchant_id INTEGER NOT NULL,
    vercel_blob_url TEXT NOT NULL,
    file_extension VARCHAR(10) NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    "order" INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);
```

### Photo Naming Convention

**Primary photos:**
- Blob path: `merchants/{merchant_id}/primary.{ext}`
- Database: `is_primary=True`, `order=0`

**Additional photos:**
- Blob path: `merchants/{merchant_id}/photo-1.{ext}`, `photo-2.{ext}`, etc.
- Database: `is_primary=False`, `order=1,2,3...`

## Running Migrations

All migration scripts require the `BLOB_READ_WRITE_TOKEN` environment variable to be set in `.env` for Vercel Blob operations.

### Full Fresh Setup
```bash
# 1. Seed merchants from Google Maps data
uv run python -m migrations.seed data/pondok-labu.json

# 2. Add search capabilities
uv run python -m migrations.fts
uv run python -m migrations.trgm

# 3. Add descriptions
uv run python -m migrations.add_descriptions

# 4. Upload all photos to Vercel Blob
uv run python -m migrations.reseed_all_photos
```

### Photo Updates Only
```bash
# Update specific photo sets
uv run python -m migrations.photos              # Primary photos only
uv run python -m migrations.additional_photos   # Additional photos only
```
