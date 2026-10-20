// Push a built digest, its shots and its range to digest/<branch>; the push starts the Checkpoint digest workflow,
// which uploads the page, posts its link to Slack and moves the checkpoint. No gh and no token: a git push is enough.
// node publish.mjs <page.html> --branch <b> --to <sha> --from <saved sha, empty on a first run>
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
const file = args[0];
const branch = option("branch");
const to = option("to");
const from = option("from");
if (!file || file.startsWith("--") || !branch || !to || from === undefined)
  throw new Error(
    "usage: node publish.mjs <page.html> --branch <b> --to <sha> --from <saved sha or empty>",
  );

const page = resolve(file);
const data = JSON.parse(readFileSync(join(dirname(page), "data.json"), "utf8"));
const git = (cwd, ...a) =>
  execFileSync("git", a, { cwd, encoding: "utf8" }).trim();
const origin = git(process.cwd(), "remote", "get-url", "origin");
const repo = origin.match(/github\.com[:/](.+?)(?:\.git)?$/)?.[1];
if (!repo) throw new Error(`origin ${origin} is not a GitHub repository`);
const sha = git(process.cwd(), "rev-parse", `${to}^{commit}`);
const saved =
  from && from !== "null"
    ? git(process.cwd(), "rev-parse", `${from}^{commit}`)
    : "";
const who = ["user.name", "user.email"].flatMap((k) => [
  "-c",
  `${k}=${git(process.cwd(), "config", k)}`,
]);

// The page rides on main under .digest/, so the push starts the Checkpoint digest workflow main defines.
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
  writeFileSync(
    join(files, "index.html"),
    documentOf(readFileSync(page, "utf8")),
  );
  writeFileSync(
    join(files, "digest.json"),
    JSON.stringify({ ...data, range: { branch, from: saved, to: sha } }),
  );
  const shots = join(dirname(page), "shots");
  if (existsSync(shots))
    cpSync(shots, join(files, "shots"), { recursive: true });
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
    `digest of ${branch} to ${sha.slice(0, 7)}`,
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
