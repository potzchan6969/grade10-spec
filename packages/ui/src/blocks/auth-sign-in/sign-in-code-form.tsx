import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { FormEvent, ReactNode } from "react";

type SignInCodeFormProps = {
  /** Controlled by the consumer: the verify call needs the code. */
  code: string;
  onCodeChange: (code: string) => void;
  codeLabel: ReactNode;
  /** Where the code went — "Code sent to a@b.co". */
  hint?: ReactNode;
  codeLength?: number;
  error?: ReactNode;
  submitLabel: ReactNode;
  submitting?: boolean;
  onSubmit: () => void;
  /** Back to the previous step. Omit both and no back button renders. */
  backLabel?: ReactNode;
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
  codeLabel,
  hint,
  codeLength = 6,
  error,
  submitLabel,
  submitting = false,
  onSubmit,
  backLabel,
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
          label={codeLabel}
          maxLength={codeLength}
          message={error ?? undefined}
          onChange={(event) => onCodeChange(event.target.value)}
          required
          status={error ? "error" : "default"}
          value={code}
        />
        <Button disabled={!code} loading={submitting} type="submit">
          {submitLabel}
        </Button>
        {onBack ? (
          <Button onClick={onBack} type="button" variant="ghost">
            {backLabel}
          </Button>
        ) : null}
      </VStack>
    </form>
  );
}

export type { SignInCodeFormProps };
export { SignInCodeForm };
