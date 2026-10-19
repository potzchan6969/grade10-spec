// Push a built handoff page and its shots to handoff/pr-<n>, then dispatch the Handoff page workflow, which uploads them and comments the link on the PR.
// node publish.mjs <page.html> --pr <n>
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
import { documentOf } from "./document.mjs";

const args = process.argv.slice(2);
const file = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--pr");
const pr = args[args.indexOf("--pr") + 1];
if (!file || !/^\d+$/.test(pr ?? ""))
  throw new Error("usage: node publish.mjs <page.html> --pr <n>");

const page = resolve(file);
const git = (cwd, ...a) =>
  execFileSync("git", a, { cwd, encoding: "utf8" }).trim();
const origin = git(process.cwd(), "remote", "get-url", "origin");
const repo = origin.match(/github\.com[:/](.+?)(?:\.git)?$/)?.[1];
if (!repo) throw new Error(`origin ${origin} is not a GitHub repository`);
const who = ["user.name", "user.email"].flatMap((k) => [
  "-c",
  `${k}=${git(process.cwd(), "config", k)}`,
]);

const out = mkdtempSync(join(tmpdir(), "handoff-"));
try {
  writeFileSync(
    join(out, "index.html"),
    documentOf(readFileSync(page, "utf8")),
  );
  const shots = join(dirname(page), "shots");
  if (existsSync(shots)) cpSync(shots, join(out, "shots"), { recursive: true });
  git(out, "init", "-q");
  git(out, "add", "-A");
  git(out, ...who, "commit", "-qm", `handoff page for #${pr}`);
  execFileSync(
    "git",
    ["push", "-qf", origin, `HEAD:refs/heads/handoff/pr-${pr}`],
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
    "handoff.yml",
    "--repo",
    repo,
    "--ref",
    "main",
    "-f",
    `pr=${pr}`,
  ],
  { stdio: "inherit" },
);
console.log(
  `pushed handoff/pr-${pr}; the Handoff page run comments the link on #${pr}: gh run watch --repo ${repo}`,
);
