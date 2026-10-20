// Push the run's day pages, their shots and the run's range to digest/<branch>; the push starts the Checkpoint digest workflow,
// which uploads each day, posts what the run brought to Slack and moves the checkpoint. No gh and no token: a git push is enough.
// node publish.mjs <page.html>... --range <range.json>
// range.json is what range printed: both repositories' commits, the checkpoints the workflow moves with a lease, and the fresh commits.
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { documentOf } from "../../handoff-page/scripts/document.mjs";

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : (args[i + 1] ?? "");
};
const first = args.findIndex((a) => a.startsWith("--"));
const pages = first === -1 ? args : args.slice(0, first);
if (!pages.length || !option("range"))
  throw new Error(
    "usage: node publish.mjs <page.html>... --range <range.json>",
  );
const read = JSON.parse(readFileSync(resolve(option("range")), "utf8"));
const branch = read.branch;

const git = (cwd, ...a) =>
  execFileSync("git", a, { cwd, encoding: "utf8" }).trim();
const origin = git(process.cwd(), "remote", "get-url", "origin");
const repo = origin.match(/github\.com[:/](.+?)(?:\.git)?$/)?.[1];
if (!repo) throw new Error(`origin ${origin} is not a GitHub repository`);
const commit = (cwd, rev) => git(cwd, "rev-parse", `${rev}^{commit}`);
// The dir stays here: the workflow needs each repository's run and its checkpoint, never a path on this machine.
const runOf = (r, cwd) => ({
  repo: r.repo,
  from: commit(cwd, r.from),
  to: commit(cwd, r.to),
  saved: r.saved ? commit(cwd, r.saved) : "",
});
const range = {
  branch,
  ...runOf(read.spec, process.cwd()),
  build: read.build ? runOf(read.build, read.build.dir) : null,
  fresh: read.fresh,
};
const days = pages.map((file) => {
  const page = resolve(file);
  const data = JSON.parse(
    readFileSync(join(dirname(page), "data.json"), "utf8"),
  );
  const date = data.stamp?.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? ""))
    throw new Error(
      `${file}: stamp.date is the day the page covers, such as 2026-10-20`,
    );
  return { page, data, date };
});
if (new Set(days.map((d) => d.date)).size !== days.length)
  throw new Error("one page per day: two pages cover the same day");
const who = ["user.name", "user.email"].flatMap((k) => [
  "-c",
  `${k}=${git(process.cwd(), "config", k)}`,
]);

// The pages ride on main under .digest/, so the push starts the Checkpoint digest workflow main defines.
execFileSync("git", ["fetch", "-q", origin, "main"], { stdio: "inherit" });
const base = git(process.cwd(), "rev-parse", "FETCH_HEAD^{commit}");
const out = mkdtempSync(join(tmpdir(), "digest-"));
const index = join(out, "index");
const inRepo = (...a) =>
  execFileSync("git", a, {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, GIT_INDEX_FILE: index },
  }).trim();
try {
  const files = join(out, "page");
  mkdirSync(files);
  writeFileSync(join(files, "range.json"), JSON.stringify(range));
  for (const { page, data, date } of days) {
    const folder = join(files, date);
    mkdirSync(folder);
    writeFileSync(
      join(folder, "index.html"),
      documentOf(readFileSync(page, "utf8")),
    );
    writeFileSync(
      join(folder, "digest.json"),
      JSON.stringify({ ...data, range }),
    );
    const shots = join(dirname(page), "shots");
    if (existsSync(shots))
      cpSync(shots, join(folder, "shots"), { recursive: true });
  }
  inRepo("read-tree", base);
  for (const name of readdirSync(files, { recursive: true })) {
    const path = join(files, name);
    if (!statSync(path).isFile()) continue;
    const blob = inRepo("hash-object", "-w", path);
    inRepo(
      "update-index",
      "--add",
      "--cacheinfo",
      `100644,${blob},.digest/${name.split(sep).join("/")}`,
    );
  }
  const commit = inRepo(
    ...who,
    "commit-tree",
    inRepo("write-tree"),
    "-p",
    base,
    "-m",
    `digest of ${branch} to ${range.to.slice(0, 7)}: ${days.map((d) => d.date).join(", ")}`,
  );
  execFileSync(
    "git",
    ["push", "-qf", origin, `${commit}:refs/heads/digest/${branch}`],
    { stdio: "inherit" },
  );
} finally {
  rmSync(out, { recursive: true, force: true });
}
console.log(
  `pushed digest/${branch}; its push starts the Checkpoint digest run, which posts the link and moves the checkpoint: https://github.com/${repo}/actions/workflows/checkpoint-digest.yml`,
);
