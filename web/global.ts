/** biome-ignore-all lint/style/useConsistentTypeDefinitions: Schema */
import type messages from './messages/id.json';

export const locales = ['id', 'en'] as const;

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof locales)[number];
    Messages: typeof messages;
  }
}
