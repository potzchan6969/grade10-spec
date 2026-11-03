import type { DeskVerdicts } from "./desk.ts";
import type { Phase, Unit } from "./phases.ts";
import { caseVerdict, type RowVerdict } from "./verdicts.ts";

/**
 * Where a unit stands on the readiness ladder, read from the pages, the
 * suites and the run desk — never set by hand. Pure, so the QA tab, the
 * board, the run sheet and the release command read one answer.
 */

export const STEPS = [
  "planned",
  "no-suite",
  "prepared",
  "reviewed",
  "in-qa",
  "failing",
  "blocked",
  "passed",
  "released",
] as const;
export type Step = (typeof STEPS)[number];

export const STEP_LABEL: Record<Step, string> = {
  planned: "Planned",
  "no-suite": "No suite",
  prepared: "Prepared",
  reviewed: "Reviewed",
  "in-qa": "In QA",
  failing: "Failing",
  blocked: "Blocked",
  passed: "Passed",
  released: "Released",
};

/** Ready for a run: reviewed or further. */
export const READY_STEPS: Step[] = [
  "reviewed",
  "in-qa",
  "failing",
  "blocked",
  "passed",
];

/** A case of a unit, as its suite writes it. */
export type UnitCase = {
  id: string;
  title?: string;
  marker?: string;
  rev?: number;
  status?: string;
  /** The rules of the unit it traces; empty for a case on the whole section
   * or a capability's suite. */
  rules: string[];
};

export type Turn = {
  role: "qa" | "pm" | "dev" | "assignee";
  why: string;
};

export type CaseResult = {
  id: string;
  verdict: RowVerdict | "stale";
  run?: string;
  triages: string[];
  /** An automated fail beside a person's pass, untriaged. */
  automatedFail?: boolean;
};

export type Readiness = {
  step: Step;
  cases: number;
  drafts: number;
  /** Rules no case traces yet. */
  uncovered: string[];
  questions: number;
  building: number;
  /** Cases whose latest verdict is from an older revision of the case. */
  stale: number;
  counts: Record<"pass" | "fail" | "blocked" | "notrun" | "skipped", number>;
  untriagedAutomatedFails: number;
  deferred: number;
  /** How many failing or blocked cases carry each triage; `untriaged` for
   * the rest. */
  triages: Record<string, number>;
  /** Cases a finalized run of this phase left out, with the reason. */
  excluded: { id: string; reason: string }[];
  /** The newest run holding the unit's cases. */
  run?: string;
  results: CaseResult[];
  waitingOn: Turn[];
};

/** The latest verdict of a case on an environment, matched by its marker
 * where it has one — a heading renamed keeps its results. */
export function resultOf(
  verdicts: DeskVerdicts | undefined,
  env: string,
  one: UnitCase,
): CaseResult | undefined {
  const byCase = verdicts?.cases[env];
  if (!byCase) return undefined;
  const found =
    byCase[one.id] ??
    (one.marker
      ? Object.values(byCase).find((held) => held.marker === one.marker)
      : undefined);
  if (!found) return undefined;
  if (
    one.rev !== undefined &&
    found.rev !== undefined &&
    found.rev !== one.rev
  ) {
    return { id: one.id, verdict: "stale", run: found.run, triages: [] };
  }
  const reading = caseVerdict(found.rows);
  return {
    id: one.id,
    verdict: reading.verdict,
    run: found.run,
    triages: reading.triages,
    ...(reading.untriagedAutomatedFail ? { automatedFail: true } : {}),
  };
}

const TRIAGE_TURN: Record<string, Turn["role"]> = {
  bug: "assignee",
  spec: "pm",
  case: "qa",
  environment: "dev",
  data: "qa",
  flaky: "dev",
  deferred: "qa",
  untriaged: "qa",
};

/** Run ids count up, so the newest is the one that sorts last as a number. */
const newerRun = (a: string, b: string) =>
  a.localeCompare(b, "en", { numeric: true }) > 0;

export function readinessOf(
  unit: Unit,
  allCases: UnitCase[],
  phase: Phase | undefined,
  verdicts?: DeskVerdicts,
): Readiness {
  const excludedHere = verdicts?.excluded[unit.phase] ?? {};
  const excluded =
    unit.kind === "section"
      ? []
      : allCases
          .filter((one) => excludedHere[one.id] !== undefined)
          .map((one) => ({ id: one.id, reason: excludedHere[one.id] }));
  const cases = allCases.filter(
    (one) => !excluded.some((left) => left.id === one.id),
  );
  const drafts = cases.filter((one) => one.status === "draft").length;
  const traced = new Set(cases.flatMap((one) => one.rules));
  const uncovered =
    unit.kind === "section"
      ? unit.rules.filter((rule) => !traced.has(rule))
      : [];

  const counts = { pass: 0, fail: 0, blocked: 0, notrun: 0, skipped: 0 };
  const triages: Record<string, number> = {};
  let stale = 0;
  let untriagedAutomatedFails = 0;
  let deferred = 0;
  let run: string | undefined;
  let ran = 0;
  const results: CaseResult[] = [];
  const env = phase?.env ?? "";
  for (const one of cases) {
    const found = resultOf(verdicts, env, one);
    if (!found) {
      counts.notrun += 1;
      continue;
    }
    results.push(found);
    ran += 1;
    if (
      found.run !== undefined &&
      (run === undefined || newerRun(found.run, run))
    )
      run = found.run;
    if (found.verdict === "stale") {
      stale += 1;
      counts.notrun += 1;
      continue;
    }
    const verdict = found.verdict === "na" ? "skipped" : found.verdict;
    counts[verdict] += 1;
    if (found.automatedFail) untriagedAutomatedFails += 1;
    if (verdict === "fail" || verdict === "blocked") {
      const named = found.triages.length > 0 ? found.triages : ["untriaged"];
      for (const triage of named) triages[triage] = (triages[triage] ?? 0) + 1;
    }
    if (verdict === "skipped" && found.triages.includes("deferred"))
      deferred += 1;
  }

  const step = stepOf();
  return {
    step,
    cases: cases.length,
    drafts,
    uncovered,
    questions: unit.questions,
    building: unit.building,
    stale,
    counts,
    untriagedAutomatedFails,
    deferred,
    triages,
    excluded,
    ...(run ? { run } : {}),
    results,
    waitingOn: turnsOf(),
  };

  function stepOf(): Step {
    if (phase?.released) return "released";
    if (cases.length === 0)
      return unit.kind === "section" ? "planned" : "no-suite";
    if (uncovered.length > 0) return "planned";
    if (drafts > 0) return "prepared";
    if (ran === 0) return "reviewed";
    if (counts.fail > 0) return "failing";
    if (counts.blocked > 0) return "blocked";
    if (counts.pass === cases.length) return "passed";
    return "in-qa";
  }

  function turnsOf(): Turn[] {
    const turns: Turn[] = [];
    const plural = (count: number, word: string) =>
      `${count} ${word}${count === 1 ? "" : "s"}`;
    switch (step) {
      case "planned":
        turns.push({
          role: "qa",
          why:
            uncovered.length > 0
              ? `write cases for ${plural(uncovered.length, "rule")}`
              : "write its cases",
        });
        break;
      case "no-suite":
        turns.push({
          role: "qa",
          why: unit.spec
            ? `write ${unit.spec}'s suite`
            : "name the page's capability, then write its suite",
        });
        break;
      case "prepared":
        turns.push({
          role: "qa",
          why: `review ${plural(drafts, "draft case")}`,
        });
        break;
      case "reviewed":
        turns.push({ role: "qa", why: "run its cases" });
        break;
      case "in-qa":
        turns.push({
          role: "qa",
          why: `walk ${plural(counts.notrun + counts.skipped, "case")}`,
        });
        break;
      case "failing":
      case "blocked":
        for (const [triage, count] of Object.entries(triages)) {
          turns.push({
            role: TRIAGE_TURN[triage] ?? "qa",
            why:
              triage === "untriaged"
                ? `triage ${plural(count, "case")}`
                : `${plural(count, "case")} ${triage}`,
          });
        }
        break;
      default:
        break;
    }
    if (untriagedAutomatedFails > 0) {
      turns.push({
        role: "qa",
        why: `triage ${plural(untriagedAutomatedFails, "automated fail")}`,
      });
    }
    if (unit.questions > 0 && step !== "released") {
      turns.push({
        role: "pm",
        why: `answer ${plural(unit.questions, "question")}`,
      });
    }
    return turns;
  }
}

/** Whether a unit holds its phase's release: a P0 not passed, or one that
 * would launch with a question in it. */
export function holdsRelease(unit: Unit, readiness: Readiness): boolean {
  if (readiness.step === "released") return false;
  const launches = unit.priority === "P0" || readiness.step === "passed";
  if (unit.priority === "P0" && readiness.step !== "passed") return true;
  if (unit.priority === "P0" && readiness.deferred > 0) return true;
  return (
    launches &&
    (readiness.questions > 0 || readiness.untriagedAutomatedFails > 0)
  );
}

/** A P0 unit not passed within 7 days of its phase's target: on the board
 * only, since the check reads nothing live. */
export function atRisk(
  unit: Unit,
  readiness: Readiness,
  phase: Phase | undefined,
  today: Date,
): boolean {
  if (unit.priority !== "P0" || !phase?.target || readiness.step === "passed")
    return false;
  if (readiness.step === "released") return false;
  const target = new Date(
    phase.target.length === 7 ? `${phase.target}-01` : phase.target,
  );
  return target.getTime() - today.getTime() <= 7 * 24 * 60 * 60 * 1000;
}
