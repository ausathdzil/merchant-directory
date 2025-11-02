from fastapi import APIRouter
from sqlalchemy import select

from app.dependencies import SessionDep
from app.models.merchant import MerchantType


router = APIRouter(prefix="/merchant-types", tags=["type"])


def format_type_name(type_name: str) -> str:
    return type_name.replace("_", " ").title()


@router.get("", response_model=list[str])
def read_merchant_types(session: SessionDep):
    stmt = select(MerchantType.type_name).distinct()
    types = session.scalars(stmt).all()

    return [format_type_name(type_name) for type_name in sorted(types)]
