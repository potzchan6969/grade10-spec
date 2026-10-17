#!/usr/bin/env node
/**
 * One-off backfill for `tell-each-hand-what-moved` Q9: write today's
 * `reviewed:` id for every written, unwaived artifact of every in-flight
 * change that has none and that the retired commit-date comparison does not
 * name behind today. An artifact it names behind gets no line, and stays held
 * whole until its hand reads it. Writes only a missing line, so a rerun is
 * safe.
 *
 *   node scripts/openspec/backfill-reviewed.mjs [--root <store>]
 */
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { openRecord, setEntry } from "./lib/record.mjs";
import { readChangesAt } from "./lib/store-read.mjs";

const at = process.argv.indexOf("--root");
const root = resolve(at === -1 ? process.cwd() : process.argv[at + 1]);
// `--all` skips the date comparison: a fixture store whose history is the
// enclosing repository's dates nothing the way its walks expect.
const all = process.argv.includes("--all");

const dateOf = (path) => {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", path], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out === "" ? undefined : Date.parse(out);
  } catch {
    return undefined;
  }
};

/** The files one artifact of a change is written as, as `upstream.mts` reads
 * them: a `specs/**` artifact is one file per capability carrying it. */
function filesOf(change, artifact) {
  const { generates } = artifact;
  if (!generates.startsWith("specs/")) return [`${change.dir}/${generates}`];
  const name = generates.slice(generates.lastIndexOf("/") + 1);
  const found = [];
  const walk = (dir) => {
    let entries = [];
    try {
      entries = readdirSync(join(root, dir), { withFileTypes: true });
    } catch {
      return;
    }
    for (const one of entries) {
      const path = `${dir}/${one.name}`;
      if (one.isDirectory()) walk(path);
      else if (one.name === name) found.push(path);
    }
  };
  walk(`${change.dir}/specs`);
  return found.sort();
}

const newest = (dates) =>
  dates.filter((one) => one !== undefined).reduce((a, b) => Math.max(a, b), -1);

const { changes, artifactsOf } = await readChangesAt(root);
let written = 0;
let held = 0;
for (const change of changes) {
  if (change.status !== "in-flight" || change.error || !change.upstream)
    continue;
  const artifacts = artifactsOf(change);
  const lines = [];
  for (const [id, read] of Object.entries(change.upstream)) {
    if (change.reviewed?.[id] !== undefined) continue;
    const artifact = artifacts.find((one) => one.id === id);
    if (!artifact) continue;
    const drawn = newest(filesOf(change, artifact).map(dateOf));
    const behind =
      !all &&
      drawn !== -1 &&
      read.items.some((item) => {
        const upstream = artifacts.find((one) => one.id === item);
        if (!upstream) return false;
        return newest(filesOf(change, upstream).map(dateOf)) > drawn;
      });
    if (behind) {
      held += 1;
      continue;
    }
    lines.push([id, read.id]);
  }
  if (lines.length === 0) continue;
  const record = openRecord(root, change.id);
  for (const [id, content] of lines)
    setEntry(record.doc, "reviewed", id, content);
  // No reflow: a record's long lines stay one line each.
  writeFileSync(record.file, record.doc.toString({ lineWidth: 0 }));
  written += lines.length;
}
console.log(
  `backfill-reviewed: ${written} line(s) written, ${held} artifact(s) left behind to be read again`,
);
