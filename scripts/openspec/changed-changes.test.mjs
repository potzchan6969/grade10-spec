import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

import {
  classifyCapabilities,
  classifyChanges,
  parseChangedFiles,
  slackPayload,
} from "./changed-changes.mjs";
import { sendAll } from "./lib/notify.mjs";

test("parses regular and renamed OpenSpec files from git's NUL format", () => {
  assert.deepEqual(
    parseChangedFiles(
      "M\0openspec/changes/add-cart/proposal.md\0R100\0openspec/changes/add-cart/tasks.md\0openspec/changes/archive/2026-09-08-add-cart/tasks.md\0",
    ),
    [
      {
        oldPath: null,
        path: "openspec/changes/add-cart/proposal.md",
        status: "M",
      },
      {
        oldPath: "openspec/changes/add-cart/tasks.md",
        path: "openspec/changes/archive/2026-09-08-add-cart/tasks.md",
        status: "R",
      },
    ],
  );
});

test("classifies file additions, updates, archive moves, and removals by scope", () => {
  const changes = classifyChanges([
    {
      oldPath: null,
      path: "openspec/changes/new-change/proposal.md",
      status: "A",
    },
    {
      oldPath: null,
      path: "openspec/changes/active-change/tech-design.md",
      status: "A",
    },
    {
      oldPath: null,
      path: "openspec/changes/active-change/specs/store/spec.md",
      status: "M",
    },
    {
      oldPath: null,
      path: "openspec/changes/old-change/proposal.md",
      status: "D",
    },
    {
      oldPath: "openspec/changes/finished-change/tasks.md",
      path: "openspec/changes/archive/2026-09-08-finished-change/tasks.md",
      status: "R",
    },
  ]);

  assert.deepEqual(changes, {
    new: [
      { id: "active-change", path: "active-change", scopes: ["tech-design"] },
      { id: "new-change", path: "new-change", scopes: ["proposal"] },
    ],
    updated: [{ id: "active-change", path: "active-change", scopes: ["spec"] }],
    archived: [
      {
        id: "finished-change",
        path: "2026-09-08-finished-change",
        scopes: ["tasks"],
      },
    ],
    removed: [{ id: "old-change", path: "old-change", scopes: ["proposal"] }],
  });
});

test("classifies a deleted file inside an existing change as removed", () => {
  assert.deepEqual(
    classifyChanges([
      {
        oldPath: null,
        path: "openspec/changes/active-change/spec.md",
        status: "D",
      },
    ]),
    {
      new: [],
      updated: [],
      archived: [],
      removed: [
        { id: "active-change", path: "active-change", scopes: ["spec"] },
      ],
    },
  );
});

test("does not report untouched changes when the diff is empty", () => {
  assert.deepEqual(classifyChanges([]), {
    new: [],
    updated: [],
    archived: [],
    removed: [],
  });
});

test("classifies durable capability files by capability and scope", () => {
  assert.deepEqual(
    classifyCapabilities([
      {
        oldPath: null,
        path: "openspec/specs/grade10-site/auction/winner-journey/spec.md",
        status: "A",
      },
      {
        oldPath: null,
        path: "openspec/specs/grade10-site/auction/winner-journey/user-journeys.md",
        status: "M",
      },
      {
        oldPath: null,
        path: "openspec/specs/grade10-site/auction/winner-journey/feature-tcs.md",
        status: "D",
      },
    ]),
    {
      new: [
        {
          id: "grade10-site/auction/winner-journey",
          path: "grade10-site/auction/winner-journey",
          scopes: ["spec"],
        },
      ],
      updated: [
        {
          id: "grade10-site/auction/winner-journey",
          path: "grade10-site/auction/winner-journey",
          scopes: ["user-journeys"],
        },
      ],
      archived: [],
      removed: [
        {
          id: "grade10-site/auction/winner-journey",
          path: "grade10-site/auction/winner-journey",
          scopes: ["test-cases"],
        },
      ],
    },
  );
});

test("builds one Slack section for each changed status", () => {
  const payload = slackPayload({
    changes: {
      new: [
        { id: "new-change", title: "Add a cart", scopes: ["proposal", "spec"] },
      ],
      updated: [
        {
          id: "active-change",
          title: "Update <copy>",
          scopes: ["tech-design"],
        },
      ],
      archived: [
        { id: "finished-change", title: "Finish a change", scopes: ["tasks"] },
      ],
      removed: [
        { id: "old-change", title: "Remove a change", scopes: ["proposal"] },
      ],
    },
    commitSha: "1234567890",
    commitUrl: "https://github.com/9gag/grade10-spec/commit/1234567890",
    manualUrl: "https://spec.grade10-stg.com/planning",
    openspecUrl: "https://spec.grade10-stg.com/openspec/",
  });

  assert.equal(payload.blocks.length, 5);
  assert.equal(
    payload.blocks[0].text.text,
    ":new: OpenSpec *New*\n- <https://spec.grade10-stg.com/openspec/#/change/new-change|Add a cart> (`new-change`) — `proposal`, `spec`",
  );
  assert.match(
    payload.blocks[0].text.text,
    /<https:\/\/spec\.grade10-stg\.com\/openspec\/#\/change\/new-change\|Add a cart> \(`new-change`\) — `proposal`, `spec`/,
  );
  assert.equal(
    payload.blocks[1].text.text,
    ":pencil2: OpenSpec *Updated*\n- <https://spec.grade10-stg.com/openspec/#/change/active-change|Update &lt;copy&gt;> (`active-change`) — `tech-design`",
  );
  assert.match(
    payload.blocks[1].text.text,
    /Update &lt;copy&gt;.*`tech-design`/,
  );
  assert.match(
    payload.blocks[2].text.text,
    /^:file_cabinet: OpenSpec \*Archived\*\n/,
  );
  assert.match(
    payload.blocks[3].text.text,
    /^:wastebasket: OpenSpec \*Removed\*\n/,
  );
  assert.match(payload.blocks.at(-1).elements[0].text, /1234567/);
});

test("includes durable capability links in the Slack payload", () => {
  const payload = slackPayload({
    changes: { new: [], updated: [], archived: [], removed: [] },
    capabilities: {
      new: [
        {
          id: "grade10-site/auction/winner-journey",
          path: "grade10-site/auction/winner-journey",
          scopes: ["spec"],
        },
      ],
      updated: [],
      archived: [],
      removed: [],
    },
    commitSha: "1234567890",
    commitUrl: "https://github.com/9gag/grade10-spec/commit/1234567890",
    manualUrl: "https://spec.grade10-stg.com/planning",
    openspecUrl: "https://spec.grade10-stg.com/openspec/",
  });

  assert.equal(
    payload.blocks[0].text.text,
    ":new: OpenSpec *New capabilities*\n- <https://spec.grade10-stg.com/openspec/#/spec/grade10-site/auction/winner-journey|grade10-site/auction/winner-journey> — `spec`",
  );
});

// ── The stages, the hands and the messages ──────────────────────────────────

/**
 * One repository at two revisions, which is what a push is.
 *
 * The script reads the base through a worktree and the head through the
 * checkout, so a fixture for it is one store committed twice — built the way
 * `tools/manual/test/store-main.test.ts`'s `checkout()` builds one, with each
 * commit carrying the day it is given so a freshness reading is exact rather
 * than approximately today. The script stays where it is and takes `--root`:
 * a copy in a temporary directory could not import `tools/manual/src/store`.
 */

const SCRIPTS = fileURLToPath(new URL(".", import.meta.url));
const CHANGE = "probe";
const DIR = `openspec/changes/${CHANGE}`;
const DAY = 86_400_000;

const SCHEMA = [
  "name: demo-planning",
  "version: 1",
  "artifacts:",
  "  - id: proposal",
  "    hand: pm",
  "    required: true",
  "    generates: proposal.md",
  "    requires: []",
  "    upstream: []",
  "  - id: decisions",
  "    hand: pm",
  "    required: true",
  "    generates: decisions.md",
  "    requires: [proposal]",
  "    upstream: [proposal]",
  "  - id: user-journeys",
  "    hand: pm",
  "    required: true",
  "    generates: user-journeys.md",
  "    requires: [decisions]",
  "    upstream: [proposal, decisions]",
  "  - id: ui-design",
  "    hand: design",
  "    required: false",
  "    generates: ui-design.md",
  "    requires: [decisions]",
  "    upstream: [proposal, decisions]",
  "  - id: tech-design",
  "    hand: tech",
  "    required: false",
  "    generates: tech-design.md",
  "    requires: [decisions]",
  "    upstream: [proposal, decisions]",
  "  - id: specs",
  "    hand: pm",
  "    required: true",
  "    generates: spec.md",
  "    requires: [tech-design]",
  "    upstream: [proposal, decisions, user-journeys]",
  "  - id: test-cases",
  "    hand: qa",
  "    required: true",
  "    generates: feature-tcs.md",
  "    requires: [specs]",
  "    upstream: [proposal, decisions, user-journeys]",
  "  - id: tasks",
  "    hand: dev",
  "    required: true",
  "    generates: tasks.md",
  "    requires: [specs]",
  "    upstream: [tech-design]",
  "",
].join("\n");

/** Four people: three with a Slack member, one QA hand the map gives none,
 * and one channel per role for a stage whose hand a change does not name. */
const TEAM = [
  "handles:",
  "  dana:",
  "    email: dana@test",
  "    slack: U-DANA",
  "    roles: [pm, design]",
  "  erin:",
  "    email: erin@test",
  "    slack: U-ERIN",
  "    roles: [tech, dev]",
  "  fred:",
  "    email: fred@test",
  "    slack: U-FRED",
  "    roles: [release, qa]",
  "  gina:",
  "    email: gina@test",
  "    roles: [qa]",
  "channels:",
  "  pm: C-PM",
  "  design: C-DESIGN",
  "  tech: C-TECH",
  "  dev: C-DEV",
  "  qa: C-QA",
  "  release: C-RELEASE",
  "",
].join("\n");

const HANDS = [
  "hands:",
  "  pm: dana",
  "  design: dana",
  "  tech: erin",
  "  dev: erin",
  "  qa: fred",
  "  release: fred",
];

const record = (...lines) =>
  ["schema: demo-planning", "created: 2026-10-01", ...lines, ""].join("\n");

const proposalOf = (note = "") =>
  ["# Probe", "", "## Why", "", `Nobody has.${note}`, ""].join("\n");

const tasksMd = (done = 0) =>
  [
    "## 1. Build it (grade10-spec)",
    "",
    `- [${done >= 1 ? "x" : " "}] 1.1 Write it`,
    `- [${done >= 2 ? "x" : " "}] 1.2 Ship it`,
    "",
  ].join("\n");

/** Every artifact below `tasks`, so a fixture walks the ladder by writing
 * files rather than by restating the schema. */
const throughSpecs = (change = CHANGE) => ({
  [`openspec/changes/${change}/decisions.md`]: "## Goals\n\n- One\n",
  [`openspec/changes/${change}/user-journeys.md`]: "**Walked by:** nobody\n",
  [`openspec/changes/${change}/ui-design.md`]: "## Screens\n\nOne.\n",
  [`openspec/changes/${change}/tech-design.md`]: "## Decisions\n\nOne.\n",
  [`openspec/changes/${change}/spec.md`]: "## Requirement\n\nOne.\n",
  [`openspec/changes/${change}/feature-tcs.md`]: "## Cases\n\nOne.\n",
});

function sandbox() {
  const root = mkdtempSync(join(tmpdir(), "notify-store-"));
  const git = (args, daysAgo = 0) => {
    const at = new Date(Date.now() - daysAgo * DAY).toISOString();
    return execFileSync(
      "git",
      ["-c", "user.email=dana@test", "-c", "user.name=dana", ...args],
      {
        cwd: root,
        encoding: "utf8",
        env: { ...process.env, GIT_AUTHOR_DATE: at, GIT_COMMITTER_DATE: at },
      },
    ).trim();
  };
  const write = (files) => {
    for (const [path, text] of Object.entries(files)) {
      const file = join(root, path);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, text);
    }
  };
  const drop = (path) => rmSync(join(root, path), { force: true });
  const commit = (message, daysAgo = 0) => {
    git(["add", "-A"]);
    git(["commit", "--quiet", "-m", message], daysAgo);
    return git(["rev-parse", "HEAD"]);
  };
  git(["init", "--quiet", "--initial-branch=main", "."]);
  write({
    "docs/prds/team.yaml": TEAM,
    "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
  });
  return { root, git, write, drop, commit };
}

/** The script over a fixture store, its payloads printed and nothing sent. */
function stages(root, args = []) {
  const done = spawnSync(
    process.execPath,
    [
      join(SCRIPTS, "changed-changes.mjs"),
      "--stages",
      "--root",
      root,
      "--workspace-url",
      "grade10.slack.com",
      "--manual-url",
      "https://spec.test/planning",
      ...args,
    ],
    { encoding: "utf8", env: { ...process.env, NO_COLOR: "1" } },
  );
  return { ...done, read: () => JSON.parse(done.stdout) };
}

const textOf = (messages, key) =>
  messages.find((one) => one.key === key)?.text ?? "";

test("--stages tells both hands the proposal's landing put on the change", () => {
  const { root, write, commit } = sandbox();
  write({
    [`${DIR}/.openspec.yaml`]: record(...HANDS),
    [`${DIR}/proposal.md`]: proposalOf(),
  });
  const base = commit("propose probe", 3);
  write({
    [`${DIR}/decisions.md`]: "## Goals\n\n- One\n",
    [`${DIR}/user-journeys.md`]: "**Walked by:** nobody\n",
  });
  const head = commit("decide probe", 1);

  const { read } = stages(root, ["--base", base, "--head", head]);
  const { messages, stages: reached } = read();

  assert.equal(reached[CHANGE], "proposed");
  assert.deepEqual(messages.map((one) => one.key).sort(), [
    "probe:proposed:design",
    "probe:proposed:tech",
  ]);
  assert.deepEqual(messages.map((one) => one.channel).sort(), [
    "U-DANA",
    "U-ERIN",
  ]);
  for (const message of messages) {
    assert.equal(message.kind, "your-turn");
    assert.equal(message.to, "member");
    assert.match(message.text, /Probe/);
    assert.match(message.text, /Proposed/);
    // The change page, because the record names no thread.
    assert.match(
      message.text,
      /https:\/\/spec\.test\/planning\/in-flight\/probe/,
    );
    assert.match(message.text, /`\/[a-z]+ probe/);
  }
});

test("--stages names the stage a push moved a change into and tells its hand", () => {
  const { root, write, commit } = sandbox();
  write({
    [`${DIR}/.openspec.yaml`]: record(...HANDS),
    [`${DIR}/proposal.md`]: proposalOf(),
  });
  const base = commit("propose probe", 3);
  write({
    ...throughSpecs(),
    [`${DIR}/.openspec.yaml`]: record(...HANDS, 'promoted_by: "@dana"'),
    [`${DIR}/tasks.md`]: tasksMd(0),
  });
  const head = commit("plan probe", 1);

  const { read } = stages(root, ["--base", base, "--head", head]);
  const { messages, stages: reached, payload, hasMessages } = read();

  assert.equal(reached[CHANGE], "planned");
  assert.equal(hasMessages, true);
  assert.deepEqual(
    messages.map((one) => [one.key, one.channel]),
    [["probe:planned:dev", "U-ERIN"]],
  );
  assert.match(payload.blocks[0].text.text, /Planned/);
});

test("--stages tells each hand of its own change when one push moves two", () => {
  const { root, write, commit } = sandbox();
  write({
    [`${DIR}/.openspec.yaml`]: record(...HANDS),
    [`${DIR}/proposal.md`]: proposalOf(),
    "openspec/changes/other/.openspec.yaml": record(...HANDS),
    "openspec/changes/other/proposal.md": proposalOf(" Twice."),
  });
  const base = commit("propose both", 3);
  write({
    ...throughSpecs(),
    [`${DIR}/.openspec.yaml`]: record(...HANDS, 'promoted_by: "@dana"'),
    [`${DIR}/tasks.md`]: tasksMd(0),
    "openspec/changes/other/decisions.md": "## Goals\n\n- One\n",
    "openspec/changes/other/user-journeys.md": "**Walked by:** nobody\n",
  });
  const head = commit("move both", 1);

  const { read } = stages(root, ["--base", base, "--head", head]);
  const { messages, stages: reached, payload } = read();

  assert.equal(reached.probe, "planned");
  assert.equal(reached.other, "proposed");
  const post = payload.blocks.map((block) => block.text?.text ?? "").join("\n");
  assert.match(post, /probe.*Planned/s);
  assert.match(post, /other.*Proposed/s);
  assert.deepEqual(messages.map((one) => one.key).sort(), [
    "other:proposed:design",
    "other:proposed:tech",
    "probe:planned:dev",
  ]);
});

test("--stages tells the engineer again when a reverted landing lands again", () => {
  const { root, write, drop, commit } = sandbox();
  write({
    ...throughSpecs(),
    [`${DIR}/.openspec.yaml`]: record(...HANDS, 'promoted_by: "@dana"'),
    [`${DIR}/proposal.md`]: proposalOf(),
    [`${DIR}/tasks.md`]: tasksMd(0),
  });
  const planned = commit("plan probe", 5);
  drop(`${DIR}/tasks.md`);
  const reverted = commit("revert the plan", 3);
  write({ [`${DIR}/tasks.md`]: tasksMd(0) });
  const again = commit("plan probe again", 1);

  const first = stages(root, ["--base", reverted, "--head", planned]).read();
  const second = stages(root, ["--base", reverted, "--head", again]).read();

  // The revert took the stage back down, so the re-landing is a real move —
  // and a second push is a second run, with its own sent keys.
  assert.deepEqual(
    first.messages.map((one) => one.key),
    ["probe:planned:dev"],
  );
  assert.deepEqual(
    second.messages.map((one) => one.key),
    ["probe:planned:dev"],
  );
});

test("--stages tells nobody when a push only ticks a task", () => {
  const { root, write, commit } = sandbox();
  write({
    ...throughSpecs(),
    [`${DIR}/.openspec.yaml`]: record(...HANDS, 'promoted_by: "@dana"'),
    [`${DIR}/proposal.md`]: proposalOf(),
    [`${DIR}/tasks.md`]: tasksMd(0),
  });
  const base = commit("plan probe", 3);
  write({ [`${DIR}/tasks.md`]: tasksMd(1) });
  const head = commit("build probe 1.1", 1);

  const { read } = stages(root, ["--base", base, "--head", head]);
  const { messages, stages: reached, payload } = read();

  assert.equal(reached[CHANGE], "building");
  assert.deepEqual(messages, []);
  assert.match(payload.blocks[0].text.text, /probe.*Building/s);
});

test("--stages names no change for a push that only writes the record's keys", () => {
  const { root, write, commit } = sandbox();
  write({
    ...throughSpecs(),
    [`${DIR}/.openspec.yaml`]: record(...HANDS, 'promoted_by: "@dana"'),
    [`${DIR}/proposal.md`]: proposalOf(),
    [`${DIR}/tasks.md`]: tasksMd(0),
  });
  const base = commit("plan probe", 3);
  write({
    [`${DIR}/.openspec.yaml`]: record(
      ...HANDS,
      'promoted_by: "@dana"',
      "thread: C0AB/1700000000.000100",
      "reviewed:",
      "  decisions: abcd1234",
      "landed_by:",
      "  tasks: erin",
    ),
  });
  const head = commit("record the round", 1);
  const output = join(root, "output.txt");

  const { read } = stages(root, [
    "--base",
    base,
    "--head",
    head,
    "--github-output",
    output,
  ]);
  const { messages, changes, hasMessages } = read();

  assert.deepEqual(messages, []);
  assert.deepEqual(changes.updated, []);
  assert.equal(hasMessages, false);
  assert.match(readFileSync(output, "utf8"), /has-messages=false/);
});

test("--stages tells the artifact's hand what changed before it", () => {
  const { root, write, commit } = sandbox();
  write({
    [`${DIR}/.openspec.yaml`]: record("hands:", "  pm: dana"),
    [`${DIR}/proposal.md`]: proposalOf(),
    [`${DIR}/decisions.md`]: "## Goals\n\n- One\n",
  });
  const base = commit("propose probe", 10);
  write({ [`${DIR}/proposal.md`]: proposalOf(" Again.") });
  const head = commit("reword the proposal", 1);

  const { read } = stages(root, ["--base", base, "--head", head]);
  const { messages } = read();

  assert.deepEqual(
    messages.map((one) => [one.key, one.kind, one.channel]),
    [["probe:behind:decisions", "behind", "U-DANA"]],
  );
  assert.match(textOf(messages, "probe:behind:decisions"), /decisions/);
  assert.match(textOf(messages, "probe:behind:decisions"), /proposal/);
});

test("--stages sends nothing twice for one push", () => {
  const { root, write, commit } = sandbox();
  write({
    [`${DIR}/.openspec.yaml`]: record("hands:", "  pm: dana"),
    [`${DIR}/proposal.md`]: proposalOf(),
    [`${DIR}/decisions.md`]: "## Goals\n\n- One\n",
  });
  const base = commit("propose probe", 10);
  write({ [`${DIR}/proposal.md`]: proposalOf(" Again.") });
  const head = commit("reword the proposal", 1);
  const keys = join(root, "sent-keys.txt");
  const args = ["--base", base, "--head", head, "--sent-keys", keys];

  const first = stages(root, args).read();
  const second = stages(root, args).read();

  assert.deepEqual(
    first.messages.map((one) => one.key),
    ["probe:behind:decisions"],
  );
  assert.deepEqual(second.messages, []);
  assert.equal(readFileSync(keys, "utf8").trim(), "probe:behind:decisions");
});

test("--stages says it told a handle with no Slack member nothing", () => {
  const { root, write, commit } = sandbox();
  write({
    ...throughSpecs(),
    [`${DIR}/.openspec.yaml`]: record(
      "hands:",
      "  qa: gina",
      "  release: fred",
      'promoted_by: "@dana"',
      "deployed_env: staging",
    ),
    [`${DIR}/proposal.md`]: proposalOf(),
    [`${DIR}/tasks.md`]: tasksMd(0),
  });
  const base = commit("plan probe", 3);
  write({ [`${DIR}/tasks.md`]: tasksMd(2) });
  const head = commit("finish probe", 1);

  const { read, stderr } = stages(root, ["--base", base, "--head", head]);
  const { messages, skipped, stages: reached } = read();

  assert.equal(reached[CHANGE], "on-staging");
  assert.deepEqual(
    messages.map((one) => [one.key, one.channel]),
    [["probe:on-staging:release", "U-FRED"]],
  );
  assert.deepEqual(
    skipped.map((one) => one.key),
    ["probe:on-staging:qa"],
  );
  assert.match(skipped[0].why, /gina/);
  assert.match(stderr, /gina/);
});

test("--stages posts to the role's channel when the hand is unnamed", () => {
  // Planned, not Proposed: Proposed holds the product manager until both
  // second hands are named (decisions Q49), so an unnamed hand there is no
  // turn of its own.
  const { root, write, commit } = sandbox();
  const named = ["hands:", "  pm: dana", "  design: dana", "  tech: erin"];
  write({
    [`${DIR}/.openspec.yaml`]: record(...named),
    [`${DIR}/proposal.md`]: proposalOf(),
  });
  const base = commit("propose probe", 3);
  write({
    ...throughSpecs(),
    [`${DIR}/.openspec.yaml`]: record(...named, 'promoted_by: "@dana"'),
    [`${DIR}/tasks.md`]: tasksMd(0),
  });
  const head = commit("plan probe", 1);

  const { read } = stages(root, ["--base", base, "--head", head]);
  const { messages } = read();

  assert.deepEqual(
    messages.map((one) => [one.key, one.to, one.channel]),
    [["probe:planned:dev", "channel", "C-DEV"]],
  );
  assert.match(messages[0].text, /`\/tasks probe`/);
});

test("--stages posts to the role's channel when the hand is taken off", () => {
  const { root, write, commit } = sandbox();
  write({
    ...throughSpecs(),
    [`${DIR}/.openspec.yaml`]: record(...HANDS, 'promoted_by: "@dana"'),
    [`${DIR}/proposal.md`]: proposalOf(),
    [`${DIR}/tasks.md`]: tasksMd(0),
  });
  const base = commit("plan probe", 3);
  write({
    [`${DIR}/.openspec.yaml`]: record(
      "hands:",
      "  pm: dana",
      "  design: dana",
      "  tech: erin",
      'promoted_by: "@dana"',
    ),
  });
  const head = commit("take the engineer off", 1);

  const { read } = stages(root, ["--base", base, "--head", head]);
  const { messages, stages: reached } = read();

  assert.equal(reached[CHANGE], "planned");
  assert.deepEqual(
    messages.map((one) => [one.key, one.to, one.channel]),
    [["probe:planned:dev", "channel", "C-DEV"]],
  );
});

test("--stages refuses a base the checkout cannot reach, naming the range", () => {
  const { root, write, commit } = sandbox();
  write({
    [`${DIR}/.openspec.yaml`]: record(...HANDS),
    [`${DIR}/proposal.md`]: proposalOf(),
  });
  const head = commit("propose probe", 1);
  const missing = "0".repeat(40);

  const done = stages(root, ["--base", missing, "--head", head]);

  assert.equal(done.status, 1);
  assert.match(done.stderr, new RegExp(`${missing}\\.\\.${head}`));
});

test("--stages names the run sheet to QA and the release hand's own turn", () => {
  const { root, write, commit } = sandbox();
  write({
    ...throughSpecs(),
    [`${DIR}/.openspec.yaml`]: record(
      ...HANDS,
      'promoted_by: "@dana"',
      "thread: C0AB/1700000000.000100",
      "deployed_env: staging",
    ),
    [`${DIR}/proposal.md`]: proposalOf(),
    [`${DIR}/tasks.md`]: tasksMd(0),
  });
  const base = commit("plan probe", 3);
  write({ [`${DIR}/tasks.md`]: tasksMd(2) });
  const head = commit("finish probe", 1);

  const { read } = stages(root, [
    "--base",
    base,
    "--head",
    head,
    "--sheet-url",
    "https://sheets.test/run",
  ]);
  const { messages } = read();

  assert.deepEqual(
    messages.map((one) => [one.key, one.kind, one.channel]),
    [
      ["probe:on-staging:qa", "staging", "U-FRED"],
      ["probe:on-staging:release", "your-turn", "U-FRED"],
    ],
  );
  assert.match(
    textOf(messages, "probe:on-staging:qa"),
    /https:\/\/sheets\.test\/run/,
  );
  assert.match(textOf(messages, "probe:on-staging:release"), /On staging/);
  // The thread's permalink: the workspace host, the channel, and the
  // timestamp with its dot taken out. A direct message is not a reply.
  for (const message of messages) {
    assert.match(
      message.text,
      /https:\/\/grade10\.slack\.com\/archives\/C0AB\/p1700000000000100/,
    );
    assert.equal(message.threadTs, undefined);
  }
});

test("--stages says the words when no run sheet is configured", () => {
  const { root, write, commit } = sandbox();
  write({
    ...throughSpecs(),
    [`${DIR}/.openspec.yaml`]: record(
      ...HANDS,
      'promoted_by: "@dana"',
      "deployed_env: staging",
    ),
    [`${DIR}/proposal.md`]: proposalOf(),
    [`${DIR}/tasks.md`]: tasksMd(0),
  });
  const base = commit("plan probe", 3);
  write({ [`${DIR}/tasks.md`]: tasksMd(2) });
  const head = commit("finish probe", 1);

  const { messages } = stages(root, ["--base", base, "--head", head]).read();

  assert.match(textOf(messages, "probe:on-staging:qa"), /the run sheet/);
});

test("the sender posts each message once and retries a 429 once", async () => {
  const calls = [];
  let first = true;
  const fetched = async (url, init) => {
    calls.push({
      url,
      ...JSON.parse(init.body),
      auth: init.headers.Authorization,
    });
    if (first) {
      first = false;
      return {
        status: 429,
        headers: new Map([["retry-after", "0"]]),
        json: async () => ({ ok: false, error: "ratelimited" }),
      };
    }
    return {
      status: 200,
      headers: new Map(),
      json: async () => ({ ok: true }),
    };
  };

  const sent = await sendAll(
    [
      {
        key: "probe:planned:dev",
        to: "member",
        channel: "U-ERIN",
        text: "One",
      },
      {
        key: "probe:behind:decisions",
        to: "channel",
        channel: "C-DESIGN",
        text: "Two",
        threadTs: "1700000000.000100",
      },
    ],
    { token: "xoxb-test", fetch: fetched, sleep: async () => {} },
  );

  assert.deepEqual(sent, ["probe:planned:dev", "probe:behind:decisions"]);
  assert.equal(calls.length, 3);
  assert.equal(calls[0].url, "https://slack.com/api/chat.postMessage");
  assert.equal(calls[0].auth, "Bearer xoxb-test");
  assert.equal(calls[1].channel, "U-ERIN");
  assert.equal(calls[2].thread_ts, "1700000000.000100");
});
