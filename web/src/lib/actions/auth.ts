import { z } from 'zod';

import type {
  LoginBody,
  LoginError,
  LoginResponse,
  RegisterError,
} from '../types/auth';
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
    email: string[] | undefined;
    password: string[] | undefined;
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

const MAX_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 255;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 255;

const registerFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required.')
    .max(
      MAX_NAME_LENGTH,
      `Name must be less than ${MAX_NAME_LENGTH} characters long.`
    ),
  email: z
    .email()
    .min(1, 'Email is required.')
    .max(
      MAX_NAME_LENGTH,
      `Email must be less than ${MAX_EMAIL_LENGTH} characters long.`
    ),
  password: z
    .string()
    .min(
      MIN_PASSWORD_LENGTH,
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`
    )
    .max(
      MAX_PASSWORD_LENGTH,
      `Password must be less than ${MAX_PASSWORD_LENGTH} characters long.`
    ),
});

export type RegisterFormState = {
  success: boolean;
  message: string;
  fields: {
    name: string;
    email: string;
    password: string;
  };
  errors?: {
    name: string[] | undefined;
    email: string[] | undefined;
    password: string[] | undefined;
  };
};

export async function register(
  _prevState: RegisterFormState,
  formData: FormData
) {
  const rawFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const validatedFields = registerFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      success: false,
      message: '',
      fields: {
        name: rawFormData.name,
        email: rawFormData.email,
        password: rawFormData.password,
      },
      errors: {
        name: flattenedErrors.fieldErrors.name,
        email: flattenedErrors.fieldErrors.email,
        password: flattenedErrors.fieldErrors.password,
      },
    };
  }

  const { name, email, password } = validatedFields.data;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = (await res.json()) as RegisterError | { detail?: unknown };

    let message = 'Failed to register';

    if (Array.isArray(error.detail)) {
      message = error.detail[0].msg;
    } else if (typeof error.detail === 'string') {
      message = error.detail;
    }

    return {
      success: false,
      message,
      fields: {
        name: rawFormData.name,
        email: rawFormData.email,
        password: rawFormData.password,
      },
    };
  }

  const _data = (await res.json()) as LoginResponse;

  return {
    success: true,
    message: 'Register success',
    fields: {
      name: '',
      email: '',
      password: '',
    },
  };
}
