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
import { cn } from "@grade10/design-system/lib/utils";
import { Warning } from "@phosphor-icons/react";
import { useEffect, useId, useRef, useState } from "react";
import { toastProofNotSubmitted } from "./winner-order-proof-feedback";

/** Preview-only bank details — Grade10 / HSBC Hong Kong sample until Finance confirms live values. */
// eslint-disable-next-line react-refresh/only-export-components -- Bank detail fixtures are shared with preview stories.
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
  totalAmountDue: "HK$16,340.00",
  /** Same invoice issued in US$ for a USD-settled order. */
  usdTotalAmountDue: "US$16,340.00",
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
  notes: string;
  files: FileDropzoneItem[];
};

const EMPTY_PROOF: ProofDraft = {
  senderName: "",
  transferDate: "",
  notes: "",
  files: [],
};

type WinnerOrderPaymentProofDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful submit (dialog already closing). */
  onSubmit: () => void;
  /**
   * Preview only — simulated submit fails: dialog stays open, draft kept,
   * failure toast. Default succeeds after the short beat.
   */
  forceFailure?: boolean;
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
  forceFailure = false,
}: WinnerOrderPaymentProofDialogProps) {
  const formId = useId();
  const [draft, setDraft] = useState<ProofDraft>(EMPTY_PROOF);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [converting, setConverting] = useState(false);
  const submitTimerRef = useRef<number | null>(null);
  /** Bumps on abandon so a late timer cannot complete submit. */
  const submitGenerationRef = useRef(0);
  const senderNameRef = useRef<HTMLInputElement>(null);
  const transferDateRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

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
    Boolean(draft.notes.trim()) ||
    draft.files.length > 0;

  /** Rows that failed ingest don't count as proof — they stay removable. */
  const usableFiles = draft.files.filter(
    (item) => (item.status ?? "ready") !== "error",
  );

  const ready =
    Boolean(draft.senderName.trim()) &&
    Boolean(draft.transferDate.trim()) &&
    usableFiles.length >= WINNER_ORDER_PROOF_MIN_FILES;

  const formLocked = submitting || converting;

  const dropzoneFull = draft.files.length >= WINNER_ORDER_PROOF_MAX_FILES;

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

  function handleOpenChange(next: boolean) {
    if (!next && open) {
      // Submitting / converting: leave is blocked — no confirm, no dismiss.
      if (formLocked) return;
      if (hasDraft) {
        const leave = window.confirm(LEAVE_PROOF_CONFIRM);
        if (!leave) return;
      }
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
    }
  }

  function scrollToCenter(target: HTMLElement) {
    const scroller = target.closest<HTMLElement>('[data-slot="dialog-body"]');
    if (!scroller) return;
    // Storybook's iframe stubs scrollIntoView — scroll the body ourselves.
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const targetRect = target.getBoundingClientRect();
    const scrollerRect = scroller.getBoundingClientRect();
    const delta =
      targetRect.top +
      targetRect.height / 2 -
      (scrollerRect.top + scrollerRect.height / 2);
    scroller.scrollTo({
      top: scroller.scrollTop + delta,
      behavior: reduced ? "instant" : "smooth",
    });
  }

  function revealFirstInvalid() {
    const field = !draft.senderName.trim()
      ? senderNameRef.current
      : !draft.transferDate.trim()
        ? transferDateRef.current
        : null;
    if (field) {
      field.focus({ preventScroll: true });
      scrollToCenter(field);
      return;
    }
    const zone = dropzoneRef.current;
    if (usableFiles.length < WINNER_ORDER_PROOF_MIN_FILES && zone) {
      scrollToCenter(zone);
      zone
        .querySelector<HTMLButtonElement>("button:not(:disabled)")
        ?.focus({ preventScroll: true });
    }
  }

  function handleSubmit() {
    setAttempted(true);
    if (formLocked) return;
    if (!ready) {
      // Reveal after the error chrome commits — the messages push the
      // target down, so scrolling first would aim at a stale position.
      requestAnimationFrame(revealFirstInvalid);
      return;
    }
    const generation = submitGenerationRef.current;
    setSubmitting(true);
    clearSubmitTimer();
    submitTimerRef.current = window.setTimeout(() => {
      submitTimerRef.current = null;
      if (generation !== submitGenerationRef.current) return;
      setSubmitting(false);
      if (forceFailure) {
        toastProofNotSubmitted();
        return;
      }
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
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput
                autoComplete="name"
                disabled={formLocked}
                label="Sender Name"
                ref={senderNameRef}
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
                disabled={formLocked}
                label="Transfer Date"
                ref={transferDateRef}
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
            </div>
            <VStack className="w-full" gap="sm" hAlign="stretch">
              <span className="text-sm font-medium text-secondary-foreground">
                Payment Proof
              </span>
              <VStack
                className="w-full"
                data-slot="file-dropzone"
                gap="sm"
                hAlign="stretch"
                ref={dropzoneRef}
              >
                <div
                  aria-hidden={dropzoneFull || undefined}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none",
                    dropzoneFull ? "grid-rows-[0fr]" : "grid-rows-[1fr]",
                  )}
                  data-slot="file-dropzone-collapse"
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <div className="overflow-hidden">
                    <div
                      className={cn(
                        "transition-[opacity,transform] duration-200 motion-reduce:transition-none",
                        dropzoneFull
                          ? "pointer-events-none -translate-y-1 opacity-0 motion-reduce:translate-y-0"
                          : "translate-y-0 opacity-100",
                      )}
                      style={{
                        transitionTimingFunction:
                          "cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
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
                        disabled={formLocked}
                        files={draft.files}
                        limits={{
                          minFiles: WINNER_ORDER_PROOF_MIN_FILES,
                          maxFiles: WINNER_ORDER_PROOF_MAX_FILES,
                          maxBytesPerFile:
                            WINNER_ORDER_PROOF_MAX_BYTES_PER_FILE,
                          maxBytesTotal: WINNER_ORDER_PROOF_MAX_BYTES_TOTAL,
                        }}
                        onChange={(files) => patch("files", files)}
                        onConvertingChange={setConverting}
                        onReject={handleFileReject}
                      />
                    </div>
                  </div>
                </div>
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
                usableFiles.length < WINNER_ORDER_PROOF_MIN_FILES ? (
                  <Text size="sm" tone="error">
                    Attach at least one proof file.
                  </Text>
                ) : null}
                <span aria-live="polite" className="sr-only">
                  {usableFiles.length === 0
                    ? "No files selected"
                    : `${usableFiles.length} ${usableFiles.length === 1 ? "file" : "files"} selected`}
                </span>
              </VStack>
            </VStack>
            <TextInput
              disabled={formLocked}
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
                disabled={formLocked}
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
