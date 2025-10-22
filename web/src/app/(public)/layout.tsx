import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import { DesktopNav } from '@/components/nav';
import { Small } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
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
        'sticky top-0 z-50 flex flex-wrap items-center gap-4 bg-background px-8 py-8 lg:px-32',
        className
      )}
      {...props}
    >
      <Wordmark />
      <DesktopNav />
      <div className="ml-auto flex items-center gap-4">
        <Link
          className={buttonVariants({ variant: 'secondary', size: 'pill' })}
          href="/login"
        >
          Login
        </Link>
        <Link className={buttonVariants({ size: 'pill' })} href="/">
          Get Started
        </Link>
      </div>
      <ModeToggle />
    </header>
  );
}

function Footer({ className, ...props }: ComponentProps<'footer'>) {
  return (
    <footer
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 px-8 py-8 lg:px-32',
        className
      )}
      {...props}
    >
      <Small>&copy; 2025</Small>
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
    </footer>
  );
}
