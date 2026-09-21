/*
 * The two workflows that send the planning messages: the push notifier and
 * Monday's digest.
 *
 * Nothing in either runs in a test, so what they are held to is what they
 * say: the exact cache key that makes a re-run send nothing twice, the
 * switch the schedule can be stopped with, the node this store runs, the
 * paths a page landing arrives on, and the channel the post goes to. Read as
 * text and as YAML — `openspec-version.test.mjs` reads a workflow the same
 * way for the CLI's pin.
 *
 * Two cases reach wider: every workflow whose steps read a change's plan,
 * held to running on the push that ticks a task group, and every workflow
 * that skips that push, held to skipping the plan alone. Each trigger's
 * filter is read the way the code host reads it, through a glob matcher
 * small enough to hold here.
 */
// biome-ignore-all lint/suspicious/noTemplateCurlyInString: a workflow's `${{ … }}` is GitHub's own expression, quoted here exactly as the file writes it.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const ROOT = join(dirname(dirname(fileURLToPath(import.meta.url))), "..");
const read = (path) => readFileSync(join(ROOT, path), "utf8");

const WORKFLOWS = ".github/workflows";
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

/** Every workflow of this store, path and parsed pair. */
const workflows = () =>
  readdirSync(join(ROOT, WORKFLOWS))
    .filter((name) => name.endsWith(".yml"))
    .map((name) => [
      `${WORKFLOWS}/${name}`,
      YAML.parse(read(`${WORKFLOWS}/${name}`)),
    ]);

/** A workflow one of whose steps runs a gate that reads a change's plan:
 * `check:manual` — never `check:manual:pages`, which reads the pages alone —
 * or `validate-changes`, by its script or its `validate:changes` alias. */
const readsThePlan = (workflow) =>
  Object.values(workflow.jobs ?? {}).some((job) =>
    (job.steps ?? []).some((step) =>
      /\bcheck:manual(?![:\w-])|validate[-:]changes/.test(step.run ?? ""),
    ),
  );

/** The triggers a workflow runs on, name and filter alike, for the ones a
 * path can filter: a `push` or a `pull_request` with `paths` or
 * `paths-ignore`. A schedule and a dispatch filter nothing and are left out. */
const pathTriggers = (workflow) =>
  Object.entries(workflow.on ?? {}).filter(
    ([, trigger]) => trigger?.paths || trigger?.["paths-ignore"],
  );

/**
 * GitHub's own path filter, small enough to hold here: `**` matches any run
 * of segments, none included, `*` matches within one, and the pattern
 * matches the whole path. Enough for the patterns this store's workflows
 * write; a negated pattern (`!…`) is none of them, and would fail loudly here
 * rather than match.
 */
const globMatches = (pattern, path) => {
  assert.ok(!pattern.startsWith("!"), `${pattern}: a negated pattern`);
  const source = pattern
    .split(/(\*\*\/|\*\*|\*)/)
    .map((piece) => {
      if (piece === "**/") return "(?:.*/)?";
      if (piece === "**") return ".*";
      if (piece === "*") return "[^/]*";
      return piece.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("");
  return new RegExp(`^${source}$`).test(path);
};

/** Whether one trigger runs on a push that carries `path` alone: no
 * `paths-ignore` pattern matches it, and where `paths` is set one does. */
const runsOn = (trigger, path) =>
  !(trigger["paths-ignore"] ?? []).some((one) => globMatches(one, path)) &&
  (!trigger.paths || trigger.paths.some((one) => globMatches(one, path)));

/** A change's plan, and the plan template the store's own tests read. */
const PLAN = "openspec/changes/some-change/tasks.md";
const TEMPLATE = "openspec/schemas/grade10-planning/templates/tasks.md";

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

// shared-planning-agent-rounds-SC-84: the `round` rule refuses a ticked task
// group with no row, and `validate-changes --strict` reads the same plan. The
// push that ticks a group carries `tasks.md` and nothing else, so a trigger
// that filters that file out leaves both gates unrun on the one head where
// the group is called done.
test("shared-planning-agent-rounds-SC-84 - a workflow that reads a plan runs on the push that ticks a group", () => {
  const gates = workflows().filter(([, workflow]) => readsThePlan(workflow));

  assert.ok(gates.length > 0, "no workflow reads a change's plan");
  assert.ok(
    gates.some(([path]) => path.endsWith("/lint.yml")),
    "the Lint workflow no longer runs a gate that reads the plan",
  );
  for (const [path, workflow] of gates) {
    for (const [name, trigger] of pathTriggers(workflow)) {
      assert.ok(
        runsOn(trigger, PLAN),
        `${path}'s ${name} filters a plan's own file out of the events it runs on`,
      );
    }
  }
});

test("a workflow that skips the tick skips a change's plan alone, never the template", () => {
  // The tick's push carries a change's `tasks.md` and nothing else, which the
  // test, typecheck and design-sync workflows have no reason to run on. The
  // template of the same name is code the store's tests read, so a filter
  // written for the tick may not catch it.
  const skipping = workflows().filter(([, workflow]) =>
    pathTriggers(workflow).some(([, trigger]) =>
      (trigger["paths-ignore"] ?? []).some((one) => one.endsWith("tasks.md")),
    ),
  );

  assert.ok(skipping.length > 0, "no workflow skips the tick's push");
  for (const [path, workflow] of skipping) {
    for (const [name, trigger] of pathTriggers(workflow)) {
      assert.ok(
        runsOn(trigger, TEMPLATE),
        `${path}'s ${name} filters the plan template out of the events it runs on`,
      );
      assert.equal(
        runsOn(trigger, PLAN),
        false,
        `${path}'s ${name} runs on the tick's push, which the filter exists to skip`,
      );
    }
  }
});

test("the glob matcher reads the patterns the workflows write", () => {
  assert.equal(globMatches("**/tasks.md", PLAN), true);
  assert.equal(globMatches("**/tasks.md", "tasks.md"), true);
  assert.equal(globMatches("openspec/changes/**/tasks.md", PLAN), true);
  assert.equal(globMatches("openspec/changes/**/tasks.md", TEMPLATE), false);
  assert.equal(globMatches("docs/prds/**", "docs/prds/a/b.md"), true);
  assert.equal(globMatches("docs/prds/**", "docs/prd/a.md"), false);
  assert.equal(globMatches("*.md", "README.md"), true);
  assert.equal(globMatches("*.md", "docs/README.md"), false);
});
