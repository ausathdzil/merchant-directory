'use client';

import { SearchIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import {
  type ComponentProps,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { useIsMac } from '@/hooks/use-mac';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname, useRouter } from '@/i18n/navigation';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Kbd } from './ui/kbd';
import { Spinner } from './ui/spinner';

const DEBOUNCE_MS = 300;

export function SearchInput({
  className,
  ...props
}: ComponentProps<typeof InputGroupInput>) {
  const [isPending, startTransition] = useTransition();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isMobile = useIsMobile();
  const isMac = useIsMac();

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
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, DEBOUNCE_MS);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      if (e.key === 'Escape' && inputRef.current) {
        inputRef.current.value = '';
        handleSearch('');
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [handleSearch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isMobile) {
        inputRef.current?.focus();
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [isMobile]);

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
        autoCapitalize="off"
        autoComplete="off"
        defaultValue={searchParams.get('search')?.toString()}
        id={id}
        name="search"
        onBlur={() => setIsFocused(false)}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        ref={inputRef}
        spellCheck={false}
        type="search"
      />
      {!(
        isFocused ||
        inputRef.current?.value ||
        searchParams.get('search')
      ) && (
        <InputGroupAddon align="inline-end">
          <Kbd className="hidden md:flex">{isMac ? '⌘' : 'Ctrl'}</Kbd>
          <Kbd className="hidden md:flex">K</Kbd>
        </InputGroupAddon>
      )}
      {(inputRef.current?.value || searchParams.get('search')) && (
        <InputGroupAddon align="inline-end">
          <Kbd className="hidden md:flex">Esc</Kbd>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
