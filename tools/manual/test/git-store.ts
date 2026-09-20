import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

/**
 * A store with a real git history, committed at fixed dates.
 *
 * Two readers date a change from its history — the claim a task group has sat
 * under, and the landing the change is idle since — and both are only worth
 * testing against a repository that actually holds the commits. One helper, so
 * a fixture history reads the same way for both and a third reader has one
 * tree to ask for.
 */

export const DAY = 86_400_000;

/** A task list with a group `owner` may claim, `done` of its three tasks
 * ticked, and a second group nobody claims. `note` varies the text without
 * touching ownership or a checkbox — a real commit that must move neither
 * reader's date, the way rewording a task does not. */
export const tasksMd = (owner: string, done: number, note = "") =>
  [
    `## 1. Contracts (grade10-spec)${owner ? ` (owner: @${owner})` : ""}`,
    "",
    ...[1, 2, 3].map(
      (n) => `- [${n <= done ? "x" : " "}] 1.${n} Task ${n}${note}`,
    ),
    "",
    "## 2. Adoption (grade10)",
    "",
    "- [ ] 2.1 Wire it up",
    "",
  ].join("\n");

/** A `## Decisions` table holding the rows given, as `readQuestions` reads
 * them: what dates a held row is the commit that added its own line. */
export const decisionsMd = (rows: string[]) =>
  [
    "# Decisions",
    "",
    "## Decisions",
    "",
    "| Q | Asked | Decided |",
    "| --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");

export const MANIFEST = "schema: grade10-planning\ncreated: 2026-09-01\n";
export const PROPOSAL = "# Gift cards\n\n## Why\n\nNobody can buy one.\n";

/** A git repository to write a store into, whose commits carry the day they
 * are given so an elapsed day count is exact rather than approximately
 * today. */
export function gitStore(prefix = "manual-store-") {
  const root = mkdtempSync(join(tmpdir(), prefix));
  const git = (args: string[], daysAgo = 0) => {
    const at = new Date(Date.now() - daysAgo * DAY).toISOString();
    execFileSync(
      "git",
      ["-c", "user.email=manual@test", "-c", "user.name=manual", ...args],
      {
        cwd: root,
        stdio: "ignore",
        env: { ...process.env, GIT_AUTHOR_DATE: at, GIT_COMMITTER_DATE: at },
      },
    );
  };
  const write = (path: string, text: string) => {
    const file = join(root, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, text);
  };
  const commit = (message: string, daysAgo = 0) => {
    git(["add", "-A"]);
    git(["commit", "--quiet", "-m", message], daysAgo);
  };
  /** The commit the store's own branch is on — what a reader handed `main`'s
   * commit is handed, so a case can commit past it and read both answers. */
  const head = () =>
    execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: root,
      encoding: "utf8",
    }).trim();
  git(["init", "--quiet", "."]);
  return { root, git, write, commit, head };
}

/** A store whose change has a `tasks.md` history: one commit per state, each
 * `[owner, done, daysAgo]`. */
export function storeWithHistory(
  states: [owner: string, done: number, ago: number][],
  change = "add-gift-cards",
) {
  const { root, write, commit } = gitStore("manual-idle-");
  const dir = `openspec/changes/${change}`;
  write(`${dir}/.openspec.yaml`, MANIFEST);
  write(`${dir}/proposal.md`, PROPOSAL);
  for (const [owner, done, ago] of states) {
    write(`${dir}/tasks.md`, tasksMd(owner, done, ` (${ago})`));
    commit(`${owner} ${done}`, ago);
  }
  return root;
}
