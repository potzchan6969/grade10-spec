import type { PageEntry, WarningSignature } from "../api/types.ts";
import { git } from "./git.mts";
import type { Roots } from "./roots.mts";

/**
 * A `warning` callout is the manual saying the store is wrong about itself —
 * hand-written judgment that rots silently, so every one wears a name and a
 * date. Git already records both: whoever last shaped the callout's text, and
 * when. The build derives that signature here, so nobody maintains a copy of
 * what the repository knows; explicit `author`/`date` attributes remain the
 * way to sign a judgment git cannot attribute.
 */

/** A top-level warning callout's line span, 1-based and inclusive. */
export type WarningRange = { start: number; end: number; signed: boolean };

/**
 * Where the unsigned warning callouts sit. Mirrors the grammar: directives at
 * column 0, containers never nest, and a fence hides everything inside it —
 * which is how the authoring guide shows callouts without owning them.
 */
export function warningRanges(source: string): WarningRange[] {
  const lines = source.split("\n");
  const ranges: WarningRange[] = [];
  let fenced = false;
  for (let at = 0; at < lines.length; at += 1) {
    const line = lines[at];
    if (line.startsWith("```")) {
      fenced = !fenced;
      continue;
    }
    if (fenced) continue;
    if (!line.startsWith(":::callout{") || !line.includes('kind="warning"')) {
      continue;
    }
    const signed = line.includes('author="') && line.includes('date="');
    let close = at + 1;
    let bodyFence = false;
    for (; close < lines.length; close += 1) {
      if (lines[close].startsWith("```")) bodyFence = !bodyFence;
      if (!bodyFence && lines[close] === ":::") break;
    }
    ranges.push({ start: at + 1, end: close + 1, signed });
    at = close;
  }
  return ranges;
}

type LineAuthor = { author: string; time: number };

/**
 * One `git blame --porcelain` per file, parsed into final-line → author and
 * author-time. A line not yet committed blames to the all-zero commit and
 * reads as unattributed. Null when git cannot answer at all — no repository,
 * or a file it has never seen.
 */
export async function blameLines(
  root: string,
  path: string,
): Promise<Map<number, LineAuthor> | null> {
  let out: string;
  try {
    out = await git(root, ["blame", "--porcelain", "--", path]);
  } catch {
    return null;
  }

  const commits = new Map<string, LineAuthor>();
  const lines = new Map<number, LineAuthor>();
  let sha = "";
  let final = 0;
  for (const line of out.split("\n")) {
    const header = /^([0-9a-f]{40,64}) \d+ (\d+)(?: \d+)?$/.exec(line);
    if (header) {
      sha = header[1];
      final = Number(header[2]);
      if (!commits.has(sha)) commits.set(sha, { author: "", time: 0 });
      continue;
    }
    const info = commits.get(sha);
    if (!info) continue;
    if (line.startsWith("author ")) info.author = line.slice("author ".length);
    if (line.startsWith("author-time ")) {
      info.time = Number(line.slice("author-time ".length));
    }
    if (line.startsWith("\t") && !/^0+$/.test(sha)) lines.set(final, info);
  }
  return lines;
}

/** The newest hand that touched the span — the signature a reader can ask
 * whether the judgment is still current. */
function signatureOf(
  blame: Map<number, LineAuthor>,
  range: WarningRange,
): WarningSignature {
  let newest: LineAuthor | undefined;
  for (let line = range.start; line <= range.end; line += 1) {
    const touched = blame.get(line);
    if (touched && (!newest || touched.time > newest.time)) newest = touched;
  }
  if (!newest || newest.author === "") return null;
  return {
    author: newest.author,
    date: new Date(newest.time * 1000).toISOString().slice(0, 10),
  };
}

/**
 * Attaches a derived signature per unsigned warning callout, in document
 * order — the order the client's parse walks them back in. Pages with nothing
 * to sign carry no field, and a store without git simply leaves every
 * signature unwritten.
 */
export async function signWarningCallouts(
  roots: Roots,
  pages: PageEntry[],
): Promise<void> {
  await Promise.all(
    pages.map(async (entry) => {
      const unsigned = warningRanges(entry.source).filter((one) => !one.signed);
      if (unsigned.length === 0) return;
      const blame = await blameLines(roots.content, entry.path);
      if (!blame) return;
      entry.warningSignatures = unsigned.map((one) => signatureOf(blame, one));
    }),
  );
}
