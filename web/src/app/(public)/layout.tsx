import Image from 'next/image';
import { type ComponentProps, Suspense, ViewTransition } from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import { DesktopNav, MobileNav } from '@/components/nav';
import { Small } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { UserButton } from '@/components/user-button';
import { UserProvider } from '@/components/user-provider';
import { Wordmark } from '@/components/wordmark';
import { getUser } from '@/lib/data/users';
import { cn } from '@/lib/utils';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <ViewTransition name="page">{children}</ViewTransition>
      <Footer />
    </div>
  );
}

function Header({ className, ...props }: ComponentProps<'header'>) {
  const userPromise = getUser();

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center gap-4 bg-background px-4 py-4 md:py-8 lg:px-32',
        className
      )}
      {...props}
    >
      <Wordmark href="/" />
      <DesktopNav />
      <Suspense fallback={<Spinner className="ml-auto md:hidden" />}>
        <UserProvider userPromise={userPromise}>
          <MobileNav className="ml-auto md:hidden" />
        </UserProvider>
      </Suspense>
      <Suspense
        fallback={<Skeleton className="ml-auto hidden h-8 w-36 md:block" />}
      >
        <UserButton className="ml-auto" />
      </Suspense>
      <ModeToggle />
    </header>
  );
}

function Footer({ className, ...props }: ComponentProps<'footer'>) {
  return (
    <footer
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-32',
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
