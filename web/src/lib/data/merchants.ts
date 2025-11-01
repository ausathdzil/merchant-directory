import { cookies } from 'next/headers';
import type {
  MerchantError,
  MerchantPath,
  MerchantResponse,
  MerchantsError,
  MerchantsQuery,
  MerchantsResponse,
} from '../types/merchant';
import { API_URL } from '../utils';

export async function getMerchants(query: MerchantsQuery) {
  const searchParams = new URLSearchParams();

  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value;

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, value.toString());
      }
    }
  }

  if (locale === 'id') {
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

    let message = 'Failed to fetch orders.';

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
    const error = (await res.json()) as
      | Partial<MerchantError>
      | { detail?: unknown };

    let message = 'Failed to fetch orders.';

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
