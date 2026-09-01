import { runChecks } from "../../check/check-manual.mjs";
import type { CheckWarning } from "../api/types.ts";
import { designWarnings, readDesignSync } from "./design-sync.mts";
import type { GitIndex } from "./git.mts";
import type { Roots } from "./roots.mts";

/**
 * The warnings the snapshot ships are the checker's own — it is the only place
 * a rule lives, so the build and the PR gate can never disagree about what is
 * stale or what is missing its shelf. The check is handed the git index the
 * build already walked, so embedding warnings costs no second history walk.
 *
 * Failures are not carried: one fails the PR, so no snapshot with a failure in
 * it is ever deployed.
 *
 * The nightly design-sync report joins them under a `design` rule. It is not a
 * `check:manual` rule and cannot be — it is a verdict on a Figma file, arriving
 * on its own schedule — but it is a chore list of exactly the same kind, and
 * before this it reached nothing but the cards that happened to match it.
 */
export async function checkWarnings(
  roots: Roots,
  git: GitIndex,
): Promise<CheckWarning[]> {
  const { findings } = await runChecks(roots, git);
  const warnings = findings
    .filter((one) => one.level === "warn")
    .map((one) => {
      const page = one.path.startsWith("manual/") ? one.path : undefined;
      const warning: CheckWarning = {
        rule: one.rule,
        message: page ? one.reason : `${one.path}: ${one.reason}`,
      };
      if (page) warning.page = page;
      return warning;
    });

  return [...warnings, ...designWarnings(roots, readDesignSync(roots.store))];
}
