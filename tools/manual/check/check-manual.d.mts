/** Types for the plain-JS checker beside it, so the builder and the tests can
 * call it without pretending it is untyped. */
import type { GitIndex } from "../src/store/git.mts";
import type { Roots } from "../src/store/roots.mts";

export type CheckLevel = "fail" | "warn";

export type Finding = {
  rule: string;
  level: CheckLevel;
  /** Store-relative path of the file the finding is about. */
  path: string;
  reason: string;
};

export type CheckResult = { findings: Finding[]; notes: string[] };

/** A string target is one directory that is both roots — the store
 * documenting itself. */
export function runChecks(
  target: string | Roots,
  git?: GitIndex,
): Promise<CheckResult>;

export function formatReport(
  target: string | Roots,
  result: CheckResult,
): { text: string; failures: number; warnings: number };
