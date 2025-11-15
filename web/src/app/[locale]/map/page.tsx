import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { InteractiveMap } from '@/components/interactive-map';
import { Skeleton } from '@/components/ui/skeleton';
import { getMerchant } from '@/lib/data/merchants';

export default async function MapPage({
  searchParams,
}: PageProps<'/[locale]/map'>) {
  const { merchant_id } = await searchParams;

  if (!merchant_id) {
    notFound();
  }

  const merchant = await getMerchant({ merchant_id: Number(merchant_id) });

  if (!merchant) {
    notFound();
  }

  const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;

  if (!mapboxAccessToken) {
    throw new Error('No token provided.');
  }

  return (
    <main className="flex flex-1 flex-col items-center">
      <Suspense fallback={<Skeleton className="relative h-screen w-full" />}>
        <InteractiveMap
          mapboxAccessToken={mapboxAccessToken}
          merchant={merchant}
        />
      </Suspense>
    </main>
  );
}
