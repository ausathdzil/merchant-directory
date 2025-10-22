import { cookies } from 'next/headers';
import { cache } from 'react';
import type { UserResponse } from '../types/user';
import { API_URL } from '../utils';

export const getUser = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('session')?.value;

  if (!accessToken) {
    return null;
  }

  const res = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as UserResponse;

  return data;
});
