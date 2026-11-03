import { cn } from "@grade10/design-system/lib/utils";
import { createContext, type ReactNode, use } from "react";
import { Link } from "react-router";
import type { PageMarks } from "../api/page-phases";
import type { Assignment, Phase } from "../api/phases";
import { STEP_LABEL, type Step } from "../api/readiness";
import type { RowVerdict } from "../api/verdicts";

/**
 * The chips a phase wears: its name and release priority, a unit's step on
 * the readiness ladder, the Unplanned count and a case's latest verdict.
 * One look for the page, the QA tab and the board.
 */

export const STEP_TONE: Record<Step, { dot: string; chip: string }> = {
  planned: {
    dot: "bg-step-planned",
    chip: "border-step-planned/40 bg-step-planned/12",
  },
  "no-suite": {
    dot: "bg-muted-foreground",
    chip: "border-dashed border-muted-foreground/50 bg-muted",
  },
  prepared: {
    dot: "bg-step-prepared",
    chip: "border-step-prepared/40 bg-step-prepared/12",
  },
  reviewed: {
    dot: "bg-step-reviewed",
    chip: "border-step-reviewed/40 bg-step-reviewed/12",
  },
  "in-qa": {
    dot: "bg-step-in-qa",
    chip: "border-step-in-qa/40 bg-step-in-qa/12",
  },
  failing: {
    dot: "bg-step-failing",
    chip: "border-step-failing/40 bg-step-failing/12",
  },
  blocked: {
    dot: "bg-step-blocked",
    chip: "border-step-blocked/40 bg-step-blocked/12",
  },
  passed: {
    dot: "bg-step-passed",
    chip: "border-step-passed/40 bg-step-passed/12",
  },
  released: {
    dot: "bg-step-passed",
    chip: "border-step-passed/40 bg-step-passed/25",
  },
};

const PILL =
  "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1 font-medium text-foreground text-xs leading-none";

export function StepChip({
  step,
  className,
}: {
  step: Step;
  className?: string;
}) {
  return (
    <span className={cn(PILL, STEP_TONE[step].chip, className)}>
      <span
        aria-hidden
        className={cn("size-1.5 shrink-0 rounded-full", STEP_TONE[step].dot)}
      />
      {STEP_LABEL[step]}
    </span>
  );
}

export function UnplannedChip({ count }: { count: number }) {
  return (
    <span
      className={cn(PILL, "border-dashed border-muted-foreground/50 bg-muted")}
      title={`${count} line${count === 1 ? "" : "s"} still being built in no phase`}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-muted-foreground" />
      Unplanned
      <span className="font-mono tabular-nums">{count}</span>
    </span>
  );
}

export function AtRiskChip() {
  return (
    <span
      className={cn(
        PILL,
        "border-destructive-border bg-destructive-muted text-destructive-muted-foreground",
      )}
      title="A P0 not passed within 7 days of its phase's target"
    >
      At risk
    </span>
  );
}

/** A phase and its release priority, linked to the phase's board. Dashed
 * where it marks a part launching apart from the lines around it. */
export function PhaseChip({
  phase,
  assignment,
  small = false,
  apart = false,
}: {
  phase?: Phase;
  assignment: Assignment;
  small?: boolean;
  apart?: boolean;
}) {
  const name = phase?.name ?? assignment.phase;
  return (
    <Link
      aria-label={`${name}, ${assignment.priority}: open the phase board`}
      className={cn(
        "inline-flex shrink-0 items-stretch overflow-hidden whitespace-nowrap rounded-(--radius-md) border border-border-strong bg-background align-middle font-medium font-sans text-foreground leading-none no-underline outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
        small ? "text-[0.6875rem]" : "text-xs",
        apart && "border-dashed text-secondary-foreground",
      )}
      title={phase?.target ? `Target ${phase.target}` : undefined}
      to={`/phases/${assignment.phase}`}
    >
      <span className={small ? "px-1.5 py-[3px]" : "px-2 py-1"}>{name}</span>
      <span
        className={cn(
          "border-border-strong border-l bg-muted font-mono font-semibold",
          small ? "px-1.5 py-[3px]" : "px-2 py-1",
        )}
      >
        {assignment.priority}
      </span>
    </Link>
  );
}

export const VERDICT_LABEL: Record<RowVerdict | "stale", string> = {
  pass: "pass",
  fail: "fail",
  blocked: "blocked",
  notrun: "to do",
  skipped: "skipped",
  na: "n/a",
  stale: "stale",
};

const VERDICT_TONE: Record<RowVerdict | "stale", string> = {
  pass: "border-step-passed/40 bg-step-passed/15",
  fail: "border-step-failing/40 bg-step-failing/15",
  blocked: "border-step-blocked/40 bg-step-blocked/15",
  notrun: "border-border bg-background",
  skipped: "border-border bg-muted",
  na: "border-border bg-muted text-muted-foreground",
  stale: "border-dashed border-muted-foreground/50 text-muted-foreground",
};

/** A case's latest verdict, as the desk holds it. */
export function VerdictPip({
  verdict,
  title,
}: {
  verdict: RowVerdict | "stale";
  title?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-(--radius-sm) border px-1.5 py-0.5 font-medium font-mono text-[0.6875rem] leading-none",
        VERDICT_TONE[verdict],
      )}
      title={title}
    >
      {VERDICT_LABEL[verdict]}
    </span>
  );
}

/** What a page's prose reads to put a chip on a heading or a rule. */
export type PhaseMarksScope = {
  marks: PageMarks;
  phases: Phase[];
};

const PhaseMarksContext = createContext<PhaseMarksScope | null>(null);

export function PhaseMarksProvider({
  value,
  children,
}: {
  value: PhaseMarksScope | null;
  children: ReactNode;
}) {
  return <PhaseMarksContext value={value}>{children}</PhaseMarksContext>;
}

export function usePhaseMarks(): PhaseMarksScope | null {
  return use(PhaseMarksContext);
}

export function phaseNamed(phases: Phase[], id: string): Phase | undefined {
  return phases.find((phase) => phase.id === id);
}
