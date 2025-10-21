from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import InvalidTokenError
from pydantic import ValidationError
from sqlmodel import Session, select

from app.config import settings
from app.database import engine
from app.models.user import User, UserPublic
from app.models.utils import TokenPayload


def get_session():
    with Session(engine) as session:
        yield session


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

    statement = select(User).where(User.email == token_payload.sub)
    user = session.exec(statement).first()

    if user is None:
        raise credentials_exception

    return UserPublic.model_validate(user)


CurrentUser = Annotated[UserPublic, Depends(get_current_user)]
