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
 * proposal links, in link order, then each artifact the schema's `upstream:`
 * names, one text per artifact — a `specs/**` artifact being its files in
 * path order. The record is before nothing, so writing a hand, a waiver or a
 * wait puts nothing behind; a waived artifact is skipped, so it is never
 * behind and never puts anything behind; and a page section the change does
 * not link is not read at all.
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
  const sections = (change.sections ?? []).flatMap((ref) => {
    const page = byPath.get(ref.page);
    if (page === undefined) return [];
    const text = sectionTextOf({ ast: asts.get(page.path) ?? null }, ref.slug);
    // A link to a section the page does not carry names nothing to read: the
    // `refs` rule is what reports it, and hashing an empty string here would
    // read a kept link and a dropped one as the same upstream.
    if (text === undefined) return [];
    return [
      { item: `${ref.page}#${ref.slug}`, text, date: page.lastCommit?.date },
    ];
  });

  const own = new Map<string, { text: string; date?: string }>();
  const readOwn = (artifact: SchemaArtifact) => {
    const held = own.get(artifact.id);
    if (held) return held;
    const files = filesOf(change, artifact);
    const read = {
      text: files
        .map((file) => readTextIfExists(join(root, file)) ?? "")
        .join("\n"),
      date: newest(files.map((file) => git.commitOf(file)?.date)),
    };
    own.set(artifact.id, read);
    return read;
  };

  const reading: Record<string, UpstreamRead> = {};
  for (const artifact of artifacts) {
    if (!written.has(artifact.id) || waived.has(artifact.id)) continue;
    const before = [
      ...sections,
      ...artifact.upstream.flatMap((id) => {
        const upstream = artifacts.find((one) => one.id === id);
        if (!upstream || waived.has(id) || !written.has(id)) return [];
        return [{ item: id, ...readOwn(upstream) }];
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
    const drawn = readOwn(artifact).date;
    if (drawn !== undefined) {
      read.newer = before
        .filter(
          (one) =>
            one.date !== undefined && Date.parse(one.date) > Date.parse(drawn),
        )
        .map((one) => one.item);
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
