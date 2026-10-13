import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";

/**
 * Part — the sign-in ask that stands where the guest checkout button was
 * when the cart's goods reach HKD 120,000. Drawn for the Cart and Checkout
 * features only; not a shared block.
 */
function GuestBarSignInAsk({
  prompt,
  action,
  onSignIn,
}: {
  /** e.g. "To check out HK$120,000 or more, sign in to your account." */
  prompt: string;
  /** e.g. "Sign in". */
  action: string;
  onSignIn?: () => void;
}) {
  return (
    <VStack
      gap="md"
      className="w-full shrink-0 border-t border-border p-6"
      data-slot="guest-bar-ask"
    >
      <p className="text-sm font-normal leading-5 text-secondary-foreground">
        {prompt}
      </p>
      <Button size="lg" className="w-full" onClick={onSignIn}>
        {action}
      </Button>
    </VStack>
  );
}

export { GuestBarSignInAsk };
