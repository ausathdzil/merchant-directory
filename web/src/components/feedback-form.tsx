'use client';

import { MessageCircleDashedIcon, StarIcon } from 'lucide-react';
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
    <form action={formAction} className="w-full max-w-lg self-center">
      <FieldGroup>
        <Field data-invalid={!!state.errors?.name}>
          <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
          <Input
            aria-invalid={!!state.errors?.name}
            defaultValue={state.fields.name}
            id={`${id}-name`}
            maxLength={50}
            minLength={1}
            name="name"
            placeholder="John Doe"
            required
          />
          {state.errors?.name && (
            <FieldError
              errors={state.errors.name.map((error) => ({ message: error }))}
            />
          )}
        </Field>
        <Field data-invalid={!!state.errors?.message}>
          <FieldLabel htmlFor={`${id}-message`}>Message</FieldLabel>
          <Textarea
            aria-invalid={!!state.errors?.message}
            defaultValue={state.fields.message}
            id={`${id}-message`}
            maxLength={255}
            minLength={1}
            name="message"
            placeholder="Write your message here…"
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
            Submit
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}

function RatingField({ state }: { state: CreateFeedbackFormState }) {
  const id = useId();

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState<string>(
    state.fields.rating > 0 ? state.fields.rating.toString() : ''
  );

  const displayRating =
    hoverRating ?? (currentRating ? Number.parseInt(currentRating, 10) : 0);

  return (
    <Field data-invalid={!!state.errors?.rating}>
      <FieldLabel className="leading-none" htmlFor={`${id}-rating-group`}>
        Rate your experience
      </FieldLabel>
      <RadioGroup
        aria-invalid={!!state.errors?.rating}
        className="inline-flex gap-0"
        id={`${id}-rating-group`}
        name="rating"
        onValueChange={setCurrentRating}
        // required
        value={currentRating}
      >
        {Array.from({ length: 5 }, (_, index) => index + 1).map((value) => {
          const radioId = `${id}-rating-${value}`;
          return (
            <label
              className="relative block cursor-pointer rounded p-0.5 outline-none has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50"
              htmlFor={radioId}
              key={value}
            >
              <RadioGroupItem
                aria-label={`${value} star${value === 1 ? '' : 's'}`}
                className="sr-only"
                id={radioId}
                value={value.toString()}
              />
              <span
                aria-hidden="true"
                className="block"
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(null)}
              >
                <StarIcon
                  className={cn(
                    'transition-all',
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
