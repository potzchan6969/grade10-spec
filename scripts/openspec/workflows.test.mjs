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
 * Four cases reach wider: every workflow whose steps read a change's plan,
 * held to running on the push that ticks a task group; every workflow that
 * skips that push, held to skipping the plan alone; every check a pull
 * request runs, held to cancelling on pull requests alone; and the Test
 * workflow's jobs, held to skipping only what they do not read. Each
 * trigger's filter is read the way the code host reads it, through a glob
 * matcher small enough to hold here.
 */
// biome-ignore-all lint/suspicious/noTemplateCurlyInString: a workflow's `${{ … }}` is GitHub's own expression, quoted here exactly as the file writes it.
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
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
 * A path filter small enough to hold here, close enough to the host's for the
 * patterns this store's workflows write: `**` matches any run of segments,
 * `*` matches within one, and the pattern matches the whole path. These are
 * the matcher's own semantics, not a claim about the host's corners; a
 * pattern using a character it does not model — a negation, `?`, `+`, a
 * class — fails loudly here rather than matching wrong.
 */
const globMatches = (pattern, path) => {
  assert.ok(
    !/[!?+[\]]/.test(pattern),
    `${pattern}: a pattern this matcher does not model`,
  );
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

/** Whether one trigger runs on an event that carries `path` alone: no
 * `paths-ignore` pattern matches it, and where `paths` is set one does. A
 * bare trigger (`pull_request:` with nothing under it) filters nothing. */
const runsOn = (trigger, path) =>
  !(trigger?.["paths-ignore"] ?? []).some((one) => globMatches(one, path)) &&
  (!trigger?.paths || trigger.paths.some((one) => globMatches(one, path)));

/** A change's plan, and the two files of the same name a filter written for
 * the tick may not catch: the plan template `test:openspec` reads, and the
 * demo store's plans the manual's tests read. Both asserted to exist, so a
 * moved file fails here rather than passing on a path nothing writes. */
const PLAN = "openspec/changes/some-change/tasks.md";
const TEMPLATE = "openspec/schemas/grade10-planning/templates/tasks.md";
const FIXTURE_PLAN =
  "tools/manual/demo-store/openspec/changes/add-thing/tasks.md";
for (const path of [TEMPLATE, FIXTURE_PLAN])
  assert.ok(existsSync(join(ROOT, path)), `${path} is not there`);
/** The workflows that skip the tick's push: the set the skip case holds,
 * named so a workflow leaving it says so. Test is not one: its checks are
 * required on pull requests, and a required check whose workflow never runs
 * stays pending, so its jobs filter themselves. */
const SKIPPING = ["typecheck.yml", "design-sync.yml"];

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

test("the notifier runs once the manual and the viewer deployed, and only then", () => {
  // The Manual workflow deploys the manual and the OpenSpec viewer in one job,
  // so its success is both being live; a message sent before it would link a
  // page that does not yet show what the message says.
  assert.equal(notify.on.push, undefined, "the notifier still runs on a push");
  assert.deepEqual(notify.on.workflow_run, {
    workflows: ["Manual"],
    types: ["completed"],
    branches: ["main"],
  });
  assert.equal(YAML.parse(read(".github/workflows/manual.yml")).name, "Manual");
  assert.equal(
    notify.jobs.notify.if,
    "github.event.workflow_run.conclusion == 'success'",
  );
  // The deployed head, never `github.sha`, which under `workflow_run` is
  // whatever `main` holds when the run starts.
  assert.equal(
    notify.jobs.notify.steps.find((step) => step.name === "Checkout").with.ref,
    "${{ github.event.workflow_run.head_sha }}",
  );
  assert.doesNotMatch(notifyText, /github\.sha\b|github\.event\.before/);
});

test("the notifier finds the last deployed head by each run's conclusion, never the API's status filter", () => {
  // `status=success` answered a run two weeks old while one an hour old had
  // succeeded, and the post that range made was too long for Slack.
  const step = notify.jobs.notify.steps.find((one) => one.id === "range");
  assert.doesNotMatch(step.run, /status=success/);
  assert.match(step.run, /\.conclusion == \\"success\\"/);
  assert.match(step.run, /git merge-base --is-ancestor "\$base" "\$HEAD_SHA"/);
});

test("the manual deploys on every push the notifier reads", () => {
  // A page landing can put an artifact behind, and its hand is told; a change
  // moving is a milestone. Each must start a deploy, or the notifier never
  // wakes for it.
  const manual = YAML.parse(read(".github/workflows/manual.yml"));
  for (const path of ["docs/prds/**", "openspec/**"]) {
    assert.ok(manual.on.push.paths.includes(path), path);
  }
  assert.deepEqual(manual.on.push.branches, ["main"]);
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
    // The tick lands on `main` (`pnpm plan done` commits there), so the gate
    // runs on a push to `main` before any filter is read.
    const push = workflow.on?.push;
    assert.ok(push !== undefined, `${path} runs on no push`);
    assert.ok(
      !push?.branches || push.branches.includes("main"),
      `${path}'s push does not run on main, where the tick lands`,
    );
    assert.ok(
      runsOn(push, PLAN),
      `${path}'s push filters a plan's own file out of the events it runs on`,
    );
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
  // typecheck and design-sync workflows have no reason to run on. The
  // template of the same name is code the store's tests read, so a filter
  // written for the tick may not catch it.
  // Chosen by what the filter does, not by how it is spelled: a workflow
  // whose ignore matches a plan is in the set whatever the pattern says.
  const skipping = workflows().filter(([, workflow]) =>
    pathTriggers(workflow).some(([, trigger]) =>
      (trigger["paths-ignore"] ?? []).some((one) => globMatches(one, PLAN)),
    ),
  );

  assert.deepEqual(
    skipping.map(([path]) => path.slice(WORKFLOWS.length + 1)).sort(),
    [...SKIPPING].sort(),
    "the workflows that skip the tick's push are not the ones the store names",
  );
  for (const [path, workflow] of skipping) {
    for (const [name, trigger] of pathTriggers(workflow)) {
      for (const kept of [TEMPLATE, FIXTURE_PLAN]) {
        assert.ok(
          runsOn(trigger, kept),
          `${path}'s ${name} filters ${kept} out of the events it runs on`,
        );
      }
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
  assert.equal(globMatches("openspec/changes/**/tasks.md", PLAN), true);
  assert.equal(globMatches("openspec/changes/**/tasks.md", TEMPLATE), false);
  assert.equal(
    globMatches("openspec/changes/**/tasks.md", FIXTURE_PLAN),
    false,
  );
  assert.throws(() => globMatches("docs/**/*.md?", PLAN), /does not model/);
  assert.equal(globMatches("docs/prds/**", "docs/prds/a/b.md"), true);
  assert.equal(globMatches("docs/prds/**", "docs/prd/a.md"), false);
  assert.equal(globMatches("*.md", "README.md"), true);
  assert.equal(globMatches("*.md", "docs/README.md"), false);
});

test("a check a pull request runs cancels on pull requests alone", () => {
  // A push to main cancelled by the next one leaves no verdict on the commit
  // that may have broken main, so every run off a pull request keys its own
  // group.
  const group =
    "${{ github.event_name == 'pull_request' && github.ref || github.run_id }}";
  const checks = workflows().filter(
    ([, workflow]) => workflow.on?.pull_request !== undefined,
  );

  assert.ok(checks.some(([path]) => path.endsWith("/lint.yml")));
  for (const [path, workflow] of checks) {
    if (!workflow.concurrency?.["cancel-in-progress"]) continue;
    assert.ok(
      workflow.concurrency.group.endsWith(group),
      `${path} shares a concurrency group across pushes to main`,
    );
  }
});

test("Test's jobs skip only what they do not read", () => {
  const test = YAML.parse(read(`${WORKFLOWS}/test.yml`));
  const step = test.jobs.changes.steps.find(({ id }) => id === "diff");
  const docsOnly = new RegExp(step.env.DOCS_ONLY);

  for (const path of [
    PLAN,
    "openspec/changes/some-change/proposal.md",
    "docs/prds/a/b.md",
  ])
    assert.ok(docsOnly.test(path), `${path} reaches the Playwright jobs`);
  for (const path of [
    TEMPLATE,
    FIXTURE_PLAN,
    "openspec/specs/a/spec.md",
    "packages/ui/src/a.tsx",
    "tools/manual/src/a.ts",
    "package.json",
  ])
    assert.equal(
      docsOnly.test(path),
      false,
      `${path} skips the Playwright jobs`,
    );

  // Skipped on `false` alone, so a failed filter runs them rather than
  // reading green.
  for (const name of ["stories", "walk"]) {
    assert.equal(test.jobs[name].needs, "changes", name);
    assert.equal(
      test.jobs[name].if,
      "${{ !cancelled() && needs.changes.outputs.code != 'false' }}",
      name,
    );
  }
  const planOnly = new RegExp(step.env.PLAN_ONLY);
  assert.ok(planOnly.test(PLAN), "the tick's push runs catalogs");
  for (const path of [
    TEMPLATE,
    FIXTURE_PLAN,
    "openspec/changes/some-change/proposal.md",
  ])
    assert.equal(planOnly.test(path), false, `${path} skips catalogs`);
  assert.equal(test.jobs.catalogs.needs, "changes");
  assert.equal(
    test.jobs.catalogs.if,
    "${{ !cancelled() && needs.changes.outputs.plan != 'true' }}",
  );
  assert.match(step.run, /git diff --no-renames --name-only/);
  const parsed = spawnSync("bash", ["-n"], {
    input: step.run,
    encoding: "utf8",
  });
  assert.equal(parsed.status, 0, parsed.stderr);
  assert.equal(test.on.push["paths-ignore"], undefined);
  assert.equal(test.on.pull_request, null);
});
