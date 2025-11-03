import { ArrowUpRightIcon, HouseIcon } from 'lucide-react';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { ThemeProvider } from '@/components/theme-provider';
import { Muted } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '404 Not Found',
  description: 'The page you are looking for does not exist.',
  appleWebApp: {
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  viewportFit: 'cover',
};

export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, 'font-sans dark:antialiased')}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="grid h-screen place-items-center">
            <Empty>
              <EmptyHeader>
                <EmptyMedia>
                  <Image
                    alt="404 Not Found"
                    height={216}
                    src="/404-NotFound.png"
                    width={384}
                  />
                </EmptyMedia>
                <EmptyTitle>404 Not Found</EmptyTitle>
                <EmptyDescription>
                  The page you are looking for does not exist.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link className={buttonVariants({ size: 'pill-lg' })} href="/">
                  <HouseIcon />
                  Home
                </Link>
              </EmptyContent>
              <Muted>
                Logo by SAWARATSUKI
                <a
                  className={buttonVariants({ variant: 'link', size: 'sm' })}
                  href="https://github.com/SAWARATSUKI/KawaiiLogos/blob/main/ResponseCode/404%20NotFound.png"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  SAWARATSUKI
                  <ArrowUpRightIcon />
                </a>
              </Muted>
            </Empty>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
