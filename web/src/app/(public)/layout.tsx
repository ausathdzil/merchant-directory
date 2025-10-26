import type { ComponentProps } from 'react';

import { LocaleSelect } from '@/components/locale-select';
import { ModeToggle } from '@/components/mode-toggle';
import { DesktopNav, MobileNav } from '@/components/site-nav';
import { Wordmark } from '@/components/wordmark';
import { cn } from '@/lib/utils';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {children}
    </div>
  );
}

function Header({ className, ...props }: ComponentProps<'header'>) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex shrink-0 flex-wrap items-center justify-between border-b bg-background md:flex-nowrap',
        className
      )}
      {...props}
    >
      <div className="flex w-1/3 p-4">
        <MobileNav />
        <Wordmark className="hidden md:flex" href="/" />
      </div>
      <DesktopNav />
      <div className="flex items-center justify-end gap-4 p-4 md:w-1/3">
        <LocaleSelect />
        <ModeToggle />
      </div>
    </header>
  );
}
