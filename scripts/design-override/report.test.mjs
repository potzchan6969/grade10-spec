/*
 * The report on `main`, against a stub `gh` that records what it is asked
 * and answers from a file of existing comments.
 */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { chmodSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, test } from "node:test";
import { DESIGNER, fixture } from "./fixture.mjs";

const CARD = "packages/ui/src/blocks/card.tsx";
const GH = `#!/bin/sh
echo "$*" >> "$GH_DIR/calls"
[ -f "$GH_DIR/fail" ] && { echo "refused" >&2; exit 1; }
case "$*" in
  *POST*) cat >> "$GH_DIR/posts"; echo '{}' ;;
  *) cat "$GH_DIR/comments" 2>/dev/null || echo '[[]]' ;;
esac
`;

let repos = [];
afterEach(() => {
  for (const repo of repos) repo.cleanup();
  repos = [];
});

function store() {
  const repo = fixture();
  repos.push(repo);
  writeFileSync(join(repo.dir, "gh"), GH);
  chmodSync(join(repo.dir, "gh"), 0o755);
  repo.write(".gitignore", "node_modules\ngh\ncalls\nposts\ncomments\nfail\n");
  repo.write(CARD, `<div className="p-4" />\n`);
  repo.commit("feat: card", { as: DESIGNER });
  return repo;
}

function skipped(repo, message, options) {
  repo.must(["add", "-A"]);
  repo.must(["commit", "-q", "--no-verify", "-m", message], options);
  return repo.head();
}

function report(repo, before, after) {
  const done = spawnSync(
    "node",
    ["scripts/design-override/report.mjs", before, after],
    {
      cwd: repo.dir,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: `${repo.dir}:${process.env.PATH}`,
        GH_DIR: repo.dir,
        GITHUB_REPOSITORY: "9gag/store",
      },
    },
  );
  const read = (file) =>
    existsSync(join(repo.dir, file))
      ? readFileSync(join(repo.dir, file), "utf8")
      : "";
  const posts = read("posts")
    .split(/(?<=\})(?=\{)/)
    .filter(Boolean)
    .map((post) => JSON.parse(post).body);
  return { status: done.status, err: done.stderr, calls: read("calls"), posts };
}

test("SC-40 an override reaching main is told, naming the designer and the lines", () => {
  const repo = store();
  const before = repo.head();
  repo.write(CARD, `<div className="p-6" />\n`);
  const sha = skipped(
    repo,
    "fix: roomier\n\nDesign-Override: roomier card, agreed",
  );
  const { status, posts, calls } = report(repo, before, sha);
  assert.equal(status, 0);
  assert.match(
    calls,
    new RegExp(`POST repos/9gag/store/commits/${sha}/comments`),
  );
  assert.equal(posts.length, 1);
  assert.match(posts[0], /^<!-- design-override -->\n@tangconst /);
  assert.match(
    posts[0],
    /confirmed with `Design-Override: roomier card, agreed`/,
  );
  assert.match(
    posts[0],
    /- <div className="p-4" \/>\n\+ <div className="p-6" \/>/,
  );
});

test("SC-41 a commit that skipped the check is told and stays", () => {
  const repo = store();
  const before = repo.head();
  repo.write(CARD, `<div className="p-2" />\n`);
  const sha = skipped(repo, "fix: tighter");
  const { posts } = report(repo, before, sha);
  assert.match(posts[0], /without a `Design-Override:` line/);
  assert.equal(repo.head(), sha);
});

test("SC-42 a passing, an exempt or a confirmed-but-harmless commit is not told", () => {
  const repo = store();
  const before = repo.head();
  repo.write("packages/ui/src/blocks/other.tsx", "export const other = 1;\n");
  skipped(repo, "feat: other");
  repo.write(CARD, `<div className="p-3" />\n`);
  skipped(repo, "fix: polish", { as: DESIGNER });
  repo.write("packages/ui/src/blocks/more.tsx", "export const more = 1;\n");
  const after = skipped(repo, "feat: more\n\nDesign-Override: just in case");
  const { status, posts } = report(repo, before, after);
  assert.equal(status, 0);
  assert.deepEqual(posts, []);
});

test("SC-43 a commit already told is not told again", () => {
  const repo = store();
  const before = repo.head();
  repo.write(CARD, `<div className="p-2" />\n`);
  const sha = skipped(repo, "fix: tighter");
  repo.write(
    "comments",
    JSON.stringify([[{ body: "<!-- design-override -->\n@tangconst" }]]),
  );
  const { status, posts } = report(repo, before, sha);
  assert.equal(status, 0);
  assert.deepEqual(posts, []);
});

test("SC-44 a comment that cannot be posted fails the job", () => {
  const repo = store();
  const before = repo.head();
  repo.write(CARD, `<div className="p-2" />\n`);
  const sha = skipped(repo, "fix: tighter");
  repo.write("fail", "");
  const { status, err } = report(repo, before, sha);
  assert.equal(status, 2);
  assert.match(err, /refused/);
});

test("SC-45 a push that creates the branch reads only its last commit", () => {
  const repo = store();
  repo.write(CARD, `<div className="p-2" />\n`);
  skipped(repo, "fix: first");
  repo.write(CARD, `<div className="p-1" />\n`);
  const sha = skipped(repo, "fix: second");
  const { posts } = report(repo, "0".repeat(40), sha);
  assert.equal(posts.length, 1);
  assert.match(
    posts[0],
    /- <div className="p-2" \/>\n\+ <div className="p-1" \/>/,
  );
});

test("SC-32 the same stops at commit, at push and on main", () => {
  const repo = store();
  const before = repo.head();
  repo.write(CARD, `<div className="p-2" />\n`);
  const atCommit = repo.commit("fix: tighter").err;
  const sha = skipped(repo, "fix: tighter");
  const bare = `${repo.dir}.remote`;
  repo.must(["init", "-q", "--bare", bare], { cwd: "/" });
  repo.must(["remote", "add", "origin", bare]);
  const atPush = repo.git(["push", "-q", "origin", "main"]).err;
  const onMain = report(repo, before, sha).posts[0];
  for (const said of [atCommit, atPush, onMain]) {
    assert.match(said, /<div className="p-4" \/>/);
    assert.match(said, /<div className="p-2" \/>/);
  }
  const stopLines = (said) =>
    said.split("\n").filter((line) => /^ {2}(before|after|set by)/.test(line));
  assert.deepEqual(stopLines(atCommit), stopLines(atPush));
});
