import type {
  MerchantAmenitiesError,
  MerchantAmenitiesPath,
  MerchantAmenitiesResponse,
  MerchantError,
  MerchantOpeningHoursError,
  MerchantOpeningHoursPath,
  MerchantOpeningHoursResponse,
  MerchantPath,
  MerchantPhotoPath,
  MerchantPhotosError,
  MerchantPhotosResponse,
  MerchantResponse,
  MerchantReviewsError,
  MerchantReviewsPath,
  MerchantReviewsResponse,
  MerchantsError,
  MerchantsQuery,
  MerchantsResponse,
  MerchantTypesError,
  MerchantTypesPath,
  MerchantTypesResponse,
} from '../types/merchant';
import { API_URL } from '../utils';

export async function getMerchants(query: MerchantsQuery, locale?: string) {
  const searchParams = new URLSearchParams();

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, value.toString());
      }
    }
  }

  if (locale && locale === 'id') {
    searchParams.set('search_lang', 'indonesian');
  } else {
    searchParams.set('search_lang', 'english');
  }

  const res = await fetch(`${API_URL}/merchants?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    const error = (await res.json()) as
      | Partial<MerchantsError>
      | { detail?: unknown };

    let message = 'Failed to fetch merchants.';

    if (Array.isArray(error.detail)) {
      message = error.detail[0].msg;
    } else if (typeof error.detail === 'string') {
      message = error.detail;
    }

    throw new Error(message);
  }

  const { data, meta } = (await res.json()) as MerchantsResponse;

  return { data, meta };
}

export async function getMerchant(path: MerchantPath) {
  const res = await fetch(`${API_URL}/merchants/${path.merchant_id}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    const error = (await res.json()) as
      | Partial<MerchantError>
      | { detail?: unknown };

    let message = 'Failed to fetch merchant.';

    if (Array.isArray(error.detail)) {
      message = error.detail[0].msg;
    } else if (typeof error.detail === 'string') {
      message = error.detail;
    }

    throw new Error(message);
  }

  const data = (await res.json()) as MerchantResponse;

  return data;
}

export async function getMerchantPhotos(path: MerchantPhotoPath) {
  const res = await fetch(`${API_URL}/merchants/${path.merchant_id}/photos`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    const error = (await res.json()) as
      | Partial<MerchantPhotosError>
      | { detail?: unknown };

    let message = 'Failed to fetch merchant photos.';

    if (Array.isArray(error.detail)) {
      message = error.detail[0].msg;
    } else if (typeof error.detail === 'string') {
      message = error.detail;
    }

    throw new Error(message);
  }

  const data = (await res.json()) as MerchantPhotosResponse;

  return data;
}

export async function getMerchantReviews(path: MerchantReviewsPath) {
  const res = await fetch(`${API_URL}/merchants/${path.merchant_id}/reviews`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    const error = (await res.json()) as
      | Partial<MerchantReviewsError>
      | { detail?: unknown };

    let message = 'Failed to fetch merchant reviews.';

    if (Array.isArray(error.detail)) {
      message = error.detail[0].msg;
    } else if (typeof error.detail === 'string') {
      message = error.detail;
    }

    throw new Error(message);
  }

  const data = (await res.json()) as MerchantReviewsResponse;

  return data;
}

export async function getMerchantTypes(path: MerchantTypesPath) {
  const res = await fetch(`${API_URL}/merchants/${path.merchant_id}/types`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    const error = (await res.json()) as
      | Partial<MerchantTypesError>
      | { detail?: unknown };

    let message = 'Failed to fetch merchant types.';

    if (Array.isArray(error.detail)) {
      message = error.detail[0].msg;
    } else if (typeof error.detail === 'string') {
      message = error.detail;
    }

    throw new Error(message);
  }

  const data = (await res.json()) as MerchantTypesResponse;

  return data;
}

export async function getMerchantOpeningHours(path: MerchantOpeningHoursPath) {
  const res = await fetch(
    `${API_URL}/merchants/${path.merchant_id}/opening-hours`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
      cache: 'force-cache',
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    const error = (await res.json()) as
      | Partial<MerchantOpeningHoursError>
      | { detail?: unknown };

    let message = 'Failed to fetch merchant opening hours.';

    if (Array.isArray(error.detail)) {
      message = error.detail[0].msg;
    } else if (typeof error.detail === 'string') {
      message = error.detail;
    }

    throw new Error(message);
  }

  const data = (await res.json()) as MerchantOpeningHoursResponse;

  return data;
}

export async function getMerchantAmenities(path: MerchantAmenitiesPath) {
  const res = await fetch(
    `${API_URL}/merchants/${path.merchant_id}/amenities`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
      cache: 'force-cache',
    }
  );

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }

    const error = (await res.json()) as
      | Partial<MerchantAmenitiesError>
      | { detail?: unknown };

    let message = 'Failed to fetch merchant amenities.';

    if (Array.isArray(error.detail)) {
      message = error.detail[0].msg;
    } else if (typeof error.detail === 'string') {
      message = error.detail;
    }

    throw new Error(message);
  }

  const data = (await res.json()) as MerchantAmenitiesResponse;

  return data;
}
