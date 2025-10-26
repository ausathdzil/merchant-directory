import { cookies } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import type { locales } from '../../global';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value ||
    'id') as (typeof locales)[number];

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
