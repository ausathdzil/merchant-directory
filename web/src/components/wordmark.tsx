import { ArrowLeftIcon, GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import { type ComponentProps, ViewTransition } from 'react';

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
  return (
    <ViewTransition name="logo">
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost-colorful' }),
          'font-alt font-semibold text-base'
        )}
        {...props}
      >
        {prevIcon ? (
          <ArrowLeftIcon className="stroke-primary" />
        ) : (
          <GlobeIcon className="stroke-primary" />
        )}
        <span className="hidden xl:block">Merchant Directory</span>
      </Link>
    </ViewTransition>
  );
}
