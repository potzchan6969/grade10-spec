/**
 * What the relay checks before it moves `main` (Q55), as pure functions over
 * what has already been fetched: the word that woke the run, the handle behind
 * it, the change's record and the planning schema at the landing sha, and the
 * paths the sha changed.
 *
 * Two landings, two checks, each with its own inputs. A word landing is
 * somebody's decision and is checked against the hand who made it; a read
 * again writes one key of one file and is checked against the record as it
 * reads on `main`.
 *
 * The verdict names the check that failed, because the reply a hand reads is
 * only useful when it says which one.
 */
import { parse } from "yaml";
import { handleOf } from "../../../scripts/openspec/lib/handle.mjs";
import { handOfArtifact } from "../../manual/src/api/stages.ts";
import type { Role, SchemaArtifact } from "../../manual/src/api/types.ts";
import { ROLES } from "../../manual/src/api/types.ts";
import { wordOf } from "./slack.ts";

export type LandCheck =
  | "word-not-said"
  | "sender-unknown"
  | "unknown-artifact"
  | "unknown-role"
  | "not-the-hand"
  | "landed-by-mismatch"
  | "file-outside-change"
  | "not-only-reviewed"
  | "reviewed-line-removed";

export type Verdict = { ok: true } | { ok: false; check: LandCheck };

/** The two words that land, as `wordOf` leaves them. */
export const LANDING_WORDS = ["land", "land with recommendations"];

/** Where an artifact's landing may write, beside the change's own directory.
 * Everything else on the sha is somebody's unrelated work riding the
 * fast-forward. A task group writes code, so it is held to its paths by the
 * run's own guard instead (`Q68`). */
export const LANDING_PATHS = ["docs/prds/", "docs/references/"];

/** The artifact a task group's word lands under: the group is the plan's, and
 * the plan is one artifact. */
const GROUP_ARTIFACT = "tasks";

const IS_GROUP = /^\d+$/;

export interface WordLanding {
  change: string;
  /** The artifact the run is landing: an artifact id, or a task group number. */
  artifact: string;
  /** The text of the message that woke the run, or null for a wake no message
   * started. */
  word: string | null;
  /** The sender's handle, resolved through the team map. */
  senderHandle: string | null;
  /** `openspec/changes/<change>/.openspec.yaml` at the landing sha. */
  record: string;
  /** `openspec/schemas/grade10-planning/schema.yaml` at the landing sha. */
  schema: string;
  /** Every path the compare names. */
  paths: string[];
}

export interface ReviewedLanding {
  change: string;
  paths: string[];
  /** The change's record as it reads on `main`. */
  atMain: string;
  /** The change's record as it reads at the landing sha. */
  atSha: string;
}

/** The word a message says, or nothing: a landing is one of two words and
 * nothing else, however the rest of the thread reads. */
export function isLandingWord(text: string | null): boolean {
  return LANDING_WORDS.includes(wordOf(text ?? ""));
}

/**
 * The role whose word lands one artifact: the artifact's `hand:` in the
 * schema, read the way the manual reads it. A task group takes the plan's
 * hand, because a group is one row of the plan.
 *
 * Nothing is guessed. An id the schema does not issue is refused, and so is
 * one it issues with a role outside the six — a schema that names a seventh
 * role names nobody the record's `hands:` can be keyed by.
 */
export function roleFor(
  schemaText: string,
  artifact: string,
): { role: Role } | { check: "unknown-artifact" | "unknown-role" } {
  const wanted = IS_GROUP.test(artifact.trim())
    ? GROUP_ARTIFACT
    : artifact.trim();
  const artifacts = schemaArtifacts(schemaText);
  if (!artifacts.some((one) => one.id === wanted))
    return { check: "unknown-artifact" };
  // `handOfArtifact` is the manual's own reading of `hand:`, imported rather
  // than repeated: it reads an artifact's `id` and `hand` and nothing else,
  // which is what this parses.
  const role = handOfArtifact(wanted, artifacts as SchemaArtifact[]);
  return role === undefined ? { check: "unknown-role" } : { role };
}

/** The schema's artifacts as their ids and their roles. A `hand:` outside the
 * six is left off, so the reading above refuses it rather than carrying a role
 * nothing else in the store knows. */
function schemaArtifacts(
  schemaText: string,
): Pick<SchemaArtifact, "id" | "hand">[] {
  const schema = mappingOf(parse(schemaText)) as {
    artifacts?: { id?: unknown; hand?: unknown }[];
  };
  const artifacts = Array.isArray(schema.artifacts) ? schema.artifacts : [];
  return artifacts
    .filter((one) => typeof one?.id === "string")
    .map((one) => ({
      id: String(one.id),
      ...(isRole(one.hand) ? { hand: one.hand } : {}),
    }));
}

const isRole = (value: unknown): value is Role =>
  typeof value === "string" && (ROLES as readonly string[]).includes(value);

/** The handle the change's record names for a role. */
export function handFor(recordText: string, role: string): string | null {
  const record = mappingOf(parse(recordText)) as {
    hands?: Record<string, unknown>;
  };
  const hand = record.hands?.[role];
  return typeof hand === "string" ? hand : null;
}

/** The handle the landing commit itself claims for the artifact. */
export function landedBy(recordText: string, artifact: string): string | null {
  const record = mappingOf(parse(recordText)) as {
    landed_by?: Record<string, unknown>;
  };
  const landed = record.landed_by?.[artifact];
  return typeof landed === "string" ? landed : null;
}

/**
 * A landing on a hand's word. Every check in the order a reply reads best:
 * what was said, who said it, whose artifact it is, what the commit claims,
 * and where it wrote.
 */
export function checkWord(landing: WordLanding): Verdict {
  if (!isLandingWord(landing.word)) return refuse("word-not-said");
  if (!landing.senderHandle) return refuse("sender-unknown");
  const role = roleFor(landing.schema, landing.artifact);
  if ("check" in role) return refuse(role.check);

  const sender = handleOf(landing.senderHandle);
  const hand = handFor(landing.record, role.role);
  if (!hand || handleOf(hand) !== sender) return refuse("not-the-hand");
  const landed = landedBy(landing.record, landing.artifact);
  if (!landed || handleOf(landed) !== sender)
    return refuse("landed-by-mismatch");

  // A task group lands code, whose paths are the group's own and are held by
  // the run's guard before it pushes; an artifact lands text, and text has one
  // writable set.
  if (IS_GROUP.test(landing.artifact.trim())) return { ok: true };
  const allowed = [`openspec/changes/${landing.change}/`, ...LANDING_PATHS];
  const inside = landing.paths.every((path) =>
    allowed.some((prefix) => path.startsWith(prefix)),
  );
  return inside ? { ok: true } : refuse("file-outside-change");
}

/**
 * A landing on a read again. It writes one key of one file, so it needs
 * nobody's word: the run is recording what it read, not deciding anything.
 *
 * The record is read as YAML at both ends rather than as patch text: a diff
 * says where lines moved, and what this has to know is whether anything but
 * `reviewed:` says something different now.
 */
export function checkReviewed(landing: ReviewedLanding): Verdict {
  const record = `openspec/changes/${landing.change}/.openspec.yaml`;
  if (landing.paths.length !== 1 || landing.paths[0] !== record)
    return refuse("not-only-reviewed");

  const main = mappingOf(parse(landing.atMain));
  const sha = mappingOf(parse(landing.atSha));
  const { reviewed: reviewedAtMain, ...restAtMain } = main;
  const { reviewed: reviewedAtSha, ...restAtSha } = sha;
  if (stable(restAtMain) !== stable(restAtSha))
    return refuse("not-only-reviewed");

  const before = reviewedLines(reviewedAtMain);
  const after = reviewedLines(reviewedAtSha);
  if (before === null || after === null) return refuse("not-only-reviewed");
  // A line another artifact's re-read wrote is that artifact's freshness: a
  // landing that drops it says the artifact was never read again.
  for (const artifact of Object.keys(before)) {
    if (after[artifact] === undefined) return refuse("reviewed-line-removed");
  }
  return stable(before) === stable(after)
    ? refuse("not-only-reviewed")
    : { ok: true };
}

/** The `reviewed:` block as artifact ids against content ids, or null where it
 * is not that: the store writes `contentIdOf`'s eight hex digits there, and a
 * line holding anything else is not a read again. */
function reviewedLines(value: unknown): Record<string, string> | null {
  if (value === undefined) return {};
  if (!isMapping(value)) return null;
  const lines: Record<string, string> = {};
  for (const [artifact, id] of Object.entries(value)) {
    if (typeof id !== "string" || !/^[0-9a-f]{8}$/.test(id)) return null;
    lines[artifact] = id;
  }
  return lines;
}

const refuse = (check: LandCheck): Verdict => ({ ok: false, check });

const isMapping = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function mappingOf(value: unknown): Record<string, unknown> {
  return isMapping(value) ? value : {};
}

/** One text per value whatever order its keys were written in, so two
 * readings of one record compare by what they say. */
function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (isMapping(value))
    return `{${Object.entries(value)
      .filter(([, one]) => one !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([key, one]) => `${JSON.stringify(key)}:${stable(one)}`)
      .join(",")}}`;
  return JSON.stringify(value) ?? "null";
}
