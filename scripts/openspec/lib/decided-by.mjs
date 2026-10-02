/**
 * The `**Decided by:**` line: how it is written, how it is read, and what a
 * path on it may name. One home, because `tcs:automated` writes the line and
 * `tcs:validate` reads it back, and a writer holding its own idea of a path
 * wrote `apps/…` where the reader wanted `grade10:apps/…`.
 */
import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { isAbsolute, join, normalize, resolve, sep } from "node:path";

/** The line as a suite holds it; its value is a `commaList`, an empty one
 *  included, so a line naming nothing is refused rather than passed over. */
export const DECIDED_BY = /^\*\*Decided by:\*\*\s*(.*?)\s*$/;

/** Repositories a path may name by tag, `<tag>:<path>`. */
export const APPLICATION_TAGS = new Set(["grade10"]);

const TAGGED = /^([a-z][a-z0-9-]*):(.*)$/;

export const decidedByLine = (paths) =>
  `**Decided by:** ${paths.map((one) => `\`${one}\``).join(", ")}`;

/**
 * What is wrong with one path the line names, or `null`. A store path resolves
 * inside `root` to a file; a `grade10:<path>` is held to its form, and to a
 * file only where `appRoot` reaches the application clone - `app` marks that
 * finding, which only a run beside the clone can make (Q111).
 */
export function decidedByProblem(path, { root: given, appRoot = null }) {
  const root = resolve(given);
  const tagged = TAGGED.exec(path);
  if (tagged) {
    const [, repo, within] = tagged;
    if (!APPLICATION_TAGS.has(repo))
      return {
        message: `whose tag \`${repo}\` is no application repository — name a store path, or \`grade10:<path>\``,
      };
    if (within === "") return { message: "which names no path after its tag" };
    if (isAbsolute(within) || normalize(within).split(sep)[0] === "..")
      return {
        message:
          "which resolves outside the application repository — write it relative to that repository's root",
      };
    if (appRoot === null) return null;
    const full = join(appRoot, within);
    if (existsSync(full) && statSync(full).isFile()) return null;
    return {
      message: `which the application clone at ${appRoot} does not hold as a file`,
      app: true,
    };
  }
  const full = resolve(root, path);
  if (full !== root && !full.startsWith(root + sep))
    return {
      message:
        "which resolves outside the store — write it relative to the repository root",
    };
  if (!existsSync(full))
    return {
      message: existsSync(join(root, path.split(/[/\\]/)[0]))
        ? "which does not exist in this checkout"
        : "which does not exist in this checkout — a test in the application repository is named `grade10:<path>`",
    };
  if (!statSync(full).isFile())
    return {
      message:
        "which is not a file — name the test, not the directory holding it",
    };
  return null;
}

/** `--app-root` when given, else the clone `root` is a submodule of, else
 *  `null`. A given directory that is not there is a mistake, not an absence. */
export function applicationRoot(given, root) {
  if (given !== undefined) {
    const tree = resolve(given);
    if (existsSync(tree) && statSync(tree).isDirectory()) return tree;
    console.error(
      `--app-root ${given} is not a directory — pass the directory that holds the application repository`,
    );
    process.exit(1);
  }
  const git = spawnSync(
    "git",
    ["-C", root, "rev-parse", "--show-superproject-working-tree"],
    { encoding: "utf8" },
  );
  const tree = git.status === 0 ? git.stdout.trim() : "";
  return tree === "" ? null : tree;
}
