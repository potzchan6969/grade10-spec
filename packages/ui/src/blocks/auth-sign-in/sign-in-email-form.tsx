import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import type { FormEvent, ReactNode } from "react";

type SignInEmailFormProps = {
  /** Controlled by the consumer: the address outlives this step — the code
   * step shows it and the verify call sends it. */
  email: string;
  onEmailChange: (email: string) => void;
  emailLabel: ReactNode;
  error?: ReactNode;
  submitLabel: ReactNode;
  submitting?: boolean;
  onSubmit: () => void;
  /** Alternative path: email a one-time code instead. Omit the three and no
   * second button renders. */
  codeActionLabel?: ReactNode;
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
  emailLabel,
  error,
  submitLabel,
  submitting = false,
  onSubmit,
  codeActionLabel,
  requestingCode = false,
  onRequestCode,
}: SignInEmailFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form
      className="flex flex-col gap-4"
      data-slot="sign-in-email-form"
      onSubmit={handleSubmit}
    >
      <TextInput
        autoComplete="email"
        label={emailLabel}
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
        {submitLabel}
      </Button>
      {onRequestCode ? (
        <Button
          disabled={!email || submitting}
          loading={requestingCode}
          onClick={onRequestCode}
          type="button"
          variant="secondary"
        >
          {codeActionLabel}
        </Button>
      ) : null}
    </form>
  );
}

export type { SignInEmailFormProps };
export { SignInEmailForm };
