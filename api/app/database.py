from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import SQLModel, create_engine

from app.config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)


# def run_seed():
#     """Run the seed script to populate the database"""
#     try:
#         from seed import main as seed_main
#         print("\nRunning database seed...")
#         seed_main()
#         print("Seed completed!")
#     except Exception as e:
#         import traceback
#         print(f"Seed script error: {e}")
#         print("Full traceback:")
#         traceback.print_exc()
#         print("Skipping seed - continuing with app startup...")


@asynccontextmanager
async def lifespan(_app: FastAPI):
    SQLModel.metadata.create_all(engine)
    # run_seed()  # Commented out - data already seeded. Uncomment to re-seed on startup.
    yield
    engine.dispose()
