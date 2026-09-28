/*
 * The lines a diff removes and does not add back. Both rules read a diff this
 * way: the look rule against the first parent, the merge rule against git's
 * own merge of the parents.
 */
import { diff } from "./git.mjs";

export const normalize = (line) => line.trim().replace(/\s+/g, " ");

export function parseDiff(text) {
  const files = [];
  let file;
  let hunk;
  let n = 0;
  for (const line of text.split("\n")) {
    if (line.startsWith("diff --git ")) {
      file = { path: undefined, hunks: [] };
      hunk = undefined;
      files.push(file);
    } else if (!hunk && /^(?:--- a|\+\+\+ b)\//.test(line)) {
      file.path = line.slice(6);
    } else if (line.startsWith("@@")) {
      n = Number(line.match(/^@@ -(\d+)/)[1]);
      hunk = { removed: [], added: [] };
      file.hunks.push(hunk);
    } else if (hunk && line.startsWith("-")) {
      hunk.removed.push({ n: n++, text: line.slice(1) });
    } else if (hunk && line.startsWith("+")) {
      hunk.added.push(line.slice(1));
    }
  }
  return files.filter((f) => f.path);
}

const squeeze = (lines) => lines.join("").replace(/\s+/g, "");

/**
 * The removed lines `counts(path, text)` keeps, less one for each equal line
 * added anywhere in the diff: a move is not a removal, and neither is a hunk
 * that only moves line breaks.
 */
export function removedLines(from, to, paths, counts) {
  const files = parseDiff(diff(from, to, paths, ["-w", "-U0"]));
  const added = new Map();
  for (const line of files.flatMap((f) => f.hunks.flatMap((h) => h.added))) {
    const key = normalize(line);
    added.set(key, (added.get(key) ?? 0) + 1);
  }
  const removed = [];
  for (const { path, hunks } of files) {
    for (const { removed: lines, added: replacements } of hunks) {
      if (squeeze(lines.map(({ text }) => text)) === squeeze(replacements))
        continue;
      lines.forEach(({ n, text }, i) => {
        if (!counts(path, text)) return;
        const key = normalize(text);
        if (added.get(key) > 0) {
          added.set(key, added.get(key) - 1);
          return;
        }
        removed.push({
          file: path,
          n,
          before: text.trim(),
          after: replacements[i]?.trim(),
        });
      });
    }
  }
  return removed;
}
