import { Card } from "@grade10/design-system/components/display/card";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import type { PaymentAuthorizationResponseState } from "@grade10/test/bid-panel-states";
import { formatMoney } from "@grade10/ui";
import { type ReactNode, useState } from "react";
import { BID_FIXTURE_LOT } from "./listing-auction-bid-fixtures";
import { ListingBidEnrollmentCardPreview } from "./listing-bid-enrollment-card-preview";
import { ENROLLMENT_SNAPSHOT_READY } from "./listing-bid-enrollment-snapshots";

type PaymentMethodState = "method" | PaymentAuthorizationResponseState;

function PaymentMethodDialog({
  state,
  onClose,
  onAuthorize,
}: {
  state: PaymentMethodState;
  onClose: () => void;
  onAuthorize: () => void;
}) {
  const amountLabel = formatMoney(
    BID_FIXTURE_LOT.currentBidMinor,
    BID_FIXTURE_LOT.currency,
    { locale: "en-HK" },
  );
  const content: Record<
    PaymentMethodState,
    { description: string; footer: ReactNode; refusal?: string }
  > = {
    method: {
      description:
        "Choose a payment method to authorize your maximum bid. Your card details stay with Stripe.",
      footer: (
        <Button onClick={onAuthorize} size="md">
          Authorize {amountLabel}
        </Button>
      ),
    },
    pending: {
      description:
        "Your payment method is being authorized. Keep this dialog open while Stripe completes the request.",
      footer: (
        <Button disabled size="md">
          Authorizing payment method
        </Button>
      ),
    },
    refused: {
      description:
        "Choose another payment method to authorize your maximum bid.",
      refusal: "Your payment method was declined. No bid has been placed.",
      footer: (
        <Button onClick={onAuthorize} size="md">
          Try another method
        </Button>
      ),
    },
  };
  const current = content[state];

  return (
    <Dialog onOpenChange={(open) => !open && onClose()} open>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Authorize your bid</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack gap="md">
            <DialogDescription>{current.description}</DialogDescription>
            <Card className="p-4">
              <Text size="sm" weight="medium">
                Secure payment field
              </Text>
              <Text size="sm" tone="secondary">
                Stripe securely collects your payment details here.
              </Text>
            </Card>
          </VStack>
        </DialogBody>
        {current.refusal ? <Text role="alert">{current.refusal}</Text> : null}
        <DialogFooter>{current.footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PaymentAuthorizationPreview() {
  const [dialogState, setDialogState] = useState<PaymentMethodState | null>(
    null,
  );

  return (
    <>
      <ListingBidEnrollmentCardPreview
        onBidSubmit={() => setDialogState("method")}
        onChangePayment={() => undefined}
        onLinkPayment={() => undefined}
        snapshot={ENROLLMENT_SNAPSHOT_READY}
      />
      {dialogState ? (
        <PaymentMethodDialog
          onAuthorize={() => setDialogState("pending")}
          onClose={() => setDialogState(null)}
          state={dialogState}
        />
      ) : null}
    </>
  );
}

function PaymentAuthorizationDialogPreview({
  state,
}: {
  state: Exclude<PaymentMethodState, "method">;
}) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <PaymentMethodDialog
      onAuthorize={() => undefined}
      onClose={() => setOpen(false)}
      state={state}
    />
  );
}

export {
  PaymentAuthorizationDialogPreview,
  PaymentAuthorizationPreview,
  type PaymentMethodState,
};
