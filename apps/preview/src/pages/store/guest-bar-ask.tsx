import { Button } from "@grade10/design-system/components/forms/button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { ReactNode } from "react";

/**
 * Part — the sign-in ask that stands where the guest checkout button was
 * when the cart's goods reach HKD 120,000. Keeps the footer's summary rows,
 * swaps checkout for the Sign In CTA, and carries the note under it. Drawn
 * for the Cart and Checkout features only; not a shared block.
 */
function GuestBarSignInAsk({
  subtotal,
  shippingEstimate,
  estimatedTotal,
  subtotalLabel,
  shippingLabel,
  estimatedTotalLabel,
  prompt,
  action,
  onSignIn,
}: {
  subtotal: ReactNode;
  shippingEstimate: ReactNode;
  estimatedTotal: ReactNode;
  /** e.g. "Subtotal". */
  subtotalLabel: string;
  /** e.g. "Shipping". */
  shippingLabel: string;
  /** e.g. "Estimated total". */
  estimatedTotalLabel: string;
  /** e.g. "To check out HK$120,000 or more, sign in to your account." — under the CTA. */
  prompt: string;
  /** e.g. "Sign In". */
  action: string;
  onSignIn?: () => void;
}) {
  return (
    <VStack
      gap="md"
      className="w-full shrink-0 border-t border-border p-6"
      data-slot="guest-bar-ask"
    >
      <VStack gap="none" className="w-full">
        <HStack
          gap="none"
          vAlign="center"
          className="w-full justify-between pb-2"
        >
          <span className="text-sm font-normal leading-5 text-foreground">
            {subtotalLabel}
          </span>
          <span className="text-sm font-normal leading-5 text-foreground">
            {subtotal}
          </span>
        </HStack>
        <HStack
          gap="none"
          vAlign="center"
          className="w-full justify-between pb-2"
        >
          <span className="text-sm font-normal leading-5 text-foreground">
            {shippingLabel}
          </span>
          <span className="text-sm font-normal leading-5 text-foreground">
            {shippingEstimate}
          </span>
        </HStack>
      </VStack>
      <HStack gap="none" vAlign="center" className="w-full justify-between">
        <span className="text-base font-semibold leading-6 text-foreground">
          {estimatedTotalLabel}
        </span>
        <span className="text-base font-semibold leading-6 text-foreground">
          {estimatedTotal}
        </span>
      </HStack>
      <VStack gap="sm" className="w-full">
        <Button size="lg" className="w-full" onClick={onSignIn}>
          {action}
        </Button>
        <p className="text-center text-sm font-normal leading-5 text-secondary-foreground">
          {prompt}
        </p>
      </VStack>
    </VStack>
  );
}

export { GuestBarSignInAsk };
