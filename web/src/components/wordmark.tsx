import { ArrowLeftIcon } from 'lucide-react';
import Image from 'next/image';
import type { ComponentProps } from 'react';

import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { buttonVariants } from './ui/button';

type WordmarkProps = {
  prevIcon?: boolean;
  title: string;
};

export function Wordmark({
  prevIcon,
  title,
  className,
  ...props
}: WordmarkProps & ComponentProps<typeof Link>) {
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
        <Image alt="Logo" aria-hidden height={24} src="/logo.png" width={24} />
      )}
      {title}
    </Link>
  );
}
