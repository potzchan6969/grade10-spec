import { join } from "node:path";
import { type PageAst, parsePage } from "../../manual/src/content/grammar.ts";
import { sectionTextOf } from "../../manual/src/content/sections.ts";
import { readTextIfExists } from "../../manual/src/store/disk.mts";
import type { GitIndex } from "../../manual/src/store/git.mts";
import { type ChangeCapability, capabilitiesOf } from "./capabilities.mts";
import { contentIdOf } from "./content-id.mts";
import { movedOf } from "./moved.ts";
import type {
  ChangeEntry,
  Moved,
  PageEntry,
  SchemaArtifact,
  UpstreamRead,
} from "./types.ts";
import { waivedOf } from "./waivers.ts";

/**
 * What each artifact of a change is drawn from, read off `main`.
 *
 * Read here rather than derived in the app because both halves of it are the
 * store's: the hash is `node:crypto`'s, and the page sections are the page
 * reader's. What is written onto the entry is the reading — the content id of
 * what is before each artifact, the things that are before it, and, where the
 * artifact's `reviewed:` line holds another id, what moved since that line
 * was written, unit by unit. The verdict is not
 * written anywhere: `behindOf` compares this, so no check and no surface has
 * to be reordered to see a freshness field, and a fixture can carry a
 * behind artifact without a repository behind it.
 *
 * What is before an artifact, in reading order: the page sections the change's
 * proposal links, in `<page>#<slug>` order, then each artifact the schema's
 * `upstream:` names, one text per artifact — a `specs/**` artifact being its
 * files in path order. The sections are sorted rather than left in link
 * order, so moving a link in the proposal moves no content id. The record is
 * before nothing, so writing a hand, a waiver or a wait puts nothing behind;
 * a waived artifact is skipped, so it is never behind and never puts anything
 * behind; and a page section the change does not link is not read at all.
 *
 * A commit date never says an artifact is fresh: only its hand's landing or
 * read does, through the `reviewed:` line.
 */
export function upstreamOf(
  root: string,
  change: ChangeEntry,
  artifacts: SchemaArtifact[],
  pages: PageEntry[],
  asts: Map<string, PageAst>,
  git: GitIndex,
): Record<string, UpstreamRead> | undefined {
  if (change.error || artifacts.length === 0) return undefined;
  const waived = waivedOf(artifacts, change);
  const written = new Set(change.written);
  const byPath = new Map(pages.map((page) => [page.path, page]));
  const sections = (change.sections ?? [])
    .flatMap((ref) => {
      const page = byPath.get(ref.page);
      if (page === undefined) return [];
      const text = sectionTextOf(
        { ast: asts.get(page.path) ?? null },
        ref.slug,
      );
      // A link to a section the page does not carry names nothing to read:
      // the `refs` rule is what reports it, and hashing an empty string here
      // would put every artifact after the link behind on the strength of a
      // broken one.
      if (text === undefined) return [];
      // No date: the page's last commit dates the whole page.
      return [
        {
          item: `${ref.page}#${ref.slug}`,
          text,
          parts: [{ path: ref.page, text, slug: ref.slug }],
        },
      ];
    })
    .sort((a, b) => a.item.localeCompare(b.item));

  /** One text before an artifact: the item as a row names it, the text that
   * is hashed, the files it is read from, and the date where the item is one
   * the change owns. */
  type Before = { item: string; text: string; parts: Part[]; date?: string };
  type Own = { text: string; parts: Part[]; date?: string };
  const own = new Map<string, Own | undefined>();
  const capabilities = capabilitiesOf(root, join(root, change.dir));
  // Nothing where a file the artifact is written as reads absent, and nothing
  // where it is written as no file at all. `written` is proven against
  // `main`, which can hold a file this checkout does not — a plan pushed from
  // elsewhere, a partial checkout — and hashing it as "" would read an unread
  // file as an empty one and put everything after it behind.
  const readOwn = (artifact: SchemaArtifact): Own | undefined => {
    if (own.has(artifact.id)) return own.get(artifact.id);
    const files = filesOf(change, artifact, capabilities);
    const texts = files.map((file) => readTextIfExists(join(root, file)));
    const read =
      files.length === 0 || texts.some((text) => text === undefined)
        ? undefined
        : {
            text: texts.join("\n"),
            parts: files.map((path, at) => ({ path, text: texts[at] ?? "" })),
            date: newest(files.map((file) => git.commitOf(file)?.date)),
          };
    own.set(artifact.id, read);
    return read;
  };

  const reading: Record<string, UpstreamRead> = {};
  for (const artifact of artifacts) {
    if (!written.has(artifact.id) || waived.has(artifact.id)) continue;
    const drawn = readOwn(artifact);
    if (!drawn) continue;
    const before: Before[] = [
      ...sections,
      ...artifact.upstream.flatMap((id) => {
        const upstream = artifacts.find((one) => one.id === id);
        if (!upstream || waived.has(id) || !written.has(id)) return [];
        const read = readOwn(upstream);
        return read ? [{ item: id, ...read }] : [];
      }),
    ];
    // Nothing is before it: the proposal of a change that links no page
    // section, or any artifact of a schema that declares no upstream set.
    // There is nothing for it to be behind, so there is nothing to read.
    if (before.length === 0) continue;
    const read: UpstreamRead = {
      id: contentIdOf(before.map((one) => one.text)),
      items: before.map((one) => one.item),
    };
    const reviewed = change.reviewed?.[artifact.id];
    if (reviewed !== undefined && reviewed !== read.id) {
      const moved = movedSince(change, reviewed, before, git);
      if (moved) read.moved = moved;
    }
    // `beforeOn`: the newest commit among everything before the artifact.
    const beforeOn = newest(before.map((one) => one.date));
    if (beforeOn !== undefined) read.beforeOn = beforeOn;
    reading[artifact.id] = read;
  }
  return Object.keys(reading).length > 0 ? reading : undefined;
}

/**
 * Every in-flight change's reading, written onto the entries.
 *
 * In the snapshot, where the changes, the pages and the one history walk are
 * all at hand. An archived change is finished and reads nothing: there is no
 * hand left to read an artifact of it again.
 */
export function markUpstream(
  root: string,
  changes: ChangeEntry[],
  schemas: Record<string, SchemaArtifact[]>,
  pages: PageEntry[],
  asts: Map<string, PageAst>,
  git: GitIndex,
): void {
  for (const change of changes) {
    if (change.status !== "in-flight") continue;
    const artifacts = schemas[change.schema];
    if (!artifacts) continue;
    const upstream = upstreamOf(root, change, artifacts, pages, asts, git);
    if (upstream) change.upstream = upstream;
  }
}

/**
 * The files one artifact of a change is written as, store-relative and in path
 * order. A `specs/**` artifact is one artifact with one file per capability
 * that carries it, read off the same walk `written` is read off — through the
 * change's deltas it was zero files for a capability that had only written
 * its journeys, which hashed a file that exists as no text at all.
 */
function filesOf(
  change: ChangeEntry,
  artifact: SchemaArtifact,
  capabilities: ChangeCapability[],
): string[] {
  const { generates } = artifact;
  if (!generates.startsWith("specs/")) return [`${change.dir}/${generates}`];
  const name = generates.slice(generates.lastIndexOf("/") + 1);
  return capabilities
    .filter((one) => one.files.has(name))
    .map((one) => `${one.dir}/${name}`)
    .sort();
}

/** The dates that exist, oldest first. */
function dated(dates: (string | undefined)[]): string[] {
  return dates
    .filter((one): one is string => one !== undefined)
    .sort((a, b) => Date.parse(a) - Date.parse(b));
}

/** The newest of the dates that exist, or nothing where none does. */
function newest(dates: (string | undefined)[]): string | undefined {
  return dated(dates).at(-1);
}

/** One file an item before an artifact is read from; a page section's own
 * slug where the item is one. */
type Part = { path: string; text: string; slug?: string };

/**
 * What moved before an artifact since its `reviewed:` line was written: the
 * commit that wrote the line is found in the record's history, and what was
 * before the artifact is read at that commit. Where the before hashes to the
 * id the line holds, each item is compared unit by unit; where the commit,
 * a file or the hash cannot be recovered, nothing is answered and
 * `behindOf` reads a whole, major move.
 */
function movedSince(
  change: ChangeEntry,
  reviewed: string,
  before: { item: string; text: string; parts: Part[] }[],
  git: GitIndex,
): Moved[] | undefined {
  const sha = git.writerOf?.(`${change.dir}/.openspec.yaml`, reviewed);
  if (!sha) return undefined;
  const files = git.filesAt?.(
    sha,
    before.flatMap(({ parts }) => parts.map((part) => part.path)),
  );
  if (!files) return undefined;
  const was: string[][] = [];
  for (const { parts } of before) {
    const texts: string[] = [];
    for (const part of parts) {
      const text = textAt(files, part);
      if (text === undefined) return undefined;
      texts.push(text);
    }
    was.push(texts);
  }
  if (contentIdOf(was.map((texts) => texts.join("\n"))) !== reviewed)
    return undefined;
  return before.flatMap(({ item, parts }, at) =>
    parts.flatMap((part, index) =>
      movedOf(item, was[at][index], part.text).map((one) =>
        parts.length > 1
          ? { ...one, key: `${dirOf(part.path)}/${one.key}` }
          : one,
      ),
    ),
  );
}

/** One part as one commit held it: a file whole, or a page's section. */
function textAt(files: Map<string, string>, part: Part): string | undefined {
  const source = files.get(part.path);
  if (source === undefined || part.slug === undefined) return source;
  try {
    return sectionTextOf({ ast: parsePage(source) }, part.slug);
  } catch {
    return undefined;
  }
}

/** The capability a `specs/**` file sits in, as a key's prefix. */
function dirOf(path: string): string {
  const specs = path.indexOf("/specs/");
  const dir = path.slice(0, path.lastIndexOf("/"));
  return specs === -1 ? dir : dir.slice(specs + "/specs/".length);
}
