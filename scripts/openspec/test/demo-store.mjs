/**
 * A throwaway store for the round's scripts, small enough to commit inline
 * and real enough that `plan-land.mjs`'s gate — the pinned `openspec` CLI,
 * `check:manual` and `tcs:validate` — runs against it rather than around it.
 *
 * The scripts read the store through the manual's own readers, so they stay
 * where they are and take `--root`: a copy in a temporary directory could not
 * import `tools/manual/src/store/*`. What `sandbox` carries is one change
 * with five artifacts (plus `specs`, waited on rather than written, so the
 * CLI's "at least one delta" refusal never fires), two people in the team
 * map, and — with `remote: true`, the default — `origin/main` and the
 * change's branch on a bare remote: enough for every refusal of the landing
 * step and for the race two runs lose.
 *
 * `digest.test.mjs` and `changed-changes.test.mjs` read their own fixtures
 * still; they can move onto this one in a follow-up.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export const CHANGE = "round-probe";
export const DIR = `openspec/changes/${CHANGE}`;
export const BRANCH = `change/${CHANGE}`;

export const PROPOSAL = [
  "# Round probe",
  "",
  "## Why",
  "",
  "So the scripts have a change to land.",
  "",
].join("\n");

export const DECISIONS = [
  "## Goals",
  "",
  "- One row per round",
  "",
  "## Non-Goals",
  "",
  "- Nothing else",
  "",
  "## Decisions",
  "",
  "| Q | Asked | Decided | Instead of |",
  "| --- | --- | --- | --- |",
  "| Q1 | Who writes the row? | The landing | A second file |",
  "",
].join("\n");

/** `specs` is declared, never generated: the fixture waits on it
 * (`awaiting: specs:`) so the pinned CLI's "Change must have at least one
 * delta" never fires, and no `specs/**` tree has to validate against every
 * other store rule a real delta would summon. */
export const SCHEMA = [
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
  "  - id: ui-design",
  "    hand: design",
  "    required: false",
  "    generates: ui-design.md",
  "    requires: [decisions]",
  "    upstream: [proposal, decisions]",
  // One conditional reader and one that always runs: what the landing holds
  // the row's `Perspectives` cell to.
  "    perspectives:",
  "      - name: design",
  "        when: [surface]",
  "        agent: .claude/agents/design.md",
  "      - name: simpler",
  "        when: [always]",
  "        agent: .claude/agents/simpler.md",
  "  - id: tech-design",
  "    hand: tech",
  "    required: false",
  "    generates: tech-design.md",
  "    requires: [decisions]",
  "    upstream: [proposal, decisions]",
  "  - id: specs",
  "    hand: pm",
  "    required: true",
  "    generates: specs/**/spec.md",
  "    requires: [decisions]",
  "    upstream: [proposal, decisions]",
  "  - id: tasks",
  "    hand: dev",
  "    required: true",
  "    generates: tasks.md",
  "    requires: [ui-design]",
  "    upstream: [proposal, decisions, ui-design, tech-design]",
  // A task group is no artifact of the schema, so its readers sit here.
  "apply:",
  "  requires: [tasks]",
  "  tracks: tasks.md",
  "  perspectives:",
  "    - name: simpler",
  "      when: [always]",
  "      agent: .claude/agents/simpler.md",
  "",
].join("\n");

export const TEAM = [
  "handles:",
  "  dana:",
  "    email: dana@test",
  "    roles: [pm, design]",
  "  erin:",
  "    email: erin@test",
  "    roles: [tech, dev]",
  "channels: {}",
  "",
].join("\n");

/**
 * The change's record, its own default lines plus whatever a test needs on
 * top — a `reviewed:` or `landed_by:` mapping, an `awaiting:` wait, and so
 * on. `awaiting: specs:` and `page_waived:` are always on: the fixture never
 * carries a real delta, so the CLI's own delta gate and `check:manual`'s
 * `unmarked` rule both need telling why.
 */
export function record(...lines) {
  return [
    "# The change's record.",
    "schema: demo-planning",
    "created: 2026-10-01",
    "hands:",
    "  pm: dana",
    "  design: dana",
    "  tech: erin",
    "  dev: erin",
    "awaiting:",
    "  specs: still be drafted, once the round writes it",
    "page_waived: a fixture store with no product page to mark",
    ...lines,
    "",
  ].join("\n");
}

/** The fixture's package.json: only what `validate-changes.mjs`'s `cli()`
 * reads, the pinned `openspec` CLI, so the gate runs the same binary the real
 * store does. */
const PACKAGE_JSON = `${JSON.stringify(
  {
    name: "demo-store",
    private: true,
    scripts: { openspec: "pnpm dlx @fission-ai/openspec@1.8.0" },
  },
  null,
  2,
)}\n`;

const FILES = {
  "package.json": PACKAGE_JSON,
  "docs/prds/team.yaml": TEAM,
  "docs/prds/manual.yaml":
    "storybookBase: https://storybook.example\n\ngroups:\n  Products:\n    - demo-product\n",
  "docs/prds/index.md": "---\ntitle: Demo\n---\n\nA demo store.\n",
  "docs/prds/products/demo-product/index.md":
    "---\ntitle: Demo product\n---\n\nThe landing.\n",
  "openspec/schemas/demo-planning/schema.yaml": SCHEMA,
  [`${DIR}/.openspec.yaml`]: record(),
  [`${DIR}/proposal.md`]: PROPOSAL,
  [`${DIR}/decisions.md`]: DECISIONS,
  [`${DIR}/ui-design.md`]: "## Screens\n\nThe one screen.\n",
  [`${DIR}/tech-design.md`]: "## Decisions\n\nThe one decision.\n",
  [`${DIR}/tasks.md`]: "## 1. Build it (grade10-spec)\n\n- [ ] 1.1 Ship it\n",
};

/**
 * A throwaway store, committed, on `main`. With `remote: true` (the default)
 * it also carries a bare remote holding `main` and the change's branch,
 * checked out on that branch — what the landing step pushes against.
 * `remote: false` gives it an origin that exists but holds neither ref, for
 * the one refusal that needs an origin with no `main` to land on.
 *
 * `files` overrides or adds to the fixture's own — the same shape `record()`
 * builds a manifest with, keyed `a/b/c.md` from the store's root.
 */
export function sandbox({ remote = true, files = {} } = {}) {
  const root = mkdtempSync(join(tmpdir(), "round-scripts-"));
  for (const [path, text] of Object.entries({ ...FILES, ...files })) {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  }
  const git = (...args) =>
    execFileSync(
      "git",
      ["-c", "user.email=dana@test", "-c", "user.name=dana", ...args],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
  git("init", "--quiet", "--initial-branch=main", ".");
  git("config", "user.email", "dana@test");
  git("config", "user.name", "dana");
  git("add", "-A");
  git("commit", "--quiet", "-m", "the change");

  const bare = mkdtempSync(join(tmpdir(), "round-remote-"));
  execFileSync("git", ["init", "--quiet", "--bare", bare]);
  if (remote) {
    execFileSync("git", [
      "-C",
      bare,
      "symbolic-ref",
      "HEAD",
      "refs/heads/main",
    ]);
  }
  git("remote", "add", "origin", bare);
  git("checkout", "--quiet", "-b", BRANCH);
  if (remote) {
    git("push", "--quiet", "origin", "HEAD:refs/heads/main");
    git("push", "--quiet", "origin", `HEAD:refs/heads/${BRANCH}`);
  }
  return { root, remote: bare, git };
}
