import type { Metadata, Viewport } from 'next';
import { Atkinson_Hyperlegible_Next } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, type Locale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LocaleSelect } from '@/components/locale-select';
import { ModeToggle } from '@/components/mode-toggle';
import { DesktopNav, MobileNav } from '@/components/site-nav';
import { ThemeProvider } from '@/components/theme-provider';
import { Wordmark } from '@/components/wordmark';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const atkinsonHyperlegibleNext = Atkinson_Hyperlegible_Next({
  variable: '--font-atkinson-hyperlegible-next',
  subsets: ['latin'],
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
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          atkinsonHyperlegibleNext.variable,
          'font-sans dark:antialiased'
        )}
      >
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen flex-col">
              <Header locale={locale} />
              {children}
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

async function Header({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'Header' });

  const navItems: NavItem[] = [
    { label: t('navigation.explore'), href: '/explore' },
    { label: t('navigation.about'), href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 flex shrink-0 flex-wrap items-center justify-between border-b bg-background pt-safe-top lg:flex-nowrap">
      <div className="flex w-1/3 p-4 lg:px-8">
        <MobileNav homeLabel={t('navigation.home')} navItems={navItems} />
        <Wordmark className="hidden lg:flex" href="/" title={t('title')} />
      </div>
      <DesktopNav
        navItems={navItems}
        searchPlaceholder={t('search.placeholder')}
      />
      <div className="flex items-center justify-end gap-4 p-4 lg:w-1/3 lg:px-8">
        <LocaleSelect />
        <ModeToggle modeToggleLabel={t('modeToggle')} />
      </div>
    </header>
  );
}
