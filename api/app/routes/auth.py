from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from sqlmodel import Session, select

from app.config import settings
from app.dependencies import SessionDep
from app.models.user import User, UserCreate
from app.models.utils import Token, TokenPayload

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def get_user_by_email(session: Session, email: str):
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    return user


def authenticate_user(session: Session, email: str, password: str):
    user = get_user_by_email(session, email)
    if not user:
        return None
    if not pwd_context.verify(password, user.hashed_password):
        return None
    return user


def create_token(data: TokenPayload, expires_delta: timedelta):
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = TokenPayload.model_validate(data, update={"exp": expire})

    encoded_jwt = jwt.encode(  # pyright: ignore[reportUnknownMemberType]
        to_encode.model_dump(),
        settings.SECRET_KEY,
        settings.ALGORITHM,
    )

    return encoded_jwt


@router.post("/login", response_model=Token)
def login_user(
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
    user = authenticate_user(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_payload = TokenPayload.model_validate({"sub": user.email})
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_token(access_token_payload, access_token_expires)

    return Token(access_token=access_token, token_type="bearer")


@router.post("/register", response_model=Token)
def register_user(session: SessionDep, user_in: UserCreate):
    existing_user = get_user_by_email(session, user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user this email already exists in the system",
        )

    user = User.model_validate(
        user_in, update={"hashed_password": pwd_context.hash(user_in.password)}
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    access_token_payload = TokenPayload.model_validate({"sub": user.email})
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_token(access_token_payload, access_token_expires)

    return Token(access_token=access_token, token_type="bearer")
