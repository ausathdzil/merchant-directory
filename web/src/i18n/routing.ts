import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'id'] as const;

export const routing = defineRouting({
  locales,

  defaultLocale: 'en',
});
