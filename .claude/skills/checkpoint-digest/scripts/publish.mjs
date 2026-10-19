// Push a built digest, its shots and its range to digest/<branch>, then dispatch the Checkpoint digest workflow,
// which uploads the page, posts its link to Slack and moves the checkpoint.
// node publish.mjs <page.html> --branch <b> --to <sha> --from <saved sha, empty on a first run>
import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
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

const out = mkdtempSync(join(tmpdir(), "digest-"));
try {
  writeFileSync(
    join(out, "index.html"),
    documentOf(readFileSync(page, "utf8")),
  );
  writeFileSync(
    join(out, "digest.json"),
    JSON.stringify({ ...data, range: { branch, from: saved, to: sha } }),
  );
  const shots = join(dirname(page), "shots");
  if (existsSync(shots)) cpSync(shots, join(out, "shots"), { recursive: true });
  git(out, "init", "-q");
  git(out, "add", "-A");
  git(
    out,
    ...who,
    "commit",
    "-qm",
    `digest of ${branch} to ${sha.slice(0, 7)}`,
  );
  execFileSync(
    "git",
    ["push", "-qf", origin, `HEAD:refs/heads/digest/${branch}`],
    { cwd: out, stdio: "inherit" },
  );
} finally {
  rmSync(out, { recursive: true, force: true });
}
execFileSync(
  "gh",
  [
    "workflow",
    "run",
    "checkpoint-digest.yml",
    "--repo",
    repo,
    "--ref",
    "main",
    "-f",
    `branch=${branch}`,
  ],
  { stdio: "inherit" },
);
console.log(
  `pushed digest/${branch}; the Checkpoint digest run posts the link and moves the checkpoint: gh run watch --repo ${repo}`,
);
