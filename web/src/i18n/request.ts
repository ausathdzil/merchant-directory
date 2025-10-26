import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['id', 'en'] as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value ||
    'en') as (typeof locales)[number];

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
