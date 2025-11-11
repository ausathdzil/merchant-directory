import { SearchIcon, StarIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hasLocale, type Locale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
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
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
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

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="flex w-full max-w-6xl flex-1 flex-col gap-4 p-4 lg:p-8">
        <div className="flex flex-wrap justify-between gap-4">
          <Suspense fallback={<Subheading>All Results</Subheading>}>
            <ResultText locale={locale} searchParams={searchParams} />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-9 w-[488px]" />}>
            <div className="grid w-full grid-cols-2 items-center gap-4 md:flex md:w-fit [&_div]:w-full md:[&_div]:w-fit">
              <ViewToggle className="hidden md:flex" />
              <MerchantTypesFilter locale={locale} />
              <MerchantSortByFilter locale={locale} />
            </div>
          </Suspense>
        </div>
        <Suspense fallback={<MerchantsGridSkeleton />}>
          <MerchantsResult locale={locale} searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

type ResultTextProps = {
  locale: Locale;
} & Omit<PageProps<'/[locale]/explore'>, 'params'>;

async function ResultText({ locale, searchParams }: ResultTextProps) {
  const { search } = await searchParams;

  const t = await getTranslations({ locale, namespace: 'ExplorePage' });

  return (
    <Subheading>
      {search && typeof search === 'string'
        ? t('search.searching', { query: search })
        : t('search.allResults')}{' '}
    </Subheading>
  );
}

async function MerchantTypesFilter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'ExplorePage.filters' });
  const merchantTypes = await getMerchantTypesList();

  const opts = [
    { label: t('merchantType'), value: '', isDisabled: true },
    ...merchantTypes.map((type) => ({
      label: type,
      value: type.toLocaleLowerCase().replace(/\s+/g, '_'),
    })),
  ];

  return <FilterSelect name="type" opts={opts} />;
}

async function MerchantSortByFilter({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: 'ExplorePage.filters' });

  const opts = [
    { label: t('sortBy'), value: '', isDisabled: true },
    { label: t('name'), value: 'name' },
    { label: t('rating'), value: 'rating' },
  ];

  return <FilterSelect name="sort_by" opts={opts} />;
}

type MerchantsResultProps = {
  locale: Locale;
} & Omit<PageProps<'/[locale]/explore'>, 'params'>;

async function MerchantsResult({ locale, searchParams }: MerchantsResultProps) {
  const t = await getTranslations({ locale, namespace: 'ExplorePage' });

  const { page, page_size, search, type, sort_by, sort_order, view } =
    await searchParams;

  const query: MerchantsQuery = {
    page: page ? Number(page) : 1,
    page_size: page_size ? Number(page_size) : 16,
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

  const merchants = await getMerchants(query, locale);

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
        view === 'list'
          ? 'grid-cols-1'
          : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      )}
    >
      {merchants.map((merchant) => (
        <li className="list-none" key={merchant.id}>
          <Item asChild className="h-full" variant="outline">
            <Link href={`/merchants/${merchant.id}`} prefetch>
              {merchant.photo_url &&
                (view === 'list' ? (
                  <ItemMedia variant="image">
                    <Image
                      alt={merchant.display_name || merchant.name}
                      className="object-cover grayscale"
                      height={32}
                      loading="eager"
                      src={merchant.photo_url}
                      width={32}
                    />
                  </ItemMedia>
                ) : (
                  <ItemHeader>
                    <Image
                      alt={merchant.display_name || merchant.name}
                      className="aspect-square w-full rounded-sm object-cover"
                      height={128}
                      loading="eager"
                      src={merchant.photo_url}
                      width={128}
                    />
                  </ItemHeader>
                ))}
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
              {view === 'list' ? (
                <ItemActions>
                  {merchant.primary_type && (
                    <Badge variant="secondary">{merchant.primary_type}</Badge>
                  )}
                  {merchant.type_count > 1 && (
                    <Badge variant="outline">+{merchant.type_count - 1}</Badge>
                  )}
                </ItemActions>
              ) : (
                <ItemFooter>
                  {merchant.primary_type && (
                    <Badge variant="secondary">{merchant.primary_type}</Badge>
                  )}
                  {merchant.type_count > 1 && (
                    <Badge variant="outline">+{merchant.type_count - 1}</Badge>
                  )}
                </ItemFooter>
              )}
            </Link>
          </Item>
        </li>
      ))}
    </ItemGroup>
  );
}

function MerchantsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 16 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Skeleton
        <Skeleton className="h-[353px]" key={i} />
      ))}
    </div>
  );
}
