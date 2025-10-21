'use client';

import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useActionState, useId, useState } from 'react';

import { Text } from '@/components/typography';
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
    <form action={action} className="w-full max-w-md">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Login</FieldLegend>
          <FieldDescription>Login to your account.</FieldDescription>
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
        </FieldSet>
        <Field>
          <Button disabled={isPending} type="submit">
            {isPending ? <Spinner /> : 'Submit'}
          </Button>
          {!state.success && (
            <Text className="text-destructive">{state.message}</Text>
          )}
        </Field>
      </FieldGroup>
    </form>
  );
}
