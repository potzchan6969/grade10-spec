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
export const WINNER_ORDER_PROOF_FILE_HINT =
  "PDF, PNG, JPG, or HEIC. Up to 3 files, 5 MB each, 15 MB total." as const;

/** Dialog description — one-shot rule stays on the confirm microcopy. */
export const PROOF_DIALOG_SUBTEXT =
  "After you transfer, upload your receipt here." as const;

const PROOF_CONFIRM_MICROCOPY =
  "You can’t add or change files after you submit." as const;

const LEAVE_PROOF_CONFIRM =
  "Leave without submitting? Your payment proof will not be saved." as const;

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
      case "convert_failed":
        toast.error("Couldn’t convert HEIC", {
          description:
            "Try exporting as JPG from your phone, then upload again.",
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
            Cancel
          </DialogClose>
          <Button
            className="w-full sm:w-auto"
            disabled={formLocked}
            loading={submitting}
            onClick={() => void handleSubmit()}
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

export type { ProofRefusal, WinnerOrderPaymentProofDialogProps };
export { WinnerOrderPaymentProofDialog };
