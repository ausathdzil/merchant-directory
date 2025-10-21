import Image from 'next/image';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export default function NotFoundPage() {
  return (
    <main className="flex flex-1 justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <Image
              alt="404 Not Found"
              height={216}
              src="/404-NotFound.png"
              width={384}
            />
          </EmptyMedia>
          <EmptyTitle>Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for does not exists.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </main>
  );
}
