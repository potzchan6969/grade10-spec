import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  FILE_DROPZONE_MIB,
  FileDropzoneFileList,
  type FileDropzoneItem,
  type FileDropzoneRejectReason,
  FileDropzoneTarget,
} from "@grade10/design-system/components/forms/file-dropzone";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { HStack } from "@grade10/design-system/components/layout/hstack";
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
import { toast } from "@grade10/design-system/components/overlays/toast";
import { Check, Copy, Warning } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

/** Preview-only bank details — Finance TBC for live account values. */
export const WINNER_ORDER_BANK_DETAILS = {
  beneficiaryName: "{tbc}",
  bankName: "{tbc}",
  accountNumber: "XXXX-XXXX-XXXX-1234",
  swiftCode: "X12345678",
  /** Preview fixture aligned to bank-transfer invoice Order Total (fee Free). */
  totalAmountDue: "HK$16,020",
  transferReference: "TCG-INV-202609-LK7P2Q-01-W42",
} as const;

/**
 * Winner payment proof — matches `add-winner-bank-transfer` after the
 * 1–3 / 5 MB / 15 MB / HEIC update.
 */
export const WINNER_ORDER_PROOF_FILE_ACCEPT =
  ".pdf,.png,.jpg,.jpeg,.heic,.heif,application/pdf,image/png,image/jpeg,image/heic,image/heif" as const;
export const WINNER_ORDER_PROOF_MAX_FILES = 3;
export const WINNER_ORDER_PROOF_MIN_FILES = 1;
export const WINNER_ORDER_PROOF_MAX_BYTES_PER_FILE = 5 * FILE_DROPZONE_MIB;
export const WINNER_ORDER_PROOF_MAX_BYTES_TOTAL = 15 * FILE_DROPZONE_MIB;
export const WINNER_ORDER_PROOF_FILE_HINT =
  "PDF, PNG, JPG, or HEIC. Up to 3 files, 5 MB each, 15 MB total." as const;

const PROOF_CONFIRM_MICROCOPY =
  "You can’t add or change files after you submit." as const;

const LEAVE_PROOF_CONFIRM =
  "Leave without submitting? Your payment proof will not be saved." as const;

const COPY_FEEDBACK_MS = 1600;
const SUBMIT_SIMULATE_MS = 400;

type ProofDraft = {
  senderName: string;
  transferDate: string;
  transactionReference: string;
  notes: string;
  files: FileDropzoneItem[];
};

const EMPTY_PROOF: ProofDraft = {
  senderName: "",
  transferDate: "",
  transactionReference: "",
  notes: "",
  files: [],
};

type CopiedField = "account" | "amount" | "reference" | null;

type WinnerOrderPaymentProofDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful submit (dialog already closing). */
  onSubmit: () => void;
  amountDue?: string;
  transferReference?: string;
  accountNumber?: string;
};

/**
 * Preview-only: bank details + proof form after Pay by Bank Transfer.
 * Not a published `@grade10/ui` export. Field list explores product UX;
 * OpenSpec stores files after confirm only.
 */
function WinnerOrderPaymentProofDialog({
  open,
  onOpenChange,
  onSubmit,
  amountDue = WINNER_ORDER_BANK_DETAILS.totalAmountDue,
  transferReference = WINNER_ORDER_BANK_DETAILS.transferReference,
  accountNumber = WINNER_ORDER_BANK_DETAILS.accountNumber,
}: WinnerOrderPaymentProofDialogProps) {
  const formId = useId();
  const [draft, setDraft] = useState<ProofDraft>(EMPTY_PROOF);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [converting, setConverting] = useState(false);
  const [copiedField, setCopiedField] = useState<CopiedField>(null);
  const submitTimerRef = useRef<number | null>(null);
  /** Bumps on abandon so a late timer cannot complete submit. */
  const submitGenerationRef = useRef(0);

  useEffect(() => {
    if (!copiedField) return;
    const timer = window.setTimeout(
      () => setCopiedField(null),
      COPY_FEEDBACK_MS,
    );
    return () => window.clearTimeout(timer);
  }, [copiedField]);

  useEffect(() => {
    return () => {
      if (submitTimerRef.current != null) {
        window.clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  function patch<K extends keyof ProofDraft>(key: K, value: ProofDraft[K]) {
    setDraft((held) => ({ ...held, [key]: value }));
  }

  const hasDraft =
    Boolean(draft.senderName.trim()) ||
    Boolean(draft.transferDate.trim()) ||
    Boolean(draft.transactionReference.trim()) ||
    Boolean(draft.notes.trim()) ||
    draft.files.length > 0;

  const ready =
    Boolean(draft.senderName.trim()) &&
    Boolean(draft.transferDate.trim()) &&
    Boolean(draft.transactionReference.trim()) &&
    draft.files.length >= WINNER_ORDER_PROOF_MIN_FILES;

  const formLocked = submitting || converting;

  function clearSubmitTimer() {
    if (submitTimerRef.current != null) {
      window.clearTimeout(submitTimerRef.current);
      submitTimerRef.current = null;
    }
  }

  function resetDraft() {
    clearSubmitTimer();
    setDraft(EMPTY_PROOF);
    setAttempted(false);
    setSubmitting(false);
    setConverting(false);
    setCopiedField(null);
  }

  function abandonInFlightSubmit() {
    submitGenerationRef.current += 1;
    clearSubmitTimer();
    setSubmitting(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next && open && (hasDraft || submitting || converting)) {
      const leave = window.confirm(LEAVE_PROOF_CONFIRM);
      if (!leave) return;
      abandonInFlightSubmit();
    }
    if (!next) resetDraft();
    onOpenChange(next);
  }

  async function copyValue(
    field: Exclude<CopiedField, null>,
    value: string,
    successToast: string,
    manualToast: string,
  ) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast.success(successToast);
    } catch {
      toast.info(manualToast, { description: value });
    }
  }

  function handleFileReject(reason: FileDropzoneRejectReason, detail?: string) {
    switch (reason) {
      case "too_many":
        toast.error("Too many files", {
          description: detail ?? `Up to ${WINNER_ORDER_PROOF_MAX_FILES} files.`,
        });
        break;
      case "too_large_file":
        toast.error("File too large", {
          description: detail ?? "Each file must be 5 MB or less.",
        });
        break;
      case "too_large_total":
        toast.error("Files too large", {
          description: detail ?? "All files together must be 15 MB or less.",
        });
        break;
      case "type":
        toast.error("File type not supported", {
          description: "Use PDF, PNG, JPG, or HEIC.",
        });
        break;
      case "convert_failed":
        toast.error("Couldn’t convert HEIC", {
          description:
            "Try exporting as JPG from your phone, then upload again.",
        });
        break;
    }
  }

  function handleSubmit() {
    setAttempted(true);
    if (!ready || formLocked) return;
    const generation = submitGenerationRef.current;
    setSubmitting(true);
    clearSubmitTimer();
    submitTimerRef.current = window.setTimeout(() => {
      submitTimerRef.current = null;
      if (generation !== submitGenerationRef.current) return;
      setSubmitting(false);
      resetDraft();
      onOpenChange(false);
      onSubmit();
    }, SUBMIT_SIMULATE_MS);
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="max-w-lg" showCloseButton={false}>
        <DialogHeader showCloseButton={false}>
          <DialogTitle>Pay by Bank Transfer</DialogTitle>
          <DialogSubtext>
            Copy the bank details, pay the amount due, then upload your receipt.
          </DialogSubtext>
        </DialogHeader>
        <DialogBody>
          <VStack className="w-full" gap="md" hAlign="stretch">
            <VStack className="w-full" gap="sm" hAlign="stretch">
              <h3 className="text-sm leading-5 font-medium text-foreground">
                Bank Details
              </h3>
              <div className="flex w-full flex-col gap-2 rounded-xl border border-border bg-card px-3 pt-3 pb-4">
                <DetailRow
                  label="Beneficiary Name"
                  value={WINNER_ORDER_BANK_DETAILS.beneficiaryName}
                />
                <DetailRow
                  label="Bank Name"
                  value={WINNER_ORDER_BANK_DETAILS.bankName}
                />
                <CopyableDetailRow
                  copied={copiedField === "account"}
                  copyAriaLabel="Copy account number"
                  copiedAriaLabel="Account number copied"
                  label="Account Number / IBAN"
                  onCopy={() =>
                    void copyValue(
                      "account",
                      accountNumber,
                      "Account number copied",
                      "Copy the account number manually",
                    )
                  }
                  value={accountNumber}
                />
                <DetailRow
                  label="Routing / SWIFT Code"
                  value={WINNER_ORDER_BANK_DETAILS.swiftCode}
                />
                <CopyableDetailRow
                  copied={copiedField === "amount"}
                  copyAriaLabel="Copy amount due"
                  copiedAriaLabel="Amount due copied"
                  label="Total Amount Due"
                  onCopy={() =>
                    void copyValue(
                      "amount",
                      amountDue,
                      "Amount due copied",
                      "Copy the amount due manually",
                    )
                  }
                  value={amountDue}
                />
                <CopyableDetailRow
                  copied={copiedField === "reference"}
                  copyAriaLabel="Copy transfer reference"
                  copiedAriaLabel="Reference copied"
                  label="Required Transfer Reference"
                  onCopy={() =>
                    void copyValue(
                      "reference",
                      transferReference,
                      "Reference copied",
                      "Copy the reference manually",
                    )
                  }
                  value={transferReference}
                />
              </div>
            </VStack>

            <VStack className="w-full" gap="md" hAlign="stretch" id={formId}>
              <h3 className="text-sm leading-5 font-medium text-foreground">
                Proof of Payment
              </h3>
              <TextInput
                autoComplete="name"
                disabled={submitting}
                label="Sender Name"
                message={
                  attempted && !draft.senderName.trim()
                    ? "Enter the sender name."
                    : undefined
                }
                onChange={(event) =>
                  patch("senderName", event.currentTarget.value)
                }
                status={
                  attempted && !draft.senderName.trim() ? "error" : "default"
                }
                value={draft.senderName}
              />
              <TextInput
                disabled={submitting}
                label="Transfer Date"
                message={
                  attempted && !draft.transferDate.trim()
                    ? "Enter the transfer date."
                    : undefined
                }
                onChange={(event) =>
                  patch("transferDate", event.currentTarget.value)
                }
                status={
                  attempted && !draft.transferDate.trim() ? "error" : "default"
                }
                type="date"
                value={draft.transferDate}
              />
              <TextInput
                disabled={submitting}
                label="Transaction Reference / ID"
                message={
                  attempted && !draft.transactionReference.trim()
                    ? "Enter the transaction reference."
                    : undefined
                }
                onChange={(event) =>
                  patch("transactionReference", event.currentTarget.value)
                }
                status={
                  attempted && !draft.transactionReference.trim()
                    ? "error"
                    : "default"
                }
                value={draft.transactionReference}
              />
              <VStack className="w-full" gap="sm" hAlign="stretch">
                <span className="text-sm font-medium text-secondary-foreground">
                  Proof of Payment File
                </span>
                <VStack
                  className="w-full"
                  data-slot="file-dropzone"
                  gap="sm"
                  hAlign="stretch"
                >
                  <FileDropzoneTarget
                    accept={WINNER_ORDER_PROOF_FILE_ACCEPT}
                    converting={converting}
                    copy={{
                      idleTitle: "Drop files here or choose files",
                      idleDescription: WINNER_ORDER_PROOF_FILE_HINT,
                      chooseFiles: "Choose Files",
                      converting: "Converting HEIC…",
                    }}
                    disabled={submitting}
                    files={draft.files}
                    limits={{
                      minFiles: WINNER_ORDER_PROOF_MIN_FILES,
                      maxFiles: WINNER_ORDER_PROOF_MAX_FILES,
                      maxBytesPerFile: WINNER_ORDER_PROOF_MAX_BYTES_PER_FILE,
                      maxBytesTotal: WINNER_ORDER_PROOF_MAX_BYTES_TOTAL,
                    }}
                    onChange={(files) => patch("files", files)}
                    onConvertingChange={setConverting}
                    onReject={handleFileReject}
                  />
                  <FileDropzoneFileList
                    copy={{ removeFile: "Remove file" }}
                    disabled={formLocked}
                    files={draft.files}
                    onRemove={(id) =>
                      patch(
                        "files",
                        draft.files.filter((item) => item.id !== id),
                      )
                    }
                  />
                  {attempted &&
                  draft.files.length < WINNER_ORDER_PROOF_MIN_FILES ? (
                    <Text size="sm" tone="error">
                      Attach at least one proof file.
                    </Text>
                  ) : null}
                </VStack>
              </VStack>
              <TextInput
                disabled={submitting}
                label="Additional Notes (optional)"
                onChange={(event) => patch("notes", event.currentTarget.value)}
                value={draft.notes}
              />
              <HStack className="w-full" gap="xs" vAlign="start">
                <span className="mt-0.5 shrink-0 text-warning">
                  <Warning aria-hidden size={16} weight="fill" />
                </span>
                <Text className="text-secondary-foreground" size="sm">
                  {PROOF_CONFIRM_MICROCOPY}
                </Text>
              </HStack>
            </VStack>
          </VStack>
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
            Cancel
          </DialogClose>
          <Button
            className="w-full sm:w-auto"
            disabled={formLocked}
            loading={submitting}
            onClick={handleSubmit}
            size="md"
            type="button"
          >
            Submit Payment Proof
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

function CopyableDetailRow({
  label,
  value,
  copied,
  copyAriaLabel,
  copiedAriaLabel,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  copyAriaLabel: string;
  copiedAriaLabel: string;
  onCopy: () => void;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-0.5">
      <span className="text-sm leading-5 text-secondary-foreground">
        {label}
      </span>
      <div className="flex min-w-0 items-center gap-1">
        <span className="min-w-0 text-sm leading-5 font-medium break-all text-foreground">
          {value}
        </span>
        <IconButton
          aria-label={copied ? copiedAriaLabel : copyAriaLabel}
          className="shrink-0"
          onClick={onCopy}
          size="xs"
          type="button"
          variant="ghost"
        >
          <span className="relative inline-flex size-3 items-center justify-center">
            <span
              className={
                copied
                  ? "absolute size-3 scale-75 opacity-0 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none"
                  : "absolute size-3 scale-100 opacity-100 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none"
              }
            >
              <Copy aria-hidden size={12} />
            </span>
            <span
              className={
                copied
                  ? "absolute size-3 scale-100 opacity-100 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none"
                  : "absolute size-3 scale-75 opacity-0 transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none"
              }
            >
              <Check aria-hidden size={12} />
            </span>
          </span>
        </IconButton>
      </div>
    </div>
  );
}

export type { WinnerOrderPaymentProofDialogProps };
export { WinnerOrderPaymentProofDialog };
