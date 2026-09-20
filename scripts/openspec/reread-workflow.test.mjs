/*
 * The re-read job, as the workflow declares it.
 *
 * The job wakes the relay and stops: every bound the cascade runs under —
 * one wake per change, the session, the thread's own failure line — lives in
 * the relay now (`scripts/openspec/relay-post.mjs`,
 * `scripts/openspec/plan-land.mjs` relay mode), and this file holds only what
 * the workflow itself still owns: the gate that starts the job, the one step
 * that wakes the relay, and the plain step that says in the channel when the
 * wake never arrived — the only step here that reads the bot token, since the
 * relay cannot post about a wake it never took. Read as YAML rather than
 * grepped: a key moved one level up is the difference between
 * `contents: write` on one job and on the whole workflow, and a token one step
 * holds from one the whole job does.
 *
 * The preflight that names what Operations has not set is `notify`'s, not
 * this job's: a matrix says the same thing once per change, and it says it
 * after the matrix was computed. One step above the matrix says it once.
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
const notify = workflow.jobs.notify;
const stepsOf = (job) => job.steps ?? [];
const stepNamed = (job, pattern) =>
  stepsOf(job).findIndex((step) => pattern.test(step.name ?? ""));
const usesIn = (job, action) =>
  stepsOf(job).filter((step) => (step.uses ?? "").startsWith(action));
/** The channel every step of this workflow reads, the notify job's own
 * expression: one variable, with the store-wide one behind it. */
const CHANNEL =
  /^\$\{\{ vars\.SLACK_PLANNING_CHANNEL_ID \|\| vars\.SLACK_CHANNEL_ID \}\}$/;

test("shared-planning-agent-rounds-SC-66 - a landing wakes the relay once per change", () => {
  // Gated the same way as before: the variable is how Operations turns the
  // cascade on, and the matrix gate keeps a push that moved no change from
  // starting a job with nothing to wake.
  assert.match(reread.if, /vars\.AGENT_REREAD == 'true'/);
  assert.match(reread.if, /needs\.notify\.outputs\.matrix != '\[\]'/);
  assert.equal(reread.needs, "notify");
  assert.match(
    reread.strategy.matrix.include,
    /needs\.notify\.outputs\.matrix/,
  );
  assert.equal(reread.strategy["fail-fast"], false);
  assert.equal(reread["timeout-minutes"], 10);

  // Two steps: one wake — the matrix runs it once per entry, and the relay is
  // what serialises them per change from there — and the step that runs on a
  // failure alone. The preflight is `notify`'s.
  assert.equal(stepsOf(reread).length, 2);
  const [wake] = stepsOf(reread);
  assert.equal(wake.if, undefined);
  assert.match(wake.name, /Wake the relay/);
  assert.match(wake.run, /-X POST "\$AGENT_WAKE_URL\/wake"/);
  assert.match(wake.run, /-H "Authorization: Bearer \$AGENT_WAKE_TOKEN"/);
  assert.match(wake.env.AGENT_WAKE_URL, /^\$\{\{ vars\.AGENT_WAKE_URL \}\}$/);
  assert.match(
    wake.env.AGENT_WAKE_TOKEN,
    /^\$\{\{ secrets\.AGENT_WAKE_TOKEN \}\}$/,
  );
  assert.match(wake.env.BEFORE, /^\$\{\{ github\.event\.before \}\}$/);
  assert.match(wake.env.HEAD_SHA, /^\$\{\{ github\.sha \}\}$/);
});

test("shared-planning-agent-rounds-SC-66 - the matrix entry reaches the wake's body through the environment, never the shell", () => {
  const [wake] = stepsOf(reread);

  // The id a push computed arrives as an environment variable, and the body
  // is built from a quoted heredoc by `jq --arg`: nothing a change is named
  // is ever spliced into a shell word.
  assert.match(wake.env.CHANGE, /^\$\{\{ matrix\.id \}\}$/);
  assert.doesNotMatch(wake.run, /matrix\.id/);
  assert.match(wake.run, /<<'JQ'/);
  assert.match(wake.run, /--arg change "\$CHANGE"/);
  assert.match(wake.run, /reason: "landing"/);
  assert.match(wake.run, /--arg base "\$BEFORE"/);
  assert.match(wake.run, /--arg head "\$HEAD_SHA"/);
});

test("shared-planning-agent-rounds-SC-66 - the notify job says which piece of setup is missing once, before the matrix", () => {
  const at = stepNamed(notify, /Check the wake is configured/);
  const preflight = stepsOf(notify)[at];

  // In `notify`, above the step that computes the matrix: said once per push
  // rather than once per change, and said before anything is dispatched.
  assert.ok(at >= 0, "the wake's preflight is not in the notify job");
  assert.ok(
    at < stepsOf(notify).findIndex((step) => step.id === "changes"),
    "the preflight runs after the matrix was computed",
  );
  assert.equal(stepNamed(reread, /configured/), -1);
  // Behind the same variable the job is: a store that never turned the
  // cascade on is not told what it did not set for it.
  assert.equal(preflight.if, "vars.AGENT_REREAD == 'true'");
  assert.match(preflight.run, /::error::Not configured/);
  // Whichever of the two is unset is named, rather than one message for both.
  assert.match(preflight.run, /AGENT_WAKE_URL/);
  assert.match(preflight.run, /AGENT_WAKE_TOKEN/);
  assert.match(preflight.run, /exit 1/);
  assert.deepEqual(Object.keys(preflight.env).sort(), [
    "AGENT_WAKE_TOKEN",
    "AGENT_WAKE_URL",
  ]);
});

test("shared-planning-agent-rounds-SC-66 - a wake that does not reach the relay is said in the channel", () => {
  const [wake, failed] = stepsOf(reread);

  // The only step that can fail above it is the wake, so the line fires for
  // a wake that did not reach the relay and for nothing else.
  assert.match(wake.name, /Wake the relay/);
  assert.equal(failed.if, "failure()");
  assert.match(failed.run, /chat\.postMessage/);
  assert.match(failed.run, /-H "Authorization: Bearer \$SLACK_BOT_TOKEN"/);
  // The change and the short head: what a person needs to find the landing
  // nothing read again, both through the environment and a quoted heredoc.
  assert.match(failed.run, /<<'JQ'/);
  assert.match(failed.run, /--arg change "\$CHANGE"/);
  assert.match(failed.run, /\$\{HEAD_SHA:0:8\}/);
  assert.match(failed.run, /did not reach the relay/);
  assert.doesNotMatch(failed.run, /matrix\.id/);
  assert.match(failed.env.CHANGE, /^\$\{\{ matrix\.id \}\}$/);
  // The channel the notify job posts to, read the same way here.
  assert.match(failed.env.CHANNEL, CHANNEL);
  assert.match(
    failed.env.SLACK_BOT_TOKEN,
    /^\$\{\{ secrets\.SLACK_BOT_TOKEN \}\}$/,
  );
  // Slack answers 200 with `ok: false` on a channel it will not post to, so
  // the step reads the answer rather than the status.
  assert.match(failed.run, /jq -r '\.ok'/);
  assert.match(failed.run, /exit 1/);
  // A curl and nothing else: no script, so no session runs to hold it.
  assert.equal(failed.uses, undefined);
});

test("shared-planning-agent-rounds-SC-66 - every step of the workflow reads one channel", () => {
  const channels = Object.values(workflow.jobs)
    .flatMap((job) => stepsOf(job))
    .flatMap((step) => Object.entries(step.env ?? {}))
    .filter(([name]) => name === "CHANNEL")
    .map(([, value]) => value);

  assert.ok(channels.length >= 3);
  for (const value of channels) assert.match(value, CHANNEL);
});

test("shared-planning-agent-rounds-SC-67 - the workflow holds no session, no write permission and no chat token", () => {
  assert.deepEqual(workflow.permissions, { contents: "read" });
  for (const [name, job] of Object.entries(workflow.jobs)) {
    assert.equal(
      job.permissions,
      undefined,
      `${name} takes the workflow's own \`contents: read\``,
    );
  }
  // No session anywhere in the workflow: the relay is what runs the round now.
  assert.equal(usesIn(reread, "anthropics/").length, 0);
  for (const [name, job] of Object.entries(workflow.jobs)) {
    assert.equal(
      usesIn(job, "anthropics/").length,
      0,
      `${name} dispatches no session`,
    );
  }
  // The chat token is one plain step's, the one that runs on a failure: the
  // job itself holds none, so the wake — and anything a matrix entry runs
  // beside it — cannot read it.
  assert.equal(reread.env, undefined);
  const [wake, failed] = stepsOf(reread);
  assert.ok(
    !JSON.stringify(wake).includes("SLACK_BOT_TOKEN"),
    `${wake.name} never holds the chat token`,
  );
  assert.deepEqual(Object.keys(failed.env).sort(), [
    "CHANGE",
    "CHANNEL",
    "HEAD_SHA",
    "SLACK_BOT_TOKEN",
  ]);
  const rereadText = JSON.stringify(reread);
  assert.ok(
    !rereadText.includes("CLAUDE_CODE_OAUTH_TOKEN"),
    "the reread job holds no session credential",
  );
  assert.ok(
    !rereadText.includes("settings"),
    "the reread job writes no settings file",
  );
});
