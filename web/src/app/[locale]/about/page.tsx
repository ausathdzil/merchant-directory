import {
  CheckCircleIcon,
  LanguagesIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  UsersIcon,
  ZapIcon,
} from 'lucide-react';
// biome-ignore lint/performance/noNamespaceImport: Motion for React Server Components
import * as motion from 'motion/react-client';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import {
  Blockquote,
  Heading,
  Lead,
  Muted,
  Title,
} from '@/components/typography';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/about'>): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: 'Metadata.AboutPage',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutPage({
  params,
}: PageProps<'/[locale]/about'>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'AboutPage' });

  const values = [
    {
      key: 'accessibility',
      icon: CheckCircleIcon,
    },
    {
      key: 'performance',
      icon: ZapIcon,
    },
    {
      key: 'languages',
      icon: LanguagesIcon,
    },
    {
      key: 'quality',
      icon: ShieldCheckIcon,
    },
    {
      key: 'transparency',
      icon: SparklesIcon,
    },
  ] as const;

  const roadmap = [
    {
      key: 'userSubmitted',
      icon: UsersIcon,
    },
    {
      key: 'msmeExpansion',
      icon: MapPinIcon,
    },
    {
      key: 'reviews',
      icon: StarIcon,
    },
  ] as const;

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="flex w-full max-w-4xl flex-1 flex-col gap-12 p-4 sm:px-8 md:gap-16 md:py-16">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Title>{t('hero.title')}</Title>
          <Lead className="max-w-[60ch]">{t('hero.description')}</Lead>
        </motion.section>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Heading className="text-center">{t('problem.heading')}</Heading>
          <Blockquote>
            &ldquo;{t('problem.quote')}&rdquo;
            <Muted className="mt-2 not-italic">
              {t('problem.quoteSource')}
            </Muted>
          </Blockquote>
          <ItemGroup className="grid list-none grid-cols-2 gap-4">
            <li>
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>{t('problem.points.point1')}</ItemTitle>
                </ItemContent>
              </Item>
            </li>
            <li>
              <Item variant="outline">
                <ItemContent>
                  <ItemTitle>{t('problem.points.point2')}</ItemTitle>
                </ItemContent>
              </Item>
            </li>
          </ItemGroup>
        </motion.section>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Heading>{t('values.heading')}</Heading>
          <ItemGroup className="gap-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <li className="list-none" key={value.key}>
                  <Item variant="outline">
                    <ItemMedia variant="icon">
                      <Icon className="stroke-primary" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{t(`values.${value.key}.title`)}</ItemTitle>
                      <ItemDescription className="line-clamp-none">
                        {t(`values.${value.key}.description`)}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </li>
              );
            })}
          </ItemGroup>
        </motion.section>

        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Heading>{t('roadmap.heading')}</Heading>
          <ItemGroup className="gap-4">
            {roadmap.map((item) => {
              const Icon = item.icon;
              return (
                <li className="list-none" key={item.key}>
                  <Item variant="outline">
                    <ItemMedia variant="icon">
                      <Icon className="stroke-primary" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{t(`roadmap.${item.key}.title`)}</ItemTitle>
                      <ItemDescription className="line-clamp-none">
                        {t(`roadmap.${item.key}.description`)}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </li>
              );
            })}
          </ItemGroup>
        </motion.section>
      </div>
    </main>
  );
}
