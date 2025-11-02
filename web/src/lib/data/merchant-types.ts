import type { MerchantTypesListResponse } from '../types/merchant-types';
import { API_URL } from '../utils';

export async function getMerchantTypesList() {
  const res = await fetch(`${API_URL}/merchant-types`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
    cache: 'force-cache',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch merchant types.');
  }

  const data = (await res.json()) as MerchantTypesListResponse;

  return data;
}
