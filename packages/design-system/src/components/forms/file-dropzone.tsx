import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import {
  File as FileGlyph,
  FilePdf,
  Trash,
  UploadSimple,
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

export type FileDropzoneItem = {
  id: string;
  file: File;
  /** Display name after any conversion (e.g. HEIC → JPEG). */
  name: string;
  /** True when the original was HEIC/HEIF and was converted for storage. */
  convertedFromHeic?: boolean;
};

export type FileDropzoneTargetCopy = {
  idleTitle: string;
  idleDescription: string;
  chooseFiles: string;
  converting: string;
};

export type FileDropzoneFileCopy = {
  removeFile: string;
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
  files: readonly FileDropzoneItem[];
  limits: FileDropzoneLimits;
  accept: string;
  onChange: (files: FileDropzoneItem[]) => void;
  onReject?: (reason: FileDropzoneRejectReason, detail?: string) => void;
};

async function ingestFiles(
  rawList: FileList | File[],
  context: IngestContext,
): Promise<void> {
  const { files, limits, accept, onChange, onReject } = context;
  const remainingSlots = Math.max(0, limits.maxFiles - files.length);
  const currentTotal = files.reduce((sum, item) => sum + item.file.size, 0);
  const incoming = Array.from(rawList);
  if (incoming.length === 0) return;

  if (incoming.length > remainingSlots) {
    onReject?.("too_many", `Up to ${limits.maxFiles} files.`);
    return;
  }

  const next: FileDropzoneItem[] = [...files];
  let runningTotal = currentTotal;

  for (const raw of incoming) {
    if (!isAllowedType(raw, accept)) {
      onReject?.("type", raw.name);
      return;
    }
    if (raw.size > limits.maxBytesPerFile) {
      onReject?.(
        "too_large_file",
        `Each file must be ${Math.floor(limits.maxBytesPerFile / FILE_DROPZONE_MIB)} MB or less.`,
      );
      return;
    }

    let file = raw;
    let convertedFromHeic = false;
    if (isHeicFile(raw)) {
      try {
        file = await convertHeicToJpeg(raw);
        convertedFromHeic = true;
      } catch {
        onReject?.("convert_failed", raw.name);
        return;
      }
    }

    if (file.size > limits.maxBytesPerFile) {
      onReject?.(
        "too_large_file",
        `Each file must be ${Math.floor(limits.maxBytesPerFile / FILE_DROPZONE_MIB)} MB or less.`,
      );
      return;
    }
    if (runningTotal + file.size > limits.maxBytesTotal) {
      onReject?.(
        "too_large_total",
        `All files together must be ${Math.floor(limits.maxBytesTotal / FILE_DROPZONE_MIB)} MB or less.`,
      );
      return;
    }

    runningTotal += file.size;
    next.push({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      name: file.name,
      convertedFromHeic,
    });
  }

  onChange(next);
}

/** Square preview: image thumbnail, or icon tile for PDF / other. */
function FileDropzoneThumb({ file }: { file: File }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isImageFile(file)) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (previewUrl) {
    return (
      <span
        aria-hidden
        className="relative size-10 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
        data-slot="file-dropzone-thumb"
      >
        <img alt="" className="size-full object-cover" src={previewUrl} />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-secondary-foreground"
      data-slot="file-dropzone-thumb"
    >
      {isPdfFile(file) ? (
        <FilePdf size={20} weight="regular" />
      ) : (
        <FileGlyph size={20} weight="regular" />
      )}
    </span>
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

  const remainingSlots = Math.max(0, limits.maxFiles - files.length);
  const inactive = disabled || converting || remainingSlots === 0;

  async function ingest(rawList: FileList | File[]) {
    if (disabled || converting) return;

    setConverting(true);
    try {
      await ingestFiles(rawList, { files, limits, accept, onChange, onReject });
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

/** One uploaded file row — thumbnail, name, size, remove. */
function FileDropzoneFile({
  item,
  onRemove,
  copy,
  disabled = false,
  className,
}: FileDropzoneFileProps) {
  return (
    <HStack
      className={cn(
        "w-full rounded-xl border border-border bg-card px-3 py-2",
        className,
      )}
      data-slot="file-dropzone-file"
      gap="sm"
      vAlign="center"
    >
      <FileDropzoneThumb file={item.file} />
      <VStack className="min-w-0 flex-1" gap="none" hAlign="stretch">
        <span className="truncate text-sm leading-5 font-medium text-foreground">
          {item.name}
        </span>
        <Text size="sm" tone="secondary">
          {(item.file.size / FILE_DROPZONE_MIB).toFixed(1)} MB
          {item.convertedFromHeic
            ? `. ${copy.convertedFromHeic ?? "Converted from HEIC"}`
            : ""}
        </Text>
      </VStack>
      <IconButton
        aria-label={`${copy.removeFile}: ${item.name}`}
        disabled={disabled}
        onClick={() => onRemove(item.id)}
        size="xs"
        type="button"
        variant="ghost"
      >
        <Trash aria-hidden />
      </IconButton>
    </HStack>
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
