import type { DeskVerdicts } from "./desk.ts";
import { comparePriority, nextPhase, type Phase, type Unit } from "./phases.ts";
import {
  holdsRelease,
  type Readiness,
  readinessOf,
  STEPS,
  type Step,
  type Turn,
} from "./readiness.ts";
import type { TeamMember } from "./types.ts";
import type { ReleaseReading } from "./units.ts";

/**
 * The phase board's readings: each unit with its readiness, the release's
 * own check, whose turn each unit is, QA's queue and every phase counted.
 * Pure over one reading and the desk's verdicts, so the board and the
 * release command count alike.
 */

export type UnitReading = {
  unit: Unit;
  readiness: Readiness;
  phase?: Phase;
};

export function readUnits(
  reading: ReleaseReading,
  verdicts?: DeskVerdicts,
): UnitReading[] {
  const byId = new Map(reading.phases.map((phase) => [phase.id, phase]));
  return reading.units.map((unit) => {
    const phase = byId.get(unit.phase);
    return {
      unit,
      phase,
      readiness: readinessOf(unit, reading.casesOf(unit), phase, verdicts),
    };
  });
}

/** A phase's units, P0 first, in page order within a priority. */
export function unitsIn(readings: UnitReading[], phase: string): UnitReading[] {
  return readings
    .filter((one) => one.unit.phase === phase)
    .map((one, order) => ({ one, order }))
    .sort(
      (a, b) =>
        comparePriority(a.one.unit.priority, b.one.unit.priority) ||
        a.order - b.order,
    )
    .map(({ one }) => one);
}

/** The phase a board opens on: the first not released, else the last. */
export function firstUnreleased(phases: Phase[]): Phase | undefined {
  return phases.find((phase) => !phase.released) ?? phases.at(-1);
}

const settled = (step: Step) => step === "passed" || step === "released";

export type ReleaseCheck = {
  p0: { passed: number; total: number };
  /** Units failing or blocked, and how many of them carry each triage. */
  failing: { units: number; byTriage: [string, number][] };
  untriagedAutomatedFails: number;
  /** Questions in the units that would launch: every P0, and every unit
   * passed. */
  questions: { count: number; units: number };
  /** P1 and P2 units not passed, which move at release. */
  moves: { units: number; byPriority: Record<"P1" | "P2", number> };
  to?: Phase;
  launches: boolean;
};

export function releaseCheck(
  inPhase: UnitReading[],
  phases: Phase[],
  phase: string,
): ReleaseCheck {
  const p0 = inPhase.filter((one) => one.unit.priority === "P0");
  const failing = inPhase.filter(
    (one) =>
      one.readiness.step === "failing" || one.readiness.step === "blocked",
  );
  const byTriage = new Map<string, number>();
  for (const one of failing) {
    for (const triage of Object.keys(one.readiness.triages))
      byTriage.set(triage, (byTriage.get(triage) ?? 0) + 1);
  }
  const launching = inPhase.filter(
    (one) => one.unit.priority === "P0" || settled(one.readiness.step),
  );
  const asking = launching.filter((one) => one.readiness.questions > 0);
  const moving = inPhase.filter(
    (one) => one.unit.priority !== "P0" && !settled(one.readiness.step),
  );
  const untriagedAutomatedFails = inPhase.reduce(
    (sum, one) => sum + one.readiness.untriagedAutomatedFails,
    0,
  );
  return {
    p0: {
      passed: p0.filter((one) => settled(one.readiness.step)).length,
      total: p0.length,
    },
    failing: {
      units: failing.length,
      byTriage: [...byTriage].sort((a, b) => b[1] - a[1]),
    },
    untriagedAutomatedFails,
    questions: {
      count: asking.reduce((sum, one) => sum + one.readiness.questions, 0),
      units: asking.length,
    },
    moves: {
      units: moving.length,
      byPriority: {
        P1: moving.filter((one) => one.unit.priority === "P1").length,
        P2: moving.filter((one) => one.unit.priority === "P2").length,
      },
    },
    to: nextPhase(phases, phase),
    launches:
      inPhase.length > 0 &&
      untriagedAutomatedFails === 0 &&
      !inPhase.some((one) => holdsRelease(one.unit, one.readiness)),
  };
}

export type Waiter = Turn["role"] | "nobody";
const WAITERS: Waiter[] = ["qa", "pm", "dev", "assignee", "nobody"];

export type WaitingGroup = {
  waiter: Waiter;
  units: { reading: UnitReading; why: string[] }[];
};

/** Units grouped by whose turn it is; a unit two hands wait on is in both,
 * and one nobody holds is waiting for the launch. */
export function waitingOn(readings: UnitReading[]): WaitingGroup[] {
  const groups = new Map<Waiter, WaitingGroup["units"]>();
  for (const reading of readings) {
    const turns = reading.readiness.waitingOn;
    const byRole = new Map<Waiter, string[]>();
    for (const turn of turns)
      byRole.set(turn.role, [...(byRole.get(turn.role) ?? []), turn.why]);
    if (byRole.size === 0) byRole.set("nobody", []);
    for (const [waiter, why] of byRole)
      groups.set(waiter, [...(groups.get(waiter) ?? []), { reading, why }]);
  }
  return WAITERS.flatMap((waiter) => {
    const units = groups.get(waiter);
    return units ? [{ waiter, units }] : [];
  });
}

const WAITER_LABEL: Record<Waiter, string> = {
  qa: "QA",
  pm: "PM",
  dev: "Dev",
  assignee: "Assignee",
  nobody: "Nobody",
};

/** Who a waiter is, by the team map where one handle holds the role. A bug's
 * assignee is never in the map, so it stays the word. */
export function waiterLabel(waiter: Waiter, team?: TeamMember[]): string {
  const label = WAITER_LABEL[waiter];
  if (waiter === "assignee" || waiter === "nobody") return label;
  const holders = (team ?? []).filter((one) => one.roles.includes(waiter));
  return holders.length === 1 ? `${label} · @${holders[0].handle}` : label;
}

/** Units reviewed and waiting for a run: by phase, then release priority,
 * then the longest waiting first. `since` is when a unit last changed;
 * a unit with none keeps its place after the dated ones. */
export function qaQueue(
  readings: UnitReading[],
  since: (unit: Unit) => string | undefined,
): UnitReading[] {
  return readings
    .filter((one) => one.readiness.step === "reviewed")
    .map((one, order) => ({ one, order, at: since(one.unit) }))
    .sort(
      (a, b) =>
        (a.one.phase?.order ?? Number.MAX_SAFE_INTEGER) -
          (b.one.phase?.order ?? Number.MAX_SAFE_INTEGER) ||
        comparePriority(a.one.unit.priority, b.one.unit.priority) ||
        waited(a.at, b.at) ||
        a.order - b.order,
    )
    .map(({ one }) => one);
}

function waited(a: string | undefined, b: string | undefined): number {
  if (a === undefined || b === undefined)
    return (a === undefined ? 1 : 0) - (b === undefined ? 1 : 0);
  return a < b ? -1 : a > b ? 1 : 0;
}

export type PhaseCount = {
  phase: Phase;
  units: number;
  /** Units at each step, in ladder order, steps with none left out. */
  steps: [Step, number][];
};

export function everyPhase(
  readings: UnitReading[],
  phases: Phase[],
): PhaseCount[] {
  return phases.map((phase) => {
    const mine = readings.filter((one) => one.unit.phase === phase.id);
    return {
      phase,
      units: mine.length,
      steps: STEPS.map(
        (step) =>
          [step, mine.filter((one) => one.readiness.step === step).length] as [
            Step,
            number,
          ],
      ).filter(([, count]) => count > 0),
    };
  });
}
