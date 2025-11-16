'use client';

import { MessageCircleDashedIcon, StarIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useId, useState } from 'react';
import { toast } from 'sonner';

import { type CreateFeedbackFormState, createFeedback } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Spinner } from './ui/spinner';
import { Textarea } from './ui/textarea';

const initialState: CreateFeedbackFormState = {
  success: false,
  fields: {
    name: '',
    message: '',
    rating: 0,
  },
};

export function FeedbackForm() {
  const id = useId();
  const t = useTranslations('ContactPage.form');
  const [state, formAction, isPending] = useActionState(
    createFeedback,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form action={formAction} className="mt-4 w-full max-w-lg self-center">
      <FieldGroup>
        <Field data-invalid={!!state.errors?.name}>
          <FieldLabel htmlFor={`${id}-name`}>{t('name.label')}</FieldLabel>
          <Input
            aria-invalid={!!state.errors?.name}
            defaultValue={state.fields.name}
            id={`${id}-name`}
            maxLength={50}
            minLength={1}
            name="name"
            placeholder={t('name.placeholder')}
            required
          />
          {state.errors?.name && (
            <FieldError
              errors={state.errors.name.map((error) => ({ message: error }))}
            />
          )}
        </Field>
        <Field data-invalid={!!state.errors?.message}>
          <FieldLabel htmlFor={`${id}-message`}>
            {t('message.label')}
          </FieldLabel>
          <Textarea
            aria-invalid={!!state.errors?.message}
            defaultValue={state.fields.message}
            id={`${id}-message`}
            maxLength={255}
            minLength={1}
            name="message"
            placeholder={t('message.placeholder')}
            required
          />
          {state.errors?.message && (
            <FieldError
              errors={state.errors.message.map((error) => ({ message: error }))}
            />
          )}
        </Field>
        <RatingField state={state} />
        <Field className="justify-end" orientation="horizontal">
          <Button
            aria-invalid={!!state.errors}
            disabled={isPending}
            type="submit"
          >
            {isPending ? <Spinner /> : <MessageCircleDashedIcon />}
            {t('submit')}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

function RatingField({ state }: { state: CreateFeedbackFormState }) {
  const id = useId();
  const t = useTranslations('ContactPage.form');

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState<string>(
    state.fields.rating > 0 ? state.fields.rating.toString() : ''
  );

  const displayRating =
    hoverRating ?? (currentRating ? Number.parseInt(currentRating, 10) : 0);

  return (
    <Field data-invalid={!!state.errors?.rating}>
      <FieldLabel className="leading-none" htmlFor={`${id}-rating-group`}>
        {t('rating.label')}
      </FieldLabel>
      <RadioGroup
        aria-invalid={!!state.errors?.rating}
        className="inline-flex gap-0"
        id={`${id}-rating-group`}
        name="rating"
        onValueChange={setCurrentRating}
        required
        value={currentRating}
      >
        {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => {
          const radioId = `${id}-rating-${value}`;
          const starLabel =
            value === 1
              ? t('stars.one')
              : t('stars.other', { count: value.toString() });
          return (
            // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Label is interactive per HTML spec
            <label
              className="relative block cursor-pointer rounded p-0.5 outline-none has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
              htmlFor={radioId}
              key={value}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(null)}
            >
              <RadioGroupItem
                aria-label={starLabel}
                className="sr-only"
                id={radioId}
                value={value.toString()}
              />
              <span aria-hidden="true" className="block">
                <StarIcon
                  className={cn(
                    displayRating >= value
                      ? 'fill-amber-500 stroke-amber-500'
                      : 'text-input'
                  )}
                  data-invalid={!!state.errors?.rating}
                  size={32}
                />
              </span>
            </label>
          );
        })}
      </RadioGroup>
      {state.errors?.rating && (
        <FieldError
          errors={state.errors.rating.map((error) => ({ message: error }))}
        />
      )}
    </Field>
  );
}
