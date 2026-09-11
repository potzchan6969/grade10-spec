import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { FormEvent, ReactNode } from "react";

/** The words the step says, whoever is signing in. */
type SignInEmailFormCopy = {
  /** Names the field. Figma draws no label above it, so this is the field's
   * accessible name rather than visible text — the placeholder is what a
   * sighted collector reads. */
  email: string;
  /** What the empty field says. Omit it and the field shows nothing. */
  emailPlaceholder?: string;
  submit: string;
};

type SignInEmailFormProps = {
  copy: SignInEmailFormCopy;
  /** Controlled by the consumer: the address outlives this step — what the
   * send action reports it to belongs to the flow, not to the field. */
  email: string;
  onEmailChange: (email: string) => void;
  error?: ReactNode;
  submitting?: boolean;
  onSubmit: () => void;
};

/**
 * The address step: one email field and one send action. What that action
 * does — magic link, password reset, anything — belongs to the consumer.
 *
 * The field carries no visible label, which is what Figma's `email-section`
 * (4666:1475) draws: a placeholder and nothing above it. `copy.email` stays
 * the accessible name, so the control is still named for a screen reader.
 */
function SignInEmailForm({
  email,
  onEmailChange,
  copy,
  error,
  submitting = false,
  onSubmit,
}: SignInEmailFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form data-slot="sign-in-email-form" onSubmit={handleSubmit}>
      {/* 12 is Figma's `email-section` gap and not a rung on the primitive,
          so the utility overrides it rather than the prop. */}
      <VStack className="gap-3">
        <TextInput
          aria-label={copy.email}
          autoComplete="email"
          message={error ?? undefined}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder={copy.emailPlaceholder}
          required
          status={error ? "error" : "default"}
          type="email"
          value={email}
        />
        <Button disabled={!email} loading={submitting} type="submit">
          {copy.submit}
        </Button>
      </VStack>
    </form>
  );
}

export type { SignInEmailFormCopy, SignInEmailFormProps };
export { SignInEmailForm };
