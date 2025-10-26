import {
  ArrowRightIcon,
  CheckCircleIcon,
  HeartPlusIcon,
  SearchIcon,
  StoreIcon,
  TelescopeIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import type { ComponentProps } from 'react';

import { ExploreButton } from '@/components/explore-button';
import { Heading, Small, Text, Title } from '@/components/typography';
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

export default async function Home() {
  const t = await getTranslations('HomePage');

  return (
    <>
      <main className="flex flex-1 flex-col items-center gap-16 pt-16 md:pt-24">
        <div className="flex flex-col items-center px-8">
          <article className="max-w-[60ch]">
            <Title className="text-wrap sm:text-balance">
              {t('hero.title')}
            </Title>
            <Text className="text-center text-sm sm:text-base">
              {t('hero.description')}
            </Text>
          </article>
          <div className="flex flex-col items-center gap-4 pt-8 md:flex-row">
            <ExploreButton />
          </div>
        </div>
        <div className="flex flex-col items-center gap-8 px-8">
          <article className="text-center">
            <Heading>{t('features.heading')}</Heading>
            <Text className="text-sm sm:text-base">
              {t('features.description')}
            </Text>
          </article>
          <Features className="lg:max-w-4/5" />
        </div>
        <div className="flex flex-col items-center px-8">
          <Heading>{t('faq.heading')}</Heading>
          {/* TODO: FAQ */}
        </div>
        <div className="flex w-full flex-col items-center gap-4 bg-accent/50 py-8">
          <TelescopeIcon className="stroke-primary" size={64} />
          <article className="max-w-[60ch] px-8 text-center md:px-0">
            <Heading>{t('cta.heading')}</Heading>
            <Text className="text-sm md:text-base">{t('cta.description')}</Text>
          </article>
          <Link
            className={cn(
              buttonVariants({
                size: 'pill-lg',
                variant: 'ghost-colorful',
              }),
              'hover:scale-105'
            )}
            href="/explore"
          >
            {t('cta.button')}
            <ArrowRightIcon />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

async function Features({
  className,
  ...props
}: ComponentProps<typeof ItemGroup>) {
  const t = await getTranslations('HomePage.features.steps');

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
          variant={index % 2 === 0 ? 'muted' : 'default'}
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

function Footer({ className, ...props }: ComponentProps<'footer'>) {
  return (
    <footer
      className={cn(
        'mx-auto flex w-full flex-wrap items-center justify-between gap-4 p-4 lg:max-w-4/5',
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
