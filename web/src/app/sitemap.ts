import type { MetadataRoute } from 'next';

import { locales } from '@/i18n/routing';
import { getMerchants } from '@/lib/data/merchants';

const BASE_URL = process.env.BASE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const arr: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    arr.push({
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${BASE_URL}/${loc}`])
        ),
      },
    });

    arr.push({
      url: `${BASE_URL}/${locale}/explore`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          locales.map((loc) => [loc, `${BASE_URL}/${loc}/explore`])
        ),
      },
    });
  }

  const merchants = await getMerchants({ page_size: 27 });

  const allMerchantIds: string[] = merchants.data.map((m) => String(m.id));

  for (const merchantId of allMerchantIds) {
    for (const locale of locales) {
      arr.push({
        url: `${BASE_URL}/${locale}/merchants/${merchantId}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc,
              `${BASE_URL}/${loc}/merchants/${merchantId}`,
            ])
          ),
        },
      });
    }
  }

  return arr;
}
