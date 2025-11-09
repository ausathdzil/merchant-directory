'use client';

import { SearchIcon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Form from 'next/form';
import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';

import { useIsMac } from '@/hooks/use-mac';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from '@/i18n/navigation';
import { Button, buttonVariants } from './ui/button';
import { Field, FieldDescription } from './ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './ui/input-group';
import { Kbd, KbdGroup } from './ui/kbd';

export function ExploreButton() {
  const t = useTranslations('HomePage.hero');
  const isMobile = useIsMobile();

  return isMobile ? (
    <motion.div
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Link className={buttonVariants({ size: 'pill-lg' })} href="/explore">
        <SearchIcon />
        {t('button')}
      </Link>
    </motion.div>
  ) : (
    <AnimatedSearch />
  );
}

function AnimatedSearch() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const t = useTranslations('HomePage.hero');
  const isMac = useIsMac();

  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k' && !isExpanded) {
        e.preventDefault();
        setIsExpanded(true);
      }

      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () =>
      document.removeEventListener('keydown', handleKeyboardShortcut);
  }, [isExpanded]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      animate={{
        width: isExpanded ? 400 : 'auto',
        maxWidth: isExpanded ? '80vw' : '100vw',
      }}
      className="relative flex h-16 items-start justify-center"
      layout
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
        mass: 0.8,
      }}
    >
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            key="input-group"
            onAnimationComplete={() => {
              setTimeout(() => inputRef.current?.focus(), 50);
            }}
            transition={{
              duration: 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Form action="/explore">
              <Field>
                <InputGroup>
                  <label aria-hidden htmlFor={id}>
                    <InputGroupAddon>
                      <SearchIcon />
                    </InputGroupAddon>
                  </label>
                  <InputGroupInput
                    aria-label="Search"
                    autoCapitalize="off"
                    autoComplete="off"
                    id={id}
                    name="search"
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={t('search.placeholder')}
                    ref={inputRef}
                    spellCheck={false}
                    type="search"
                    value={value}
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      disabled={!value.trim()}
                      size="xs"
                      type="submit"
                      variant="secondary"
                    >
                      {t('search.search')}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
                {value.trim() && (
                  <FieldDescription className="hidden text-center md:block">
                    {t('search.press')} <Kbd>Enter</Kbd> {t('search.toSearch')}{' '}
                    <Kbd>Esc</Kbd> {t('search.toClose')}
                  </FieldDescription>
                )}
              </Field>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            key="button"
            transition={{
              duration: 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{
              scale: 1.1,
              transition: {
                duration: 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              },
            }}
          >
            <Button onClick={handleToggle} size="pill-lg" variant="default">
              <SearchIcon />
              {t('button')}
              <KbdGroup>
                <Kbd className="bg-blue-500/50 text-primary-foreground">
                  {isMac ? '⌘' : 'Ctrl'}
                </Kbd>
                <Kbd className="bg-blue-500/50 text-primary-foreground">K</Kbd>
              </KbdGroup>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
