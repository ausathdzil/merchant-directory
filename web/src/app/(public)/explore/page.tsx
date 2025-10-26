import { SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Suspense } from 'react';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export const metadata: Metadata = {
  title: 'Explore',
};

export default async function ExplorePage({
  searchParams,
}: PageProps<'/explore'>) {
  const { q } = await searchParams;
  const t = await getTranslations('ExplorePage');

  return (
    <main className="flex flex-1 flex-col items-center">
      {q ? (
        <Suspense fallback={null}>
          <pre className="pt-16">
            {t('search.searching', { query: q as string })}
          </pre>
        </Suspense>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>{t('empty.title')}</EmptyTitle>
            <EmptyDescription>{t('empty.description')}</EmptyDescription>
          </EmptyHeader>
          <EmptyDescription>
            <Link href="/">{t('empty.button')}</Link>
          </EmptyDescription>
        </Empty>
      )}
    </main>
  );
}
