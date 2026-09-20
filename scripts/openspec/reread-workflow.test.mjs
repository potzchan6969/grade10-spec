/*
 * The re-read job, as the workflow declares it.
 *
 * The job wakes the relay and stops: every bound the cascade runs under —
 * one wake per change, the failure line, the session, the chat token — lives
 * in the relay now (`scripts/openspec/relay-post.mjs`,
 * `scripts/openspec/plan-land.mjs` relay mode), and this file holds only what
 * the workflow itself still owns: the gate that starts the job, and the one
 * step that posts to it. Read as YAML rather than grepped: a key moved one
 * level up is the difference between `contents: write` on one job and on the
 * whole workflow.
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
const usesIn = (job, action) =>
  stepsOf(job).filter((step) => (step.uses ?? "").startsWith(action));

test("shared-planning-agent-rounds-SC-66 - a landing wakes the relay once per change the push put behind", () => {
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

  // One step, one wake — the matrix runs it once per entry, and the relay is
  // what serialises them per change from there.
  assert.equal(stepsOf(reread).length, 1);
  const [wake] = stepsOf(reread);
  assert.match(wake.name, /Wake the relay/);
  assert.match(wake.run, /-X POST "\$AGENT_WAKE_URL\/wake"/);
  assert.match(wake.run, /-H "Authorization: Bearer \$AGENT_WAKE_TOKEN"/);
  assert.match(wake.run, /"change":"\$\{\{ matrix\.id \}\}"/);
  assert.match(wake.run, /"reason":"landing"/);
  assert.match(wake.run, /"base":"\$BEFORE"/);
  assert.match(wake.run, /"head":"\$HEAD_SHA"/);
  assert.match(wake.env.AGENT_WAKE_URL, /^\$\{\{ vars\.AGENT_WAKE_URL \}\}$/);
  assert.match(
    wake.env.AGENT_WAKE_TOKEN,
    /^\$\{\{ secrets\.AGENT_WAKE_TOKEN \}\}$/,
  );
  assert.match(wake.env.BEFORE, /^\$\{\{ github\.event\.before \}\}$/);
  assert.match(wake.env.HEAD_SHA, /^\$\{\{ github\.sha \}\}$/);
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
  const rereadText = JSON.stringify(reread);
  assert.ok(
    !rereadText.includes("SLACK_BOT_TOKEN"),
    "the reread job never holds the chat token",
  );
  assert.ok(
    !rereadText.includes("CLAUDE_CODE_OAUTH_TOKEN"),
    "the reread job holds no session credential",
  );
  assert.ok(
    !rereadText.includes("settings"),
    "the reread job writes no settings file",
  );
});
