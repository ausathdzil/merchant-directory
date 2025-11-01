from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import func, select

from app.dependencies import SessionDep
from app.models.merchant import (
    Merchant,
    MerchantDetail,
    MerchantListItem,
    MerchantsPublic,
)
from app.models.utils import PaginationMeta

router = APIRouter(prefix="/merchants", tags=["merchants"])


def format_type_name(type_name: str) -> str:
    return type_name.replace("_", " ").title()


@router.get("", response_model=MerchantsPublic)
def read_merchants(
    session: SessionDep,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 10,
    search: Annotated[str | None, Query()] = None,
    primary_type: Annotated[str | None, Query()] = None,
    search_lang: Annotated[Literal["english", "indonesian"], Query()] = "english",
    sort_by: Annotated[
        Literal["name", "rating", "distance", "created_at"], Query()
    ] = "created_at",
    sort_order: Annotated[Literal["asc", "desc"], Query()] = "desc",
):
    stmt = select(Merchant)
    rank_expr = None

    if search:
        ts_config = "english" if search_lang == "english" else "indonesian"
        search_vector_col = (
            Merchant.search_vector_en
            if search_lang == "english"
            else Merchant.search_vector_id
        )
        tsquery = func.plainto_tsquery(ts_config, search)
        stmt = stmt.where(
            search_vector_col.isnot(None), search_vector_col.op("@@")(tsquery)
        )
        rank_expr = func.ts_rank(search_vector_col, tsquery)

    if primary_type:
        stmt = stmt.where(Merchant.primary_type == primary_type)

    total_count = session.scalar(select(func.count()).select_from(stmt.subquery())) or 0

    if search and rank_expr is not None:
        order_columns = [rank_expr.desc()]
        if sort_by == "name":
            order_columns.append(
                Merchant.display_name.asc()
                if sort_order == "asc"
                else Merchant.display_name.desc()
            )
        elif sort_by == "rating":
            order_columns.append(
                Merchant.rating.asc() if sort_order == "asc" else Merchant.rating.desc()
            )
        elif sort_by == "created_at":
            order_columns.append(
                Merchant.created_at.asc()
                if sort_order == "asc"
                else Merchant.created_at.desc()
            )
        else:
            order_columns.append(Merchant.id.asc())

        stmt = stmt.order_by(*order_columns)
    else:
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

        stmt = stmt.order_by(order_column)

    offset = (page - 1) * page_size
    stmt = stmt.offset(offset).limit(page_size)

    merchants = session.scalars(stmt).all()

    merchant_items = [
        MerchantListItem(
            id=merchant.id,
            display_name=merchant.display_name,
            name=merchant.name,
            primary_type=(
                format_type_name(merchant.primary_type)
                if merchant.primary_type
                else None
            ),
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


@router.get("/{merchant_id}", response_model=MerchantDetail)
def read_merchant(merchant_id: int, session: SessionDep):
    stmt = select(Merchant).where(Merchant.id == merchant_id)
    merchant = session.scalar(stmt)

    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")

    return MerchantDetail(
        id=merchant.id,
        display_name=merchant.display_name,
        name=merchant.name,
        primary_type=(
            format_type_name(merchant.primary_type) if merchant.primary_type else None
        ),
        formatted_address=merchant.formatted_address,
        short_address=merchant.short_address,
        phone_national=merchant.phone_national,
        phone_international=merchant.phone_international,
        website=merchant.website,
        latitude=merchant.latitude,
        longitude=merchant.longitude,
        rating=merchant.rating,
        user_rating_count=merchant.user_rating_count,
    )
