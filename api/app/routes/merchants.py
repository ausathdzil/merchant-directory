from typing import Annotated, Literal

from fastapi import APIRouter, Query
from sqlalchemy import or_

from app.dependencies import SessionDep
from app.models.merchant import Merchant, MerchantListItem, MerchantsPublic
from app.models.utils import PaginationMeta

router = APIRouter(prefix="/merchants", tags=["merchants"])


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
    query = session.query(Merchant)

    if search:
        search_filter = or_(
            Merchant.display_name.ilike(f"%{search}%"),
            Merchant.name.ilike(f"%{search}%"),
            Merchant.short_address.ilike(f"%{search}%"),
        )
        query = query.filter(search_filter)

    if primary_type:
        query = query.filter(Merchant.primary_type == primary_type)

    total_count = query.count()

    if sort_by == "name":
        order_column = (
            Merchant.display_name.asc()
            if sort_order == "asc"
            else Merchant.display_name.desc()
        )
    elif sort_by == "rating":
        order_column = (
            Merchant.rating.asc() if sort_order == "asc" else Merchant.rating.desc()
        )
    elif sort_by == "created_at":
        order_column = (
            Merchant.created_at.asc()
            if sort_order == "asc"
            else Merchant.created_at.desc()
        )
    else:
        order_column = Merchant.id.asc()

    query = query.order_by(order_column)

    offset = (page - 1) * page_size
    merchants = query.offset(offset).limit(page_size).all()

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
