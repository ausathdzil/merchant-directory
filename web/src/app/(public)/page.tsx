import { ArrowRightIcon, TelescopeIcon } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { ExploreButton } from '@/components/explore-button';
import { Heading, Text, Title } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default async function Home() {
  const t = await getTranslations('HomePage');

  return (
    <main className="flex flex-1 flex-col items-center gap-16 pt-16 md:pt-24">
      <div className="flex flex-col items-center px-8">
        <article className="max-w-[60ch]">
          <Title className="text-wrap sm:text-balance">{t('hero.title')}</Title>
          <Text className="text-center text-sm sm:text-base">
            {t('hero.description')}
          </Text>
        </article>
        <div className="flex flex-col items-center gap-4 pt-8 md:flex-row">
          <ExploreButton />
        </div>
      </div>
      <div className="flex flex-col items-center px-8">
        <Heading>{t('features.heading')}</Heading>
        {/* TODO: Features */}
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
  );
}
