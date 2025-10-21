'use server';

import z from 'zod';

import type { LoginBody, LoginError, LoginResponse } from '../types/auth';
import { API_URL } from '../utils';

const loginFormSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginFormState = {
  success: boolean;
  message: string;
  fields: {
    email: string;
    password: string;
  };
  errors?: {
    email?: string[];
    password?: string[];
  };
};

export async function login(_prevState: LoginFormState, formData: FormData) {
  const rawFormData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validatedFields = loginFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      success: false,
      message: '',
      fields: {
        email: rawFormData.email,
        password: rawFormData.password,
      },
      errors: {
        email: flattenedErrors.fieldErrors.email,
        password: flattenedErrors.fieldErrors.password,
      },
    };
  }

  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'password',
      username: rawFormData.email,
      password: rawFormData.password,
      scope: '',
    } satisfies LoginBody),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = (await res.json()) as LoginError | { detail?: unknown };

    let message = 'Failed to login';

    if (Array.isArray(error.detail)) {
      message = error.detail[0].msg;
    } else if (typeof error.detail === 'string') {
      message = error.detail;
    }

    return {
      success: false,
      message,
      fields: {
        email: rawFormData.email,
        password: rawFormData.password,
      },
    };
  }

  const _data = (await res.json()) as LoginResponse;

  return {
    success: true,
    message: 'Login success',
    fields: {
      email: '',
      password: '',
    },
  };
}
