import Image from 'next/image';
import { type ComponentProps, Suspense } from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import { DesktopNav, MobileNav } from '@/components/site-nav';
import { Small } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { UserButton } from '@/components/user-button';
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
      <Footer />
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
        <Suspense fallback={<Skeleton className="h-8 w-32" />}>
          <UserButton />
        </Suspense>
        <ModeToggle />
      </div>
    </header>
  );
}

function Footer({ className, ...props }: ComponentProps<'footer'>) {
  return (
    <footer
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 p-4',
        className
      )}
      {...props}
    >
      <Small>&copy; 2025</Small>
      <div className="flex items-center gap-4">
        <a
          className={buttonVariants({ variant: 'link', size: 'sm' })}
          href="https://github.com/ausathdzil/merchant-directory"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt="GitHub icon"
            aria-hidden
            className="dark:invert"
            height={16}
            src="/GitHub_light.svg"
            width={16}
          />
          Source
        </a>
      </div>
    </footer>
  );
}
