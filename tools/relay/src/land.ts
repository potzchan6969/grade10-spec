/**
 * What the relay checks before it moves `main` (Q55), as one pure function over
 * what has already been fetched: the word that woke the run, the handle behind
 * it, the change's record and the planning schema at the landing sha, and the
 * files the sha changed.
 *
 * The verdict names the check that failed, because the reply a hand reads is
 * only useful when it says which one.
 */
import { parse } from "yaml";
import type { ComparedFile } from "./github.ts";

export type LandKind = "word" | "reviewed";

export type LandCheck =
  | "word-not-said"
  | "sender-unknown"
  | "not-the-hand"
  | "file-outside-change"
  | "not-only-reviewed";

export type Verdict = { ok: true } | { ok: false; check: LandCheck };

/** The two words that land, trimmed and case-folded. */
export const LANDING_WORDS = ["land", "land with recommendations"];

/** Where a landing may write. Everything else on the sha is somebody's
 * unrelated work riding the fast-forward. */
export const LANDING_PATHS = ["docs/prds/", "docs/references/"];

/** The record's `reviewed:` key, and one artifact's read-again line under it. */
const REVIEWED_KEY = /^\s*reviewed:\s*$/;
const REVIEWED_LINE = /^\s+[a-z][a-z0-9-]*:\s*[0-9a-f]{8}\s*$/;

export interface LandInputs {
  kind: LandKind;
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
  files: ComparedFile[];
}

/** Whose word lands this artifact: the stage's teammate in the schema, the
 * `apply:` block's for a task group, and `dev` for anything the schema names no
 * teammate for — the specs and the suites, which no hand holds alone. */
export function roleFor(schemaText: string, artifact: string): string {
  const schema = readYaml(schemaText) as {
    artifacts?: { id?: string; teammate?: string }[];
    apply?: { teammate?: string };
  };
  if (/^\d+$/.test(artifact.trim())) return schema.apply?.teammate ?? "dev";
  const found = schema.artifacts?.find((entry) => entry.id === artifact.trim());
  return found?.teammate ?? "dev";
}

/** The handle the change's record names for a role. */
export function handFor(recordText: string, role: string): string | null {
  const record = readYaml(recordText) as {
    hands?: Record<string, string>;
  };
  const hand = record.hands?.[role];
  return typeof hand === "string" ? hand : null;
}

function readYaml(text: string): unknown {
  const value = parse(text) as unknown;
  return value && typeof value === "object" ? value : {};
}

/** Only the lines a patch added or removed. The `+++`/`---` headers name files,
 * not content. */
function changedLines(patch: string): string[] {
  return patch
    .split("\n")
    .filter(
      (line) =>
        (line.startsWith("+") || line.startsWith("-")) &&
        !line.startsWith("+++") &&
        !line.startsWith("---"),
    )
    .map((line) => line.slice(1));
}

export function checkLanding(inputs: LandInputs): Verdict {
  const changeDir = `openspec/changes/${inputs.change}/`;
  if (inputs.kind === "reviewed") {
    // A read-again landing writes one key of one file, so it needs nobody's
    // word: the run is recording what it read, not deciding anything.
    const record = `${changeDir}.openspec.yaml`;
    if (inputs.files.length !== 1 || inputs.files[0].path !== record)
      return { ok: false, check: "not-only-reviewed" };
    const lines = changedLines(inputs.files[0].patch);
    const reviewedOnly =
      lines.length > 0 &&
      lines.every(
        (line) => REVIEWED_KEY.test(line) || REVIEWED_LINE.test(line),
      );
    return reviewedOnly
      ? { ok: true }
      : { ok: false, check: "not-only-reviewed" };
  }

  const word = (inputs.word ?? "").trim().toLowerCase();
  if (!LANDING_WORDS.includes(word))
    return { ok: false, check: "word-not-said" };
  if (!inputs.senderHandle) return { ok: false, check: "sender-unknown" };
  const hand = handFor(inputs.record, roleFor(inputs.schema, inputs.artifact));
  if (!hand || hand !== inputs.senderHandle)
    return { ok: false, check: "not-the-hand" };
  const allowed = [changeDir, ...LANDING_PATHS];
  const inside = inputs.files.every((file) =>
    allowed.some((prefix) => file.path.startsWith(prefix)),
  );
  return inside ? { ok: true } : { ok: false, check: "file-outside-change" };
}
