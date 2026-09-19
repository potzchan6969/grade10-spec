import { join } from "node:path";
import type {
  ChangeEntry,
  PageEntry,
  SchemaArtifact,
  UpstreamRead,
} from "../api/types.ts";
import { waivedOf } from "../api/waivers.ts";
import type { PageAst } from "../content/grammar.ts";
import { sectionTextOf } from "../content/sections.ts";
import { contentIdOf } from "./content-id.mts";
import { readTextIfExists } from "./disk.mts";
import type { GitIndex } from "./git.mts";

/**
 * What each artifact of a change is drawn from, read off `main`.
 *
 * Read here rather than derived in the app because both halves of it are the
 * store's: the hash is `node:crypto`'s, and the page sections are the page
 * reader's. What is written onto the entry is the reading — the content id of
 * what is before each artifact, the things that are before it, and which of
 * them a commit dates later than the artifact itself. The verdict is not
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
 * Only the change's own artifacts are dated. A commit on a page dates every
 * section of it, so a date on a linked section cannot say that section moved
 * — the recorded `reviewed:` id is what says it, and until the round writes
 * one a linked section puts nothing behind.
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
      return [{ item: `${ref.page}#${ref.slug}`, text }];
    })
    .sort((a, b) => a.item.localeCompare(b.item));

  /** One text before an artifact: the item as a row names it, the text that
   * is hashed, and the date where the item is one the change owns. */
  type Before = { item: string; text: string; date?: string };
  type Own = { text: string; date?: string };
  const own = new Map<string, Own | undefined>();
  // Nothing where a file the artifact is written as reads absent. `written`
  // is proven against `main`, which can hold a file this checkout does not —
  // a plan pushed from elsewhere, a partial checkout — and hashing it as ""
  // would read an unread file as an empty one and put everything after it
  // behind.
  const readOwn = (artifact: SchemaArtifact): Own | undefined => {
    if (own.has(artifact.id)) return own.get(artifact.id);
    const files = filesOf(change, artifact);
    const texts = files.map((file) => readTextIfExists(join(root, file)));
    const read = texts.some((text) => text === undefined)
      ? undefined
      : {
          text: texts.join("\n"),
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
    const drawnAt =
      drawn.date === undefined ? undefined : Date.parse(drawn.date);
    const newerItems =
      drawnAt === undefined
        ? []
        : before.filter(
            (one) => one.date !== undefined && Date.parse(one.date) > drawnAt,
          );
    if (newerItems.length > 0) {
      read.newer = newerItems.map((one) => one.item);
      read.newerOn = newest(newerItems.map((one) => one.date));
    }
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
 * order. A `specs/**` artifact is one artifact with one file per delta
 * capability, as `written` already reads it.
 */
function filesOf(change: ChangeEntry, artifact: SchemaArtifact): string[] {
  const { generates } = artifact;
  if (!generates.startsWith("specs/")) return [`${change.dir}/${generates}`];
  const name = generates.slice(generates.lastIndexOf("/") + 1);
  return change.deltas
    .map(({ spec }) => `${change.dir}/specs/${spec}/${name}`)
    .sort();
}

/** The newest of the dates that exist, or nothing where none does. */
function newest(dates: (string | undefined)[]): string | undefined {
  return dates
    .filter((one): one is string => one !== undefined)
    .sort((a, b) => Date.parse(a) - Date.parse(b))
    .at(-1);
}
