#!/usr/bin/env node
/*
 * The hooks' entry. Exits 0 when every commit passes, 1 on a stop, 2 when it
 * cannot read what it needs.
 *
 *   node check.mjs --message <file>   commit-msg: the index and the message
 *   node check.mjs --push <remote>    pre-push: every commit a pushed ref sends
 */
import { existsSync, readFileSync } from "node:fs";
import { evaluate, loadSettings } from "./evaluate.mjs";
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

/** The commit git is about to record, built from the index without recording it. */
function atCommit(settings, file) {
  const message = cleanMessage(readFileSync(file, "utf8"), commentChar());
  const parents = [
    ...(succeeds(["rev-parse", "-q", "--verify", "HEAD"]) ? ["HEAD"] : []),
    ...mergeHeads(),
  ];
  const tree = git(["write-tree"]).trim();
  const sha = git(
    ["commit-tree", tree, ...parents.flatMap((ref) => ["-p", ref])],
    { input: message },
  ).trim();
  return [evaluate(settings, sha)];
}

/** Every commit each pre-push line would send that no remote branch holds yet. */
function pushedCommits(lines) {
  return lines.flatMap((line) => {
    const [, local, , remote] = line.trim().split(/\s+/);
    if (!local || isZero(local)) return [];
    const known =
      !isZero(remote) && succeeds(["cat-file", "-e", `${remote}^{commit}`]);
    return git([
      "rev-list",
      "--reverse",
      local,
      "--not",
      "--remotes",
      ...(known ? [`^${remote}`] : []),
    ])
      .split("\n")
      .filter(Boolean);
  });
}

function atPush(settings) {
  const lines = readFileSync(0, "utf8").split("\n").filter(Boolean);
  return [...new Set(pushedCommits(lines))].map((sha) =>
    evaluate(settings, sha),
  );
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
