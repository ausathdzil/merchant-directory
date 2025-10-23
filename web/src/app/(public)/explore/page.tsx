import { SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
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

type ExplorePageProps = {
  searchParams: Promise<{
    q: string;
  }>;
};

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { q } = await searchParams;

  return (
    <main className="flex flex-1 flex-col items-center px-8">
      {q ? (
        <Suspense fallback={null}>
          <pre>Searching for "{q}"</pre>
        </Suspense>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchIcon />
            </EmptyMedia>
            <EmptyTitle>Start searching</EmptyTitle>
            <EmptyDescription>
              Enter a name or keyword to find nearby merchants
            </EmptyDescription>
          </EmptyHeader>
          <EmptyDescription>
            <Link href="/">Need Help?</Link>
          </EmptyDescription>
        </Empty>
      )}
    </main>
  );
}
