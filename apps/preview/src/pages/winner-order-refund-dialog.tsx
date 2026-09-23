import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import type { OrderDetailsPaymentBrand } from "@grade10/ui";
import { OrderDetailsPaymentLogo, PaymentMethodCard } from "@grade10/ui";
import { Bank } from "@phosphor-icons/react";

/** Card refund destination — same marks as Store Order Details payment row. */
export type WinnerOrderRefundCardTransfer = {
  kind: "card";
  brand: OrderDetailsPaymentBrand;
  maskedNumber: string;
};

/** Bank refund destination — masked destination with free-text bank name. */
export type WinnerOrderRefundBankTransfer = {
  kind: "bank_transfer";
  bankName: string;
  /** Masked destination — e.g. `···· 8891`. */
  maskedAccount: string;
  /**
   * Provider reference the operator entered — shown so the winner can match
   * the credit on their statement (Q21). Card refunds omit this.
   */
  reference: string;
};

export type WinnerOrderRefundTransfer =
  | WinnerOrderRefundCardTransfer
  | WinnerOrderRefundBankTransfer;

export type WinnerOrderRefundDetails = {
  /** Positive amount returned — e.g. `HK$16,140`. */
  amount: string;
  /** Reason category the operator recorded. */
  reason: string;
  /**
   * Optional operator note. Omitted from the dialog when empty (Q28).
   */
  note?: string;
  /** Where the money went — card marks or bank name + masked account. */
  transfer: WinnerOrderRefundTransfer;
};

type WinnerOrderRefundDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refund: WinnerOrderRefundDetails;
};

/**
 * Winner-facing refund detail — amount, Transfer to, reason and optional note.
 * A bank refund also shows its provider reference. Note is hidden when the
 * operator left none. Proof, Stripe reference and audit number stay with the
 * operator.
 */
function WinnerOrderRefundDialog({
  open,
  onOpenChange,
  refund,
}: WinnerOrderRefundDialogProps) {
  const bankReference =
    refund.transfer.kind === "bank_transfer" ? refund.transfer.reference : null;
  const note = refund.note?.trim() ? refund.note : null;

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refund Details</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack className="w-full" gap="md" hAlign="stretch">
            <DetailRow label="Amount" value={refund.amount} />
            <TransferTo transfer={refund.transfer} />
            {bankReference ? (
              <DetailRow label="Reference" value={bankReference} />
            ) : null}
            <DetailRow label="Reason" value={refund.reason} />
            {note ? <DetailRow label="Note" value={note} /> : null}
          </VStack>
        </DialogBody>
        <DialogFooter>
          <DialogClose
            render={<Button size="md" variant="outline" />}
            type="button"
          >
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <VStack className="w-full" gap="xs" hAlign="stretch">
      <Text className="text-secondary-foreground" size="sm">
        {label}
      </Text>
      <Text className="whitespace-pre-line text-foreground" size="sm">
        {value}
      </Text>
    </VStack>
  );
}

function TransferTo({ transfer }: { transfer: WinnerOrderRefundTransfer }) {
  return (
    <VStack className="w-full" gap="xs" hAlign="stretch">
      <Text className="text-secondary-foreground" size="sm">
        Transfer to
      </Text>
      {transfer.kind === "card" ? (
        <PaymentMethodCard
          label={transfer.maskedNumber}
          leading={<OrderDetailsPaymentLogo brand={transfer.brand} />}
        />
      ) : (
        <PaymentMethodCard
          description={transfer.bankName}
          label={transfer.maskedAccount}
          leading={<Bank aria-label="Bank" size={20} weight="regular" />}
        />
      )}
    </VStack>
  );
}

export type { WinnerOrderRefundDialogProps };
export { WinnerOrderRefundDialog };
