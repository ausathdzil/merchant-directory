import type { Metadata } from 'next';
import { DM_Sans, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';

import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import './globals.css';
import { getLocale } from 'next-intl/server';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(inter.variable, dmSans.variable, 'font-sans antialiased')}
      >
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
