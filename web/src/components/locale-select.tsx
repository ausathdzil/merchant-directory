'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { type ComponentProps, useState } from 'react';

import { usePathname } from '@/i18n/navigation';
import { NativeSelect, NativeSelectOption } from './ui/native-select';

export function LocaleSelect({
  className,
  ...props
}: ComponentProps<typeof NativeSelect>) {
  const [isPending, setIsPending] = useState(false);

  const locale = useLocale();

  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    setIsPending(true);
    window.location.href = `/${newLocale}${path}`;
  };

  return (
    <NativeSelect
      aria-label="Choose your preferred language"
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
