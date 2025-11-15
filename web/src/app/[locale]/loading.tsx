import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <main className="grid min-h-[calc(100vh-101px)] flex-1 place-items-center">
      <Spinner />
    </main>
  );
}
