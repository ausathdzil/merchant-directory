import type { Metadata, Viewport } from 'next';
import { Atkinson_Hyperlegible_Next } from 'next/font/google';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { hasLocale, type Locale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { type ComponentProps, Suspense } from 'react';

import { DesktopNav, MobileNav } from '@/components/site-nav';
import { SiteSettings } from '@/components/site-settings';
import { ThemeProvider } from '@/components/theme-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import { Wordmark } from '@/components/wordmark';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const atkinsonHyperlegibleNext = Atkinson_Hyperlegible_Next({
  variable: '--font-atkinson-hyperlegible-next',
  subsets: ['latin'],
});

const openDyslexic = localFont({
  variable: '--font-open-dyslexic',
  src: [
    {
      path: '../fonts/OpenDyslexic-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/OpenDyslexic-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/OpenDyslexic-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/OpenDyslexic-Bold-Italic.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'Metadata.Layout' });

  return {
    title: {
      default: t('title'),
      template: `%s | ${t('title')}`,
    },
    description: t('description'),
    appleWebApp: {
      statusBarStyle: 'black-translucent',
    },
  };
}

export const viewport: Viewport = {
  viewportFit: 'cover',
};

type NavItem<T extends string = string> = {
  href: T;
  label: string;
};

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      className={cn(
        atkinsonHyperlegibleNext.variable,
        openDyslexic.variable,
        'font-sans'
      )}
      lang={locale}
      suppressHydrationWarning
    >
      <body className="dark:antialiased">
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            disableTransitionOnChange
            enableSystem
          >
            <div className="flex min-h-screen flex-col">
              <Header locale={locale} />
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

type HeaderProps = {
  locale: Locale;
} & ComponentProps<'header'>;

async function Header({ locale, className, ...props }: HeaderProps) {
  const t = await getTranslations({ locale, namespace: 'Header' });

  const navItems: NavItem[] = [
    { label: t('navigation.explore'), href: '/explore' },
    { label: t('navigation.about'), href: '#' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex shrink-0 flex-wrap items-center justify-between border-b bg-background pt-safe-top lg:flex-nowrap',
        className
      )}
      {...props}
    >
      <div className="flex w-1/3 p-4 lg:px-8">
        <div className="h-9">
          <MobileNav
            homeLabel={t('navigation.home')}
            menuLabel={t('navigation.menu')}
            navItems={navItems}
          />
        </div>
        <Wordmark className="hidden md:flex" href="/" title={t('title')} />
      </div>
      <DesktopNav
        navItems={navItems}
        searchPlaceholder={t('search.placeholder')}
      />
      <div className="flex w-1/3 items-center justify-end gap-4 p-4 lg:px-8">
        <Suspense fallback={<Skeleton className="h-8 w-[94px]" />}>
          <SiteSettings />
        </Suspense>
      </div>
    </header>
  );
}
