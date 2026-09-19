/*
 * The re-read job, as the workflow declares it.
 *
 * Every bound the change put on the cascade lives in
 * `.github/workflows/proposal-notify.yml` and nowhere else, so nothing but
 * this file says the queue is a queue rather than a cancellation, that the
 * agent holds no chat token, or that the job's write permission stops at the
 * job. Read as YAML rather than grepped: a key moved one level up is the
 * difference between `contents: write` on one job and on the whole workflow.
 *
 * `reread-job.test.mjs` holds the job's own scripts — the settings, the guard
 * and the notice. This holds the declaration around them.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const FILE = ".github/workflows/proposal-notify.yml";
const workflow = YAML.parse(readFileSync(join(ROOT, FILE), "utf8"));
const reread = workflow.jobs.reread;
const stepsOf = (job) => job.steps ?? [];
const named = (job, part) =>
  stepsOf(job).filter((step) => (step.name ?? "").includes(part));
const usesIn = (job, action) =>
  stepsOf(job).filter((step) => (step.uses ?? "").startsWith(action));

test("shared-planning-agent-rounds-SC-66 - a second push queues behind the first and neither is cancelled", () => {
  assert.equal(reread.concurrency.group, "cascade-${{ matrix.id }}");
  assert.equal(reread.concurrency["cancel-in-progress"], false);
  // One queue per change, not per run: a group keyed by the run would let two
  // pushes to one change read it at once.
  assert.match(reread.concurrency.group, /matrix\.id/);
});

test("shared-planning-agent-rounds-SC-67 - the run is bounded and reads what the matrix gave it", () => {
  assert.equal(reread["timeout-minutes"], 30);
  assert.equal(reread.needs, "notify");
  assert.match(
    reread.strategy.matrix.include,
    /needs\.notify\.outputs\.matrix/,
  );
  assert.equal(reread.strategy["fail-fast"], false);
});

test("the job runs behind the repository variable and an empty matrix", () => {
  // Two gates, both needed: the variable is how Operations turns the cascade
  // on, and the matrix gate is what keeps a push that moved no change from
  // starting a job with nothing to read.
  assert.match(reread.if, /vars\.AGENT_REREAD == 'true'/);
  assert.match(reread.if, /needs\.notify\.outputs\.matrix != '\[\]'/);
});

test("write permission stops at the re-read job", () => {
  assert.deepEqual(workflow.permissions, { contents: "read" });
  assert.deepEqual(reread.permissions, {
    contents: "write",
    "id-token": "write",
  });
  for (const [name, job] of Object.entries(workflow.jobs)) {
    if (name === "reread") continue;
    assert.equal(
      job.permissions,
      undefined,
      `${name} takes the workflow's own \`contents: read\``,
    );
  }
});

test("the agent's reach is declared, and holds no chat token", () => {
  const [step] = usesIn(reread, "anthropics/claude-code-action");
  assert.ok(step, "the job dispatches the round through the action");
  for (const flag of ["--max-turns", "--allowedTools", "--model"])
    assert.match(
      step.with.claude_args,
      new RegExp(flag),
      `${flag} is declared`,
    );
  assert.match(step.with.settings, /\.round\/settings\.json/);
  // The round writes its thread line to a file and a plain step posts it, so
  // the agent's own step holds no token at all.
  assert.deepEqual(
    Object.keys(step.env ?? {}),
    [],
    "the action step is given no environment of its own",
  );
  assert.ok(
    !JSON.stringify(step).includes("SLACK_BOT_TOKEN"),
    "the agent never holds the chat token",
  );
});

test("the round's summary is posted from the file the agent wrote", () => {
  const [post] = named(reread, "Post the round's own summary");
  assert.ok(post, "a plain step posts what the round wrote");
  assert.match(post.run, /--message-file \.round\/thread\.txt/);
  assert.equal(post.env.SLACK_BOT_TOKEN, "${{ secrets.SLACK_BOT_TOKEN }}");
});

test("the two posts are keyed, restored and saved the way the messages are", () => {
  const restore = usesIn(reread, "actions/cache/restore");
  const save = usesIn(reread, "actions/cache/save");
  assert.equal(restore.length, 1, "one restore, before the posts");
  assert.equal(save.length, 1, "one save, after them");
  // No `restore-keys`: a prefix fallback would drag another run's keys in and
  // silence a summary this run owes.
  assert.equal(restore[0].with["restore-keys"], undefined);
  assert.equal(restore[0].with.key, save[0].with.key);
  assert.match(restore[0].with.key, /matrix\.id/);
  assert.equal(save[0].if, "always()");

  const order = stepsOf(reread).map((step) => step.uses ?? step.name ?? "");
  const at = (part) => order.findIndex((one) => one.includes(part));
  assert.ok(at("actions/cache/restore") < at("Post the round's own summary"));
  assert.ok(at("Say the read again failed") < at("actions/cache/save"));

  for (const step of [
    ...named(reread, "Post the round's own summary"),
    ...named(reread, "Say the read again failed"),
  ])
    assert.match(
      step.run,
      /--sent-keys "\$SENT_KEYS"/,
      `${step.name} posts once per run`,
    );
});
