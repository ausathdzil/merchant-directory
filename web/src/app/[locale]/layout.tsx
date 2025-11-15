import type { Metadata, Viewport } from 'next';
import { Atkinson_Hyperlegible_Next } from 'next/font/google';
import localFont from 'next/font/local';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hasLocale, type Locale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { type ComponentProps, Suspense } from 'react';

import { DesktopNav, MobileNav } from '@/components/site-nav';
import { SiteSettings } from '@/components/site-settings';
import { ThemeProvider } from '@/components/theme-provider';
import { Small } from '@/components/typography';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster } from '@/components/ui/sonner';
import { Wordmark } from '@/components/wordmark';
import { Link } from '@/i18n/navigation';
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
              <Footer locale={locale} />
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
    { label: t('navigation.about'), href: '/about' },
    { label: t('navigation.support'), href: '/contact' },
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
        <Wordmark className="hidden lg:flex" href="/" title={t('title')} />
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

async function Footer({
  locale,
  className,
  ...props
}: { locale: Locale } & ComponentProps<'footer'>) {
  const t = await getTranslations({ locale, namespace: 'Footer' });

  return (
    <footer
      className={cn(
        'mx-auto flex w-full max-w-6xl flex-col items-start gap-4 p-4 md:flex-row lg:p-8',
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-8 md:flex-1 md:flex-row md:gap-16">
        <Small className="text-base">&copy; 2025</Small>
        <div className="flex flex-col gap-2">
          <p>Resources</p>
          <ul className="space-y-2 [&>li]:text-muted-foreground [&>li]:transition-colors [&>li]:hover:text-foreground">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/explore">Explore</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/contact">Help</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button
          asChild
          className="-ml-2 md:-mt-2 mt-0 md:ml-0"
          size="sm"
          variant="ghost"
        >
          <a
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
            {t('source')}
          </a>
        </Button>
      </div>
    </footer>
  );
}
