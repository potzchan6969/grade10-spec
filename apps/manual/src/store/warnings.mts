import { runChecks } from "../../../../scripts/check-manual.mjs";
import type { CheckWarning } from "../api/types.ts";
import type { GitIndex } from "./git.mts";

/**
 * The warnings the snapshot ships are the checker's own — it is the only place
 * a rule lives, so the build and the PR gate can never disagree about what is
 * stale or what is missing its shelf. The check is handed the git index the
 * build already walked, so embedding warnings costs no second history walk.
 *
 * Failures are not carried: one fails the PR, so no snapshot with a failure in
 * it is ever deployed.
 */
export async function checkWarnings(
  root: string,
  git: GitIndex,
): Promise<CheckWarning[]> {
  const { findings } = await runChecks(root, git);
  return findings
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
}
