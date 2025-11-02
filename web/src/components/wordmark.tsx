import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

type WordmarkProps = {
  prevIcon?: boolean;
};

export function Wordmark({
  className,
  prevIcon,
  ...props
}: WordmarkProps & ComponentProps<typeof Link>) {
  const t = useTranslations('Header');

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
