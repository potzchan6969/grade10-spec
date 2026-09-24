import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  FILE_DROPZONE_MIB,
  FileDropzoneFileList,
  type FileDropzoneItem,
  type FileDropzoneRejectReason,
  FileDropzoneTarget,
} from "@grade10/design-system/components/forms/file-dropzone";
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
import { Warning } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";

/** Preview-only bank details — Grade10 / HSBC Hong Kong sample until Finance confirms live values. */
export const WINNER_ORDER_BANK_DETAILS = {
  beneficiaryName: "Grade10 Finance Limited",
  beneficiaryAddress: "Unit 2602, 28 Stanley Street, Central, Hong Kong",
  bankName: "HSBC Hong Kong",
  /** Main branch address, city and country. */
  bankAddress: "1 Queen's Road Central, Central, Hong Kong",
  bankCode: "004",
  branchCode: "001",
  /**
   * Full account number including bank and branch code
   * (`bank-branch-account`).
   */
  accountNumber: "004-001-583291-001",
  swiftCode: "HSBCHKHHXXX",
  fpsId: "12345678",
  /** Preview fixture aligned to bank-transfer invoice Order Total (fee Free). */
  totalAmountDue: "HK$16,340",
  /** Payment reference — listing code, unchanged across reissues. */
  transferReference: "LK7P2Q",
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

/** Dialog description — one-shot rule stays on the confirm microcopy. */
export const PROOF_DIALOG_SUBTEXT =
  "After you transfer, upload your receipt here." as const;

const PROOF_CONFIRM_MICROCOPY =
  "You can’t add or change files after you submit." as const;

const LEAVE_PROOF_CONFIRM =
  "Leave without submitting? Your payment proof will not be saved." as const;

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

type WinnerOrderPaymentProofDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful submit (dialog already closing). */
  onSubmit: () => void;
};

/**
 * Preview-only: Submit Payment Proof from Order summary primary control.
 * Not a published `@grade10/ui` export. Rails live in View Bank Details.
 * Field list explores product UX; OpenSpec stores files after confirm only.
 */
function WinnerOrderPaymentProofDialog({
  open,
  onOpenChange,
  onSubmit,
}: WinnerOrderPaymentProofDialogProps) {
  const formId = useId();
  const [draft, setDraft] = useState<ProofDraft>(EMPTY_PROOF);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [converting, setConverting] = useState(false);
  const submitTimerRef = useRef<number | null>(null);
  /** Bumps on abandon so a late timer cannot complete submit. */
  const submitGenerationRef = useRef(0);

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
          <DialogTitle>Submit Payment Proof</DialogTitle>
          <DialogSubtext>{PROOF_DIALOG_SUBTEXT}</DialogSubtext>
        </DialogHeader>
        <DialogBody>
          <VStack className="w-full" gap="md" hAlign="stretch" id={formId}>
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

export type { WinnerOrderPaymentProofDialogProps };
export { WinnerOrderPaymentProofDialog };
