#!/usr/bin/env node
/*
 * The hooks' entry. Exits 0 when every commit passes, 1 on a stop, 2 when it
 * cannot read what it needs.
 *
 *   node check.mjs --message <file>   commit-msg: the index and the message
 *   node check.mjs --push <remote>    pre-push: every commit a pushed ref sends
 *
 * A rebase replays commits without commit-msg, so the push also reads each
 * pushed commit that replays an older one as the merge it is. The older one is
 * found among the commits the pushed branch held before, on the remote or in
 * its reflog, by author, author date and subject: a replay that rewrites any of
 * them is read as a new commit.
 */
import { existsSync, readFileSync } from "node:fs";
import { evaluate, evaluateReplay, loadSettings } from "./evaluate.mjs";
import { stopText } from "./format.mjs";
import { git, isZero, succeeds } from "./git.mjs";
import { cleanMessage } from "./message.mjs";

function commentChar() {
  const set = git(["config", "--get", "core.commentChar"], {
    ok: [0, 1],
  }).trim();
  return set === "" || set === "auto" ? "#" : set;
}

/** Every other parent of a merge in progress; an octopus has several. */
function mergeHeads() {
  const file = git(["rev-parse", "--git-path", "MERGE_HEAD"]).trim();
  return existsSync(file)
    ? readFileSync(file, "utf8").split("\n").filter(Boolean)
    : [];
}

const commitAt = (name) =>
  git(["rev-parse", "-q", "--verify", name], { ok: [0, 1] }).trim();

/** The commit git is about to record, built from the index without recording it. */
function atCommit(settings, file) {
  const message = cleanMessage(readFileSync(file, "utf8"), commentChar());
  const parents = [...(commitAt("HEAD") ? ["HEAD"] : []), ...mergeHeads()];
  const tree = git(["write-tree"]).trim();
  const sha = git(
    ["commit-tree", tree, ...parents.flatMap((ref) => ["-p", ref])],
    { input: message },
  ).trim();
  const picked = commitAt("CHERRY_PICK_HEAD");
  return [
    evaluate(settings, sha),
    ...(picked ? [evaluateReplay(settings, sha, picked)] : []),
  ];
}

const IDENTITY = "%H%x00%an <%ae> %ad%x00%s";

/** `[sha, identity]` for each single-parent commit the revisions list. */
function identities(revisions, flags = []) {
  return git(
    [
      "log",
      "--stdin",
      "--no-merges",
      "--date=raw",
      `--format=${IDENTITY}`,
      ...flags,
    ],
    { input: `${revisions.join("\n")}\n` },
  )
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha, ...identity] = line.split("\0");
      return [sha, identity.join("\0")];
    });
}

function reflog(ref) {
  if (!ref.startsWith("refs/heads/") || !succeeds(["reflog", "exists", ref]))
    return [];
  return git(["reflog", "show", "--format=%H", ref, "--"])
    .split("\n")
    .filter(Boolean);
}

/** Each pushed commit that replays one its ref held before, with that one. */
function replays(refs, sent) {
  const before = [
    ...new Set(
      refs.flatMap(({ localRef, remote, known }) => [
        ...(known ? [remote] : []),
        ...reflog(localRef),
      ]),
    ),
  ];
  if (before.length === 0 || sent.length === 0) return [];
  const older = new Map();
  const pushed = refs.map(({ local }) => `^${local}`);
  for (const [sha, identity] of identities([...before, ...pushed]))
    if (!older.has(identity)) older.set(identity, sha);
  return identities(sent, ["--no-walk"]).flatMap(([sha, identity]) =>
    older.has(identity) ? [[sha, older.get(identity)]] : [],
  );
}

/** Each pushed ref, with the commits it sends that no remote branch holds yet. */
function pushedRefs(lines) {
  return lines.flatMap((line) => {
    const [localRef, local, , remote] = line.trim().split(/\s+/);
    if (!local || isZero(local)) return [];
    const known =
      !isZero(remote) && succeeds(["cat-file", "-e", `${remote}^{commit}`]);
    const sent = git([
      "rev-list",
      "--reverse",
      local,
      "--not",
      "--remotes",
      ...(known ? [`^${remote}`] : []),
    ])
      .split("\n")
      .filter(Boolean);
    return [{ localRef, local, remote, known, sent }];
  });
}

function atPush(settings) {
  const lines = readFileSync(0, "utf8").split("\n").filter(Boolean);
  const refs = pushedRefs(lines);
  const sent = [...new Set(refs.flatMap((ref) => ref.sent))];
  return [
    ...sent.map((sha) => evaluate(settings, sha)),
    ...replays(refs, sent).map(([sha, original]) =>
      evaluateReplay(settings, sha, original),
    ),
  ];
}

function main([mode, value]) {
  const settings = loadSettings();
  if (mode === "--message" && value) return atCommit(settings, value);
  if (mode === "--push") return atPush(settings);
  throw new Error("usage: check.mjs --message <file> | --push <remote>");
}

try {
  const stopped = main(process.argv.slice(2)).filter(
    (result) => result.stopped,
  );
  for (const result of stopped) process.stderr.write(`${stopText(result)}\n`);
  process.exitCode = stopped.length > 0 ? 1 : 0;
} catch (error) {
  process.stderr.write(
    `Design Override could not check this: ${error.message}\n`,
  );
  process.exitCode = 2;
}
