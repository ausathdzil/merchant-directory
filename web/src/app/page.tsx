import { ArrowRightIcon, SearchIcon } from 'lucide-react';
import Link from 'next/link';

import { Text, Title } from '@/components/typography';
import { buttonVariants } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center gap-8 px-32 py-8">
      <article className="flex max-w-[60ch] flex-col items-center">
        <Title>Discover local businesses in South Jakarta.</Title>
        <Text className="text-center">
          Connect with the best small and medium enterprises in South Jakarta.
          Find trusted merchants, explore local services, and support your
          community.
        </Text>
        <div className="flex items-center gap-4 pt-8">
          <Link className={buttonVariants({ size: 'pill' })} href="/">
            <SearchIcon />
            Browse Directory
          </Link>
          <Link
            className={buttonVariants({ size: 'pill', variant: 'secondary' })}
            href="/"
          >
            List Your Business
            <ArrowRightIcon />
          </Link>
        </div>
      </article>
    </main>
  );
}
