import { Alert } from "@grade10/design-system/components/display/alert";
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
  DialogSubtext,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import type { ReactNode } from "react";
import { WINNER_ORDER_BANK_DETAILS } from "./winner-order-bank-details";
import type { WinnerOrderBankRail } from "./winner-order-setup-dialog";

const REFERENCE_WARNING =
  "Enter this reference in your bank app’s Memo or Remarks field. Missing it delays verification." as const;

const OUR_NOTE =
  "In your bank app, choose OUR for transfer fees so we receive the full order total." as const;

type WinnerOrderHowToPayDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amountDue?: string;
  /** Collector-facing invoice ID — shown as DialogSubtext. */
  invoiceId?: string;
  transferReference?: string;
  /** The single bank rail selected for this invoice. */
  paymentRail: WinnerOrderBankRail;
};

/**
 * Preview-only: View Bank Details after Order summary secondary control.
 * Not a published `@grade10/ui` export. Sample values are Grade10 / HSBC Hong
 * Kong until Finance confirms live accounts.
 */
function WinnerOrderHowToPayDialog({
  open,
  onOpenChange,
  amountDue = WINNER_ORDER_BANK_DETAILS.totalAmountDue,
  invoiceId,
  transferReference = WINNER_ORDER_BANK_DETAILS.transferReference,
  paymentRail,
}: WinnerOrderHowToPayDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className="flex max-h-[min(640px,calc(100dvh-2rem))] max-w-xl min-h-0 flex-col gap-4 overflow-hidden"
        showCloseButton={false}
      >
        <DialogHeader showCloseButton={false}>
          <DialogTitle>View Bank Details</DialogTitle>
          {invoiceId ? (
            <DialogSubtext>Invoice: {invoiceId}</DialogSubtext>
          ) : null}
        </DialogHeader>
        <DialogBody
          className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto"
          tabIndex={0}
        >
          <div className="flex w-full shrink-0 flex-col gap-1">
            <span className="text-sm leading-5 text-secondary-foreground">
              Amount due
            </span>
            <span className="text-xl leading-6 font-semibold tracking-tight text-foreground tabular-nums">
              {amountDue}
            </span>
          </div>

          <div className="min-h-0 w-full flex-1">
            {paymentRail === "fps" ? (
              <RailPanel>
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">
                  <VStack
                    className="w-full shrink-0 items-center justify-center sm:w-auto"
                    gap="sm"
                  >
                    <FpsQrPlaceholder />
                    <Text
                      className="text-center text-secondary-foreground sm:max-w-36"
                      size="sm"
                    >
                      Open your banking app and scan this QR
                    </Text>
                  </VStack>
                  <VStack
                    className="min-w-0 flex-1 border-t border-border pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-5"
                    gap="sm"
                    hAlign="stretch"
                  >
                    <DetailRow
                      label="FPS ID"
                      value={WINNER_ORDER_BANK_DETAILS.fpsId}
                    />
                    <DetailRow
                      label="Account name"
                      value={WINNER_ORDER_BANK_DETAILS.beneficiaryName}
                    />
                    <PaymentReferenceBand value={transferReference} />
                  </VStack>
                </div>
              </RailPanel>
            ) : null}
            {paymentRail === "hk_local" ? (
              <RailPanel>
                <DetailList>
                  <DetailRow
                    label="Bank name"
                    value={WINNER_ORDER_BANK_DETAILS.bankName}
                  />
                  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                    <DetailRow
                      label="Bank code"
                      value={WINNER_ORDER_BANK_DETAILS.bankCode}
                    />
                    <DetailRow
                      label="Branch code"
                      value={WINNER_ORDER_BANK_DETAILS.branchCode}
                    />
                  </div>
                  <DetailRow
                    label="Account number"
                    value={WINNER_ORDER_BANK_DETAILS.accountNumber}
                  />
                  <PaymentReferenceBand value={transferReference} />
                </DetailList>
              </RailPanel>
            ) : null}
            {paymentRail === "swift" ? (
              <RailPanel>
                <DetailList>
                  <DetailRow
                    label="Beneficiary name"
                    value={WINNER_ORDER_BANK_DETAILS.beneficiaryName}
                  />
                  <DetailRow
                    label="Beneficiary address"
                    value={WINNER_ORDER_BANK_DETAILS.beneficiaryAddress}
                  />
                  <DetailRow
                    label="Bank name"
                    value={WINNER_ORDER_BANK_DETAILS.bankName}
                  />
                  <DetailRow
                    label="Bank address"
                    value={WINNER_ORDER_BANK_DETAILS.bankAddress}
                  />
                  <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
                    <DetailRow
                      label="SWIFT / BIC"
                      value={WINNER_ORDER_BANK_DETAILS.swiftCode}
                    />
                    <DetailRow
                      label="Account number / IBAN"
                      value={WINNER_ORDER_BANK_DETAILS.accountNumber}
                    />
                  </div>
                  <PaymentReferenceBand value={transferReference} />
                  <Alert
                    dismissible={false}
                    layout="inline"
                    status="warning"
                    title={OUR_NOTE}
                  />
                </DetailList>
              </RailPanel>
            ) : null}
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose
            render={
              <Button
                className="w-full sm:w-auto"
                size="md"
                variant="outline"
              />
            }
          >
            Done
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RailPanel({ children }: { children: ReactNode }) {
  return (
    <VStack
      className="w-full rounded-xl border border-border bg-muted/40 p-4"
      gap="md"
      hAlign="stretch"
    >
      {children}
    </VStack>
  );
}

function DetailList({ children }: { children: ReactNode }) {
  return (
    <VStack className="w-full" gap="sm" hAlign="stretch">
      {children}
    </VStack>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-0.5">
      <span className="text-sm leading-5 text-secondary-foreground">
        {label}
      </span>
      <span className="text-sm leading-5 font-medium break-all text-foreground">
        {value}
      </span>
    </div>
  );
}

function PaymentReferenceBand({ value }: { value: string }) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-0.5">
      <span className="text-sm leading-5 text-secondary-foreground">
        Payment reference
      </span>
      <span className="text-sm leading-5 font-medium break-all text-foreground">
        {value}
      </span>
      <Text className="text-secondary-foreground" size="sm">
        {REFERENCE_WARNING}
      </Text>
    </div>
  );
}

function FpsQrPlaceholder() {
  return (
    <div
      aria-label="FPS QR code for Grade10"
      className="flex aspect-square size-32 items-center justify-center rounded-xl border border-border bg-background"
      role="img"
    >
      <svg
        aria-hidden="true"
        className="size-24 text-foreground"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect fill="currentColor" height="28" width="28" x="8" y="8" />
        <rect fill="currentColor" height="28" width="28" x="84" y="8" />
        <rect fill="currentColor" height="28" width="28" x="8" y="84" />
        <rect
          fill="none"
          height="16"
          stroke="currentColor"
          strokeWidth="4"
          width="16"
          x="14"
          y="14"
        />
        <rect
          fill="none"
          height="16"
          stroke="currentColor"
          strokeWidth="4"
          width="16"
          x="90"
          y="14"
        />
        <rect
          fill="none"
          height="16"
          stroke="currentColor"
          strokeWidth="4"
          width="16"
          x="14"
          y="90"
        />
        <rect fill="currentColor" height="8" width="8" x="20" y="20" />
        <rect fill="currentColor" height="8" width="8" x="96" y="20" />
        <rect fill="currentColor" height="8" width="8" x="20" y="96" />
        <rect fill="currentColor" height="10" width="10" x="52" y="52" />
        <rect fill="currentColor" height="8" width="8" x="44" y="28" />
        <rect fill="currentColor" height="8" width="8" x="68" y="28" />
        <rect fill="currentColor" height="8" width="8" x="44" y="84" />
        <rect fill="currentColor" height="8" width="8" x="84" y="52" />
        <rect fill="currentColor" height="8" width="8" x="28" y="52" />
        <rect fill="currentColor" height="8" width="8" x="68" y="68" />
      </svg>
    </div>
  );
}

export type { WinnerOrderHowToPayDialogProps };
export { OUR_NOTE, REFERENCE_WARNING, WinnerOrderHowToPayDialog };
