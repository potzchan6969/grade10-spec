import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import type { ItemError } from "../api/types.ts";

/** The store root is the directory holding `openspec/`. */
export function findStoreRoot(from: string): string {
  let dir = resolve(from);
  for (;;) {
    if (existsSync(join(dir, "openspec"))) return dir;
    const up = dirname(dir);
    if (up === dir) throw new Error(`no openspec/ directory above ${from}`);
    dir = up;
  }
}

/** Store-relative, always with forward slashes — the shape every artifact
 * path and every git path takes. */
export function storePath(root: string, absolute: string): string {
  return resolve(absolute)
    .slice(resolve(root).length + 1)
    .split(sep)
    .join("/");
}

/** Resolves a path written against any suffix of `dir` — `manual/assets/x.png`,
 * `assets/x.png` and `x.png` all name the same file — and refuses anything
 * that escapes it. Every write the editor makes goes through here.
 *
 * A path that opens on another store directory is refused rather than
 * re-rooted: `openspec/x` under `manual/` means someone wrote a store-relative
 * path for the wrong tree, and answering with `manual/openspec/x` invents a
 * file nobody asked for. */
export function confine(
  root: string,
  dir: string,
  path: string,
): string | { error: string } {
  const segments = dir.split("/");
  const prefix = segments
    .map((_, index) => `${segments.slice(index).join("/")}/`)
    .find((candidate) => path.startsWith(candidate));

  const base = resolve(root, dir);
  const file = resolve(base, prefix ? path.slice(prefix.length) : path);
  if (file === base || !file.startsWith(base + sep)) {
    return { error: `\`${path}\` resolves outside ${dir}/` };
  }

  const [first] = path.split("/");
  if (!prefix && path.includes("/") && existsSync(join(root, first))) {
    return { error: `\`${path}\` names the store's ${first}/, not ${dir}/` };
  }
  return file;
}

export function readText(file: string): string {
  return readFileSync(file, "utf8");
}

export function readTextIfExists(file: string): string | undefined {
  return existsSync(file) ? readText(file) : undefined;
}

export function subdirectories(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** `ext` is either a suffix (`.md`) or a whole file name (`spec.md`). A name
 * that merely ends in the second — `draft-spec.md` — is a different file, and
 * matching it invents a spec nobody wrote. */
function named(name: string, ext: string): boolean {
  return ext.startsWith(".") ? name.endsWith(ext) : name === ext;
}

function walk(
  root: string,
  dir: string,
  keep: (name: string, isDirectory: boolean) => boolean,
): string[] {
  if (!existsSync(dir)) return [];
  const found: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name < b.name ? -1 : 1,
  )) {
    if (!keep(entry.name, entry.isDirectory())) continue;
    const child = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(root, child, keep));
    else found.push(storePath(root, child));
  }
  return found;
}

/** Every file under `dir` matching `ext`, store-relative, sorted. */
export function walkFiles(root: string, dir: string, ext: string): string[] {
  return walk(
    root,
    dir,
    (name, isDirectory) => isDirectory || named(name, ext),
  );
}

/** Every file under `dir`, store-relative, sorted, hidden entries skipped:
 * `.gitkeep` only holds a directory open, and a machine's own `.DS_Store`
 * would make an artifact differ from one machine to the next. */
export function walkAll(root: string, dir: string): string[] {
  return walk(root, dir, (name) => !name.startsWith("."));
}

/** Newest mtime under `dir`, so a snapshot can be memoized across polls. */
export function newestMtime(dir: string): number {
  if (!existsSync(dir)) return 0;
  let newest = statSync(dir).mtimeMs;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const child = join(dir, entry.name);
    const at = entry.isDirectory()
      ? newestMtime(child)
      : statSync(child).mtimeMs;
    if (at > newest) newest = at;
  }
  return newest;
}

/** A structural problem in someone else's file. Specs and changes contain it
 * as an `error` entry; manual pages let it out. */
export class StoreFileError extends Error {
  readonly line: number;
  constructor(line: number, message: string) {
    super(message);
    this.name = "StoreFileError";
    this.line = line;
  }
}

export function toItemError(file: string, cause: unknown): ItemError {
  if (cause instanceof StoreFileError) {
    return { file, line: cause.line, message: cause.message };
  }
  return {
    file,
    message: cause instanceof Error ? cause.message : String(cause),
  };
}
