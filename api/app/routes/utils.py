from fastapi import APIRouter

from app.models.util import HealthCheck

router = APIRouter(prefix="/utils", tags=["utils"])


@router.get("/", response_model=HealthCheck)
def health_check():
    return HealthCheck(ok=True)
