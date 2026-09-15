import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";

/** The words the link-sent step says, after a successful send. */
type SignInLinkSentCopy = {
  /** Confirmation that names the address. The consumer interpolates the
   * email before passing — this step carries no catalog of its own. */
  message: ReactNode;
  resend: string;
  back: string;
};

type SignInLinkSentProps = {
  copy: SignInLinkSentCopy;
  onResend: () => void;
  onBack: () => void;
  /** While a resend request is in flight — the Resend control looks busy. */
  resending?: boolean;
};

/**
 * The body after a successful sign-in-link send: confirmation that names the
 * address, Resend, and Back to the entry step. What those actions do belongs
 * to the consumer — this step does not send mail or own the flow.
 */
function SignInLinkSent({
  copy,
  onResend,
  onBack,
  resending = false,
}: SignInLinkSentProps) {
  return (
    <VStack className="w-full gap-3" data-slot="sign-in-link-sent">
      <Text className="w-full text-center text-foreground" size="sm">
        {copy.message}
      </Text>
      <Button loading={resending} onClick={onResend} size="md" type="button">
        {copy.resend}
      </Button>
      <Button onClick={onBack} size="md" type="button" variant="outline">
        {copy.back}
      </Button>
    </VStack>
  );
}

export type { SignInLinkSentCopy, SignInLinkSentProps };
export { SignInLinkSent };
