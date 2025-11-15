'use client';

import { CloudAlertIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const t = useTranslations('ErrorPage');

  return (
    <main className="grid min-h-[calc(100vh-101px)] flex-1 place-items-center">
      <div className="flex w-full max-w-6xl flex-1 flex-col gap-4 p-8">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CloudAlertIcon />
            </EmptyMedia>
            <EmptyTitle>
              {t('title')}: {error.message}
            </EmptyTitle>
            <EmptyDescription>
              {t('digest')}: {error.digest}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <EmptyDescription>
              <Link href="/contact">{t('button')}</Link>
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      </div>
    </main>
  );
}
