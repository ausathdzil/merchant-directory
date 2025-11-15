// biome-ignore lint/performance/noNamespaceImport: Motion for React Server Components
import * as motion from 'motion/react-client';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { FeedbackForm } from '@/components/feedback-form';
import { Heading, Lead } from '@/components/typography';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/contact'>): Promise<Metadata> {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({
    locale,
    namespace: 'Metadata.ContactPage',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ContactPage({
  params,
}: PageProps<'/[locale]/contact'>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'ContactPage' });

  return (
    <main className="grid flex-1 place-items-center">
      <div className="flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 py-12 sm:px-8 md:gap-8 md:py-16">
        <motion.section
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Heading>{t('contact.heading')}</Heading>
          <Lead>{t('contact.description')}</Lead>
          <FeedbackForm />
        </motion.section>
      </div>
    </main>
  );
}
