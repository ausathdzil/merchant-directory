from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_session
from app.models.user import User, UserPublic
from app.models.utils import TokenPayload

SessionDep = Annotated[Session, Depends(get_session)]


oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")
TokenDep = Annotated[str, Depends(oauth2_scheme)]


def get_current_user(session: SessionDep, access_token: TokenDep):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(  # pyright: ignore[reportAny, reportUnknownMemberType]
            access_token, settings.SECRET_KEY, settings.ALGORITHM
        )
        token_payload = TokenPayload.model_validate(payload)
    except (InvalidTokenError, ValidationError):
        raise credentials_exception

    stmt = select(User).where(User.email == token_payload.sub)
    user = session.scalar(stmt)

    if user is None:
        raise credentials_exception

    return UserPublic.model_validate(user)


CurrentUser = Annotated[UserPublic, Depends(get_current_user)]
