import { cn } from "@grade10/design-system/lib/utils";
import { MARK_LABEL, type MarkValue } from "../../api/desk";

/** One colour per word of QA's six, the Sheet's own: pass green, fail red,
 * blocked amber, skipped blue, to do and n/a quiet. */
export const MARK_FILL: Record<MarkValue, string> = {
  pass: "bg-success",
  fail: "bg-destructive",
  blocked: "bg-warning",
  skipped: "bg-info",
  todo: "bg-border-strong",
  na: "bg-muted",
};

const MARK_CHIP: Record<MarkValue, string> = {
  pass: "bg-success text-success-foreground",
  fail: "bg-destructive text-destructive-foreground",
  blocked: "bg-warning text-warning-foreground",
  skipped: "bg-info text-info-foreground",
  todo: "border border-border-strong text-secondary-foreground",
  na: "bg-muted text-muted-foreground",
};

/** Each word's letter, so a pip never says it by colour alone; to do is
 * the empty box. */
export const MARK_LETTER: Record<MarkValue, string> = {
  pass: "P",
  fail: "F",
  blocked: "B",
  skipped: "S",
  na: "–",
  todo: "",
};

export function Pip({
  value,
  pending = false,
  title,
}: {
  value: MarkValue;
  pending?: boolean;
  title?: string;
}) {
  return (
    <i
      aria-hidden
      className={cn(
        "flex size-3.5 shrink-0 items-center justify-center rounded-[3px] font-bold font-mono text-[0.5625rem] not-italic leading-none",
        MARK_CHIP[value],
        pending && "animate-pulse",
      )}
      data-pip={value}
      title={title}
    >
      {MARK_LETTER[value]}
    </i>
  );
}

export function MarkChip({
  value,
  pending = false,
  className,
}: {
  value: MarkValue;
  pending?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-(--radius-sm) px-1.5 font-medium text-[0.6875rem] leading-none",
        MARK_CHIP[value],
        pending && "opacity-70",
        className,
      )}
      data-mark={value}
    >
      {MARK_LABEL[value]}
    </span>
  );
}
