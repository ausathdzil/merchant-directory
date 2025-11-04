import {
  ArrowRightIcon,
  CheckCircleIcon,
  HeartPlusIcon,
  SearchIcon,
  StoreIcon,
  TelescopeIcon,
} from 'lucide-react';
// biome-ignore lint/performance/noNamespaceImport: Motion for React Server Components
import * as motion from 'motion/react-client';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hasLocale, type Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ComponentProps } from 'react';

import { ExploreButton } from '@/components/explore-button';
import { HeroDecorations } from '@/components/hero-decoration';
import { Heading, Small, Text, Title } from '@/components/typography';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { buttonVariants } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return (
    <>
      <main className="flex flex-1 flex-col items-center gap-16 pt-safe-top">
        <motion.div
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4 px-8 py-16 sm:gap-8 md:py-24"
          initial={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <article className="flex max-w-[80ch] flex-col items-center gap-4">
            <HeroDecorations className="mb-4" />
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Title className="text-wrap sm:text-balance">
                {t('hero.title')}
              </Title>
            </motion.div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2,
              }}
            >
              <Text className="text-center text-sm sm:text-base">
                {t('hero.description')}
              </Text>
            </motion.div>
          </article>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2,
            }}
          >
            <ExploreButton />
          </motion.div>
        </motion.div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-8 px-4 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.3,
          }}
        >
          <article className="text-center">
            <Heading>{t('features.heading')}</Heading>
            <Text className="text-sm sm:text-base">
              {t('features.description')}
            </Text>
          </article>
          <Features className="lg:max-w-6xl" locale={locale} />
        </motion.div>
        <div className="flex w-full flex-col items-center gap-8 px-4 lg:px-8">
          <article className="text-center">
            <Heading>{t('faq.heading')}</Heading>
            <Text className="text-sm sm:text-base">{t('faq.description')}</Text>
          </article>
          <FrequentlyAskedQuestions
            className="w-full lg:max-w-6xl"
            collapsible
            locale={locale}
            type="single"
          />
        </div>
        <div className="flex w-full flex-col items-center gap-4 bg-accent/50 py-8">
          <TelescopeIcon className="stroke-primary" size={64} />
          <article className="max-w-[60ch] px-8 text-center md:px-0">
            <Heading>{t('cta.heading')}</Heading>
            <Text className="text-sm md:text-base">{t('cta.description')}</Text>
          </article>
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              className={buttonVariants({
                size: 'pill-lg',
                variant: 'ghost-colorful',
              })}
              href="/explore"
            >
              {t('cta.button')}
              <ArrowRightIcon />
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}

type FeatureProps = {
  locale: Locale;
} & ComponentProps<typeof ItemGroup>;

async function Features({ locale, className, ...props }: FeatureProps) {
  'use cache';

  const t = await getTranslations({ locale, namespace: 'HomePage' });

  const features = [
    {
      icon: SearchIcon,
      iconColor: 'stroke-primary',
      label: t('features.steps.discovery.label'),
      labelColor: 'text-primary',
      title: t('features.steps.discovery.title'),
      description: t('features.steps.discovery.description'),
      benefits: [
        t('features.steps.discovery.benefits.curatedDirectory'),
        t('features.steps.discovery.benefits.categoryFilters'),
        t('features.steps.discovery.benefits.locationBasedSearch'),
        t('features.steps.discovery.benefits.verifiedListings'),
      ],
    },
    {
      icon: StoreIcon,
      iconColor: 'stroke-emerald-700',
      label: t('features.steps.information.label'),
      labelColor: 'text-emerald-700',
      title: t('features.steps.information.title'),
      description: t('features.steps.information.description'),
      benefits: [
        t('features.steps.information.benefits.completeDetails'),
        t('features.steps.information.benefits.customerReviews'),
        t('features.steps.information.benefits.operatingHours'),
        t('features.steps.information.benefits.contactInformation'),
      ],
    },
    {
      icon: HeartPlusIcon,
      iconColor: 'stroke-rose-700',
      label: t('features.steps.connection.label'),
      labelColor: 'text-rose-700',
      title: t('features.steps.connection.title'),
      description: t('features.steps.connection.description'),
      benefits: [
        t('features.steps.connection.benefits.directContact'),
        t('features.steps.connection.benefits.communityImpact'),
        t('features.steps.connection.benefits.localSupport'),
        t('features.steps.connection.benefits.easyCommunication'),
      ],
    },
  ];

  return (
    <ItemGroup className={cn('gap-4', className)} {...props}>
      {features.map((feature, index) => (
        <li className="list-none" key={feature.label}>
          <Item
            className="flex-col gap-4 p-8 md:flex-row"
            variant={index % 2 === 0 ? 'default' : 'muted'}
          >
            <ItemMedia className="self-center! size-48 md:size-64 lg:size-96">
              <feature.icon className={cn('size-1/2', feature.iconColor)} />
            </ItemMedia>
            <ItemContent className="gap-4">
              <Small className={cn('font-alt uppercase', feature.labelColor)}>
                {feature.label}
              </Small>
              <ItemTitle className="font-alt lg:text-2xl">
                {feature.title}
              </ItemTitle>
              <ItemDescription className="line-clamp-none lg:text-base">
                {feature.description}
              </ItemDescription>
              <ItemContent className="gap-4">
                {feature.benefits.map((benefit) => (
                  <ItemTitle key={benefit}>
                    <CheckCircleIcon className={feature.iconColor} />
                    {benefit}
                  </ItemTitle>
                ))}
              </ItemContent>
            </ItemContent>
          </Item>
        </li>
      ))}
    </ItemGroup>
  );
}

type FrequentlyAskedQuestionsProps = {
  locale: Locale;
} & ComponentProps<typeof Accordion>;

async function FrequentlyAskedQuestions({
  locale,
  ...props
}: FrequentlyAskedQuestionsProps) {
  'use cache';

  const t = await getTranslations({ locale, namespace: 'HomePage' });

  const questions = [
    {
      question: t('faq.questions.whatIsMerchantDirectory.question'),
      answer: t('faq.questions.whatIsMerchantDirectory.answer'),
    },
    {
      question: t('faq.questions.isItFree.question'),
      answer: t('faq.questions.isItFree.answer'),
    },
    {
      question: t('faq.questions.doIHaveToRegister.question'),
      answer: t('faq.questions.doIHaveToRegister.answer'),
    },
    {
      question: t('faq.questions.whatTypeOfBusinessCanIDiscover.question'),
      answer: t('faq.questions.whatTypeOfBusinessCanIDiscover.answer'),
    },
  ];

  return (
    <Accordion {...props}>
      {questions.map((question) => (
        <AccordionItem key={question.question} value={question.question}>
          <AccordionTrigger className="md:text-lg">
            {question.question}
          </AccordionTrigger>
          <AccordionContent className="md:text-base">
            {question.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function Footer({ className, ...props }: ComponentProps<'footer'>) {
  return (
    <footer
      className={cn(
        'mx-auto flex w-full flex-wrap items-center justify-between gap-4 p-4 lg:max-w-6xl',
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
