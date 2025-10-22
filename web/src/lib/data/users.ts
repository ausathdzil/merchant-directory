import type { UserResponse } from '../types/user';
import { API_URL } from '../utils';

export async function getUser(accessToken: string | undefined) {
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
}
