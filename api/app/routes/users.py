from fastapi import APIRouter

from app.dependencies import CurrentUser
from app.models.user import UserPublic

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser):
    return current_user
