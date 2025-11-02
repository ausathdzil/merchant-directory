'use client';

import { GridIcon, ListIcon } from 'lucide-react';
import type { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { ComponentProps } from 'react';
import { Button } from './ui/button';
import { ButtonGroup } from './ui/button-group';

export function ViewToggle({ ...props }: ComponentProps<typeof ButtonGroup>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleViewChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('view', value);
    } else {
      params.delete('view');
    }
    router.push(`${pathname as Route}?${params.toString()}`);
  };

  return (
    <ButtonGroup {...props}>
      <Button
        aria-label="Toggle list view"
        onClick={() => handleViewChange('list')}
        variant={searchParams.get('view') === 'list' ? 'default' : 'outline'}
      >
        <ListIcon />
        List
      </Button>
      <Button
        aria-label="Toggle grid view"
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
