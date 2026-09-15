import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";

/** The words the link-sent step says, after a successful send. */
type SignInLinkSentCopy = {
  /** Confirmation that names the address. The consumer interpolates the
   * email before passing — this step carries no catalog of its own. */
  message: ReactNode;
  /** Ready-state Resend label, e.g. "Resend". */
  resend: string;
  /** Cooldown label with seconds already interpolated, e.g. "Resend (45)".
   * Required whenever `resendCooldownRemaining` is greater than zero. */
  resendCountdown?: string;
  back: string;
};

type SignInLinkSentProps = {
  copy: SignInLinkSentCopy;
  onResend: () => void;
  onBack: () => void;
  /** While a resend request is in flight — the Resend control looks busy. */
  resending?: boolean;
  /** Whole seconds left in the post-send wait. Greater than zero disables
   * Resend and shows `copy.resendCountdown`. The consumer owns the clock —
   * this step does not tick. */
  resendCooldownRemaining?: number;
};

/**
 * The body after a successful sign-in-link send: confirmation that names the
 * address, Resend (with an optional cooldown), and Back to the entry step.
 * What those actions do belongs to the consumer — this step does not send
 * mail or own the flow.
 */
function SignInLinkSent({
  copy,
  onResend,
  onBack,
  resending = false,
  resendCooldownRemaining = 0,
}: SignInLinkSentProps) {
  const coolingDown = resendCooldownRemaining > 0;
  const resendLabel =
    coolingDown && copy.resendCountdown ? copy.resendCountdown : copy.resend;

  return (
    <VStack className="w-full gap-3" data-slot="sign-in-link-sent">
      <Text className="w-full text-center text-foreground" size="sm">
        {copy.message}
      </Text>
      <Button
        disabled={coolingDown}
        loading={resending}
        onClick={onResend}
        size="md"
        type="button"
      >
        {resendLabel}
      </Button>
      <Button onClick={onBack} size="md" type="button" variant="outline">
        {copy.back}
      </Button>
    </VStack>
  );
}

export type { SignInLinkSentCopy, SignInLinkSentProps };
export { SignInLinkSent };
