/**
 * `pnpm storybook:rename <mapping>` - retitles stories and rewrites every
 * place that cites them. The mapping is one `old title<TAB>new title` per
 * line. Only each meta's `title` string changes in a story file; elsewhere an
 * exact old id, a `<old title id>--` prefix or a quoted old title path is
 * rewritten, so a link keeps pointing at the same story. `--also <repository>`
 * rewrites exact ids in another repository that links to these stories.
 */
import { execFile } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";
import { rootDirectory, sanitize, storyIndex } from "./story-index.mjs";

const exec = promisify(execFile);
const TEXT = /\.(md|mdx|ts|tsx|mts|mjs|js|json|yaml|yml)$/;
const SKIP = [
  /(^|\/)node_modules\//,
  /(^|\/)storybook-static[^/]*\//,
  /^openspec\/changes\/archive\//,
  // A test's ids are its own fixtures, not links to these stories.
  /(^|\/)test\//,
  /\.test\.[cm]?[jt]sx?$/,
  /(^|\/)pnpm-lock\.yaml$/,
];

export function readMapping(text) {
  const mapping = new Map();
  for (const line of text.split("\n")) {
    if (!line.trim() || line.startsWith("#")) continue;
    const [from, to] = line.split("\t").map((cell) => cell.trim());
    if (!from || !to) throw new Error(`mapping line needs two cells: ${line}`);
    mapping.set(from, to);
  }
  return mapping;
}

/** `text` with the title literal at `span` replaced, quotes kept. */
export function retitle(text, span, title) {
  const quote = text[span.start];
  const literal =
    quote === "'" || quote === "`"
      ? `${quote}${title}${quote}`
      : JSON.stringify(title);
  return `${text.slice(0, span.start)}${literal}${text.slice(span.end)}`;
}

/** Old id to new id, joined on file and export. */
export function idMap(before, after) {
  const key = (entry) =>
    `${entry.path}\0${entry.type === "docs" ? "" : entry.exportName}`;
  const next = new Map(
    Object.values(after).map((entry) => [key(entry), entry]),
  );
  const ids = new Map();
  for (const entry of Object.values(before)) {
    const moved = next.get(key(entry));
    if (moved && moved.id !== entry.id) ids.set(entry.id, moved.id);
  }
  return ids;
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** One pass over a text: exact ids, then id prefixes, then quoted title paths. */
export function rewriteText(text, { ids, prefixes, titles }) {
  let out = text.replace(
    /(?<![a-z0-9-])[a-z0-9]+(?:-[a-z0-9]+)*--(?:[a-z0-9]+(?:-[a-z0-9]+)*|\*)/g,
    (id) => {
      if (ids.has(id)) return ids.get(id);
      const [prefix, rest] = id.split("--");
      return prefixes.has(prefix) ? `${prefixes.get(prefix)}--${rest}` : id;
    },
  );
  for (const [from, to] of titles) {
    out = out.replace(
      new RegExp(`(["'\`])${escapeRegExp(from)}(?=(?:/[^"'\`\\n]*)?\\1)`, "g"),
      `$1${to}`,
    );
  }
  return out;
}

async function trackedTextFiles(root) {
  const { stdout } = await exec("git", ["ls-files"], {
    cwd: root,
    maxBuffer: 64 * 1024 * 1024,
  });
  return stdout
    .split("\n")
    .filter(
      (path) =>
        path && TEXT.test(path) && !SKIP.some((pattern) => pattern.test(path)),
    );
}

/** Retitles the stories under `root`, then rewrites what cites them in `root`
 * and every `also` repository. Returns the id map and the files it changed. */
export async function rename({ root = rootDirectory, mapping, also = [] }) {
  const before = storyIndex({ root });
  for (const [path, file] of Object.entries(before.files)) {
    const title = mapping.get(file.title);
    if (!title || !file.titleSpan) continue;
    const text = readFileSync(join(root, path), "utf8");
    writeFileSync(join(root, path), retitle(text, file.titleSpan, title));
  }
  const after = storyIndex({ root });

  const ids = idMap(before.entries, after.entries);
  const prefixes = new Map(
    [...mapping].map(([from, to]) => [sanitize(from), sanitize(to)]),
  );
  // Longest first, so `A/B/C` is rewritten before `A/B` could claim it.
  const titles = [...mapping].sort(([a], [b]) => b.length - a.length);

  // Another repository has stories of its own under titles that may match an
  // old one here, so only an exact id of this store's is rewritten there.
  const exact = { ids, prefixes: new Map(), titles: [] };
  const changed = [];
  for (const repository of [root, ...also]) {
    const maps = repository === root ? { ids, prefixes, titles } : exact;
    for (const path of await trackedTextFiles(repository)) {
      const file = join(repository, path);
      if (!existsSync(file)) continue;
      const text = readFileSync(file, "utf8");
      const out = rewriteText(text, maps);
      if (out !== text) {
        writeFileSync(file, out);
        changed.push(file);
      }
    }
  }
  return { ids, changed };
}

async function main() {
  const [mappingPath, ...rest] = process.argv
    .slice(2)
    .filter((arg) => arg !== "--");
  if (!mappingPath) {
    console.error(
      "usage: pnpm storybook:rename <mapping.tsv> [--also <repository>]...",
    );
    process.exit(2);
  }
  const also = [];
  for (let i = 0; i < rest.length; i++)
    if (rest[i] === "--also") also.push(rest[++i]);
  const mapping = readMapping(readFileSync(mappingPath, "utf8"));
  const { ids, changed } = await rename({ mapping, also });
  console.log(
    `${mapping.size} titles, ${ids.size} ids moved; ${changed.length} files rewritten`,
  );
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
