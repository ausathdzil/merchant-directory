import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

type WordmarkProps = {
  prevIcon?: boolean;
};

export async function Wordmark({
  className,
  prevIcon,
  ...props
}: WordmarkProps & ComponentProps<typeof Link>) {
  const t = await getTranslations('Header');

  return (
    <Link
      className={cn(
        buttonVariants({ variant: 'ghost-colorful' }),
        'px-2.5 font-alt font-semibold md:ml-0 md:text-base',
        className
      )}
      {...props}
    >
      {prevIcon ? (
        <ArrowLeftIcon className="stroke-primary" />
      ) : (
        <Image alt="Logo" aria-hidden height={16} src="/globe.svg" width={16} />
      )}
      {t('title')}
    </Link>
  );
}
