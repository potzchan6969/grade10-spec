/*
 * A throwaway copy of the store: the engine, the team parser, the hooks and a
 * team map of its own, committed on `main` with the hooks set. Every git call
 * runs with no global or system config, so the answer is the same anywhere.
 */
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const STORE = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export const DESIGNER = "Constance <tangconstance@gmail.com>";
export const ENGINEER = "Echo <ecchochan@gmail.com>";
export const AGENT = "Cursor Agent <cursoragent@cursor.com>";

export const TEAM = `handles:
  tangconst:
    email: tangconstance@gmail.com
    roles: [design]
  ecchochan:
    email: ecchochan@gmail.com
    roles: [tech, dev]
channels: {}
`;

const person = (who) => who.match(/^(.*) <(.*)>$/).slice(1);

export function fixture({ team = TEAM, gitConfig } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "design-override-"));
  const copy = (path) =>
    cpSync(join(STORE, path), join(dir, path), { recursive: true });
  cpSync(
    join(STORE, "scripts/design-override"),
    join(dir, "scripts/design-override"),
    {
      recursive: true,
      filter: (path) => !path.endsWith(".test.mjs"),
    },
  );
  copy("scripts/openspec/lib/team-parse.mjs");
  copy("scripts/openspec/lib/handle.mjs");
  copy(".githooks");
  symlinkSync(join(STORE, "node_modules"), join(dir, "node_modules"));
  if (team !== undefined) write(dir, "docs/prds/team.yaml", team);
  if (gitConfig !== undefined) write(dir, ".gitconfig-global", gitConfig);
  write(dir, ".gitignore", "node_modules\n.gitconfig-global\n");

  const env = {
    ...Object.fromEntries(
      Object.entries(process.env).filter(
        ([key]) => key !== "CI" && !key.startsWith("GIT_"),
      ),
    ),
    GIT_CONFIG_GLOBAL:
      gitConfig === undefined ? "/dev/null" : join(dir, ".gitconfig-global"),
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_AUTHOR_DATE: "2026-09-01T00:00:00Z",
    GIT_COMMITTER_DATE: "2026-09-01T00:00:00Z",
  };
  const git = (
    args,
    { as = ENGINEER, committer = as, input, cwd = dir } = {},
  ) => {
    const [an, ae] = person(as);
    const [cn, ce] = person(committer);
    const done = spawnSync("git", args, {
      cwd,
      input,
      encoding: "utf8",
      env: {
        ...env,
        GIT_AUTHOR_NAME: an,
        GIT_AUTHOR_EMAIL: ae,
        GIT_COMMITTER_NAME: cn,
        GIT_COMMITTER_EMAIL: ce,
      },
    });
    return { status: done.status, out: done.stdout, err: done.stderr };
  };
  const must = (args, options) => {
    const done = git(args, options);
    if (done.status !== 0)
      throw new Error(`git ${args.join(" ")}: ${done.err}`);
    return done.out;
  };

  /** Runs the install `pnpm install` runs, as a person's clone, or with `extra` set. */
  const install = (extra = {}) =>
    spawnSync("sh", ["scripts/design-override/install.sh"], {
      cwd: dir,
      encoding: "utf8",
      env: { ...env, ...extra },
    });

  must(["init", "-q", "-b", "main"]);
  if (install().status !== 0) throw new Error("install.sh failed");
  must(["add", "-A"]);
  must(["commit", "-q", "-m", "the store"]);

  return {
    dir,
    git,
    must,
    install,
    write: (path, text) => write(dir, path, text),
    remove: (path) => rmSync(join(dir, path)),
    /** Stage everything and commit; the result carries the hook's stop. */
    commit: (message, options) => {
      must(["add", "-A"]);
      return git(["commit", "-q", "-m", message], options);
    },
    head: () => must(["rev-parse", "HEAD"]).trim(),
    cleanup: () => rmSync(dir, { recursive: true, force: true }),
  };
}

function write(dir, path, text) {
  mkdirSync(dirname(join(dir, path)), { recursive: true });
  writeFileSync(join(dir, path), text);
}
