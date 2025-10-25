import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
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
          'font-alt font-semibold'
        )}
        {...props}
      >
        {prevIcon ? (
          <ArrowLeftIcon className="stroke-primary" />
        ) : (
          <Image
            alt="Logo"
            aria-hidden
            height={16}
            src="/globe.svg"
            width={16}
          />
        )}
        <span className="hidden md:inline">Merchant Directory</span>
      </Link>
    </ViewTransition>
  );
}
