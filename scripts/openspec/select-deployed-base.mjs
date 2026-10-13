import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** A run listing must contain the deploy that woke this job. A stale listing
 * can otherwise pick an old success and report weeks of changes again. */
export function previousSuccessfulHead(runs, current) {
  if (!Array.isArray(runs)) throw new Error("Manual run listing is missing");

  const thisRun = runs.find((run) => run.id === current.id);
  if (
    thisRun?.run_number !== current.number ||
    thisRun?.head_sha !== current.head ||
    thisRun?.conclusion !== "success"
  ) {
    throw new Error(
      `Manual run ${current.id} at ${current.head} is missing from its run listing; refusing a possibly stale deploy base`,
    );
  }

  const previous = runs
    .filter(
      (run) => run.conclusion === "success" && run.run_number < current.number,
    )
    .sort((left, right) => right.run_number - left.run_number)[0];
  return previous?.head_sha ?? "";
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [id, number, head] = process.argv.slice(2);
  if (!id || !number || !head) {
    throw new Error(
      "usage: select-deployed-base.mjs <run-id> <run-number> <head-sha>",
    );
  }
  const response = JSON.parse(readFileSync(0, "utf8"));
  console.log(
    previousSuccessfulHead(response.workflow_runs, {
      id: Number(id),
      number: Number(number),
      head,
    }),
  );
}
