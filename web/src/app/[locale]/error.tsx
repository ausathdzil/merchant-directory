'use client';

import { CloudAlertIcon } from 'lucide-react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Link } from '@/i18n/navigation';

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="flex w-full max-w-6xl flex-1 flex-col gap-4 p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CloudAlertIcon />
            </EmptyMedia>
            <EmptyTitle>Error: {error.message}</EmptyTitle>
            <EmptyDescription>Digest: {error.digest}</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <EmptyDescription>
              <Link href="/">Home</Link>
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      </div>
    </main>
  );
}
