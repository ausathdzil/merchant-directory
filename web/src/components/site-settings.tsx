'use client';

import { SettingsIcon } from 'lucide-react';
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
} from './ui/field';

export function SiteSettings() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  return isMobile ? (
    <Drawer onOpenChange={setOpen} open={open}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="secondary">
          <SettingsIcon />
          Settings
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Site Settings</DrawerTitle>
          <DrawerDescription>
            Configure site language, theme, and font.
          </DrawerDescription>
        </DrawerHeader>
        <SettingsForm className="px-4" />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <SettingsIcon />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Site Settings</DialogTitle>
          <DialogDescription>
            Configure site language, theme, and font.
          </DialogDescription>
        </DialogHeader>
        <SettingsForm />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SettingsForm({ ...props }: ComponentProps<typeof FieldGroup>) {
  const id = useId();

  return (
    <FieldGroup {...props}>
      <Field>
        <FieldLabel htmlFor={`${id}-language`}>Language</FieldLabel>
        <LocaleSelect id={`${id}-language`} />
        <FieldDescription>
          Choose your preferred language. This will reload the page.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${id}-theme`}>Color Theme</FieldLabel>
        <ThemeSelect id={`${id}-theme`} />
        <FieldDescription>
          Switch between light and dark appearances.
        </FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor={`${id}-font`}>Dyslexic Font</FieldLabel>
          <FieldDescription>
            Makes text easier to read for dyslexic users.
          </FieldDescription>
        </FieldContent>
        <FontSwitch id={`${id}-font`} />
      </Field>
    </FieldGroup>
  );
}
