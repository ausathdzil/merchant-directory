import { ArrowRightIcon, SearchIcon, TelescopeIcon } from 'lucide-react';
import Link from 'next/link';

import { Heading, Text, Title } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-32 pt-8 md:pt-16">
      <div className="flex flex-col items-center px-8">
        <article className="max-w-[60ch]">
          <Title>Discover local businesses in South Jakarta.</Title>
          <Text className="text-center text-sm md:text-base">
            Connect with the best small and medium enterprises in South Jakarta.
            Find trusted merchants, explore local services, and support your
            community.
          </Text>
        </article>
        <div className="flex flex-col items-center gap-4 pt-8 md:flex-row">
          <Link className={buttonVariants({ size: 'pill-lg' })} href="/explore">
            <SearchIcon />
            Explore Directory
          </Link>
          <Link
            className={buttonVariants({
              size: 'pill-lg',
              variant: 'secondary',
            })}
            href="/"
          >
            List Your Business
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
      <div className="flex flex-col items-center px-8">
        <Heading>How It Works</Heading>
        {/* TODO: Features */}
      </div>
      <div className="flex flex-col items-center px-8">
        <Heading>Frequently Asked Questions</Heading>
        {/* TODO: FAQ */}
      </div>
      <div className="flex w-full flex-col items-center gap-4 bg-accent/50 py-8">
        <TelescopeIcon className="stroke-primary" size={64} />
        <article className="max-w-[60ch] px-8 text-center md:px-0">
          <Heading>What are you waiting for?</Heading>
          <Text className="text-sm md:text-base">
            Start exploring hundreds of verified merchants in Jakarta Selatan
            today. Find the perfect business for your needs.
          </Text>
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
          Explore Directory
          <ArrowRightIcon />
        </Link>
      </div>
    </main>
  );
}
