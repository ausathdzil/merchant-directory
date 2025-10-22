import { GlobeIcon } from 'lucide-react';
import Link from 'next/link';
import { ViewTransition } from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

export function Wordmark() {
  return (
    <ViewTransition name="logo">
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost-colorful' }),
          'font-alt font-semibold text-base'
        )}
        href="/"
      >
        <GlobeIcon className="stroke-primary" />
        Merchant Directory
      </Link>
    </ViewTransition>
  );
}
