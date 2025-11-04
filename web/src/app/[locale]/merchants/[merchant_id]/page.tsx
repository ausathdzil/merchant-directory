import { format, isAfter, subMonths } from 'date-fns';
import {
  GlobeIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  Share2Icon,
  StarIcon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { ReviewText } from '@/components/review-description';
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
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getMerchant,
  getMerchantAmenities,
  getMerchantOpeningHours,
  getMerchantReviews,
  getMerchantTypes,
} from '@/lib/data/merchants';
import type {
  MerchantDetail as MerchantDetailType,
  MerchantReviewsResponse,
} from '@/lib/types/merchant';
import { cn, MAPBOX_ACCESS_TOKEN } from '@/lib/utils';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/merchants/[merchant_id]'>): Promise<Metadata> {
  const { merchant_id } = await params;

  const merchant = await getMerchant({ merchant_id: Number(merchant_id) });

  if (!merchant) {
    notFound();
  }

  return {
    title: merchant.display_name,
  };
}

export default function MerchantPage({
  params,
}: PageProps<'/[locale]/merchants/[merchant_id]'>) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <Suspense fallback={<Spinner />}>
        <MerchantDetail params={params} />
      </Suspense>
    </main>
  );
}

async function MerchantDetail({
  params,
}: Omit<PageProps<'/[locale]/merchants/[merchant_id]'>, 'searchParams'>) {
  const { merchant_id } = await params;

  const merchant = await getMerchant({ merchant_id: Number(merchant_id) });

  if (!merchant) {
    notFound();
  }

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+2563eb(${merchant.longitude},${merchant.latitude})/${merchant.longitude},${merchant.latitude},18/1280x720@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;

  const [reviews, types, opening_hours, amenities] = await Promise.all([
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
        <div className="relative aspect-video w-full rounded-lg bg-muted">
          <Image
            alt={merchant.display_name ?? 'Map of the business'}
            className="rounded-lg object-cover"
            fill
            loading="eager"
            src={mapUrl}
          />
        </div>
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
            <Button size="icon-lg" variant="outline">
              <Share2Icon />
            </Button>
          </ItemActions>
        </Item>
        <Separator />
        {types && types.length > 0 && (
          <div className="grid gap-4">
            <Subheading>Additional Types</Subheading>
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
            <Subheading>Amenities</Subheading>
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
            <Subheading>Opening Hours</Subheading>
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
          <Subheading>Reviews</Subheading>
          {reviews && reviews.length > 0 ? (
            <ReviewCards reviews={reviews} />
          ) : (
            <Text>No reviews yet.</Text>
          )}
        </div>
      </div>
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader className="border-b">
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <MerchantContact merchant={merchant} />
          <CardFooter className="grid gap-2 border-t">
            <a
              className={buttonVariants({ size: 'lg' })}
              href={`https://www.google.com/maps/dir/?api=1&destination=${merchant.latitude},${merchant.longitude}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <NavigationIcon />
              Get Directions
            </a>
            <a
              className={buttonVariants({ size: 'lg', variant: 'secondary' })}
              href={`tel:${merchant.phone_international}`}
            >
              <PhoneIcon />
              Contact Business
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function ReviewCards({ reviews }: { reviews: MerchantReviewsResponse }) {
  return (
    <ItemGroup className="list-none gap-4">
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

function MerchantContact({ merchant }: { merchant: MerchantDetailType }) {
  return (
    <CardContent className="space-y-4 **:p-0">
      <Item>
        <ItemMedia variant="icon">
          <MapPinIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Address</ItemTitle>
          <ItemDescription title={merchant.formatted_address ?? undefined}>
            {merchant.formatted_address
              ? merchant.formatted_address
              : 'No address available'}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <PhoneIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Phone</ItemTitle>
          <ItemDescription>
            {merchant.phone_international ? (
              <a href={`tel:${merchant.phone_international}`}>
                {merchant.phone_international}
              </a>
            ) : (
              'No phone number available'
            )}
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <GlobeIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Website</ItemTitle>
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
              'No website available'
            )}
          </ItemDescription>
        </ItemContent>
      </Item>
    </CardContent>
  );
}
