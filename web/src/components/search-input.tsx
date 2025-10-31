'use client';

import { SearchIcon } from 'lucide-react';
import type { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { type ComponentProps, useEffect, useId, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Kbd } from './ui/kbd';

const DEBOUNCE_MS = 300;

export function SearchInput({
  className,
  ...props
}: ComponentProps<typeof InputGroupInput>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('q', term);
    } else {
      params.delete('page');
      params.delete('q');
    }
    router.replace(`${pathname as Route}?${params.toString()}`, {
      scroll: false,
    });
  }, DEBOUNCE_MS);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inputRef.current) {
        inputRef.current.value = '';
        handleSearch('');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleSearch]);

  return (
    <InputGroup>
      <label aria-hidden htmlFor={id}>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </label>
      <InputGroupInput
        className={className}
        {...props}
        aria-label="Search"
        autoComplete="off"
        autoFocus
        defaultValue={searchParams.get('q')?.toString()}
        id={id}
        name="q"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        ref={inputRef}
        type="search"
      />
      {(inputRef.current?.value || searchParams.get('q')) && (
        <InputGroupAddon align="inline-end">
          <Kbd className="hidden sm:flex">Esc</Kbd>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
