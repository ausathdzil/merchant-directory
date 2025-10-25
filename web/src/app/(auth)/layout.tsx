import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ViewTransition } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Wordmark } from '@/components/wordmark';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Get Started',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-primary/5 p-6 md:p-10 lg:block">
        <div className="flex justify-center gap-2 md:justify-start">
          <Wordmark href="/" prevIcon />
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Link
          className={cn(
            buttonVariants({ variant: 'ghost-colorful' }),
            'absolute top-8 flex lg:hidden'
          )}
          href="/"
        >
          <Image
            alt="Logo"
            aria-hidden
            height={16}
            src="/globe.svg"
            width={16}
          />
          Merchant Directory
        </Link>
        <ViewTransition name="form">
          <div className="w-full max-w-xs px-8 sm:px-0">{children}</div>
        </ViewTransition>
      </div>
    </main>
  );
}
