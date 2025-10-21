import { GlobeIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';

import { ModeToggle } from '@/components/mode-toggle';
import { DesktopNav } from '@/components/nav';
import { ThemeProvider } from '@/components/theme-provider';
import { Small } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Merchant Directory',
  description: 'Discover local businesses in South Jakarta.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(inter.variable, dmSans.variable, 'font-sans antialiased')}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
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
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'font-alt font-semibold text-base'
        )}
        href="/"
      >
        <GlobeIcon className="stroke-primary" />
        Merchant Directory
      </Link>
      <DesktopNav />
      <ModeToggle className="ml-auto" />
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
