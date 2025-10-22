import type { Metadata } from 'next';
import { ViewTransition } from 'react';

import { Wordmark } from '@/components/wordmark';

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
        <ViewTransition name="form">
          <div className="w-full max-w-xs px-8 sm:px-0">{children}</div>
        </ViewTransition>
      </div>
    </main>
  );
}
