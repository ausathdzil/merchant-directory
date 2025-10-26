'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';

import { setLocale } from '@/lib/actions/locale';
import type { locales } from '../../global';
import { NativeSelect, NativeSelectOption } from './ui/native-select';

export function LocaleSelect() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(async () => {
      await setLocale(e.target.value as (typeof locales)[number]);
    });
  };

  return (
    <NativeSelect
      aria-label="Choose your preferred language"
      defaultValue={locale}
      disabled={isPending}
      onChange={handleChange}
    >
      <NativeSelectOption value="id">Indonesian</NativeSelectOption>
      <NativeSelectOption value="en">English</NativeSelectOption>
    </NativeSelect>
  );
}
