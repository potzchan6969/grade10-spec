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
import { useId, useRef, useState } from "react";

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

type ProofRejectCopy = { title: string; description: string };

/** Every word the dialog draws, in the reader's language. */
type WinnerOrderPaymentProofDialogCopy = {
  title: string;
  /** Dialog description — one-shot rule stays on the final notice. */
  description: string;
  senderName: string;
  senderNameRequired: string;
  transferDate: string;
  transferDateRequired: string;
  proof: string;
  dropTitle: string;
  fileHint: string;
  chooseFiles: string;
  converting: string;
  removeFile: string;
  filesRequired: string;
  noFilesSelected: string;
  filesSelected: (count: number) => string;
  notes: string;
  finalNotice: string;
  leaveConfirm: string;
  cancel: string;
  submit: string;
  tooManyFiles: ProofRejectCopy;
  fileTooLarge: ProofRejectCopy;
  filesTooLarge: ProofRejectCopy;
  fileTypeUnsupported: ProofRejectCopy;
  heicFailed: ProofRejectCopy;
};

/** The English copy — the catalog's `auctionOrders.proofDialog` in `en`. */
export const WINNER_ORDER_PROOF_DIALOG_COPY: WinnerOrderPaymentProofDialogCopy =
  {
    title: "Submit Payment Proof",
    description: "After you transfer, upload your receipt here.",
    senderName: "Sender Name",
    senderNameRequired: "Enter the sender name.",
    transferDate: "Transfer Date",
    transferDateRequired: "Enter the transfer date.",
    proof: "Payment Proof",
    dropTitle: "Drop files here or choose files",
    fileHint: "PDF, PNG, JPG, or HEIC. Up to 3 files, 5 MB each, 15 MB total.",
    chooseFiles: "Choose Files",
    converting: "Converting HEIC…",
    removeFile: "Remove file",
    filesRequired: "Attach at least one proof file.",
    noFilesSelected: "No files selected",
    filesSelected: (count) =>
      `${count} ${count === 1 ? "file" : "files"} selected`,
    notes: "Additional Notes (optional)",
    finalNotice: "You can’t add or change files after you submit.",
    leaveConfirm:
      "Leave without submitting? Your payment proof will not be saved.",
    cancel: "Cancel",
    submit: "Submit Payment Proof",
    tooManyFiles: {
      title: "Too many files",
      description: `Up to ${WINNER_ORDER_PROOF_MAX_FILES} files.`,
    },
    fileTooLarge: {
      title: "File too large",
      description: "Each file must be 5 MB or less.",
    },
    filesTooLarge: {
      title: "Files too large",
      description: "All files together must be 15 MB or less.",
    },
    fileTypeUnsupported: {
      title: "File type not supported",
      description: "Use PDF, PNG, JPG, or HEIC.",
    },
    heicFailed: {
      title: "Couldn’t convert HEIC",
      description: "Try exporting as JPG from your phone, then upload again.",
    },
  };

export const WINNER_ORDER_PROOF_FILE_HINT =
  WINNER_ORDER_PROOF_DIALOG_COPY.fileHint;

export const PROOF_DIALOG_SUBTEXT = WINNER_ORDER_PROOF_DIALOG_COPY.description;

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
  copy: WinnerOrderPaymentProofDialogCopy;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Uploads proof files; resolves null once accepted, else its refusal. */
  onSubmit: (files: File[]) => Promise<ProofRefusal | null>;
};

type ProofRefusal = { title: string; description: string };

/**
 * Submit Payment Proof — Winner Order primary control for a pending bank
 * transfer. Rails live in View Bank Details. A blocked submit reveals the
 * first invalid field inside the dialog body; a refused upload keeps the
 * draft and shows the refusal in place.
 */
function WinnerOrderPaymentProofDialog({
  copy,
  open,
  onOpenChange,
  onSubmit,
}: WinnerOrderPaymentProofDialogProps) {
  const formId = useId();
  const [draft, setDraft] = useState<ProofDraft>(EMPTY_PROOF);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [converting, setConverting] = useState(false);
  const [refusal, setRefusal] = useState<ProofRefusal | null>(null);
  const senderNameRef = useRef<HTMLInputElement>(null);
  const transferDateRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

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

  function resetDraft() {
    setDraft(EMPTY_PROOF);
    setRefusal(null);
    setAttempted(false);
    setSubmitting(false);
    setConverting(false);
  }

  function handleOpenChange(next: boolean) {
    if (!next && open) {
      // Submitting / converting: leave is blocked — no confirm, no dismiss.
      if (formLocked) return;
      if (hasDraft) {
        const leave = window.confirm(copy.leaveConfirm);
        if (!leave) return;
      }
    }
    if (!next) resetDraft();
    onOpenChange(next);
  }

  function handleFileReject(reason: FileDropzoneRejectReason) {
    const rejected = {
      too_many: copy.tooManyFiles,
      too_large_file: copy.fileTooLarge,
      too_large_total: copy.filesTooLarge,
      type: copy.fileTypeUnsupported,
      convert_failed: copy.heicFailed,
    }[reason];
    toast.error(rejected.title, { description: rejected.description });
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

  async function handleSubmit() {
    setAttempted(true);
    if (formLocked) return;
    if (!ready) {
      // Reveal after the error chrome commits — the messages push the
      // target down, so scrolling first would aim at a stale position.
      requestAnimationFrame(revealFirstInvalid);
      return;
    }
    setSubmitting(true);
    setRefusal(null);
    try {
      const refused = await onSubmit(usableFiles.map((item) => item.file));
      if (refused) {
        setRefusal(refused);
      } else {
        resetDraft();
        onOpenChange(false);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent className="max-w-lg" showCloseButton={false}>
        <DialogHeader showCloseButton={false}>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogSubtext>{copy.description}</DialogSubtext>
        </DialogHeader>
        <DialogBody>
          <VStack className="w-full" gap="md" hAlign="stretch" id={formId}>
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput
                autoComplete="name"
                disabled={formLocked}
                label={copy.senderName}
                ref={senderNameRef}
                message={
                  attempted && !draft.senderName.trim()
                    ? copy.senderNameRequired
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
                label={copy.transferDate}
                ref={transferDateRef}
                message={
                  attempted && !draft.transferDate.trim()
                    ? copy.transferDateRequired
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
                {copy.proof}
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
                          idleTitle: copy.dropTitle,
                          idleDescription: copy.fileHint,
                          chooseFiles: copy.chooseFiles,
                          converting: copy.converting,
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
                  copy={{ removeFile: copy.removeFile }}
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
                    {copy.filesRequired}
                  </Text>
                ) : null}
                <span aria-live="polite" className="sr-only">
                  {usableFiles.length === 0
                    ? copy.noFilesSelected
                    : copy.filesSelected(usableFiles.length)}
                </span>
              </VStack>
            </VStack>
            <TextInput
              disabled={formLocked}
              label={copy.notes}
              onChange={(event) => patch("notes", event.currentTarget.value)}
              value={draft.notes}
            />
            <HStack className="w-full" gap="xs" vAlign="start">
              <span className="mt-0.5 shrink-0 text-warning">
                <Warning aria-hidden size={16} weight="fill" />
              </span>
              <Text className="text-secondary-foreground" size="sm">
                {copy.finalNotice}
              </Text>
            </HStack>
          </VStack>
        </DialogBody>
        {refusal ? (
          <VStack gap="none" role="alert">
            <Text size="sm" tone="error" weight="medium">
              {refusal.title}
            </Text>
            <Text size="sm" tone="error">
              {refusal.description}
            </Text>
          </VStack>
        ) : null}
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
            {copy.cancel}
          </DialogClose>
          <Button
            className="w-full sm:w-auto"
            disabled={formLocked}
            loading={submitting}
            onClick={() => void handleSubmit()}
            size="md"
            type="button"
          >
            {copy.submit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type {
  ProofRefusal,
  WinnerOrderPaymentProofDialogCopy,
  WinnerOrderPaymentProofDialogProps,
};
export { WinnerOrderPaymentProofDialog };
