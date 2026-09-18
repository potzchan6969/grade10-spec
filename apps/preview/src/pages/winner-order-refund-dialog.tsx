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

export type WinnerOrderRefundDetails = {
  /** Positive amount returned — e.g. `HK$15,660`. */
  amount: string;
  /** Reason category the operator recorded. */
  reason: string;
  /** Operator note the winner may read. */
  note: string;
  /** How the money went back — ❓ working channel label until Product settles winner-facing transaction clues (Q20). */
  method: string;
};

type WinnerOrderRefundDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refund: WinnerOrderRefundDetails;
};

/**
 * Winner-facing refund detail — reason, note and method only.
 * Proof, provider reference and audit number stay with the operator.
 */
function WinnerOrderRefundDialog({
  open,
  onOpenChange,
  refund,
}: WinnerOrderRefundDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Refund Details</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack className="w-full" gap="md" hAlign="stretch">
            <DetailRow label="Amount" value={refund.amount} />
            <DetailRow label="Reason" value={refund.reason} />
            <DetailRow label="Note" value={refund.note} />
            <DetailRow label="Refund Method" value={refund.method} />
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

export type { WinnerOrderRefundDialogProps };
export { WinnerOrderRefundDialog };
