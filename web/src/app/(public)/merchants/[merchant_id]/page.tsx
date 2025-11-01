import { getMerchant } from '@/lib/data/merchants';

export default async function MerchantPage({
  params,
}: PageProps<'/merchants/[merchant_id]'>) {
  const { merchant_id } = await params;

  const merchant = await getMerchant({ merchant_id: Number(merchant_id) });

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="flex w-full max-w-6xl flex-1 flex-col gap-4 p-8">
        <pre>{JSON.stringify(merchant, null, 2)}</pre>
      </div>
    </main>
  );
}
