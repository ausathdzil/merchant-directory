'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { type ComponentProps, useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { routing } from '@/i18n/routing';
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
    const query = searchParams.toString();
    const target = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(target, {
        locale: e.target.value as (typeof routing.locales)[number],
      });
    });
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
