from fastapi import APIRouter

from app.models.utils import Status

router = APIRouter(prefix="/utils", tags=["utils"])


@router.get("/", response_model=Status)
def health_check():
    return Status(ok=True)
