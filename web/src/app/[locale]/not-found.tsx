import { ArrowUpRightIcon, HouseIcon } from 'lucide-react';
import type { Metadata, Viewport } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

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
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: '404 Not Found',
  description: 'The page you are looking for does not exist.',
  appleWebApp: {
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function NotFound() {
  const t = useTranslations('NotFound.Layout');

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
