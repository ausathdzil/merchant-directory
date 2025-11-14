'use client';

import { useTheme } from 'next-themes';
import type { ComponentProps } from 'react';

import { NativeSelect, NativeSelectOption } from './ui/native-select';

export function ThemeSelect(props: ComponentProps<typeof NativeSelect>) {
  const { theme, setTheme } = useTheme();

  return (
    <NativeSelect
      onChange={(e) => setTheme(e.target.value)}
      value={theme}
      {...props}
      name="theme"
    >
      <NativeSelectOption value="light">Light</NativeSelectOption>
      <NativeSelectOption value="dark">Dark</NativeSelectOption>
      <NativeSelectOption value="system">System</NativeSelectOption>
    </NativeSelect>
  );
}
