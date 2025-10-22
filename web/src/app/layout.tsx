import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
import { Suspense } from 'react';

import { ThemeProvider } from '@/components/theme-provider';
import { UserProvider } from '@/components/user-provider';
import { getUser } from '@/lib/data/users';
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
  title: {
    default: 'Merchant Directory',
    template: '%s | Merchant Directory',
  },
  description: 'Discover local businesses in South Jakarta.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userPromise = getUser();

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
          <Suspense fallback={null}>
            <UserProvider userPromise={userPromise}>{children}</UserProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
