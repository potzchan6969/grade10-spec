import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { FormEvent, ReactNode } from "react";

/** The words the step says, whoever is signing in. */
type SignInEmailFormCopy = {
  email: string;
  submit: string;
  /** Names the alternative path — email a code instead. Omit it, and the
   * handler with it, and no second button renders. */
  codeAction?: string;
};

type SignInEmailFormProps = {
  copy: SignInEmailFormCopy;
  /** Controlled by the consumer: the address outlives this step — the code
   * step shows it and the verify call sends it. */
  email: string;
  onEmailChange: (email: string) => void;
  error?: ReactNode;
  submitting?: boolean;
  onSubmit: () => void;
  /** Alternative path: email a one-time code instead. */
  requestingCode?: boolean;
  onRequestCode?: () => void;
};

/**
 * The address step: one email field, a primary send action, and optionally a
 * second path that requests a code. What each action does — magic link,
 * password reset, anything — belongs to the consumer.
 */
function SignInEmailForm({
  email,
  onEmailChange,
  copy,
  error,
  submitting = false,
  onSubmit,
  requestingCode = false,
  onRequestCode,
}: SignInEmailFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form data-slot="sign-in-email-form" onSubmit={handleSubmit}>
      <VStack gap="md">
        <TextInput
          autoComplete="email"
          label={copy.email}
          message={error ?? undefined}
          onChange={(event) => onEmailChange(event.target.value)}
          required
          status={error ? "error" : "default"}
          type="email"
          value={email}
        />
        <Button
          disabled={!email || requestingCode}
          loading={submitting}
          type="submit"
        >
          {copy.submit}
        </Button>
        {onRequestCode ? (
          <Button
            disabled={!email || submitting}
            loading={requestingCode}
            onClick={onRequestCode}
            type="button"
            variant="secondary"
          >
            {copy.codeAction}
          </Button>
        ) : null}
      </VStack>
    </form>
  );
}

export type { SignInEmailFormCopy, SignInEmailFormProps };
export { SignInEmailForm };
