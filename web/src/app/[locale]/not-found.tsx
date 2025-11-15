import { ArrowUpRightIcon, HouseIcon } from 'lucide-react';
import type { Metadata, Viewport } from 'next';
import Image from 'next/image';
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
import { Link } from '@/i18n/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata.NotFoundPage');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function NotFound() {
  const t = useTranslations('NotFound.Layout');

  return (
    <main className="grid min-h-[calc(100vh-101px)] flex-1 place-items-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Image
              alt="404 Not Found"
              height={216}
              loading="eager"
              src="/404-NotFound.png"
              width={384}
            />
          </EmptyMedia>
          <EmptyTitle>{t('title')}</EmptyTitle>
          <EmptyDescription>{t('description')}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link className={buttonVariants({ size: 'pill-lg' })} href="/">
            <HouseIcon />
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
