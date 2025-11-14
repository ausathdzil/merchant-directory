'use client';

import { type ComponentProps, useEffect, useState } from 'react';
import { Switch } from './ui/switch';

export function FontSwitch(props: ComponentProps<typeof Switch>) {
  const [font, setFont] = useState<'default' | 'open-dyslexic'>('default');

  useEffect(() => {
    const savedFont = localStorage.getItem('font');
    const currentFont =
      savedFont === 'open-dyslexic' ? 'open-dyslexic' : 'default';
    setFont(currentFont);

    if (currentFont === 'open-dyslexic') {
      document.documentElement.setAttribute('data-font', 'open-dyslexic');
    } else {
      document.documentElement.removeAttribute('data-font');
    }
  }, []);

  const toggleFont = () => {
    const newFont = font === 'open-dyslexic' ? 'default' : 'open-dyslexic';

    if (newFont === 'open-dyslexic') {
      localStorage.setItem('font', 'open-dyslexic');
      document.documentElement.setAttribute('data-font', 'open-dyslexic');
    } else {
      localStorage.removeItem('font');
      document.documentElement.removeAttribute('data-font');
    }

    setFont(newFont);
  };

  return (
    <Switch
      checked={font === 'open-dyslexic'}
      onCheckedChange={toggleFont}
      {...props}
    />
  );
}
