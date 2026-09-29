import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";

type VaultAcceptOfferDialogCopy = {
  title: string;
  /** What accepting agrees to: the amount, the term and the rate. */
  lead: string;
  /** The total to repay. */
  total: string;
  /** What a late day costs. */
  lateDay: string;
  /** What will be signed at the visit. */
  signs: string;
  goBack: string;
  accept: string;
};

type VaultAcceptOfferDialogProps = {
  copy: VaultAcceptOfferDialogCopy;
  /** The caller's decision; the block forwards it and never opens itself. */
  open: boolean;
  /** The answer is on its way. */
  pending: boolean;
  /** Why the answer was refused, in the collector's words; null until it is. */
  refusal: string | null;
  onConfirm: () => void;
  onGoBack: () => void;
};

/**
 * Accepting an offer, confirmed: the total to repay, what a late day costs
 * and what will be signed, before the answer goes. Going back - the button,
 * Escape or the overlay - answers nothing. An answer in flight holds the
 * dialog open, and a refusal stays beside the terms it refused.
 */
function VaultAcceptOfferDialog({
  copy,
  open,
  pending,
  refusal,
  onConfirm,
  onGoBack,
}: VaultAcceptOfferDialogProps) {
  return (
    <Dialog
      onOpenChange={(next) => {
        if (!next && !pending) onGoBack();
      }}
      open={open}
    >
      <DialogContent>
        <DialogHeader showCloseButton={false}>
          <DialogTitle>{copy.title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>{copy.lead}</DialogDescription>
          <Text weight="medium">{copy.total}</Text>
          <Text>{copy.lateDay}</Text>
          <Text>{copy.signs}</Text>
        </DialogBody>
        {refusal === null ? null : (
          <Text role="alert" tone="error">
            {refusal}
          </Text>
        )}
        <DialogFooter>
          <Button
            disabled={pending}
            onClick={onGoBack}
            size="md"
            type="button"
            variant="outline"
          >
            {copy.goBack}
          </Button>
          <Button loading={pending} onClick={onConfirm} size="md" type="button">
            {copy.accept}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { VaultAcceptOfferDialogCopy, VaultAcceptOfferDialogProps };
export { VaultAcceptOfferDialog };
