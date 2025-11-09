'use client';

import { SettingsIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ComponentProps, useId, useState } from 'react';

import { useIsMobile } from '@/hooks/use-mobile';
import { FontSwitch } from './font-switch';
import { LocaleSelect } from './locale-select';
import { ThemeSelect } from './theme-select';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from './ui/field';

export function SiteSettings() {
  const t = useTranslations('SiteSettings');

  const [open, setOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('site-settings-open') === 'true';
    }
    return false;
  });

  const isMobile = useIsMobile();

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    sessionStorage.setItem('site-settings-open', String(value));
  };

  return isMobile ? (
    <Drawer onOpenChange={handleOpenChange} open={open}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="secondary">
          <SettingsIcon />
          {t('button')}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t('title')}</DrawerTitle>
          <DrawerDescription>{t('description')}</DrawerDescription>
        </DrawerHeader>
        <SettingsForm className="px-4" />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              {t('close')}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <SettingsIcon />
          {t('button')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <SettingsForm />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              {t('close')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SettingsForm({ ...props }: ComponentProps<typeof FieldGroup>) {
  const t = useTranslations('SiteSettings.fields');
  const id = useId();

  return (
    <FieldGroup {...props}>
      <Field>
        <FieldLabel htmlFor={`${id}-language`}>
          {t('language.label')}
        </FieldLabel>
        <LocaleSelect id={`${id}-language`} />
        <FieldDescription>{t('language.description')}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-theme`}>{t('theme.label')}</FieldLabel>
        <ThemeSelect id={`${id}-theme`} />
        <FieldDescription>{t('theme.description')}</FieldDescription>
      </Field>
      <FieldLabel htmlFor={`${id}-font`}>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{t('font.label')}</FieldTitle>
            <FieldDescription>{t('font.description')}</FieldDescription>
          </FieldContent>
          <FontSwitch id={`${id}-font`} />
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}
