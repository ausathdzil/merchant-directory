# Veteran Market

A merchant directory platform connecting customers with small and medium enterprises near UPN Veteran Jakarta campuses in Limo, Depok and Pondok Labu, South Jakarta.

## Authors

- [Ausath Ikram](https://github.com/ausathdzil)
- [Muhammad Boby Pratama](http://github.com/MBobyPratama)
- [Rafki Aulia Hazli](https://github.com/rafkiaulia)

## Features

- **Merchant Directory**: Browse and search through a comprehensive directory of local businesses
- **Interactive Map**: View merchant locations on an interactive Mapbox map
- **Search & Filter**: Search merchants by name and filter by category/type
- **Merchant Profiles**: Detailed profiles with photos, descriptions, contact information, ratings, and operating hours
- **Multi-language Support**: Available in English and Indonesian (Bahasa Indonesia)
- **Location-based Search**: Find merchants near UPN Veteran Jakarta campuses
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Theme Switching**: Dark and light mode support
- **Accessibility**: Font switching options for improved readability
- **Pagination**: Efficient browsing with paginated merchant listings
- **SEO Optimization**: Comprehensive SEO features including:
  - **Dynamic Metadata**: Page-specific metadata generation for all routes (home, explore, about, contact, merchant pages)
  - **Sitemap Generation**: Automated XML sitemap with all pages, merchant listings, and language alternates
  - **Robots.txt**: Configured robots.txt with sitemap reference for search engine crawlers
  - **Open Graph Tags**: Social media sharing optimization with Open Graph metadata
  - **Canonical URLs**: Proper canonical URL configuration to prevent duplicate content issues
  - **Language Alternates**: Hreflang tags for multi-language SEO with English and Indonesian variants
  - **Title Templates**: Dynamic title generation with consistent branding across all pages
  - **Structured Data**: Merchant-specific metadata for better search engine understanding

## How to Run

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Python 3.12
- uv package manager
- PostgreSQL database (Neon Postgres recommended)

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd merchant-directory
   ```

2. **Backend Setup**

   Navigate to the API directory:

   ```bash
   cd api
   ```

   Install uv (if not already installed):

   ```bash
   pip install uv
   ```

   Create and activate virtual environment:

   ```bash
   # Create virtual environment
   uv venv

   # Activate virtual environment
   # Windows PowerShell
   .venv\Scripts\Activate.ps1
   
   # Windows CMD
   .venv\Scripts\activate.bat
   
   # Linux/macOS
   source .venv/bin/activate
   ```

   Install dependencies:

   ```bash
   uv sync
   ```

   Create a `.env` file in the `api` directory with the following variables:

   ```env
   DATABASE_URL=your_postgresql_connection_string
   SECRET_KEY=your_secret_key
   FRONTEND_HOST=http://localhost:3000
   BACKEND_CORS_ORIGIN=http://localhost:3000
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
   ```

   **Note**:
   - `DATABASE_URL` is required.
   - `SECRET_KEY`, `FRONTEND_HOST`, and `BACKEND_CORS_ORIGIN` have defaults but should be set for production.
   - `BLOB_READ_WRITE_TOKEN` is required for running database migrations that upload merchant photos to Vercel Blob storage. Get your token from the [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables → `BLOB_READ_WRITE_TOKEN`.

   Run the development server:

   ```bash
   uvicorn server:app --reload
   ```

   The API will be available at `http://localhost:8000`

3. **Frontend Setup**

   Navigate to the web directory:

   ```bash
   cd web
   ```

   Install dependencies:

   ```bash
   pnpm install
   ```

   Create a `.env.local` file in the `web` directory with the following variables:

   ```env
   API_URL=http://localhost:8000/api/v1
   MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   BASE_URL=http://localhost:3000
   ```

   **Note**: `BASE_URL` is optional and defaults to `http://localhost:3000`. `API_URL` and `MAPBOX_ACCESS_TOKEN` are required.

   Run the development server:

   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

### Database Seeding (Optional)

If you need to seed the database with merchant data and photos, you'll need to run the migration scripts. See `api/migrations/README.md` for detailed instructions. The photo migration scripts require `BLOB_READ_WRITE_TOKEN` to upload images to Vercel Blob storage.

## Tech Stack

### Frontend

- **Next.js** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - UI component library
- **next-intl** - Internationalization
- **Mapbox GL** - Interactive maps
- **React Map GL** - React wrapper for Mapbox
- **Lucide React** - Icon library
- **Motion** - Animation library

### Backend

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **PostgreSQL** - Relational database (Neon Postgres)
- **Pydantic** - Data validation
- **JWT** - Authentication tokens
- **Uvicorn** - ASGI server
- **Vercel Blob** - Cloud storage for merchant photos

### Development Tools

- **uv** - Fast Python package installer
- **pnpm** - Fast, disk space efficient package manager
- **Biome** - Fast formatter and linter
