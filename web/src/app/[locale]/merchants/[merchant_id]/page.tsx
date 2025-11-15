import { format, isAfter, subMonths } from 'date-fns';
import {
  ExpandIcon,
  GlobeIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  StarIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { hasLocale, type Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ComponentProps } from 'react';

import { MerchantPhotos } from '@/components/merchant-photos';
import { ReviewText } from '@/components/review-description';
import { ShareButton } from '@/components/share-button';
import { Subheading, Text } from '@/components/typography';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Link } from '@/i18n/navigation';
import { locales, routing } from '@/i18n/routing';
import {
  getMerchant,
  getMerchantAmenities,
  getMerchantOpeningHours,
  getMerchantPhotos,
  getMerchantReviews,
  getMerchants,
  getMerchantTypes,
} from '@/lib/data/merchants';
import type {
  MerchantDetail as MerchantDetailType,
  MerchantReviewsResponse,
} from '@/lib/types/merchant';
import { cn, MAPBOX_ACCESS_TOKEN } from '@/lib/utils';

export const dynamicParams = false;

export async function generateStaticParams() {
  const merchants = await getMerchants({ page_size: 27 });

  return locales.flatMap((locale) =>
    merchants.data
      .filter((m) => m.id)
      .map((merchant) => ({
        locale,
        merchant_id: String(merchant.id),
      }))
  );
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/merchants/[merchant_id]'>): Promise<Metadata> {
  const { locale, merchant_id } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const merchant = await getMerchant(
    { merchant_id: Number(merchant_id) },
    locale
  );

  if (!merchant) {
    notFound();
  }

  return {
    title: merchant.display_name,
    description: merchant.description,
  };
}

export default function MerchantPage({
  params,
}: PageProps<'/[locale]/merchants/[merchant_id]'>) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <MerchantDetails params={params} />
    </main>
  );
}

async function MerchantDetails({
  params,
}: Omit<PageProps<'/[locale]/merchants/[merchant_id]'>, 'searchParams'>) {
  const { locale, merchant_id } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const merchant = await getMerchant(
    { merchant_id: Number(merchant_id) },
    locale
  );

  if (!merchant) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'MerchantPage' });

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+2563eb(${merchant.longitude},${merchant.latitude})/${merchant.longitude},${merchant.latitude},19/1280x720@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;

  const [photos, reviews, types, opening_hours, amenities] = await Promise.all([
    getMerchantPhotos({ merchant_id: Number(merchant_id) }),
    getMerchantReviews({ merchant_id: Number(merchant_id) }),
    getMerchantTypes({ merchant_id: Number(merchant_id) }),
    getMerchantOpeningHours({ merchant_id: Number(merchant_id) }),
    getMerchantAmenities({ merchant_id: Number(merchant_id) }),
  ]);

  const hasAmenities =
    amenities && Object.values(amenities).some((v) => v === true);

  return (
    <div className="grid gap-8 p-4 lg:grid-cols-3 lg:p-8">
      <div className="grid gap-8 lg:col-span-2">
        <MerchantPhotos
          merchantName={merchant.display_name || merchant.name}
          photos={photos || []}
        />
        <Item className="p-0">
          <ItemContent className="gap-2">
            {merchant.display_name && (
              <ItemTitle className="text-balance text-xl lg:text-3xl">
                {merchant.display_name}
              </ItemTitle>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <StarIcon className="size-4 fill-yellow-500 stroke-yellow-500" />
                <ItemDescription className="tabular-nums leading-none">
                  {merchant.rating} ({merchant.user_rating_count})
                </ItemDescription>
              </div>
              {merchant.primary_type && (
                <Badge variant="secondary">{merchant.primary_type}</Badge>
              )}
            </div>
          </ItemContent>
          <ItemActions className="self-start">
            <Button
              aria-label="Contact"
              asChild
              className="flex lg:hidden"
              size="icon-lg"
              title="Contact"
              variant="outline"
            >
              <a href={`#contact-${merchant_id}`}>
                <MapPinIcon />
              </a>
            </Button>
            <ShareButton aria-label="Share" title="Share" />
          </ItemActions>
        </Item>
        <Separator />
        <div className="grid gap-4">
          <Subheading>{t('sections.about')}</Subheading>
          <Text className="mt-0!">
            {merchant.description ? merchant.description : t('about.noAbout')}
          </Text>
        </div>
        {types && types.length > 0 && (
          <div className="grid gap-4">
            <Subheading>{t('sections.additionalTypes')}</Subheading>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Badge key={type.id} variant="secondary">
                  {type.type_name}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {hasAmenities && (
          <div className="grid gap-4">
            <Subheading>{t('sections.amenities')}</Subheading>
            <div className="flex flex-wrap gap-2">
              {Object.entries(amenities)
                .filter(([_key, value]) => value === true)
                .map(([key]) => (
                  <Badge key={key} variant="secondary">
                    {key
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Badge>
                ))}
            </div>
          </div>
        )}
        {opening_hours && Object.keys(opening_hours).length > 0 && (
          <div className="grid gap-4">
            <Subheading>{t('sections.openingHours')}</Subheading>
            <Table>
              <TableHeader>
                <TableRow>
                  {Object.entries(opening_hours)
                    .slice(2)
                    .map(([day]) => (
                      <TableHead className="capitalize" key={day}>
                        {day}
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  {Object.entries(opening_hours)
                    .slice(2)
                    .map(([day, hours]) => (
                      <TableCell key={`${day}-hours`}>{hours}</TableCell>
                    ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
        <div className="grid gap-4">
          <Subheading>{t('sections.reviews')}</Subheading>
          {reviews && reviews.length > 0 ? (
            <ReviewCards reviews={reviews} />
          ) : (
            <Text className="mt-0!">{t('reviews.noReviews')}</Text>
          )}
        </div>
      </div>
      <div className="lg:col-span-1" id={`contact-${merchant_id}`}>
        <Card className="sticky top-4">
          <CardHeader className="border-b">
            <CardTitle>{t('sections.contactInformation')}</CardTitle>
          </CardHeader>
          <MerchantContact locale={locale} merchant={merchant} />
          <CardFooter className="grid gap-2 border-t">
            <div className="relative aspect-video w-full rounded-lg bg-muted">
              <Image
                alt={merchant.display_name || merchant.name}
                className="rounded-lg object-scale-down"
                fill
                loading="eager"
                sizes="(max-width: 768px) 100vw, 33vw"
                src={mapUrl}
              />
              <Button
                aria-label="Map"
                asChild
                className="absolute top-2 right-2 hover:[&_svg]:scale-110"
                size="icon"
              >
                <Link
                  href={{
                    pathname: '/map',
                    search: `?merchant_id=${merchant.id}`,
                  }}
                >
                  <ExpandIcon />
                </Link>
              </Button>
            </div>
            <a
              className={buttonVariants({ size: 'lg' })}
              href={`https://www.google.com/maps/dir/?api=1&destination=${merchant.latitude},${merchant.longitude}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <NavigationIcon />
              {t('actions.getDirections')}
            </a>
            <a
              className={buttonVariants({ size: 'lg', variant: 'secondary' })}
              href={`tel:${merchant.phone_international}`}
            >
              <PhoneIcon />
              {t('actions.contactBusiness')}
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

type ReviewCardProps = {
  reviews: MerchantReviewsResponse;
} & ComponentProps<typeof ItemGroup>;

function ReviewCards({ reviews, className, ...props }: ReviewCardProps) {
  return (
    <ItemGroup className={cn('list-none gap-4', className)} {...props}>
      {reviews.map((review) => (
        <li key={review.id}>
          <Item variant="outline">
            {review.author_name && (
              <ItemMedia>
                <Avatar className="size-10">
                  <AvatarFallback>
                    {review.author_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
            )}
            <ItemContent>
              <div className="flex items-center gap-2">
                <ItemTitle>{review.author_name}</ItemTitle>
                <ItemDescription className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon
                      className={cn(
                        'stroke-yellow-500',
                        i < review.rating ? 'fill-yellow-500' : ''
                      )}
                      // biome-ignore lint/suspicious/noArrayIndexKey: Rating
                      key={i}
                      size={14}
                    />
                  ))}
                </ItemDescription>
              </div>
              <ReviewText text={review.text} />
            </ItemContent>
            {review.published_at && (
              <ItemActions className="self-start">
                {isAfter(
                  new Date(review.published_at),
                  subMonths(new Date(), 6)
                )
                  ? review.relative_time
                  : format(new Date(review.published_at), 'd MMM yyyy')}
              </ItemActions>
            )}
          </Item>
        </li>
      ))}
    </ItemGroup>
  );
}

type MerchantContactProps = {
  merchant: MerchantDetailType;
  locale: Locale;
} & ComponentProps<typeof CardContent>;

async function MerchantContact({
  merchant,
  locale,
  className,
  ...props
}: MerchantContactProps) {
  const t = await getTranslations({ locale, namespace: 'MerchantPage' });

  return (
    <CardContent className={cn('space-y-4 **:p-0', className)} {...props}>
      <Item>
        <ItemMedia variant="icon">
          <MapPinIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{t('contact.address')}</ItemTitle>
          <ItemDescription title={merchant.formatted_address ?? undefined}>
            {merchant.formatted_address
              ? merchant.formatted_address
              : t('contact.noAddress')}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <PhoneIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{t('contact.phone')}</ItemTitle>
          <ItemDescription>
            {merchant.phone_international ? (
              <a href={`tel:${merchant.phone_international}`}>
                {merchant.phone_international}
              </a>
            ) : (
              t('contact.noPhone')
            )}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <GlobeIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{t('contact.website')}</ItemTitle>
          <ItemDescription>
            {merchant.website ? (
              <a
                href={merchant.website}
                rel="noopener noreferrer"
                target="_blank"
              >
                {merchant.website}
              </a>
            ) : (
              t('contact.noWebsite')
            )}
          </ItemDescription>
        </ItemContent>
      </Item>
    </CardContent>
  );
}
