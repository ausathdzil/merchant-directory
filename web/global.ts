import type messages from './messages/id.json';

export const locales = ['id', 'en'] as const;

declare module 'next-intl' {
  // biome-ignore lint/style/useConsistentTypeDefinitions: next-intl
  interface AppConfig {
    Locale: (typeof locales)[number];
    Messages: typeof messages;
  }
}
