'use server';

// biome-ignore lint/performance/noNamespaceImport: Zod just works better this way
import * as z from 'zod';

import type { CreateFeedbackBody, CreateFeedbackError } from './types/feedback';
import { API_URL } from './utils';

const createFeedbackSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(50, { message: 'Name must be less than 50 characters' }),
  message: z
    .string()
    .min(1, { message: 'Message is required' })
    .max(255, { message: 'Message must be less than 255 characters' }),
  rating: z
    .number()
    .min(1, { message: 'Rating is required' })
    .max(5, { message: 'Rating must be between 1 and 5' }),
}) satisfies z.ZodSchema<CreateFeedbackBody>;

export type CreateFeedbackFormState = {
  success: boolean;
  message?: string;
  errors?: {
    name?: string[];
    message?: string[];
    rating?: string[];
  };
  fields: {
    name: string;
    message: string;
    rating: number;
  };
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Server action and validation logic
export async function createFeedback(
  _prevState: CreateFeedbackFormState,
  formData: FormData
) {
  const rawFormData = {
    name: formData.get('name') as string,
    message: formData.get('message') as string,
    rating: Number(formData.get('rating')),
  };

  const validatedFormData = createFeedbackSchema.safeParse(rawFormData);

  if (!validatedFormData.success) {
    const fieldErrors = z.flattenError(validatedFormData.error).fieldErrors;
    return {
      success: false,
      errors: fieldErrors,
      fields: {
        name: fieldErrors.name ? '' : rawFormData.name,
        message: fieldErrors.message ? '' : rawFormData.message,
        rating: fieldErrors.rating ? 0 : rawFormData.rating,
      },
    };
  }

  const { name, message, rating } = validatedFormData.data;

  const res = await fetch(`${API_URL}/feedbacks`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, message, rating }),
  });

  if (!res.ok) {
    let err = 'Failed to create feedback, please try again.';

    try {
      const data = (await res.json()) as
        | CreateFeedbackError
        | { detail?: unknown };

      if (Array.isArray(data.detail)) {
        err = data.detail[0]?.msg ?? err;
      } else if (typeof data.detail === 'string') {
        err = data.detail;
      }

      return {
        success: false,
        message: err,
        fields: rawFormData,
      };
    } catch (error) {
      err = error instanceof Error ? error.message : err;

      return {
        success: false,
        message: err,
        fields: rawFormData,
      };
    }
  }

  return {
    success: true,
    message: 'Thank you for your feedback!',
    fields: {
      name: '',
      message: '',
      rating: 0,
    },
  };
}
