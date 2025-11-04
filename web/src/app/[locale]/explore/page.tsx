import { SearchIcon, StarIcon } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

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
import { Skeleton } from '@/components/ui/skeleton';
import { ViewToggle } from '@/components/view-toggle';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getMerchantTypesList } from '@/lib/data/merchant-types';
import { getMerchants } from '@/lib/data/merchants';
import type { MerchantListItem, MerchantsQuery } from '@/lib/types/merchant';
import { cn } from '@/lib/utils';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/explore'>): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({
    locale,
    namespace: 'Metadata.ExplorePage',
  });

  return {
    title: t('title'),
  };
}

export default async function ExplorePage({
  params,
  searchParams,
}: PageProps<'/[locale]/explore'>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 lg:p-8">
        <div className="flex flex-wrap justify-between gap-4">
          <Suspense fallback={<Subheading>All Results</Subheading>}>
            <ResultText searchParams={searchParams} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-9 w-[488px]" />}>
            <div className="grid w-full grid-cols-2 items-center gap-4 md:flex md:w-fit [&_div]:w-full md:[&_div]:w-fit">
              <ViewToggle className="hidden md:flex" />
              <MerchantTypesFilter />
              <MerchantSortByFilter />
            </div>
          </Suspense>
        </div>
        <Suspense fallback={<MerchantsGridSkeleton />}>
          <MerchantsResult searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function ResultText({
  searchParams,
}: Omit<PageProps<'/[locale]/explore'>, 'params'>) {
  const { search } = await searchParams;

  const t = await getTranslations('ExplorePage');

  return (
    <Subheading>
      {search && typeof search === 'string'
        ? t('search.searching', { query: search })
        : t('search.allResults')}{' '}
    </Subheading>
  );
}

async function MerchantTypesFilter() {
  const merchantTypes = await getMerchantTypesList();

  const opts = [
    { label: 'Merchant Type', value: '', isDisabled: true },
    ...merchantTypes.map((type) => ({
      label: type,
      value: type.toLocaleLowerCase().replace(/\s+/g, '_'),
    })),
  ];

  return <FilterSelect name="type" opts={opts} />;
}

function MerchantSortByFilter() {
  const opts = [
    { label: 'Sort By', value: '', isDisabled: true },
    { label: 'Name', value: 'name' },
    { label: 'Rating', value: 'rating' },
  ];

  return <FilterSelect name="sort_by" opts={opts} />;
}

async function MerchantsResult({
  searchParams,
}: Omit<PageProps<'/[locale]/explore'>, 'params'>) {
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

  if (merchants.data.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <MerchantsGrid
        merchants={merchants.data}
        view={view as 'grid' | 'list'}
      />
      <MerchantPagination className="mt-auto" paginationMeta={merchants.meta} />
    </>
  );
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
            <Link href={`/merchants/${merchant.id}`} prefetch>
              <ItemContent>
                <ItemTitle className="line-clamp-1">
                  {merchant.display_name}
                </ItemTitle>
                <div className="flex items-center gap-1">
                  <StarIcon className="size-4 fill-yellow-500 stroke-yellow-500" />
                  <ItemDescription className="tabular-nums leading-none">
                    {merchant.rating} ({merchant.user_rating_count})
                  </ItemDescription>
                </div>
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

function MerchantsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 15 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton
        <Skeleton className="h-[78px]" key={i} />
      ))}
    </div>
  );
}
