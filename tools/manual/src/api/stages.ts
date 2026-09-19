// Explicit extensions: `check:manual`, the store's reader and the notify
// script all load this under plain node, which resolves no extensionless path.
import type {
  BehindArtifact,
  ChangeEntry,
  ChangeLane,
  ChangeSuite,
  Role,
  SchemaArtifact,
  Stage,
} from "./types.ts";
import { waivedOf } from "./waivers.ts";

/**
 * The stage, the hand, the hand's move and the overlays — one derivation, read
 * by the board, the change page, the page's ribbon, My turn, the checks and
 * every Slack message.
 *
 * Its own module, beside `waivers.ts` and for the same reason: the app reads
 * it through the bundler, and the store's reader and the workflow script read
 * it under plain node, where `derive.ts` — which parses pages — cannot go. A
 * second reading of the stage anywhere would drift from this one inside a
 * week, and the eight stages and the four lanes would start disagreeing about
 * the same change.
 */

/** The ladder, in order. The stage is the furthest rung whose proof, and every
 * proof before it, is on `main`. */
export const STAGES: Stage[] = [
  "proposed",
  "designed",
  "specified",
  "planned",
  "building",
  "on-staging",
  "released",
  "archived",
];

/**
 * How far a change has got, proven by what is on `main` and never by a key
 * anybody sets.
 *
 * `written ∪ waivedOf` is what proves an artifact rung: `written` keeps its
 * meaning of a file that exists, and a waiver is a line that stands for the
 * file it names. The walk stops at the first unproven rung, so a proof that
 * lands while an earlier one is missing moves nothing, and a proof that
 * leaves `main` drops the stage to the furthest rung still proven.
 *
 * Two answers are read before the ladder. A record nothing could read is
 * Proposed — where every change starts — because the lanes are how somebody
 * finds it and leaving it out would hide the one change that needs a person.
 * An archived change is Archived: the fold is the last rung, `deploy_waived`
 * and `tasks_waived` are how the archive answers for a rung it skipped, and
 * reading it back down the ladder would file finished work as in progress.
 */
export function stageOf(
  change: ChangeEntry,
  artifacts: SchemaArtifact[],
): Stage {
  if (change.error) return "proposed";
  if (change.status === "archived") return "archived";
  const settled = settledOf(change, artifacts);
  const { done, total } = taskTotals(change);
  const proven: Partial<Record<Stage, boolean>> = {
    designed: settled("ui-design") && settled("tech-design"),
    specified:
      settled("specs") &&
      settled("test-cases") &&
      (change.raisedOpen ?? 0) === 0,
    planned: settled("tasks") && change.promotedBy !== undefined,
    building: done > 0,
    "on-staging":
      total > 0 && done === total && change.deployedEnv === "staging",
    released: change.releasedIn !== undefined,
  };
  let reached: Stage = "proposed";
  for (const rung of STAGES.slice(1)) {
    if (!proven[rung]) break;
    reached = rung;
  }
  return reached;
}

/** Whether an artifact is on `main` or stood for by a line of the record. */
function settledOf(
  change: ChangeEntry,
  artifacts: SchemaArtifact[],
): (artifact: string) => boolean {
  const written = new Set(change.written);
  const waived = waivedOf(artifacts, change);
  return (artifact) => written.has(artifact) || waived.has(artifact);
}

/** Every box of every group: what the last two rungs of the ladder read. */
export function taskTotals(change: ChangeEntry): {
  done: number;
  total: number;
} {
  return change.taskGroups.reduce(
    (sum, group) => ({
      done: sum.done + group.done,
      total: sum.total + group.total,
    }),
    { done: 0, total: 0 },
  );
}

/** The lane one stage projects to, so the four and the eight cannot disagree
 * about the same change. Designed is still what was proposed; Released and
 * Archived are both finished work awaiting or past the fold. */
export function laneOfStage(stage: Stage): ChangeLane {
  return LANE_OF[stage];
}

const LANE_OF: Record<Stage, ChangeLane> = {
  proposed: "proposed",
  designed: "proposed",
  specified: "specified",
  planned: "in-progress",
  building: "in-progress",
  "on-staging": "complete",
  released: "complete",
  archived: "complete",
};

/**
 * Whose turn it is, from the stage and `hands:`.
 *
 * Proposed splits: the product manager holds it until the decisions, the
 * journeys and the hands are all on `main`, and the designer and the tech PIC
 * take it after that — which is why a move is the pair `(stage, hands)`
 * changing and not the stage alone. Designed, Released and Archived name
 * nobody: the requirements are drafted next and read at Specified, and
 * whoever archives takes a released change.
 *
 * The two artifacts read here are settled by the record's own lines where
 * they are settled by a line at all, so this needs no schema: `decisions` by
 * `decisions_waived:` and the journeys by `skip_specs:`, which says the
 * change alters no behaviour and so has no capability to walk.
 */
export function handOf(change: ChangeEntry, stage: Stage): Role[] {
  // A record nothing could read is the product manager's to fix, and its
  // hands are open because nothing could read them either.
  if (change.error) return ["pm"];
  if (stage !== "proposed") return HANDS_AT[stage];
  const written = new Set(change.written);
  const whole =
    (written.has("decisions") || change.decisionsWaived !== undefined) &&
    (written.has("user-journeys") || change.skipSpecs !== undefined) &&
    Object.keys(change.hands ?? {}).length > 0;
  return whole ? ["design", "tech"] : ["pm"];
}

const HANDS_AT: Record<Stage, Role[]> = {
  proposed: ["pm"],
  designed: [],
  specified: ["pm"],
  planned: ["dev"],
  building: ["dev"],
  "on-staging": ["qa", "release"],
  released: [],
  archived: [],
};

/** The roles of these the change names nobody for — the hands a card shows as
 * open and a message routes to the role's channel. */
export function openHands(change: ChangeEntry, roles: Role[]): Role[] {
  return roles.filter((role) => !change.hands?.[role]);
}

/** What the change's agent drafts at one stage, and what the hand of that
 * stage does about it. */
export type Drafted = {
  /** What the agent drafts, as the stage table writes it. */
  draft: string;
  /** The hand's move beside it. */
  move: string;
  /** The command that stage's hand pastes. */
  command: string;
  /** Who moves it, as the stage table names them. */
  note: string;
};

/**
 * The agent mark and the hand's move, one entry per drafted stage.
 *
 * Partial, not total: On staging, Released and Archived are drafted by nobody
 * — the deploy, the cut and the fold — so a lookup that misses is the answer
 * for them rather than a hole. Nothing in a change's record says any of this,
 * because which stages an agent drafts is the schema's rule and not one
 * change's: two changes in one stage read the same pair.
 */
export const DRAFTED: Partial<Record<Stage, Drafted>> = {
  proposed: {
    draft: "the marks and the three files, from what the hand asks",
    move: "answer",
    command: "/plan <id>",
    note: "Product manager: say what is wanted, answer",
  },
  designed: {
    draft: "both designs, from the page and the journeys",
    move: "tweak · challenge",
    // Two commands, because two hands take the change while it is still
    // Proposed and each drafts one design.
    command: "/design <id> · /tech <id>",
    note: "Designer: tweak. Tech PIC: challenge",
  },
  specified: {
    draft: "two blind readings, reconciled",
    move: "read",
    command: "/specify <id>",
    note: "Product manager: read the requirements and the cases together",
  },
  planned: {
    draft: "the plan",
    move: "read",
    command: "/tasks <id>",
    note: "Engineer: read the summary",
  },
  building: {
    draft: "each group, test first",
    move: "read each landing",
    command: "/build <id> <group>",
    note: "Engineer: read each landing",
  },
};

/**
 * Which artifact is whose. The schema's `teammate` cannot answer it: the tech
 * design and the task list are both the engineer's there, and the hand of one
 * is the tech PIC while the hand of the other is the engineer building it.
 */
const HAND_OF_ARTIFACT: Record<string, Role> = {
  proposal: "pm",
  decisions: "pm",
  "user-journeys": "pm",
  "ui-design": "design",
  "tech-design": "tech",
  specs: "pm",
  "test-cases": "qa",
  tasks: "dev",
};

/** The role that owes one artifact, where the store issues it. */
export function handOfArtifact(artifact: string): Role | undefined {
  return HAND_OF_ARTIFACT[artifact];
}

/**
 * How a ❓ names the hand it is addressed to: `❓ <role> - <what is
 * recommended>`, the role lower-case as every role in this store is spelled.
 *
 * One grammar, because both kinds of open question are written by hand and
 * read by the same eyes: a `## Decisions` row's `Decided` cell in a change,
 * and a line on a page. The separator is what makes it a grammar — without it
 * the text is a sentence, and reading its first word as a role addresses the
 * question to whatever the author happened to begin with.
 */
export const ASKED_OF = /^❓\s+([a-z][a-z0-9._-]*)\s+-\s+(\S.*)$/;

/**
 * The hand a ❓ line on a page is addressed to.
 *
 * Q41 settles the default: the line counts against the proposal, which is the
 * product manager's artifact, so the product manager answers for it. But the
 * house style puts the confirmer on the line where somebody else owes the
 * answer — "Operations confirms" — and the row grammar above may name a role
 * outright, so a line that says whose answer it is waiting for is read rather
 * than routed past them.
 */
export function handOfMark(text: string): string {
  const named = ASKED_OF.exec(text)?.[1];
  if (named) return named;
  const confirmer = CONFIRMS.exec(text)?.[1].trim().toLowerCase();
  return (confirmer && ROLE_OF_CONFIRMER[confirmer]) || "pm";
}

/** "… ; Operations confirms" — who the line says has yet to say. */
const CONFIRMS =
  /(?:^|[\s;,—-])((?:[A-Z][a-z]+|the [a-z]+(?: [a-z]+)?))\s+confirms\b/;

/** What a page calls each role, as `shared/planning/change-stages` names them
 * in its Hands table. A name outside it is nobody's role, so the line stays
 * the product manager's. */
const ROLE_OF_CONFIRMER: Record<string, string> = {
  "the product manager": "pm",
  "the designer": "design",
  "the tech pic": "tech",
  qa: "qa",
  "the engineer": "dev",
  "the release hand": "release",
  operations: "ops",
};

/**
 * Which artifacts are behind what they were drawn from.
 *
 * A pure comparison over the store's reading — `entry.upstream`, which the
 * store computes where the pages and the history are. The recorded id is the
 * answer where the record carries one; otherwise the commit dates are, and
 * neither side being dated is no answer at all, so a depth-1 checkout marks
 * nothing. An artifact the change has not written and one a waiver stands for
 * are never read, because the store never reads an upstream for them.
 *
 * In the schema's order, so the first answer is the earliest behind artifact:
 * the one the card names and the one the message goes to.
 */
export function behindOf(
  change: ChangeEntry,
  artifacts: SchemaArtifact[],
): BehindArtifact[] {
  const behind: BehindArtifact[] = [];
  for (const { id } of artifacts) {
    const read = change.upstream?.[id];
    if (!read) continue;
    const reviewed = change.reviewed?.[id];
    if (reviewed !== undefined) {
      if (reviewed !== read.id)
        behind.push({ artifact: id, changed: read.items });
      continue;
    }
    if (read.newer?.length) behind.push({ artifact: id, changed: read.newer });
  }
  return behind;
}

/** The five overlays, in the order the table lists them. */
export const OVERLAYS = [
  "waiting",
  "blocked",
  "idle",
  "behind",
  "suite",
] as const;

export type OverlayKind = (typeof OVERLAYS)[number];

/** A verdict on the change's blind suite, as the overlay shows it. */
export type SuiteVerdict = "draft" | "approved";

/** A fact beside the stage. Never a stage of its own, and never one of these
 * five plus a sixth: the set is closed, so a reader meets one list of chips. */
export type Overlay =
  | {
      kind: "waiting";
      /** The artifact the wait is written against. */
      artifact: string;
      /** The line as its author wrote it. */
      text: string;
      /** The date the line opens with, where it carries one. */
      since?: string;
      role?: Role;
      hand?: string;
    }
  | { kind: "blocked"; change: string }
  | { kind: "idle"; days: number; shelved: boolean }
  | {
      kind: "behind";
      artifact: string;
      changed: string[];
      role?: Role;
      hand?: string;
    }
  | { kind: "suite"; verdict: SuiteVerdict };

export type OverlayContext = {
  /** Now, as an instant — the caller's clock, never this module's, so the
   * same entry read twice at one instant reads the same both times. */
  now: Date | number;
  /** The changes a release has carried: `depends_on:` naming one of these
   * blocks nothing. The caller holds the archive and the released set. */
  released: Set<string>;
  /** The schema's artifacts, for the behind reading's order. */
  artifacts: SchemaArtifact[];
};

/** The day bounds `Q21` recommends, open on the product manager. */
export const IDLE_FROM = 7;
export const SHELVED_FROM = 30;

/** The clock the day count is counted on: a landing at 23:00 in Hong Kong is
 * that day's, not the next UTC day's. */
export const TIME_ZONE = "Asia/Hong_Kong";

/** A wait may open with the day it started, which is the only date the line
 * carries. */
const DATED = /^(\d{4}-\d{2}-\d{2})\b/;

/**
 * What sits beside a change's stage, in the table's order.
 *
 * Every one is read from a file on `main` and none of them moves the stage —
 * the ladder never sees this function, and this function never asks for the
 * stage.
 */
export function overlaysOf(
  change: ChangeEntry,
  ctx: OverlayContext,
): Overlay[] {
  const overlays: Overlay[] = [];
  for (const wait of change.awaiting ?? []) {
    const since = DATED.exec(wait.why)?.[1];
    overlays.push({
      kind: "waiting",
      artifact: wait.artifact,
      text: wait.why,
      ...(since ? { since } : {}),
      ...whose(change, wait.artifact),
    });
  }
  for (const id of change.dependsOn ?? []) {
    if (!ctx.released.has(id)) overlays.push({ kind: "blocked", change: id });
  }
  const days = idleDaysOf(change, ctx.now);
  if (days !== undefined && days >= IDLE_FROM) {
    overlays.push({ kind: "idle", days, shelved: days >= SHELVED_FROM });
  }
  const [earliest] = behindOf(change, ctx.artifacts);
  if (earliest) {
    overlays.push({
      kind: "behind",
      artifact: earliest.artifact,
      changed: earliest.changed,
      ...whose(change, earliest.artifact),
    });
  }
  const verdict = verdictOf(change.suites);
  if (verdict) overlays.push({ kind: "suite", verdict });
  return overlays;
}

/** The hand an artifact's overlay is shown against: the handle the change
 * names for that role, or the role itself where it names none — the way an
 * open question carries its hand. */
function whose(
  change: ChangeEntry,
  artifact: string,
): { role?: Role; hand?: string } {
  const role = handOfArtifact(artifact);
  if (!role) return {};
  return { role, hand: change.hands?.[role] ?? role };
}

/**
 * Whole calendar days since the change last landed something, on the day
 * count's own zone — one zone, the store's, because a day is a day here and
 * a caller that could pass another would be two boards disagreeing about
 * whether a change is idle.
 *
 * Undefined where no history dates the landing — no viewer, a store with no
 * repository, a depth-1 clone — which is not the same as 0: the chip is not
 * shown rather than claiming the change landed something today.
 */
export function idleDaysOf(
  change: ChangeEntry,
  now: Date | number,
): number | undefined {
  if (change.lastLanded === undefined) return undefined;
  const landed = dayOn(change.lastLanded, TIME_ZONE);
  const today = dayOn(now, TIME_ZONE);
  if (landed === undefined || today === undefined) return undefined;
  return Math.max(0, today - landed);
}

/** Which day an instant falls on in one zone, as a count of days — the only
 * arithmetic a calendar-day difference can be done with. */
function dayOn(
  at: string | number | Date,
  timeZone: string,
): number | undefined {
  const instant = at instanceof Date ? at : new Date(at);
  if (Number.isNaN(instant.getTime())) return undefined;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(instant);
  const of = (type: string) =>
    Number(parts.find((one) => one.type === type)?.value);
  const day = Date.UTC(of("year"), of("month") - 1, of("day"));
  return Number.isNaN(day) ? undefined : day / 86_400_000;
}

/** The suite's verdict: approved once no suite of the change is left to
 * review, a draft while one is. A change with no suite wears no chip — there
 * is nothing to say about a verdict nobody has been asked for. */
function verdictOf(
  suites: ChangeSuite[] | undefined,
): SuiteVerdict | undefined {
  if (!suites || suites.length === 0) return undefined;
  return suites.every((one) => one.status === "approved")
    ? "approved"
    : "draft";
}
