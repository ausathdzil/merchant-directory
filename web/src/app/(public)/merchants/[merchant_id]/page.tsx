import {
  GlobeIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  Share2Icon,
} from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import { getMerchant } from '@/lib/data/merchants';
import type { MerchantDetail } from '@/lib/types/merchant';
import { MAPBOX_ACCESS_TOKEN } from '@/lib/utils';

export async function generateMetadata({
  params,
}: PageProps<'/merchants/[merchant_id]'>): Promise<Metadata> {
  const { merchant_id } = await params;
  const merchant = await getMerchant({ merchant_id: Number(merchant_id) });

  if (!merchant) {
    notFound();
  }

  return {
    title: merchant.display_name,
  };
}

export default async function MerchantPage({
  params,
}: PageProps<'/merchants/[merchant_id]'>) {
  const { merchant_id } = await params;
  const merchant = await getMerchant({ merchant_id: Number(merchant_id) });

  if (!merchant) {
    notFound();
  }

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+2563eb(${merchant.longitude},${merchant.latitude})/${merchant.longitude},${merchant.latitude},18/1280x720@2x?access_token=${MAPBOX_ACCESS_TOKEN}`;

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="grid gap-8 p-4 lg:grid-cols-3 lg:p-8">
        <div className="grid gap-4 lg:col-span-2">
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
              <ItemTitle className="text-balance text-xl lg:text-3xl">
                {merchant.display_name}
              </ItemTitle>
              <div className="flex items-center gap-2">
                <ItemDescription className="tabular-nums">
                  ⭐ {merchant.rating} ({merchant.user_rating_count})
                </ItemDescription>
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
    </main>
  );
}

function MerchantContact({ merchant }: { merchant: MerchantDetail }) {
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
