'use client';

import { GridIcon, ListIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { type ComponentProps, useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { Button } from './ui/button';
import { ButtonGroup } from './ui/button-group';

export function ViewToggle({ ...props }: ComponentProps<typeof ButtonGroup>) {
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleViewChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('view', value);
    } else {
      params.delete('view');
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <ButtonGroup {...props}>
      <Button
        aria-label="Toggle list view"
        disabled={isPending}
        onClick={() => handleViewChange('list')}
        variant={searchParams.get('view') === 'list' ? 'default' : 'outline'}
      >
        <ListIcon />
        List
      </Button>
      <Button
        aria-label="Toggle grid view"
        disabled={isPending}
        onClick={() => handleViewChange('grid')}
        variant={
          searchParams.get('view') === 'grid' || !searchParams.get('view')
            ? 'default'
            : 'outline'
        }
      >
        <GridIcon />
        Grid
      </Button>
    </ButtonGroup>
  );
}
