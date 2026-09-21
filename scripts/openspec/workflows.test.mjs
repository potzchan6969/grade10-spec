/*
 * The two workflows that send the planning messages: the push notifier and
 * Monday's digest.
 *
 * Nothing in either runs in a test, so what they are held to is what they
 * say: the exact cache key that makes a re-run send nothing twice, the
 * switch the schedule can be stopped with, the node this store runs, the
 * paths a page landing arrives on, and the channel the post goes to. Read as
 * text and as YAML — `openspec-version.test.mjs` reads a workflow the same
 * way for the CLI's pin. The reader the two restore that file for is held
 * here as well, because the cache key and the reading are one rule.
 */
// biome-ignore-all lint/suspicious/noTemplateCurlyInString: a workflow's `${{ … }}` is GitHub's own expression, quoted here exactly as the file writes it.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { readSentKeys } from "./lib/notify.mjs";

const ROOT = join(dirname(dirname(fileURLToPath(import.meta.url))), "..");
const read = (path) => readFileSync(join(ROOT, path), "utf8");

const NOTIFY = ".github/workflows/proposal-notify.yml";
const DIGEST = ".github/workflows/digest.yml";

const notifyText = read(NOTIFY);
const digestText = read(DIGEST);
const notify = YAML.parse(notifyText);
const digest = YAML.parse(digestText);

/** Every `actions/cache` step of one job, restore and save alike. */
const cacheSteps = (job) =>
  (job.steps ?? []).filter((step) =>
    (step.uses ?? "").startsWith("actions/cache/"),
  );

/** Any line of a workflow that sets a prefix fallback, comments — which say
 * why there is none — left out. */
const prefixFallbacks = (text) =>
  text
    .split("\n")
    .filter((line) => !/^\s*#/.test(line) && line.includes("restore-keys"));

// shared-planning-change-stages-SC-36 and -SC-37: one message per key, and a
// stage re-entered after a revert sends again. Both turn on the key being
// exact: a prefix fallback would restore the previous run's file, and the
// keys it holds would silence the move this run found.
test("shared-planning-change-stages-SC-36, shared-planning-change-stages-SC-37 - the push notifier restores its sent keys by the run's own key alone", () => {
  const steps = cacheSteps(notify.jobs.notify);

  assert.equal(steps.length, 2);
  for (const step of steps) {
    assert.equal(step.with.key, "notify-sent-${{ github.run_id }}");
    assert.equal(step.with["restore-keys"], undefined);
    assert.equal(step.with.path, "${{ env.SENT_KEYS }}");
  }
  assert.equal(notify.env.SENT_KEYS, "notify-sent.txt");
  assert.deepEqual(prefixFallbacks(notifyText), []);
});

test("shared-planning-change-stages-SC-36 - the digest restores its sent keys by the week's own key alone", () => {
  const steps = cacheSteps(digest.jobs.digest);

  assert.equal(steps.length, 2);
  for (const step of steps) {
    assert.equal(step.with.key, "digest-sent-${{ steps.week.outputs.value }}");
    assert.equal(step.with["restore-keys"], undefined);
    assert.equal(step.with.path, "${{ env.SENT_KEYS }}");
  }
  assert.equal(digest.env.SENT_KEYS, "digest-sent.txt");
  assert.deepEqual(prefixFallbacks(digestText), []);
});

// The other half of the same requirement: the file the two restore is read
// once, by `readSentKeys`. A path it cannot open says nothing about what was
// sent, so an empty answer there would post every message a second time.
test("shared-planning-change-stages-SC-36 - a sent-keys path that cannot be read stops the run", () => {
  const dir = mkdtempSync(join(tmpdir(), "sent-keys-"));

  assert.throws(() => readSentKeys(dir), { code: "EISDIR" });
});

test("shared-planning-change-stages-SC-36 - a sent-keys file that is not there yet is nothing sent", () => {
  const dir = mkdtempSync(join(tmpdir(), "sent-keys-"));

  assert.deepEqual(readSentKeys(join(dir, "notify-sent.txt")), new Set());
});

test("the digest's schedule is behind DIGEST_ENABLED", () => {
  // 01:00 UTC on Monday is 09:00 in Hong Kong, the zone every day count in
  // this store is read on.
  assert.deepEqual(digest.on.schedule, [{ cron: "0 1 * * 1" }]);
  assert.equal(digest.jobs.digest.if, "vars.DIGEST_ENABLED == 'true'");
  // Nothing else in the workflow may run the send around the switch.
  assert.equal(Object.keys(digest.jobs).length, 1);
});

test("both workflows run the node this store runs", () => {
  const pinned = JSON.parse(read("package.json")).engines.node;

  for (const [file, workflow] of [
    [NOTIFY, notify],
    [DIGEST, digest],
  ]) {
    assert.equal(workflow.env.NODE_VERSION, pinned, file);
    const jobs = Object.values(workflow.jobs);
    const setups = jobs.flatMap((job) =>
      (job.steps ?? []).filter((step) =>
        (step.uses ?? "").startsWith("actions/setup-node@"),
      ),
    );
    assert.ok(setups.length > 0, `${file} sets up no node`);
    for (const step of setups) {
      assert.equal(step.with["node-version"], "${{ env.NODE_VERSION }}", file);
    }
  }
});

test("a page landing is a push the notifier reads", () => {
  // A page's own lines are what an artifact is read against, so landing one
  // can put a fresh artifact behind and its hand is told about it.
  assert.ok(
    notify.on.push.paths.includes("docs/prds/**"),
    "the notifier does not run on a page landing",
  );
  for (const path of ["openspec/changes/**", "openspec/specs/**"]) {
    assert.ok(notify.on.push.paths.includes(path), path);
  }
  assert.deepEqual(notify.on.push.branches, ["main"]);
});

test("the channel post falls back to the store's own channel", () => {
  const channel =
    "${{ vars.SLACK_PLANNING_CHANNEL_ID || vars.SLACK_CHANNEL_ID }}";
  const mentions =
    notifyText.match(/\$\{\{[^}]*SLACK_(?:PLANNING_)?CHANNEL_ID[^}]*\}\}/g) ??
    [];

  assert.ok(mentions.length > 0, "the notifier names no channel");
  for (const one of mentions) assert.equal(one, channel);
});
