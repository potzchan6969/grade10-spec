import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  type AttachmentState,
  AttachmentTitle,
} from "@grade10/design-system/components/display/attachment";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import {
  ArrowsClockwise,
  File as FileGlyph,
  FilePdf,
  UploadSimple,
  X,
} from "@phosphor-icons/react";
import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/** Binary mebibyte — matches OpenSpec file-size language. */
export const FILE_DROPZONE_MIB = 1_048_576;

const FILE_ROW_MS = 200;
const FILE_ROW_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Ids added after the first commit. Rows present on mount stay put so a
 * static list does not play an enter transition.
 */
function useEnteringFileIds(
  files: readonly { id: string }[],
): ReadonlySet<string> {
  const knownIds = useRef<Set<string>>(new Set());
  const primed = useRef(false);
  const entering = new Set<string>();

  if (primed.current) {
    for (const file of files) {
      if (!knownIds.current.has(file.id)) entering.add(file.id);
    }
  }

  const live = new Set(files.map((file) => file.id));
  for (const id of knownIds.current) {
    if (!live.has(id)) knownIds.current.delete(id);
  }
  for (const file of files) knownIds.current.add(file.id);
  primed.current = true;

  return entering;
}

export type FileDropzoneItemStatus = "processing" | "ready" | "error";

export type FileDropzoneItem = {
  id: string;
  file: File;
  /** Display name after any conversion (e.g. HEIC → JPEG). */
  name: string;
  /** True when the original was HEIC/HEIF and was converted for storage. */
  convertedFromHeic?: boolean;
  /**
   * Row lifecycle — `processing` while async work runs (HEIC → JPEG),
   * `ready` once usable, `error` when the file could not be accepted.
   * Defaults to `ready`.
   */
  status?: FileDropzoneItemStatus;
  /** Status line under the name — converting copy or the failure reason. */
  statusMessage?: string;
  /** Set by ingest when the failure is retryable (e.g. HEIC conversion). */
  retry?: () => void;
};

export type FileDropzoneTargetCopy = {
  idleTitle: string;
  idleDescription: string;
  chooseFiles: string;
  converting: string;
};

export type FileDropzoneFileCopy = {
  removeFile: string;
  /** Accessible name for the retry action on a failed file. */
  retryFile?: string;
  /** Shown under the name when the file was converted from HEIC. */
  convertedFromHeic?: string;
};

export type FileDropzoneCopy = FileDropzoneTargetCopy & FileDropzoneFileCopy;

export type FileDropzoneLimits = {
  minFiles: number;
  maxFiles: number;
  maxBytesPerFile: number;
  maxBytesTotal: number;
};

export type FileDropzoneRejectReason =
  | "too_many"
  | "too_large_file"
  | "too_large_total"
  | "type"
  | "convert_failed";

const HEIC_TYPES = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

function isHeicFile(file: File): boolean {
  if (HEIC_TYPES.has(file.type.toLowerCase())) return true;
  return /\.hei[cf]$/i.test(file.name);
}

function isAllowedType(file: File, accept: string): boolean {
  if (isHeicFile(file)) return true;
  const tokens = accept.split(",").map((t) => t.trim().toLowerCase());
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.92,
  });
  const blob = Array.isArray(result) ? result[0] : result;
  const base = file.name.replace(/\.hei[cf]$/i, "") || "proof";
  return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
}

function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|bmp)$/i.test(file.name);
}

function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}

type IngestContext = {
  /** Latest committed items — live across the async conversion awaits. */
  getFiles: () => readonly FileDropzoneItem[];
  appendItem: (item: FileDropzoneItem) => void;
  updateItem: (id: string, update: Partial<FileDropzoneItem>) => void;
  limits: FileDropzoneLimits;
  accept: string;
  copy: FileDropzoneTargetCopy;
  onReject?: (reason: FileDropzoneRejectReason, detail?: string) => void;
};

async function ingestFiles(
  rawList: FileList | File[],
  context: IngestContext,
): Promise<void> {
  const { getFiles, appendItem, updateItem, limits, accept, copy, onReject } =
    context;
  const incoming = Array.from(rawList);
  if (incoming.length === 0) return;

  if (incoming.length > Math.max(0, limits.maxFiles - getFiles().length)) {
    onReject?.("too_many", `Up to ${limits.maxFiles} files.`);
    return;
  }

  const perFileMessage = `Each file must be ${Math.floor(limits.maxBytesPerFile / FILE_DROPZONE_MIB)} MB or less.`;
  const totalMessage = `All files together must be ${Math.floor(limits.maxBytesTotal / FILE_DROPZONE_MIB)} MB or less.`;
  const totalExcluding = (id: string) =>
    getFiles()
      .filter((item) => item.id !== id)
      .reduce((sum, item) => sum + item.file.size, 0);

  for (const raw of incoming) {
    if (!isAllowedType(raw, accept)) {
      onReject?.("type", raw.name);
      return;
    }
    if (raw.size > limits.maxBytesPerFile) {
      onReject?.("too_large_file", perFileMessage);
      return;
    }

    const item: FileDropzoneItem = {
      id: `${raw.name}-${raw.size}-${raw.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file: raw,
      name: raw.name,
    };

    if (!isHeicFile(raw)) {
      if (totalExcluding(item.id) + raw.size > limits.maxBytesTotal) {
        onReject?.("too_large_total", totalMessage);
        return;
      }
      appendItem(item);
      continue;
    }

    // HEIC: the row lands as `processing` while heic2any runs, then settles
    // to `ready` — or stays as an `error` row when it cannot be used.
    appendItem({
      ...item,
      status: "processing",
      statusMessage: copy.converting,
    });
    const runConversion = async () => {
      try {
        const converted = await convertHeicToJpeg(raw);
        if (converted.size > limits.maxBytesPerFile) {
          updateItem(item.id, {
            status: "error",
            statusMessage: perFileMessage,
            retry: undefined,
          });
          return;
        }
        if (totalExcluding(item.id) + converted.size > limits.maxBytesTotal) {
          updateItem(item.id, {
            status: "error",
            statusMessage: totalMessage,
            retry: undefined,
          });
          return;
        }
        updateItem(item.id, {
          file: converted,
          name: converted.name,
          status: "ready",
          statusMessage: undefined,
          convertedFromHeic: true,
          retry: undefined,
        });
      } catch {
        updateItem(item.id, {
          status: "error",
          statusMessage: "Couldn’t convert this file.",
          retry: () => {
            updateItem(item.id, {
              status: "processing",
              statusMessage: copy.converting,
              retry: undefined,
            });
            void runConversion();
          },
        });
      }
    };
    await runConversion();
  }
}

/** Square preview: image thumbnail, or icon tile for PDF / other. */
function FileDropzoneThumb({
  file,
  processing = false,
}: {
  file: File;
  processing?: boolean;
}) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const showImage = !processing && isImageFile(file);

  useEffect(() => {
    if (!showImage) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, showImage]);

  return (
    <AttachmentMedia
      aria-hidden
      data-slot="file-dropzone-thumb"
      variant={previewUrl ? "image" : "icon"}
    >
      {previewUrl ? (
        <img alt="" src={previewUrl} />
      ) : isPdfFile(file) ? (
        <FilePdf size={16} weight="regular" />
      ) : (
        <FileGlyph size={16} weight="regular" />
      )}
    </AttachmentMedia>
  );
}

type FileDropzoneTargetProps = {
  files: readonly FileDropzoneItem[];
  onChange: (files: FileDropzoneItem[]) => void;
  limits: FileDropzoneLimits;
  accept: string;
  copy: FileDropzoneTargetCopy;
  onReject?: (reason: FileDropzoneRejectReason, detail?: string) => void;
  disabled?: boolean;
  className?: string;
  /** Optional converting flag owned by a parent composer. */
  converting?: boolean;
  onConvertingChange?: (converting: boolean) => void;
};

/**
 * Dashed drop target with choose-files control. Does not render the file list.
 */
function FileDropzoneTarget({
  files,
  onChange,
  limits,
  accept,
  copy,
  onReject,
  disabled = false,
  className,
  converting: convertingProp,
  onConvertingChange,
}: FileDropzoneTargetProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [internalConverting, setInternalConverting] = useState(false);
  const converting = convertingProp ?? internalConverting;

  function setConverting(next: boolean) {
    onConvertingChange?.(next);
    if (convertingProp === undefined) setInternalConverting(next);
  }

  // Live list for the async ingest loop — appends and status updates land
  // on the latest committed files even across awaits, and optimistic writes
  // keep back-to-back synchronous appends from dropping each other.
  const liveFilesRef = useRef<readonly FileDropzoneItem[]>(files);
  liveFilesRef.current = files;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  function appendItem(item: FileDropzoneItem) {
    liveFilesRef.current = [...liveFilesRef.current, item];
    onChangeRef.current([...liveFilesRef.current]);
  }

  function updateItem(id: string, update: Partial<FileDropzoneItem>) {
    liveFilesRef.current = liveFilesRef.current.map((item) =>
      item.id === id ? { ...item, ...update } : item,
    );
    onChangeRef.current([...liveFilesRef.current]);
  }

  const remainingSlots = Math.max(0, limits.maxFiles - files.length);
  const inactive = disabled || converting || remainingSlots === 0;

  async function ingest(rawList: FileList | File[]) {
    if (disabled || converting) return;

    setConverting(true);
    try {
      await ingestFiles(rawList, {
        getFiles: () => liveFilesRef.current,
        appendItem,
        updateItem,
        limits,
        accept,
        copy,
        onReject,
      });
    } finally {
      setConverting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    void ingest(event.currentTarget.files ?? []);
  }

  function handleDrop(event: DragEvent<HTMLFieldSetElement>) {
    event.preventDefault();
    setDragging(false);
    void ingest(event.dataTransfer.files);
  }

  return (
    <fieldset
      aria-label={copy.idleTitle}
      aria-disabled={inactive || undefined}
      className={cn(
        "m-0 flex w-full flex-col items-center gap-3 rounded-2xl border border-dashed px-4 py-6 transition-[border-color,background-color] duration-150",
        dragging
          ? "border-border-strong bg-muted"
          : "border-border bg-background-subtle",
        inactive && "opacity-50",
        className,
      )}
      data-slot="file-dropzone-target"
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled && remainingSlots > 0) setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setDragging(false);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <span className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-background text-foreground [&_svg]:size-5">
        <UploadSimple aria-hidden />
      </span>
      <VStack className="w-full text-center" gap="xs" hAlign="center">
        <Text size="sm" weight="medium">
          {converting ? copy.converting : copy.idleTitle}
        </Text>
        <Text size="sm" tone="secondary">
          {copy.idleDescription}
        </Text>
      </VStack>
      <input
        accept={accept}
        aria-hidden
        className="sr-only"
        disabled={inactive}
        id={inputId}
        multiple={limits.maxFiles > 1}
        onChange={handleInputChange}
        ref={inputRef}
        tabIndex={-1}
        type="file"
      />
      <Button
        disabled={inactive}
        onClick={() => inputRef.current?.click()}
        size="sm"
        type="button"
        variant="outline"
      >
        {copy.chooseFiles}
      </Button>
    </fieldset>
  );
}

type FileDropzoneFileProps = {
  item: FileDropzoneItem;
  onRemove: (id: string) => void;
  copy: FileDropzoneFileCopy;
  disabled?: boolean;
  className?: string;
};

const ATTACHMENT_STATE: Record<FileDropzoneItemStatus, AttachmentState> = {
  processing: "processing",
  ready: "done",
  error: "error",
};

/** One uploaded file row — thumbnail, name, size, remove. */
function FileDropzoneFile({
  item,
  onRemove,
  copy,
  disabled = false,
  className,
}: FileDropzoneFileProps) {
  const status = item.status ?? "ready";
  return (
    <Attachment
      className={cn("w-full", className)}
      data-slot="file-dropzone-file"
      state={ATTACHMENT_STATE[status]}
    >
      <FileDropzoneThumb
        file={item.file}
        processing={status === "processing"}
      />
      <AttachmentContent>
        <AttachmentTitle>{item.name}</AttachmentTitle>
        <AttachmentDescription>
          {status === "processing"
            ? (item.statusMessage ?? "Processing…")
            : status === "error"
              ? (item.statusMessage ?? "Couldn’t add this file.")
              : `${(item.file.size / FILE_DROPZONE_MIB).toFixed(1)} MB${
                  item.convertedFromHeic
                    ? `. ${copy.convertedFromHeic ?? "Converted from HEIC"}`
                    : ""
                }`}
        </AttachmentDescription>
      </AttachmentContent>
      <AttachmentActions>
        {status === "error" && item.retry ? (
          <AttachmentAction
            aria-label={`${copy.retryFile ?? "Retry"}: ${item.name}`}
            disabled={disabled}
            onClick={() => item.retry?.()}
            type="button"
          >
            <ArrowsClockwise aria-hidden weight="regular" />
          </AttachmentAction>
        ) : null}
        <AttachmentAction
          aria-label={`${copy.removeFile}: ${item.name}`}
          disabled={disabled}
          onClick={() => onRemove(item.id)}
          type="button"
        >
          <X aria-hidden weight="regular" />
        </AttachmentAction>
      </AttachmentActions>
    </Attachment>
  );
}

type FileDropzoneFileListProps = {
  files: readonly FileDropzoneItem[];
  onRemove: (id: string) => void;
  copy: FileDropzoneFileCopy;
  disabled?: boolean;
  className?: string;
};

function FileDropzoneFileMotion({
  item,
  enter,
  spaced,
  onRemove,
  copy,
  disabled,
}: {
  item: FileDropzoneItem;
  enter: boolean;
  spaced: boolean;
  onRemove: (id: string) => void;
  copy: FileDropzoneFileCopy;
  disabled?: boolean;
}) {
  const [present, setPresent] = useState(!enter);
  const [exiting, setExiting] = useState(false);
  const onRemoveRef = useRef(onRemove);
  onRemoveRef.current = onRemove;

  useLayoutEffect(() => {
    if (!enter || prefersReducedMotion()) {
      setPresent(true);
      return;
    }
    const frame = requestAnimationFrame(() => setPresent(true));
    return () => cancelAnimationFrame(frame);
  }, [enter]);

  useEffect(() => {
    if (!exiting) return;
    const timer = window.setTimeout(
      () => onRemoveRef.current(item.id),
      FILE_ROW_MS,
    );
    return () => window.clearTimeout(timer);
  }, [exiting, item.id]);

  const open = present && !exiting;

  function startRemove() {
    if (exiting) return;
    if (prefersReducedMotion()) {
      onRemoveRef.current(item.id);
      return;
    }
    setExiting(true);
  }

  return (
    <div
      aria-hidden={exiting || undefined}
      className={cn(
        "grid transition-[grid-template-rows] duration-200 motion-reduce:transition-none",
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
      data-slot="file-dropzone-file-motion"
      onTransitionEnd={(event) => {
        if (
          exiting &&
          event.propertyName === "grid-template-rows" &&
          event.target === event.currentTarget
        ) {
          onRemoveRef.current(item.id);
        }
      }}
      style={{ transitionTimingFunction: FILE_ROW_EASE }}
    >
      <div className="overflow-hidden">
        <div
          className={cn(
            "transition-[opacity,transform,margin] duration-200 motion-reduce:transition-none",
            open
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0 motion-reduce:translate-y-0",
            spaced && open && "mt-1",
          )}
          style={{ transitionTimingFunction: FILE_ROW_EASE }}
        >
          <FileDropzoneFile
            copy={copy}
            disabled={disabled || exiting}
            item={item}
            onRemove={startRemove}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Stack of uploaded file rows. An empty list stays mounted (hidden) so a
 * file added later can play its enter transition.
 */
function FileDropzoneFileList({
  files,
  onRemove,
  copy,
  disabled = false,
  className,
}: FileDropzoneFileListProps) {
  const enteringIds = useEnteringFileIds(files);

  if (files.length === 0) {
    return <div className="hidden" data-slot="file-dropzone-file-list" />;
  }

  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="file-dropzone-file-list"
      gap="none"
      hAlign="stretch"
    >
      {files.map((item, index) => (
        <FileDropzoneFileMotion
          copy={copy}
          disabled={disabled}
          enter={enteringIds.has(item.id)}
          item={item}
          key={item.id}
          onRemove={onRemove}
          spaced={index > 0}
        />
      ))}
    </VStack>
  );
}

type FileDropzoneProps = {
  files: readonly FileDropzoneItem[];
  onChange: (files: FileDropzoneItem[]) => void;
  limits: FileDropzoneLimits;
  accept: string;
  copy: FileDropzoneCopy;
  onReject?: (reason: FileDropzoneRejectReason, detail?: string) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
};

/**
 * Controlled multi-file dropzone: target + file list.
 * Prefer `FileDropzoneTarget` / `FileDropzoneFileList` when composing layouts.
 *
 * Preview-first form primitive for payment-proof upload (limits, HEIC→JPEG).
 * Figma component set and Code Connect are TBC — no `.figma.ts` until the set
 * is published.
 */
function FileDropzone({
  files,
  onChange,
  limits,
  accept,
  copy,
  onReject,
  disabled = false,
  className,
  error,
}: FileDropzoneProps) {
  const [converting, setConverting] = useState(false);

  function removeAt(id: string) {
    onChange(files.filter((item) => item.id !== id));
  }

  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="file-dropzone"
      gap="sm"
      hAlign="stretch"
    >
      <FileDropzoneTarget
        accept={accept}
        converting={converting}
        copy={copy}
        disabled={disabled}
        files={files}
        limits={limits}
        onChange={onChange}
        onConvertingChange={setConverting}
        onReject={onReject}
      />
      <FileDropzoneFileList
        copy={copy}
        disabled={disabled || converting}
        files={files}
        onRemove={removeAt}
      />
      {error ? (
        <Text size="sm" tone="error">
          {error}
        </Text>
      ) : null}
    </VStack>
  );
}

export type {
  FileDropzoneFileListProps,
  FileDropzoneFileProps,
  FileDropzoneProps,
  FileDropzoneTargetProps,
};
export {
  FileDropzone,
  FileDropzoneFile,
  FileDropzoneFileList,
  FileDropzoneTarget,
  FileDropzoneThumb,
};
