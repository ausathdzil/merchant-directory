'use client';

import { CloudAlertIcon } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ExplorePage');

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="flex w-full max-w-6xl flex-1 flex-col gap-4 p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CloudAlertIcon />
            </EmptyMedia>
            <EmptyTitle>Error: {error.message}</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => reset()}>{t('error.tryAgain')}</Button>
          </EmptyContent>
          <EmptyDescription>
            <Link href="/">{t('empty.button')}</Link>
          </EmptyDescription>
        </Empty>
      </div>
    </main>
  );
}
