'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { type ComponentProps, useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import type { locales } from '@/i18n/routing';
import { NativeSelect, NativeSelectOption } from './ui/native-select';

export function LocaleSelect({
  className,
  ...props
}: ComponentProps<typeof NativeSelect>) {
  const [isPending, startTransition] = useTransition();

  const locale = useLocale();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(path, { locale: newLocale as (typeof locales)[number] });
    });
  };

  return (
    <NativeSelect
      defaultValue={locale}
      disabled={isPending}
      onChange={handleChange}
      {...props}
      name="locale"
    >
      <NativeSelectOption value="id">Indonesian</NativeSelectOption>
      <NativeSelectOption value="en">English</NativeSelectOption>
    </NativeSelect>
  );
}
