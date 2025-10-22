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
import { type RegisterFormState, register } from '@/lib/actions/auth';

const initialState: RegisterFormState = {
  success: false,
  message: '',
  fields: {
    name: '',
    email: '',
    password: '',
  },
};

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(register, initialState);
  const [showPassword, setShowPassword] = useState(false);

  const id = useId();

  return (
    <form action={action} className="flex flex-col gap-6">
      <FieldGroup>
        <FieldSet>
          <FieldLegend className="text-center font-alt text-xl!">
            Create your account
          </FieldLegend>
          <FieldDescription className="text-center">
            Fill in the form below to create your account
          </FieldDescription>
          <FieldGroup>
            <Field data-invalid={!!state.errors?.name}>
              <FieldLabel htmlFor={`${id}-name`}>Name</FieldLabel>
              <Input
                aria-invalid={!!state.errors?.name}
                defaultValue={state.fields.name}
                id={`${id}-name`}
                maxLength={255}
                name="name"
                placeholder="John Doe"
                required
                type="text"
              />
            </Field>
            <Field data-invalid={!!state.errors?.email}>
              <FieldLabel htmlFor={`${id}-email`}>Email</FieldLabel>
              <Input
                aria-invalid={!!state.errors?.email}
                defaultValue={state.fields.email}
                id={`${id}-email`}
                maxLength={255}
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
                  maxLength={255}
                  minLength={8}
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
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
              {state.errors?.password && (
                <FieldError>{state.errors.password[0]}</FieldError>
              )}
            </Field>
          </FieldGroup>
          <Field>
            <Button disabled={isPending} type="submit">
              {isPending ? <Spinner /> : 'Register'}
            </Button>
            {!state.success && (
              <FieldError className="text-center">{state.message}</FieldError>
            )}
            <FieldDescription className="text-center">
              Already have an account?{' '}
              <Link className="underline underline-offset-4" href="/login">
                Login
              </Link>
            </FieldDescription>
          </Field>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}
