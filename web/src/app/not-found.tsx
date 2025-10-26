import { ArrowUpRightIcon, HouseIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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

export default async function NotFoundPage() {
  const t = await getTranslations('NotFoundPage');

  return (
    <main className="flex min-h-screen justify-center">
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
