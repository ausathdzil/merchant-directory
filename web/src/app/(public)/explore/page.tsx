import { SearchIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { FilterSelect } from '@/components/filter-select';
import { MerchantPagination } from '@/components/merchant-pagination';
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
import { ViewToggle } from '@/components/view-toggle';
import { getMerchants, getMerchantTypes } from '@/lib/data/merchants';
import type { MerchantListItem, MerchantsQuery } from '@/lib/types/merchant';
import { cn } from '@/lib/utils';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Metadata.ExplorePage');

  return {
    title: t('title'),
  };
}

export default async function ExplorePage({
  searchParams,
}: PageProps<'/explore'>) {
  const t = await getTranslations('ExplorePage');

  const { page, page_size, search, type, sort_by, sort_order, view } =
    await searchParams;

  const query: MerchantsQuery = {
    page: page ? Number(page) : 1,
    page_size: page_size ? Number(page_size) : 15,
    search: typeof search === 'string' ? search : undefined,
    type: typeof type === 'string' ? type : undefined,
    sort_by:
      typeof sort_by === 'string'
        ? (sort_by as NonNullable<MerchantsQuery>['sort_by'])
        : undefined,
    sort_order:
      typeof sort_order === 'string'
        ? (sort_order as NonNullable<MerchantsQuery>['sort_order'])
        : undefined,
  };

  const merchants = await getMerchants(query);

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 lg:p-8">
        {merchants.data.length > 0 ? (
          <>
            <div className="flex flex-wrap justify-between gap-4">
              <Subheading>
                {query?.search
                  ? t('search.searching', { query: query.search })
                  : t('search.allResults')}{' '}
                <span className="tabular-nums">({merchants.meta.total})</span>
              </Subheading>
              <div className="flex items-center gap-4">
                <ViewToggle className="hidden md:flex" />
                <MerchantTypesFilter />
              </div>
            </div>
            <MerchantsGrid
              merchants={merchants.data}
              view={view as 'grid' | 'list'}
            />
            <MerchantPagination
              className="mt-auto"
              paginationMeta={merchants.meta}
            />
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

async function MerchantTypesFilter() {
  const merchantTypes = await getMerchantTypes();
  const opts = [
    { label: 'Type', value: '', isDisabled: true },
    ...merchantTypes.map((type) => ({
      label: type,
      value: type.toLocaleLowerCase().replace(/\s+/g, '_'),
    })),
  ];

  return <FilterSelect name="type" opts={opts} />;
}

function MerchantsGrid({
  merchants,
  view,
}: {
  merchants: MerchantListItem[];
  view: 'grid' | 'list';
}) {
  return (
    <ItemGroup
      className={cn(
        'grid gap-4',
        view === 'list' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'
      )}
    >
      {merchants.map((merchant) => (
        <li className="list-none" key={merchant.id}>
          <Item asChild className="items-start" variant="outline">
            <Link href={`/merchants/${merchant.id}`}>
              <ItemContent>
                <ItemTitle className="line-clamp-1">
                  {merchant.display_name}
                </ItemTitle>
                <ItemDescription className="tabular-nums">
                  ⭐ {merchant.rating} ({merchant.user_rating_count})
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                {merchant.primary_type && (
                  <Badge variant="secondary">{merchant.primary_type}</Badge>
                )}
                {merchant.type_count > 1 && (
                  <Badge variant="outline">+{merchant.type_count - 1}</Badge>
                )}
              </ItemActions>
            </Link>
          </Item>
        </li>
      ))}
    </ItemGroup>
  );
}
