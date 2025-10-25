'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Spinner } from '@/components/ui/spinner';
import { type LoginFormState, login } from '@/lib/actions/auth';

const initialState: LoginFormState = {
  success: false,
  message: '',
  fields: {
    email: '',
    password: '',
  },
};

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  const id = useId();

  return (
    <form action={action} className="flex flex-col gap-6">
      <FieldSet>
        <FieldLegend className="text-center font-alt text-xl!">
          Login
        </FieldLegend>
        <FieldDescription className="text-center">
          Enter your email below to login to your account
        </FieldDescription>
        <FieldGroup>
          <Field data-invalid={!!state.errors?.email}>
            <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
            <Input
              aria-invalid={!!state.errors?.email}
              defaultValue={state.fields.email}
              id={`${id}-email`}
              name="email"
              placeholder="m@example.com"
              required
              type="email"
            />
            {state.errors?.email && (
              <FieldError>{state.errors.email[0]}</FieldError>
            )}
          </Field>
          <Field data-invalid={!!state.errors?.password}>
            <FieldLabel htmlFor={`${id}-password`}>Password</FieldLabel>
            <InputGroup>
              <InputGroupInput
                aria-invalid={!!state.errors?.password}
                autoComplete="off"
                defaultValue={state.fields.password}
                id={`${id}-password`}
                name="password"
                required
                type={showPassword ? 'text' : 'password'}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  onClick={() => setShowPassword(!showPassword)}
                  size="icon-xs"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {state.errors?.password && (
              <FieldError>{state.errors.password[0]}</FieldError>
            )}
          </Field>
        </FieldGroup>
        <Field>
          <Button disabled={isPending} type="submit">
            {isPending ? <Spinner /> : 'Login'}
          </Button>
          {!state.success && (
            <FieldError className="text-center">{state.message}</FieldError>
          )}
          <FieldDescription className="text-center">
            Don&apos;t have an account?{' '}
            <Link className="underline underline-offset-4" href="/register">
              Register
            </Link>
          </FieldDescription>
        </Field>
      </FieldSet>
    </form>
  );
}
