'use server';

import { cookies } from 'next/headers';

import type { locales } from '../../../global';

export async function setLocale(locale: (typeof locales)[number]) {
  const cookieStore = await cookies();
  cookieStore.set('locale', locale);
}
