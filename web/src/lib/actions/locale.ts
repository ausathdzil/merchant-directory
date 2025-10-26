'use server';

import { cookies } from 'next/headers';

import type { locales } from '@/i18n/request';

export async function setLocale(locale: (typeof locales)[number]) {
  const cookieStore = await cookies();
  cookieStore.set('locale', locale);
}
