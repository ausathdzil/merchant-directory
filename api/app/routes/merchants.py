from typing import Annotated, Literal

from fastapi import APIRouter, Query
from pydantic import BaseModel
from sqlmodel import col, func, or_, select

from app.dependencies import SessionDep
from app.models.merchant import Merchant
from app.models.utils import PaginationMeta

router = APIRouter(prefix="/merchants", tags=["merchants"])


class MerchantListItem(BaseModel):
    id: int | None
    display_name: str | None
    name: str
    primary_type: str | None
    short_address: str | None
    rating: float | None
    user_rating_count: int | None


class MerchantsPublic(BaseModel):
    data: list[MerchantListItem]
    meta: PaginationMeta


@router.get("", response_model=MerchantsPublic)
def read_merchants(
    session: SessionDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 10,
    search: Annotated[str | None, Query()] = None,
    primary_type: Annotated[str | None, Query()] = None,
    sort_by: Annotated[
        Literal["name", "rating", "distance", "created_at"], Query()
    ] = "created_at",
    sort_order: Annotated[Literal["asc", "desc"], Query()] = "desc",
):
    statement = select(Merchant)

    if search:
        search_filter = or_(
            col(Merchant.display_name).ilike(f"%{search}"),
            col(Merchant.name).ilike(f"%{search}%"),
            col(Merchant.short_address).ilike(f"%{search}%"),
        )
        statement = statement.where(search_filter)

    if primary_type:
        statement = statement.where(Merchant.primary_type == primary_type)

    count_statement = select(func.count()).select_from(statement.subquery())
    total_count = session.exec(count_statement).one()

    if sort_by == "name":
        order_column = (
            col(Merchant.display_name).asc()
            if sort_order == "asc"
            else col(Merchant.display_name).desc()
        )
    elif sort_by == "rating":
        order_column = (
            col(Merchant.rating).asc()
            if sort_order == "asc"
            else col(Merchant.rating).desc()
        )
    elif sort_by == "created_at":
        order_column = (
            col(Merchant.created_at).asc()
            if sort_order == "asc"
            else col(Merchant.created_at).desc()
        )
    else:
        order_column = col(Merchant.id).asc()

    statement = statement.order_by(order_column)

    offset = (page - 1) * page_size
    statement = statement.offset(offset).limit(page_size)

    merchants = session.exec(statement).all()

    merchant_items = [
        MerchantListItem(
            id=merchant.id,
            display_name=merchant.display_name,
            name=merchant.name,
            primary_type=merchant.primary_type,
            short_address=merchant.short_address,
            rating=merchant.rating,
            user_rating_count=merchant.user_rating_count,
        )
        for merchant in merchants
    ]

    total_pages = (total_count + page_size - 1) // page_size
    has_next = page < total_pages
    has_previous = page > 1

    return MerchantsPublic(
        data=merchant_items,
        meta=PaginationMeta(
            total=total_count,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            has_next=has_next,
            has_previous=has_previous,
        ),
    )
