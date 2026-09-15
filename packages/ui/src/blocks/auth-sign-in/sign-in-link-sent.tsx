import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";

/** The words the link-sent step says, after a successful send. */
type SignInLinkSentCopy = {
  /** Lead line without the address, e.g. "We've just sent a sign-in link to".
   * The address is a separate prop and draws on the next line. */
  message: string;
  /** Ready-state Resend label, e.g. "Resend". */
  resend: string;
  /** Cooldown label with seconds already interpolated, e.g. "Resend (45)".
   * Required whenever `resendCooldownRemaining` is greater than zero. */
  resendCountdown?: string;
};

type SignInLinkSentProps = {
  copy: SignInLinkSentCopy;
  /** Address the link was sent to — drawn on its own line under `copy.message`. */
  email: string;
  onResend: () => void;
  /** While a resend request is in flight — the Resend control looks busy. */
  resending?: boolean;
  /** Whole seconds left in the post-send wait. Greater than zero disables
   * Resend and shows `copy.resendCountdown`. The consumer owns the clock —
   * this step does not tick. */
  resendCooldownRemaining?: number;
};

/**
 * The body after a successful sign-in-link send: confirmation with the
 * address on its own line, and a hugging secondary Resend (optional
 * cooldown). Dismissal of the dialog is the way back to the page beneath —
 * this step has no Back control. What Resend does belongs to the consumer.
 */
function SignInLinkSent({
  copy,
  email,
  onResend,
  resending = false,
  resendCooldownRemaining = 0,
}: SignInLinkSentProps) {
  const coolingDown = resendCooldownRemaining > 0;
  const resendLabel =
    coolingDown && copy.resendCountdown ? copy.resendCountdown : copy.resend;

  return (
    <VStack className="w-full gap-3" data-slot="sign-in-link-sent">
      <VStack className="w-full gap-1">
        <Text className="w-full text-center text-foreground" size="sm">
          {copy.message}
        </Text>
        <Text
          className="w-full break-all text-center text-foreground"
          data-slot="sign-in-link-sent-email"
          size="sm"
        >
          {email}
        </Text>
      </VStack>
      <Button
        className="w-fit self-center"
        disabled={coolingDown}
        loading={resending}
        onClick={onResend}
        size="md"
        type="button"
        variant="secondary"
      >
        {resendLabel}
      </Button>
    </VStack>
  );
}

export type { SignInLinkSentCopy, SignInLinkSentProps };
export { SignInLinkSent };
