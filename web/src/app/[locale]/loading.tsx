import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <main className="grid flex-1 place-items-center">
      <Spinner />
    </main>
  );
}
