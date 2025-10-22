import { GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import { type ComponentProps, ViewTransition } from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

export function Wordmark({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <ViewTransition name="logo">
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost-colorful' }),
          'font-alt font-semibold text-base',
          className
        )}
        {...props}
      >
        <GlobeIcon className="stroke-primary" />
        Merchant Directory
      </Link>
    </ViewTransition>
  );
}
