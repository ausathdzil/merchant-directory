import { getTranslations } from 'next-intl/server';

import { Subheading } from '@/components/typography';
import { Skeleton } from '@/components/ui/skeleton';

export default async function Loading() {
  const t = await getTranslations('ExplorePage');

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="flex w-full max-w-6xl flex-1 flex-col gap-4 p-8">
        <Subheading>{t('search.allResults')}</Subheading>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton
            <Skeleton className="h-[78px]" key={i} />
          ))}
        </div>
        <Skeleton className="mt-auto h-9" />
      </div>
    </main>
  );
}
