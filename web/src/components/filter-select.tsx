'use client';

import type { Route } from 'next';
import { useSearchParams } from 'next/navigation';
import { type ComponentProps, useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { NativeSelect, NativeSelectOption } from './ui/native-select';

type Option = {
  value: string;
  label: string;
  isDisabled?: boolean;
};

type FilterSelectProps = {
  name: string;
  opts: Option[];
} & ComponentProps<typeof NativeSelect>;

export function FilterSelect({ name, opts, ...props }: FilterSelectProps) {
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (e.target.value) {
      params.set(name, e.target.value);
    } else {
      params.delete('page');
      params.delete(name);
    }

    startTransition(() => {
      router.replace(`${pathname as Route}?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  return (
    <NativeSelect
      aria-label="Select merchant type"
      defaultValue={searchParams.get('type') ?? undefined}
      disabled={isPending}
      onChange={handleChange}
      {...props}
      name="type"
    >
      {opts.map((opt) => (
        <NativeSelectOption key={opt.label} value={opt.value}>
          {opt.label}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
