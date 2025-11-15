from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import lifespan
from app.models.utils import Message
from app.routes import auth, feedbacks, merchant_types, merchants, users, utils

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(feedbacks.router)
api_router.include_router(merchants.router)
api_router.include_router(merchant_types.router)
api_router.include_router(utils.router)
api_router.include_router(users.router)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    lifespan=lifespan,
)

if settings.all_cors_origin:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origin,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(router=api_router, prefix=settings.API_V1_STR)


@app.get("/", response_model=Message)
def read_root():
    return Message(message="Hello World")
