import { DetailRow } from "@grade10/design-system/components/display/detail-row";
import { Button } from "@grade10/design-system/components/forms/button";
import { cn } from "@grade10/design-system/lib/utils";
import {
  ArrowCounterClockwise,
  ArrowsClockwise,
  CalendarX,
  Check,
  CheckCircle,
  Clock,
  type Icon,
  Lightning,
  MagnifyingGlass,
  Prohibit,
  Question,
  Scan,
  X,
} from "@phosphor-icons/react";
import type { ReactNode } from "react";
import type { DoorAnswerKind, DoorDetail, DoorLayout } from "./types";

type DoorAnswerCopy = {
  /** "Scan next" */
  scanNext: string;
  /** "Use Fast Pass" */
  useFastPass: string;
  /** "Undo Fast Pass" */
  undoFastPass: string;
  /** "Try Again" */
  tryAgain: string;
  /** "Find by reference" */
  findByReference: string;
};

/**
 * The Fast Pass line on an admitted answer.
 * - `available` — a use is left for today: Use Fast Pass spends it
 * - `used` — spent on this entry: Undo Fast Pass gives it back
 * - `none` — a quiet line and no button: "Fast Pass: none", "…: all used"
 */
type DoorAnswerFastPass =
  | { state: "available"; label: string; pending?: boolean }
  | { state: "used"; label: string; pending?: boolean }
  | { state: "none"; label: string };

type DoorAnswerProps = {
  layout: DoorLayout;
  /** Picks the tone and the icon. */
  kind: DoorAnswerKind;
  /** The answer's word, set large in capitals: "Admitted". */
  title: string;
  /** What to do, in one line: "Let them in." */
  line: string;
  details?: readonly DoorDetail[];
  /** A sentence for staff under the details. */
  note?: string;
  fastPass?: DoorAnswerFastPass;
  /** The undo slot beside Scan next, a `DoorUndoBar` while it counts. */
  undo?: ReactNode;
  copy: DoorAnswerCopy;
  onScanNext: () => void;
  onUseFastPass?: () => void;
  onUndoFastPass?: () => void;
  /** Shown as the first action when given, Not checked's Try Again. */
  onTryAgain?: () => void;
  /** Shown beside Scan next when given, Not a ticket's way on. */
  onFindByReference?: () => void;
};

type Tone = "success" | "warning" | "destructive" | "info" | "neutral";

const TONE_OF: Record<DoorAnswerKind, Tone> = {
  admitted: "success",
  alreadyAdmitted: "warning",
  noEntriesLeft: "destructive",
  void: "destructive",
  eventCancelled: "destructive",
  notATicket: "destructive",
  wrongEvent: "destructive",
  notValidToday: "destructive",
  notChecked: "info",
  undone: "neutral",
};

const ICON_OF: Record<DoorAnswerKind, Icon> = {
  admitted: Check,
  alreadyAdmitted: Clock,
  noEntriesLeft: Prohibit,
  void: X,
  eventCancelled: CalendarX,
  notATicket: X,
  wrongEvent: X,
  notValidToday: CalendarX,
  notChecked: Question,
  undone: ArrowCounterClockwise,
};

const SURFACE: Record<Tone, string> = {
  success: "bg-success-muted",
  warning: "bg-warning-muted",
  destructive: "bg-destructive-muted",
  info: "bg-info/10",
  neutral: "bg-muted",
};

const DISC: Record<Tone, string> = {
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  info: "bg-info text-info-foreground",
  neutral: "bg-secondary-foreground text-background",
};

function FastPassLine({
  fastPass,
  layout,
  copy,
  onUseFastPass,
  onUndoFastPass,
}: {
  fastPass: DoorAnswerFastPass;
  layout: DoorLayout;
  copy: DoorAnswerCopy;
  onUseFastPass?: () => void;
  onUndoFastPass?: () => void;
}) {
  if (fastPass.state === "none") {
    return (
      <p className="flex items-center gap-2 text-sm text-secondary-foreground">
        <Lightning aria-hidden size={16} />
        {fastPass.label}
      </p>
    );
  }
  const used = fastPass.state === "used";
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border p-3",
        layout === "phone"
          ? "flex-col"
          : "flex-row items-center justify-between",
        used
          ? "border-success-border bg-success-muted"
          : "border-border bg-background",
      )}
      data-slot="door-answer-fast-pass"
    >
      <span className="flex items-center gap-2 text-base font-medium">
        {used ? (
          <span aria-hidden className="inline-flex text-success">
            <CheckCircle size={18} />
          </span>
        ) : (
          <Lightning aria-hidden size={18} />
        )}
        {fastPass.label}
      </span>
      <Button
        className={layout === "phone" ? "w-full" : undefined}
        leading={used ? <ArrowCounterClockwise /> : <Lightning />}
        loading={fastPass.pending}
        onClick={used ? onUndoFastPass : onUseFastPass}
        size={layout === "phone" ? "lg" : "md"}
        variant="outline"
      >
        {used ? copy.undoFastPass : copy.useFastPass}
      </Button>
    </div>
  );
}

/**
 * One answer at the door, the same on a phone and in the console: a tone, an
 * icon and a word large enough to read at arm's length with the sound off,
 * the line that says what to do, the ticket's details, Use Fast Pass on an
 * admitted ticket, and the way on.
 */
function DoorAnswer({
  layout,
  kind,
  title,
  line,
  details = [],
  note,
  fastPass,
  undo,
  copy,
  onScanNext,
  onUseFastPass,
  onUndoFastPass,
  onTryAgain,
  onFindByReference,
}: DoorAnswerProps) {
  const tone = TONE_OF[kind];
  const Glyph = ICON_OF[kind];
  const phone = layout === "phone";
  const noteFirst = kind === "notChecked";

  const heading = (
    <div
      aria-live="assertive"
      className={cn(
        "flex",
        phone
          ? cn(
              "flex-col items-center gap-2 px-4 pt-6 pb-6 text-center",
              SURFACE[tone],
            )
          : "items-center gap-4",
      )}
      role="status"
    >
      <span
        aria-hidden
        className={cn(
          "grid shrink-0 place-items-center rounded-full",
          phone ? "size-16" : "size-14",
          DISC[tone],
        )}
      >
        <Glyph size={phone ? 34 : 28} weight="bold" />
      </span>
      <span className={cn("flex flex-col", phone ? "gap-2" : "gap-0.5")}>
        <span
          className={cn(
            "font-heading font-bold tracking-tight uppercase",
            phone ? "text-4xl leading-none" : "text-3xl leading-9",
          )}
        >
          {title}
        </span>
        <span className="text-base">{line}</span>
      </span>
    </div>
  );

  const noteText = note ? (
    <p className="text-sm text-secondary-foreground">{note}</p>
  ) : null;

  const detailList =
    details.length > 0 ? (
      <div
        className={cn(
          "flex flex-col",
          !phone && "rounded-xl bg-background px-3",
        )}
      >
        {details.map((detail, index) => (
          <DetailRow
            className={cn(
              index === details.length - 1 && !phone && "border-b-0",
            )}
            key={detail.label}
            label={detail.label}
          >
            {detail.code ? (
              <span className="font-mono">{detail.value}</span>
            ) : (
              detail.value
            )}
          </DetailRow>
        ))}
      </div>
    ) : null;

  const tryAgainFirst = onTryAgain !== undefined;
  const actions = (
    <div
      className={cn(
        "flex gap-2",
        phone ? "mt-auto flex-col px-4 pt-4 pb-4" : "flex-wrap justify-end",
      )}
    >
      {onTryAgain ? (
        <Button
          className={phone ? "w-full" : undefined}
          leading={<ArrowsClockwise />}
          onClick={onTryAgain}
          size={phone ? "lg" : "md"}
        >
          {copy.tryAgain}
        </Button>
      ) : null}
      {onFindByReference ? (
        <Button
          className={phone ? "w-full" : undefined}
          leading={<MagnifyingGlass />}
          onClick={onFindByReference}
          size={phone ? "lg" : "md"}
          variant="outline"
        >
          {copy.findByReference}
        </Button>
      ) : null}
      {undo ? (
        <div className={cn("flex", phone && "[&>*]:w-full")}>{undo}</div>
      ) : null}
      <Button
        className={phone ? "w-full" : undefined}
        leading={<Scan />}
        onClick={onScanNext}
        size={phone ? "lg" : "md"}
        variant={tryAgainFirst ? "outline" : "default"}
      >
        {copy.scanNext}
      </Button>
    </div>
  );

  const fastPassLine = fastPass ? (
    <FastPassLine
      copy={copy}
      fastPass={fastPass}
      layout={layout}
      onUndoFastPass={onUndoFastPass}
      onUseFastPass={onUseFastPass}
    />
  ) : null;

  if (phone) {
    return (
      <div
        className="flex flex-1 flex-col"
        data-kind={kind}
        data-slot="door-answer"
      >
        {heading}
        <div className="flex flex-col gap-4 px-4 pt-4">
          {fastPassLine}
          {noteFirst ? noteText : null}
          {detailList}
          {noteFirst ? null : noteText}
        </div>
        {actions}
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col gap-4 rounded-2xl p-5", SURFACE[tone])}
      data-kind={kind}
      data-slot="door-answer"
    >
      {heading}
      {fastPassLine}
      {noteFirst ? noteText : null}
      {detailList}
      {noteFirst ? null : noteText}
      {actions}
    </div>
  );
}

export {
  DoorAnswer,
  type DoorAnswerCopy,
  type DoorAnswerFastPass,
  type DoorAnswerProps,
};
