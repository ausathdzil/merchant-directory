import { SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Subheading } from '@/components/typography';
import { Badge } from '@/components/ui/badge';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { getMerchants } from '@/lib/data/merchants';
import type { MerchantListItem, MerchantsQuery } from '@/lib/types/merchant';

export const metadata: Metadata = {
  title: 'Explore',
};

export default async function ExplorePage({
  searchParams,
}: PageProps<'/explore'>) {
  const t = await getTranslations('ExplorePage');
  const { page_size, search, sort_by } = await searchParams;

  const query: MerchantsQuery = {
    page_size: page_size ? Number(page_size) : 18,
    search: typeof search === 'string' ? search : undefined,
    sort_by:
      typeof sort_by === 'string'
        ? (sort_by as NonNullable<MerchantsQuery>['sort_by'])
        : undefined,
  };

  const merchants = await getMerchants(query);

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="flex w-full max-w-6xl flex-1 flex-col gap-4 p-8">
        {merchants.data.length > 0 ? (
          <>
            <Subheading>
              {query?.search
                ? t('search.searching', { query: query.search })
                : t('search.allResults')}{' '}
              <span className="tabular-nums">({merchants.meta.total})</span>
            </Subheading>
            <MerchantsGrid merchants={merchants.data} />
          </>
        ) : (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchIcon />
              </EmptyMedia>
              <EmptyTitle>{t('empty.title')}</EmptyTitle>
              <EmptyDescription>{t('empty.description')}</EmptyDescription>
            </EmptyHeader>
            <EmptyDescription>
              <Link href="/">{t('empty.button')}</Link>
            </EmptyDescription>
          </Empty>
        )}
      </div>
    </main>
  );
}

function MerchantsGrid({ merchants }: { merchants: MerchantListItem[] }) {
  return (
    <ItemGroup className="grid grid-cols-3 gap-4">
      {merchants.map((merchant) => (
        <Item
          asChild
          className="items-start"
          key={merchant.name}
          variant="outline"
        >
          <Link href="#">
            <ItemContent>
              <ItemTitle className="line-clamp-1">
                {merchant.display_name}
              </ItemTitle>
              <ItemDescription>
                ⭐ {merchant.rating} ({merchant.user_rating_count})
              </ItemDescription>
            </ItemContent>
            {merchant.primary_type && (
              <ItemActions>
                <Badge variant="secondary">{merchant.primary_type}</Badge>
              </ItemActions>
            )}
          </Link>
        </Item>
      ))}
    </ItemGroup>
  );
}
