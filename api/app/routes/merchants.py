from typing import Annotated, Literal

from fastapi import APIRouter, HTTPException, Query
from sqlalchemy import func, select

from app.dependencies import SessionDep
from app.models.merchant import (
    Amenity,
    AmenityPublic,
    Merchant,
    MerchantDetail,
    MerchantListItem,
    MerchantsPublic,
    MerchantType,
    MerchantTypePublic,
    OpeningHours,
    OpeningHoursPublic,
    Photo,
    PhotoPublic,
    Review,
    ReviewPublic,
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
    type: Annotated[str | None, Query()] = None,
    lang: Annotated[Literal["english", "indonesian"], Query()] = "english",
    sort_by: Annotated[
        Literal["name", "rating", "distance", "created_at"], Query()
    ] = "created_at",
    sort_order: Annotated[Literal["asc", "desc"], Query()] = "desc",
):
    stmt = select(Merchant)
    rank_expr = None
    similarity_expr = None

    if search:
        search = search.strip()
    if not search:
        search = None

    if search:
        ts_config = "english" if lang == "english" else "indonesian"
        search_vector_col = (
            Merchant.search_vector_en
            if lang == "english"
            else Merchant.search_vector_id
        )
        tsquery = func.plainto_tsquery(ts_config, search)

        fts_condition = search_vector_col.isnot(None) & search_vector_col.op("@@")(
            tsquery
        )

        similarity_display = Merchant.display_name.isnot(
            None
        ) & Merchant.display_name.op("%")(search)
        similarity_address = Merchant.short_address.isnot(
            None
        ) & Merchant.short_address.op("%")(search)
        trigram_condition = similarity_display | similarity_address

        stmt = stmt.where(fts_condition | trigram_condition)

        rank_expr = func.ts_rank(
            func.coalesce(search_vector_col, func.to_tsvector(ts_config, "")), tsquery
        )

        similarity_display_score = func.similarity(Merchant.display_name, search)
        similarity_address_score = func.similarity(Merchant.short_address, search)
        similarity_expr = func.greatest(
            func.coalesce(similarity_display_score, 0),
            func.coalesce(similarity_address_score, 0),
        )

    if type:
        stmt = stmt.join(Merchant.types).where(MerchantType.type_name == type)

    total_count = session.scalar(select(func.count()).select_from(stmt.subquery())) or 0

    if search and rank_expr is not None:
        combined_rank = (
            func.coalesce(rank_expr, 0) * 0.7 + func.coalesce(similarity_expr, 0) * 0.3
        )
        order_columns = [combined_rank.desc()]
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
            type_count=len(merchant.types),
            photo_url=merchant.photo_url,
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


@router.get("/types", response_model=list[str])
def read_merchant_types(session: SessionDep):
    stmt = select(MerchantType.type_name).distinct()
    types = session.scalars(stmt).all()

    return [format_type_name(type_name) for type_name in sorted(types)]


@router.get("/{merchant_id}", response_model=MerchantDetail)
def read_merchant(
    merchant_id: int,
    session: SessionDep,
    lang: Annotated[Literal["english", "indonesian"], Query()] = "english",
):
    stmt = select(Merchant).where(Merchant.id == merchant_id)
    merchant = session.scalar(stmt)

    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")

    stmt_photos = (
        select(Photo)
        .where(Photo.merchant_id == merchant_id, Photo.is_primary == False)
        .order_by(Photo.order.asc())
    )
    additional_photos = session.scalars(stmt_photos).all()

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
        photo_url=merchant.photo_url,
        additional_photos=[photo.vercel_blob_url for photo in additional_photos],
        description=(
            merchant.description_en if lang == "english" else merchant.description_id
        ),
        latitude=merchant.latitude,
        longitude=merchant.longitude,
        rating=merchant.rating,
        user_rating_count=merchant.user_rating_count,
    )


@router.get("/{merchant_id}/photos", response_model=list[PhotoPublic])
def read_merchant_photos(merchant_id: int, session: SessionDep):
    stmt = select(Merchant).where(Merchant.id == merchant_id)
    merchant = session.scalar(stmt)

    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")

    stmt = (
        select(Photo)
        .where(Photo.merchant_id == merchant_id)
        .order_by(Photo.is_primary.desc(), Photo.order.asc())
    )
    photos = session.scalars(stmt).all()

    return [
        PhotoPublic(
            id=photo.id,
            vercel_blob_url=photo.vercel_blob_url,
            file_extension=photo.file_extension,
            is_primary=photo.is_primary,
            order=photo.order,
        )
        for photo in photos
    ]


@router.get("/{merchant_id}/reviews", response_model=list[ReviewPublic])
def read_merchant_reviews(merchant_id: int, session: SessionDep):
    stmt = select(Merchant).where(Merchant.id == merchant_id)
    merchant = session.scalar(stmt)

    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")

    stmt = (
        select(Review)
        .where(Review.merchant_id == merchant_id)
        .order_by(Review.published_at.desc())
    )
    reviews = session.scalars(stmt).all()

    return [
        ReviewPublic(
            id=review.id,
            google_review_id=review.google_review_id,
            rating=review.rating,
            text=review.text,
            author_name=review.author_name,
            author_photo_uri=review.author_photo_uri,
            published_at=review.published_at,
            relative_time=review.relative_time,
        )
        for review in reviews
    ]


@router.get("/{merchant_id}/types", response_model=list[MerchantTypePublic])
def read_merchant_types_detail(merchant_id: int, session: SessionDep):
    stmt = select(Merchant).where(Merchant.id == merchant_id)
    merchant = session.scalar(stmt)

    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")

    stmt = select(MerchantType).where(MerchantType.merchant_id == merchant_id)
    types = session.scalars(stmt).all()

    return [
        MerchantTypePublic(
            id=type_obj.id,
            type_name=format_type_name(type_obj.type_name),
        )
        for type_obj in types
    ]


@router.get("/{merchant_id}/opening-hours", response_model=OpeningHoursPublic)
def read_merchant_opening_hours(merchant_id: int, session: SessionDep):
    stmt = select(Merchant).where(Merchant.id == merchant_id)
    merchant = session.scalar(stmt)

    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")

    stmt = select(OpeningHours).where(OpeningHours.merchant_id == merchant_id)
    opening_hours = session.scalar(stmt)

    if not opening_hours:
        raise HTTPException(
            status_code=404, detail="Opening hours not found for this merchant"
        )

    return OpeningHoursPublic(
        id=opening_hours.id,
        is_open_now=opening_hours.is_open_now,
        monday=opening_hours.monday,
        tuesday=opening_hours.tuesday,
        wednesday=opening_hours.wednesday,
        thursday=opening_hours.thursday,
        friday=opening_hours.friday,
        saturday=opening_hours.saturday,
        sunday=opening_hours.sunday,
    )


@router.get("/{merchant_id}/amenities", response_model=AmenityPublic)
def read_merchant_amenities(merchant_id: int, session: SessionDep):
    stmt = select(Merchant).where(Merchant.id == merchant_id)
    merchant = session.scalar(stmt)

    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")

    stmt = select(Amenity).where(Amenity.merchant_id == merchant_id)
    amenity = session.scalar(stmt)

    if not amenity:
        raise HTTPException(
            status_code=404, detail="Amenities not found for this merchant"
        )

    return AmenityPublic(
        id=amenity.id,
        takeout=amenity.takeout,
        dine_in=amenity.dine_in,
        outdoor_seating=amenity.outdoor_seating,
        reservable=amenity.reservable,
        serves_breakfast=amenity.serves_breakfast,
        serves_lunch=amenity.serves_lunch,
        serves_dinner=amenity.serves_dinner,
        serves_brunch=amenity.serves_brunch,
        serves_beer=amenity.serves_beer,
        serves_wine=amenity.serves_wine,
        serves_vegetarian_food=amenity.serves_vegetarian_food,
        good_for_children=amenity.good_for_children,
        good_for_groups=amenity.good_for_groups,
        accepts_credit_cards=amenity.accepts_credit_cards,
        accepts_debit_cards=amenity.accepts_debit_cards,
        accepts_cash_only=amenity.accepts_cash_only,
        accepts_nfc=amenity.accepts_nfc,
        free_parking=amenity.free_parking,
        paid_parking=amenity.paid_parking,
        valet_parking=amenity.valet_parking,
        wheelchair_entrance=amenity.wheelchair_entrance,
        wheelchair_restroom=amenity.wheelchair_restroom,
        wheelchair_seating=amenity.wheelchair_seating,
        restroom=amenity.restroom,
    )
