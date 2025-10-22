'use client';

import { SearchIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { type ComponentProps, useEffect, useRef } from 'react';

import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';

export function SearchInput({
  className,
  placeholder,
  ...props
}: { placeholder?: string } & ComponentProps<typeof InputGroup>) {
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pathname === '/explore') {
      inputRef.current?.focus();
    }
  }, [pathname]);

  return (
    <InputGroup className={className} {...props}>
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder={placeholder} ref={inputRef} type="search" />
    </InputGroup>
  );
}
