/**
 * Where a `**Decided by:**` path points, and whether the file is there.
 *
 * A bare path is the store's own: it resolves inside the store and must name a
 * file that exists. A path written `<repository>:<path>` names a file in a
 * repository the store knows - the application repository's end-to-end walks
 * live there, not here. That file is checked when the clone is named, by
 * `--app-root <repository>=<dir>` or the repository's environment variable,
 * and reported as unchecked when it is not.
 *
 * `REPOSITORIES` is the one place a prefix is declared. A prefix it does not
 * name is refused by name, never read as a bare path with a colon in it.
 */
import { existsSync, statSync } from "node:fs";
import { resolve, sep } from "node:path";

export const REPOSITORIES = {
  grade10: { env: "GRADE10_ROOT", url: "https://github.com/9gag/grade10" },
};

const PREFIXED = /^([A-Za-z0-9][\w.-]*):(.+)$/;

/** A path as written, split into the repository it names (`null` for the
 *  store) and the file inside it. */
export function readDecidedPath(path) {
  const match = PREFIXED.exec(path);
  return match
    ? { repo: match[1], file: match[2] }
    : { repo: null, file: path };
}

/** Whether `repo` - `null` for the store - is one a path may name. */
export const knownRepository = (repo) =>
  repo === null || Object.hasOwn(REPOSITORIES, repo);

/** The prefixes a line may write, for a refusal to list. */
export const knownPrefixes = () =>
  Object.keys(REPOSITORIES)
    .map((name) => `\`${name}:\``)
    .join(", ");

/**
 * Every declared repository's clone: repo -> absolute directory, or `null`
 * where none is named. `given` is the `--app-root` value,
 * `<repository>=<dir>[,<repository>=<dir>]`, and wins over the repository's
 * environment variable. A pair that is malformed, names an undeclared
 * repository, or names no directory throws, because a checker quietly
 * skipping a clone it was told about would report every path as unchecked for
 * a typo.
 */
export function repositoryRoots(env = process.env, given = null) {
  const named = {};
  for (const [name, { env: variable }] of Object.entries(REPOSITORIES))
    if (env[variable]) named[name] = { dir: env[variable], from: variable };
  for (const pair of given === null ? [] : String(given).split(",")) {
    const match = /^\s*([^=\s]+)=(.+?)\s*$/.exec(pair);
    if (!match)
      throw new Error(
        `--app-root takes \`<repository>=<dir>\`, not \`${pair.trim()}\``,
      );
    if (!Object.hasOwn(REPOSITORIES, match[1]))
      throw new Error(
        `--app-root names \`${match[1]}\`, which is no repository this store knows — write ${knownPrefixes().replaceAll(":`", "=<dir>`")}`,
      );
    named[match[1]] = { dir: match[2], from: "--app-root" };
  }
  const roots = {};
  for (const name of Object.keys(REPOSITORIES)) {
    if (!named[name]) {
      roots[name] = null;
      continue;
    }
    const { dir: value, from } = named[name];
    const dir = resolve(value);
    if (!existsSync(dir) || !statSync(dir).isDirectory())
      throw new Error(
        `${from} names \`${value}\` for ${name}, which is no directory — point it at the ${name} clone, or leave it out`,
      );
    roots[name] = dir;
  }
  return roots;
}

/**
 * One path's verdict against the store and the clones `roots` names:
 *
 *   ok          the file exists where the path says
 *   unknown     the prefix names no repository `REPOSITORIES` declares
 *   unchecked   a known repository whose clone is not named
 *   outside     the path climbs out of the tree it names
 *   missing     no file there
 *   directory   a directory, which decides nothing
 */
export function checkDecidedPath(storeRoot, path, roots) {
  const { repo, file } = readDecidedPath(path);
  if (!knownRepository(repo)) return { verdict: "unknown", repo };
  const base = repo === null ? resolve(storeRoot) : roots[repo];
  if (base === null) return { verdict: "unchecked", repo };
  const full = resolve(base, file);
  if (full !== base && !full.startsWith(base + sep))
    return { verdict: "outside", repo };
  if (!existsSync(full)) return { verdict: "missing", repo };
  if (!statSync(full).isFile()) return { verdict: "directory", repo };
  return { verdict: "ok", repo };
}
