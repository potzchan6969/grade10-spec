import { Button } from "@grade10/design-system/components/forms/button";
import { OtpInput } from "@grade10/design-system/components/forms/otp-input";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { type FormEvent, type ReactNode, useState } from "react";
import type { AsyncAction } from "../shared/async";

type TwoFactorVerifyFormProps = {
  /**
   * `otp` is the six-slot authenticator code; `text` is a backup code, which
   * is neither six characters nor digits, so the slot row cannot serve it.
   */
  variant?: "otp" | "text";
  label: ReactNode;
  /** Where the code comes from — "From your authenticator app". */
  hint?: ReactNode;
  /** Slots in the `otp` variant, max length in `text`. */
  codeLength?: number;
  error?: ReactNode;
  pending?: boolean;
  submitLabel: ReactNode;
  onSubmit: (code: string) => void;
  /** Switches to the other kind of code. Omit it and no switch renders. */
  secondaryAction?: AsyncAction;
  className?: string;
};

/**
 * The code field both halves of two-factor end on — finishing enrollment and
 * proving a session. The code is a draft, so it lives here; what verifying
 * means, and what a wrong code says, stay with the consumer.
 *
 * `autoComplete="one-time-code"` and the numeric input mode are what let a
 * password manager fill the code it has just generated, and the `otp` variant
 * submits itself the moment the last slot fills so that fill needs no second
 * click. The button stays rendered for anyone arriving by keyboard.
 */
function TwoFactorVerifyForm({
  variant = "otp",
  label,
  hint,
  codeLength = 6,
  error,
  pending = false,
  submitLabel,
  onSubmit,
  secondaryAction,
  className,
}: TwoFactorVerifyFormProps) {
  const [code, setCode] = useState("");
  const [shownVariant, setShownVariant] = useState(variant);

  // Switching between an authenticator code and a backup code starts over:
  // half a code of the other kind is never worth keeping. Adjusted during
  // render rather than in an effect, so the empty field paints in the same
  // pass as the new variant instead of one frame behind it.
  if (shownVariant !== variant) {
    setShownVariant(variant);
    setCode("");
  }

  function submit(value: string) {
    const trimmed = value.trim();
    if (!trimmed || pending) return;
    onSubmit(trimmed);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit(code);
  }

  return (
    <form
      className={className ?? "flex flex-col gap-4"}
      data-slot="two-factor-verify-form"
      onSubmit={handleSubmit}
    >
      {variant === "otp" ? (
        <OtpInput
          autoComplete="one-time-code"
          inputMode="numeric"
          label={label}
          length={codeLength}
          message={error ?? hint ?? undefined}
          name="one-time-code"
          onChange={setCode}
          onComplete={submit}
          status={error ? "error" : "default"}
          value={code}
        />
      ) : (
        <TextInput
          autoComplete="one-time-code"
          label={label}
          message={error ?? hint ?? undefined}
          name="one-time-code"
          onChange={(event) => setCode(event.target.value)}
          required
          status={error ? "error" : "default"}
          value={code}
        />
      )}
      <Button disabled={!code.trim()} loading={pending} type="submit">
        {submitLabel}
      </Button>
      {secondaryAction ? (
        <Button
          onClick={secondaryAction.onAction}
          size="sm"
          type="button"
          variant="ghost"
        >
          {secondaryAction.label}
        </Button>
      ) : null}
    </form>
  );
}

export type { TwoFactorVerifyFormProps };
export { TwoFactorVerifyForm };
