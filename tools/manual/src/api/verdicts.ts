import type { Mark, MarkValue, Surface } from "./desk.ts";

/**
 * One verdict per row, and a case's from its rows — the rule the run
 * header, the QA tab, the board and the release command all count by.
 */

export type RowVerdict =
  | "pass"
  | "fail"
  | "blocked"
  | "notrun"
  | "skipped"
  | "na";

/** Worst first: a case takes its worst row. */
const ORDER: RowVerdict[] = [
  "fail",
  "blocked",
  "notrun",
  "skipped",
  "pass",
  "na",
];

export const worst = (verdicts: RowVerdict[]): RowVerdict =>
  verdicts.reduce<RowVerdict>(
    (found, one) => (ORDER.indexOf(one) < ORDER.indexOf(found) ? one : found),
    "na",
  );

const AS_VERDICT: Record<MarkValue, RowVerdict> = {
  todo: "notrun",
  pass: "pass",
  fail: "fail",
  blocked: "blocked",
  skipped: "skipped",
  na: "na",
};

export type RowReading = {
  verdict: RowVerdict;
  /** An automated fail beside a person's pass, not yet triaged: the row
   * counts as a pass, and the phase cannot sign off until it is. */
  untriagedAutomatedFail: boolean;
};

const PERSON: Surface[] = ["web", "mobile"];
const AUTO: Surface[] = ["autoWeb", "autoMobile"];

/** A row's verdict from its current marks. Where Web or Mobile is in play,
 * a person's marks decide; automation decides alone only on a row nobody
 * can walk. A surface nobody marked is to do, unless it never was in play. */
export function rowVerdict(
  marks: Partial<Record<Surface, Pick<Mark, "value" | "triage">>>,
  inPlay: Surface[] = ["web", "mobile"],
): RowReading {
  const markOn = (surface: Surface): MarkValue =>
    marks[surface]?.value ?? (inPlay.includes(surface) ? "todo" : "na");
  const person = PERSON.filter((surface) => markOn(surface) !== "na");
  const auto = AUTO.filter((surface) => markOn(surface) !== "na");
  if (person.length > 0) {
    const verdict = worst(person.map((surface) => AS_VERDICT[markOn(surface)]));
    const untriagedAutomatedFail =
      verdict === "pass" &&
      auto.some(
        (surface) => markOn(surface) === "fail" && !marks[surface]?.triage,
      );
    return { verdict, untriagedAutomatedFail };
  }
  if (auto.length > 0) {
    return {
      verdict: worst(auto.map((surface) => AS_VERDICT[markOn(surface)])),
      untriagedAutomatedFail: false,
    };
  }
  return { verdict: "na", untriagedAutomatedFail: false };
}

/** The current mark per surface out of a row's marks, newest winning. */
export function currentMarks(marks: Mark[]): Partial<Record<Surface, Mark>> {
  const current: Partial<Record<Surface, Mark>> = {};
  for (const mark of marks) {
    const held = current[mark.surface];
    if (!held || held.seq < mark.seq) current[mark.surface] = mark;
  }
  return current;
}

export type CaseReading = {
  verdict: RowVerdict;
  untriagedAutomatedFail: boolean;
  /** Triage on the marks that make the verdict: what is failing and why. */
  triages: string[];
  /** A skip marked deferred: a P0 unit waits for it. */
  deferred: boolean;
};

/** A case's verdict: its worst row. A case whose rows are all n/a is
 * skipped — nobody walked it, and nothing says it works. */
export function caseVerdict(
  rows: { marks: Mark[]; inPlay?: Surface[] }[],
): CaseReading {
  const readings = rows.map((row) => {
    const current = currentMarks(row.marks);
    return { current, ...rowVerdict(current, row.inPlay) };
  });
  const verdict = worst(readings.map((one) => one.verdict));
  const triages = new Set<string>();
  let deferred = false;
  for (const one of readings) {
    if (one.verdict !== verdict) continue;
    for (const mark of Object.values(one.current)) {
      if (!mark?.triage) continue;
      if (AS_VERDICT[mark.value] === verdict) triages.add(mark.triage);
      if (mark.value === "skipped" && mark.triage === "deferred")
        deferred = true;
    }
  }
  return {
    verdict: verdict === "na" ? "skipped" : verdict,
    untriagedAutomatedFail: readings.some((one) => one.untriagedAutomatedFail),
    triages: [...triages],
    deferred,
  };
}
