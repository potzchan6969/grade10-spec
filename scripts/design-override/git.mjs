/*
 * The only way the check reads git. A read that fails throws, naming the
 * command, so a broken clone refuses rather than passes.
 */
import { spawnSync } from "node:child_process";

const PINNED = [
  "-c",
  "merge.conflictStyle=merge",
  "-c",
  "core.quotePath=false",
];

function run(args, input) {
  const done = spawnSync("git", [...PINNED, ...args], {
    encoding: "utf8",
    input,
    maxBuffer: 1 << 28,
  });
  if (done.error) throw new Error(`could not run git: ${done.error.message}`);
  return done;
}

export function git(args, { input, ok = [0] } = {}) {
  const done = run(args, input);
  if (!ok.includes(done.status)) {
    throw new Error(
      `could not read git: git ${args.join(" ")}\n${done.stderr.trim()}`,
    );
  }
  return done.stdout;
}

export const succeeds = (args) => run(args).status === 0;

export const isZero = (sha) => /^0+$/.test(sha);

export const short = (sha) => sha.slice(0, 8);

export function requireGit() {
  const [major, minor] = git(["version"])
    .match(/(\d+)\.(\d+)/)
    .slice(1)
    .map(Number);
  if (major < 2 || (major === 2 && minor < 38)) {
    throw new Error(
      `git ${major}.${minor} lacks merge-tree --write-tree: install git 2.38 or later`,
    );
  }
}

export function refuseShallow() {
  if (git(["rev-parse", "--is-shallow-repository"]).trim() === "true") {
    throw new Error(
      "this clone is shallow, so history cannot be read: run git fetch --unshallow",
    );
  }
}

/** The file's text at a commit or a tree; `undefined` where it is absent. */
export function readAt(ref, path) {
  const done = run(["cat-file", "blob", `${ref}:${path}`]);
  if (done.status === 0) return done.stdout;
  if (git(["ls-tree", "--name-only", ref, "--", path]).trim() === "")
    return undefined;
  throw new Error(
    `could not read ${path} at ${short(ref)}: ${done.stderr.trim()}`,
  );
}

export function diff(from, to, paths, flags) {
  if (paths.length === 0) return "";
  return git([
    "diff",
    "--no-color",
    "--no-ext-diff",
    "--no-renames",
    "--src-prefix=a/",
    "--dst-prefix=b/",
    ...flags,
    from,
    to,
    "--",
    ...paths,
  ]);
}

/** Who last set line `n` of `path` at `rev`. */
export function blame(rev, path, n) {
  const out = git(["blame", "--porcelain", "-L", `${n},${n}`, rev, "--", path]);
  const field = (key) => out.match(new RegExp(`^${key} (.*)$`, "m"))?.[1];
  return {
    sha: out.slice(0, 40),
    name: field("author"),
    date: new Date(Number(field("author-time")) * 1000)
      .toISOString()
      .slice(0, 10),
  };
}
