import { ArrowLeftIcon, ArrowUpRightIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { Muted } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata.NotFoundPage');

  return {
    title: t('title'),
  };
}

export default function NotFoundPage() {
  const t = useTranslations('NotFound.MerchantPage');

  return (
    <main className="grid flex-1 place-items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Image
              alt="404 Not Found"
              height={216}
              src="/404-NotFound.png"
              width={384}
            />
          </EmptyMedia>
          <EmptyTitle>{t('title')}</EmptyTitle>
          <EmptyDescription>{t('description')}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link className={buttonVariants({ size: 'pill-lg' })} href="/explore">
            <ArrowLeftIcon />
            {t('button')}
          </Link>
        </EmptyContent>
        <Muted>
          {t('logoBy')}
          <a
            className={buttonVariants({ variant: 'link', size: 'sm' })}
            href="https://github.com/SAWARATSUKI/KawaiiLogos/blob/main/ResponseCode/404%20NotFound.png"
            rel="noopener noreferrer"
            target="_blank"
          >
            SAWARATSUKI
            <ArrowUpRightIcon />
          </a>
        </Muted>
      </Empty>
    </main>
  );
}
