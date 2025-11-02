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
import Link from 'next/link';
import { useTranslations } from 'next-intl';
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
import { cn } from '@/lib/utils';

export default function Home() {
  const t = useTranslations('HomePage');

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
          <Features className="lg:max-w-6xl" />
        </motion.div>
        <div className="flex w-full flex-col items-center gap-8 px-4 lg:px-8">
          <article className="text-center">
            <Heading>{t('faq.heading')}</Heading>
            <Text className="text-sm sm:text-base">{t('faq.description')}</Text>
          </article>
          <FrequentlyAskedQuestions
            className="w-full lg:max-w-6xl"
            collapsible
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

function Features({ className, ...props }: ComponentProps<typeof ItemGroup>) {
  const t = useTranslations('HomePage.features.steps');

  const features = [
    {
      icon: SearchIcon,
      iconColor: 'stroke-primary',
      label: t('discovery.label'),
      labelColor: 'text-primary',
      title: t('discovery.title'),
      description: t('discovery.description'),
      benefits: [
        t('discovery.benefits.curatedDirectory'),
        t('discovery.benefits.categoryFilters'),
        t('discovery.benefits.locationBasedSearch'),
        t('discovery.benefits.verifiedListings'),
      ],
    },
    {
      icon: StoreIcon,
      iconColor: 'stroke-emerald-500',
      label: t('information.label'),
      labelColor: 'text-emerald-500',
      title: t('information.title'),
      description: t('information.description'),
      benefits: [
        t('information.benefits.completeDetails'),
        t('information.benefits.customerReviews'),
        t('information.benefits.operatingHours'),
        t('information.benefits.contactInformation'),
      ],
    },
    {
      icon: HeartPlusIcon,
      iconColor: 'stroke-rose-500',
      label: t('connection.label'),
      labelColor: 'text-rose-500',
      title: t('connection.title'),
      description: t('connection.description'),
      benefits: [
        t('connection.benefits.directContact'),
        t('connection.benefits.communityImpact'),
        t('connection.benefits.localSupport'),
        t('connection.benefits.easyCommunication'),
      ],
    },
  ];

  return (
    <ItemGroup className={cn('gap-4', className)} {...props}>
      {features.map((feature, index) => (
        <Item
          className="flex-col gap-4 p-8 md:flex-row"
          key={feature.label}
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
      ))}
    </ItemGroup>
  );
}

function FrequentlyAskedQuestions({
  ...props
}: ComponentProps<typeof Accordion>) {
  const t = useTranslations('HomePage.faq.questions');

  const questions = [
    {
      question: t('whatIsMerchantDirectory.question'),
      answer: t('whatIsMerchantDirectory.answer'),
    },
    {
      question: t('isItFree.question'),
      answer: t('isItFree.answer'),
    },
    {
      question: t('doIHaveToRegister.question'),
      answer: t('doIHaveToRegister.answer'),
    },
    {
      question: t('whatTypeOfBusinessCanIDiscover.question'),
      answer: t('whatTypeOfBusinessCanIDiscover.answer'),
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
