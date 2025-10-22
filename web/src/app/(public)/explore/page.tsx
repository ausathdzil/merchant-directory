import { SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
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

export default function ExplorePage() {
  return (
    <main className="flex flex-1 flex-col items-center">
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
    </main>
  );
}
