'use server';

// biome-ignore lint/performance/noNamespaceImport: Zod just works better this way
import * as z from 'zod';
import type { CreateFeedbackBody, CreateFeedbackError } from './types/feedback';
import { API_URL } from './utils';

export const createFeedbackSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  message: z.string().min(1, { message: 'Message is required' }),
  rating: z
    .number()
    .min(1)
    .max(5, { message: 'Rating must be between 1 and 5' }),
}) satisfies z.ZodSchema<CreateFeedbackBody>;

export async function createFeedback(
  // biome-ignore lint/suspicious/noExplicitAny: action
  _prevState: any,
  formData: FormData
) {
  const rawFormData = Object.fromEntries(formData.entries());

  const validatedFormData = createFeedbackSchema.safeParse(rawFormData);

  if (!validatedFormData.success) {
    return {
      success: false,
      message:
        'Failed to create feedback, please check the form and try again.',
      errors: z.flattenError(validatedFormData.error).fieldErrors,
      fields: rawFormData,
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
