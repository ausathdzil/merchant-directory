'use client';

import { SearchIcon } from 'lucide-react';
import type { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  type ComponentProps,
  useEffect,
  useId,
  useRef,
  useTransition,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Kbd } from './ui/kbd';
import { Spinner } from './ui/spinner';

const DEBOUNCE_MS = 300;

export function SearchInput({
  className,
  ...props
}: ComponentProps<typeof InputGroupInput>) {
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term) {
      params.set('search', term);
    } else {
      params.delete('page');
      params.delete('search');
    }
    startTransition(() => {
      router.replace(`${pathname as Route}?${params.toString()}`, {
        scroll: false,
      });
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
          {isPending ? <Spinner /> : <SearchIcon />}
        </InputGroupAddon>
      </label>
      <InputGroupInput
        className={className}
        {...props}
        aria-label="Search"
        autoComplete="off"
        autoFocus
        defaultValue={searchParams.get('search')?.toString()}
        id={id}
        name="search"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        ref={inputRef}
        type="search"
      />
      {(inputRef.current?.value || searchParams.get('search')) && (
        <InputGroupAddon align="inline-end">
          <Kbd className="hidden sm:flex">Esc</Kbd>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
