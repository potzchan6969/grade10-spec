import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { FormEvent, ReactNode } from "react";

/** The words the step says, whoever is signing in. */
type SignInCodeFormCopy = {
  code: string;
  submit: string;
  /** Names the way back to the previous step. Omit it, and the handler with
   * it, and no back button renders. */
  back?: string;
};

type SignInCodeFormProps = {
  copy: SignInCodeFormCopy;
  /** Controlled by the consumer: the verify call needs the code. */
  code: string;
  onCodeChange: (code: string) => void;
  /** Where the code went — "Code sent to a@b.co". */
  hint?: ReactNode;
  codeLength?: number;
  error?: ReactNode;
  submitting?: boolean;
  onSubmit: () => void;
  /** Back to the previous step. */
  onBack?: () => void;
};

/**
 * The verification step: where the code went, the code field, verify, and the
 * way back. Verification itself — and what a wrong code says — stays with the
 * consumer.
 */
function SignInCodeForm({
  code,
  onCodeChange,
  copy,
  hint,
  codeLength = 6,
  error,
  submitting = false,
  onSubmit,
  onBack,
}: SignInCodeFormProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form data-slot="sign-in-code-form" onSubmit={handleSubmit}>
      <VStack gap="md">
        {hint ? (
          <Text size="sm" tone="secondary">
            {hint}
          </Text>
        ) : null}
        <TextInput
          autoComplete="one-time-code"
          inputMode="numeric"
          label={copy.code}
          maxLength={codeLength}
          message={error ?? undefined}
          onChange={(event) => onCodeChange(event.target.value)}
          required
          status={error ? "error" : "default"}
          value={code}
        />
        <Button disabled={!code} loading={submitting} type="submit">
          {copy.submit}
        </Button>
        {onBack ? (
          <Button onClick={onBack} type="button" variant="ghost">
            {copy.back}
          </Button>
        ) : null}
      </VStack>
    </form>
  );
}

export type { SignInCodeFormCopy, SignInCodeFormProps };
export { SignInCodeForm };
