// Explicit extensions: `check:manual`, the store's reader and the notify
// script all load this under plain node, which resolves no extensionless path.

import type {
  BehindArtifact,
  ChangeEntry,
  ChangeLane,
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
 * The eight stages as a reader meets them, in the ladder's own order.
 *
 * Here rather than in `stage-view.ts`, which is where every other word a
 * surface shows is read from: a Slack message names the stage too, and the
 * notify script and the digest read this module under plain node, where
 * `stage-view.ts` — which reads `laneOf` from `derive.ts` — cannot go.
 * `stage-view.ts` re-exports it, so every surface still reads one list.
 */
export const STAGE_LABEL: Record<Stage, string> = {
  proposed: "Proposed",
  designed: "Designed",
  specified: "Specified",
  planned: "Planned",
  building: "Building",
  "on-staging": "On staging",
  released: "Released",
  archived: "Archived",
};

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
  return ladderOf(change, artifacts).stage;
}

/**
 * The same walk, with the artifact it stopped at where an artifact stopped it.
 *
 * `heldBy` is what the change owes next: the first artifact of the unproven
 * rung that is neither written nor waived. Nothing where the rung above is
 * proven by something no hand writes — a ticked box, a deploy, a cut — and
 * nothing where the rung is held by a raised row rather than a file, because
 * naming an artifact there would send a hand to a file that is already in.
 */
export function ladderOf(
  change: ChangeEntry,
  artifacts: SchemaArtifact[],
): { stage: Stage; heldBy?: string } {
  if (change.error) return { stage: "proposed" };
  if (change.status === "archived") return { stage: "archived" };
  const settled = settledOf(change, artifacts);
  const { done, total } = taskTotals(change);
  const proven: Partial<Record<Stage, boolean>> = {
    designed: OWED_AT.designed.every(settled),
    specified:
      OWED_AT.specified.every(settled) && (change.raisedOpen ?? 0) === 0,
    planned: OWED_AT.planned.every(settled) && change.promotedBy !== undefined,
    building: done > 0,
    "on-staging":
      total > 0 && done === total && change.deployedEnv === "staging",
    released: change.releasedIn !== undefined,
  };
  let reached: Stage = "proposed";
  for (const rung of STAGES.slice(1)) {
    if (!proven[rung]) {
      const owed = (OWED_AT[rung] ?? []).find((id) => !settled(id));
      return owed ? { stage: reached, heldBy: owed } : { stage: reached };
    }
    reached = rung;
  }
  return { stage: reached };
}

/** The artifacts each rung of the ladder is proven by, in the order a change
 * owes them. The rungs below carry none: a box, a deploy, a tag and the fold
 * are proven by no artifact of the schema. */
const OWED_AT: Partial<Record<Stage, string[]>> & {
  designed: string[];
  specified: string[];
  planned: string[];
} = {
  designed: ["ui-design", "tech-design"],
  specified: ["specs", "test-cases"],
  planned: ["tasks"],
};

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
 * Proposed splits: the product manager holds it until the decisions and the
 * journeys are on `main` and `hands:` names every role the next stage needs,
 * and those hands take it after that — which is why a move is the pair
 * `(stage, hands)` changing and not the stage alone. A waived design needs no
 * hand: nobody draws it, so the turn passes to the hand of the design that is
 * still owed rather than waiting on a handle for a file nobody will write.
 * Designed, Released and Archived name nobody: the requirements are drafted
 * next and read at Specified, and whoever archives takes a released change.
 *
 * Settled is read through the same predicate as the ladder, so the stage and
 * the turn cannot disagree about whether an artifact is in: `decisions` is
 * settled by `decisions_waived:` and the journeys by `skip_specs:`, which says
 * the change alters no behaviour and so has no capability to walk.
 */
export function handOf(
  change: ChangeEntry,
  stage: Stage,
  artifacts: SchemaArtifact[],
): Role[] {
  // A record nothing could read is the product manager's to fix, and its
  // hands are open because nothing could read them either.
  if (change.error) return ["pm"];
  if (stage !== "proposed") return HANDS_AT[stage];
  const settled = settledOf(change, artifacts);
  const waived = waivedOf(artifacts, change);
  const next = SECOND_HANDS.filter((one) => !waived.has(one.artifact)).map(
    (one) => one.role,
  );
  const whole =
    settled("decisions") &&
    settled("user-journeys") &&
    next.length > 0 &&
    next.every((role) => change.hands?.[role] !== undefined);
  return whole ? next : ["pm"];
}

/** The hands the second half of Proposed passes to, each with the design it
 * draws: a waiver stands for the file, so it stands the hand down too. */
const SECOND_HANDS: { role: Role; artifact: string }[] = [
  { role: "design", artifact: "ui-design" },
  { role: "tech", artifact: "tech-design" },
];

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

/** What the change's agent drafts at one stage, and what each hand of that
 * stage does about it. */
export type Drafted = {
  /** What the agent drafts, as the stage table writes it. */
  draft: string;
  /** One entry per hand the stage names: that hand's move as the stage table
   * writes it, and the command it pastes. Per role rather than one packed
   * sentence, because Designed names two — the designer and the tech PIC each
   * draft one design — and a surface that needs one hand's command would
   * otherwise split a string to find it. */
  moves: Partial<Record<Role, { move: string; command: string }>>;
};

/**
 * The agent mark and the hands' moves, one entry per drafted stage.
 *
 * Partial, not total: On staging, Released and Archived are drafted by nobody
 * — the deploy, the cut and the fold — so a lookup that misses is the answer
 * for them rather than a hole. Nothing in a change's record says any of this,
 * because which stages an agent drafts is the schema's rule and not one
 * change's: two changes in one stage read the same pair. `draftedOf` in
 * `api/stage-view.ts` is the one reader.
 */
export const DRAFTED: Partial<Record<Stage, Drafted>> = {
  proposed: {
    draft: "the marks and the three files, from what the hand asks",
    moves: { pm: { move: "answer", command: "/plan <id>" } },
  },
  designed: {
    draft: "both designs, from the page and the journeys",
    moves: {
      design: { move: "tweak", command: "/design <id>" },
      tech: { move: "challenge", command: "/tech <id>" },
    },
  },
  specified: {
    draft: "two blind readings, reconciled",
    moves: { pm: { move: "read", command: "/specify <id>" } },
  },
  planned: {
    draft: "the plan",
    moves: { dev: { move: "read", command: "/tasks <id>" } },
  },
  building: {
    draft: "each group, test first",
    moves: {
      dev: { move: "read each landing", command: "/build <id> <group>" },
    },
  },
};

/**
 * The move one hand makes while the turn is theirs at a stage: the stage's
 * own entry, or the next drafted stage's where the stage names none for the
 * role. Proposed's second half hands the change to the designer and the tech
 * PIC, whose moves the stage table writes against Designed, and a card or a
 * message that read only the stage's entry offered them the product
 * manager's command.
 */
export function moveOf(
  stage: Stage,
  role: Role,
): { move: string; command: string } | undefined {
  const at = STAGES.indexOf(stage);
  for (const rung of STAGES.slice(at, at + 2)) {
    const held = DRAFTED[rung]?.moves[role];
    if (held) return held;
  }
  return undefined;
}

/**
 * The role that answers for one artifact, as the schema names it — `hand:`
 * beside `teammate`, which cannot answer it: the tech design and the task
 * list are both the engineer's there, while the hand of one is the tech PIC
 * and the hand of the other is whoever builds it.
 *
 * Nothing for an artifact the schema does not issue, or issues with no hand:
 * a wait, an overlay and a landing on it are shown against no role rather
 * than against a guess.
 */
export function handOfArtifact(
  artifact: string,
  artifacts: SchemaArtifact[],
): Role | undefined {
  return artifacts.find((one) => one.id === artifact)?.hand;
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

/** The question a ❓ line asks, its mark and the grammar's role dropped — the
 * same shape a decisions row's question carries, so a surface that lists both
 * reads one. Beside `ASKED_OF` and `handOfMark`, the grammar's third reader. */
export function askedText(text: string): string {
  return ASKED_OF.exec(text)?.[2] ?? text.replace(LEADING_OPEN, "");
}

const LEADING_OPEN = /^❓\s*/;

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
      // The id says something before it moved and cannot say which, so what
      // is reported is what is before it.
      if (reviewed !== read.id)
        behind.push({ artifact: id, before: read.items });
      continue;
    }
    if (read.newer?.length) behind.push({ artifact: id, changed: read.newer });
  }
  return behind;
}
