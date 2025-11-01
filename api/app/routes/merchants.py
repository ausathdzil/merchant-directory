from typing import Literal

from fastapi import APIRouter, Query
from pydantic import BaseModel
from sqlmodel import func, or_, select

from app.dependencies import SessionDep
from app.models.merchant import Merchant

router = APIRouter(prefix="/merchants", tags=["merchants"])


# Response models for optimized data transfer
class MerchantListItem(BaseModel):
    """Optimized model for list/grid view"""

    id: int
    display_name: str | None
    name: str
    primary_type: str | None
    short_address: str | None
    rating: float | None
    user_rating_count: int | None

    class Config:
        from_attributes = True


class PaginationMeta(BaseModel):
    """Pagination metadata"""

    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool


class MerchantsPublic(BaseModel):
    """Response model for list of merchants"""

    data: list[MerchantListItem]
    meta: PaginationMeta


@router.get("/", response_model=MerchantsPublic)
def read_merchants(
    session: SessionDep,
    page: int = Query(1, ge=1, description="Page number (starts at 1)"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    search: str | None = Query(None, description="Search in name and address"),
    primary_type: str | None = Query(None, description="Filter by primary type"),
    is_open_now: bool | None = Query(None, description="Filter by open/closed status"),
    min_rating: float | None = Query(None, ge=0, le=5, description="Minimum rating"),
    sort_by: Literal["name", "rating", "distance", "created_at"] = Query(
        "created_at", description="Sort field"
    ),
    sort_order: Literal["asc", "desc"] = Query("desc", description="Sort order"),
):
    """
    Get all merchants with search, filters, sorting, and pagination.
    Returns optimized data for list/grid view.

    **Search:**
    - Searches in display_name, name, and short_address using ILIKE

    **Filters:**
    - primary_type: Filter by business type (e.g., 'coffee_shop', 'restaurant')
    - is_open_now: Filter by open status (true/false)
    - min_rating: Minimum rating threshold (0-5)

    **Sorting:**
    - Sort by: name, rating, distance, created_at
    - Sort order: asc or desc

    **Pagination:**
    - page: Page number (starts at 1)
    - page_size: Number of items per page (max 100)
    """
    statement = select(Merchant)

    if search:
        search_filter = or_(
            Merchant.display_name.ilike(f"%{search}%"),
            Merchant.name.ilike(f"%{search}%"),
            Merchant.short_address.ilike(f"%{search}%"),
        )
        statement = statement.where(search_filter)

    if primary_type:
        statement = statement.where(Merchant.primary_type == primary_type)

    if is_open_now is not None:
        statement = statement.where(Merchant.is_open_now == is_open_now)

    if min_rating is not None:
        statement = statement.where(Merchant.rating >= min_rating)

    count_statement = select(func.count()).select_from(statement.subquery())
    total_count = session.exec(count_statement).one()

    if sort_by == "name":
        order_column = Merchant.display_name if sort_order == "asc" else Merchant.display_name.desc()
    elif sort_by == "rating":
        order_column = Merchant.rating if sort_order == "asc" else Merchant.rating.desc()
    elif sort_by == "created_at":
        order_column = Merchant.created_at if sort_order == "asc" else Merchant.created_at.desc()
    else:  # distance - placeholder for now (will implement with geospatial later)
        order_column = Merchant.id

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
