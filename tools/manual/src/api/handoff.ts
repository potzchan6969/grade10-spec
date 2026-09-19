import { handOfArtifact, STAGES, TIME_ZONE } from "./stages";
import { daysBetween } from "./time";
import type { ChangeEntry, Role, SchemaArtifact, Stage } from "./types";

/**
 * Where the days went: for each stage a change has left, the days from that
 * stage landing to the next hand's first word.
 *
 * The measure the page asks for, derived from the one thing the store dates —
 * when each artifact of the change landed. A hand's word is what puts an
 * artifact on `main`, so the first word after a stage landed is the first
 * artifact landing after it, and the days between the two are the handoff.
 *
 * Nothing is stored and nothing is guessed. A stage no artifact proves — the
 * deploy, the cut and the fold — has no landing to count from and is left
 * out. A stage whose landing nothing dates says so rather than reading as 0.
 * A stage nothing has followed yet is counted to today and marked open: the
 * days are still running, which is the fact a reader wants from a change that
 * has stopped.
 */

/** The artifacts whose landing proves one stage. Proposed is complete when
 * the proposal, the decisions and the journeys are all on `main`, so the
 * newest of the three is when it landed. */
const PROOF: Partial<Record<Stage, string[]>> = {
  proposed: ["proposal", "decisions", "user-journeys"],
  designed: ["ui-design", "tech-design"],
  specified: ["specs", "test-cases"],
  planned: ["tasks"],
};

export type Handoff = {
  stage: Stage;
  /** When the stage landed, where a commit dates it. */
  landed?: string;
  /** Whole calendar days from the landing to the next hand's first word, or
   * to today where none has come yet. */
  days?: number;
  /** The hand whose word followed: the handle the change names for that role,
   * or nothing where no word has come. */
  hand?: string;
  role?: Role;
  /** No landing dates the next word yet — the days are counted to today. */
  open: boolean;
};

/** When each artifact of the change landed, keyed by the schema's artifact id
 * — the dates the change document carries. */
export type LandingDates = Record<string, string | undefined>;

export function handoffsOf(
  change: ChangeEntry,
  stage: Stage,
  artifacts: SchemaArtifact[],
  dates: LandingDates,
  now: string | number | Date = Date.now(),
  timeZone: string = TIME_ZONE,
): Handoff[] {
  const handoffs: Handoff[] = [];
  for (const left of STAGES.slice(0, STAGES.indexOf(stage))) {
    const proof = PROOF[left];
    if (!proof) continue;
    const landed = newest(proof.map((id) => dates[id]));
    if (landed === undefined) {
      handoffs.push({ stage: left, open: true });
      continue;
    }
    const word = firstWordAfter(left, landed, dates);
    const role = word ? handOfArtifact(word.artifact, artifacts) : undefined;
    const hand = role ? change.hands?.[role] : undefined;
    handoffs.push({
      stage: left,
      landed,
      ...daysOf(landed, word?.date ?? now, timeZone),
      ...(role ? { role } : {}),
      ...(hand ? { hand } : {}),
      open: word === undefined,
    });
  }
  return handoffs;
}

/** The first artifact of a later stage to land after this one did — the next
 * hand's first word. */
function firstWordAfter(
  stage: Stage,
  landed: string,
  dates: LandingDates,
): { artifact: string; date: string } | undefined {
  const later = STAGES.slice(STAGES.indexOf(stage) + 1).flatMap(
    (one) => PROOF[one] ?? [],
  );
  const words = later
    .flatMap((artifact) => {
      const date = dates[artifact];
      return date !== undefined && Date.parse(date) > Date.parse(landed)
        ? [{ artifact, date }]
        : [];
    })
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  return words[0];
}

function daysOf(
  landed: string,
  to: string | number | Date,
  timeZone: string,
): { days?: number } {
  const days = daysBetween(landed, to, timeZone);
  return days === undefined ? {} : { days };
}

/** The newest of the dates that exist, or nothing where none does. */
function newest(dates: (string | undefined)[]): string | undefined {
  return dates
    .filter((one): one is string => one !== undefined)
    .sort((a, b) => Date.parse(a) - Date.parse(b))
    .at(-1);
}
