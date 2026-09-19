/*
 * RULE `cited`: an id written in backticks names an id the store issues.
 *
 * The store issues every scenario and every journey a permanent id, then points
 * at them from everywhere else — a task naming the scenario it makes pass, a
 * design's states table, a suite's reconciliation. That is a join table written
 * in prose, and a citation that resolves to nothing reads exactly like one that
 * resolves.
 *
 * Two ways it rots. A prefix is read and never reconstructed — most capabilities
 * issue `grade10-site-auction-account-record-SC-20`, a few issue
 * `winner-order-SC-04` and keep it, so an id written from memory is the tail of
 * one and names nothing. And a renumber moves an id the change still holds,
 * leaving every other artifact pointing at the number it used to have.
 *
 * Only inside backticks, which is how the store writes a citation. A bare id in
 * a sentence is prose about the scenario, and a spec's own heading would
 * otherwise cite itself. `**Serves:**` and `**Trace:**` write theirs bare and
 * have the `serves` and `trace` rules of their own.
 *
 * Definitions are read from the whole store, the archive included: an id a
 * shipped change issued is still an id a reader can go and find. Citations are
 * checked in the durable store and in the in-flight changes only — the archive
 * is the record of what happened, and rewriting one to chase a capability the
 * store has since refolded would be a lie about the change that shipped.
 *
 * Two id shapes, because the store issues two: a scenario or a journey, issued
 * once for the whole store, and a `Q<n>` decisions row, issued by one change's
 * own table. The second resolves against that change and nowhere else.
 */
import { join } from "node:path";
import { readText, walkFiles } from "../src/store/disk.mts";
import { questionIdsOf } from "../src/store/read-changes.mts";

const ID = String.raw`[a-z0-9]+(?:-[a-z0-9]+)*-(?:SC|US)-\d+[a-z]?`;

/** Where an id is issued: a scenario's heading in a spec, a journey's in a
 * journeys file. Both are the line a reader scrolls to. */
const DEFINITION = new RegExp(
  String.raw`^(?:####\s+Scenario:\s*(${ID})\b|###\s+(${ID})\s*:)`,
  "gim",
);

const CITATION = new RegExp(String.raw`\`(${ID})\``, "gi");

/**
 * The other id the store writes in backticks: a change's decisions row.
 *
 * `Q<n>` is issued by one table — the change's own `## Decisions` — and never
 * by the store at large, so it resolves against the change whose directory the
 * citing file sits in. Ids are never reused inside a change, which is what
 * makes the citation a join: the round writes `Q12` into a proposal, a design
 * or a tech design, and a reader goes to that row for the answer. A `Q<n>`
 * outside any change's directory names no table at all.
 */
const Q_CITATION = /`(Q\d+)`/g;
const IN_CHANGE = /^openspec\/changes\/([^/]+)\//;

const ARCHIVE = "openspec/changes/archive/";

/** Line numbers without a second pass: the offset of each match is counted back
 * to the newlines before it, walking the string once. */
function* matches(text, pattern, idOf) {
  let line = 1;
  let at = 0;
  for (const match of text.matchAll(pattern)) {
    while (at < match.index) {
      if (text[at] === "\n") line++;
      at++;
    }
    yield { id: idOf(match), line };
  }
}

const definitions = (text) =>
  matches(text, DEFINITION, (one) => one[1] ?? one[2]);
const citations = (text) => matches(text, CITATION, (one) => one[1]);

/**
 * The id somebody probably meant, or null.
 *
 * A dropped prefix is far commoner than an invented scenario, and "no such id"
 * is unhelpful beside a store that plainly has one. Only ever offered when one
 * id answers: two capabilities can end alike, and guessing between them would
 * put a reader on the wrong scenario with more confidence than they arrived
 * with.
 */
function meant(issued, id) {
  const tail = `-${id}`;
  const found = [...issued.keys()].filter((one) => one.endsWith(tail));
  return found.length === 1 ? issued.get(found[0]) : null;
}

export function checkCited(root, add) {
  const files = walkFiles(root, join(root, "openspec"), ".md");
  const texts = new Map(
    files.map((path) => [path, readText(join(root, path))]),
  );

  // Keyed case-insensitively, holding the spelling the heading used: `SC` and
  // `US` are upper in every id the store issues, and a suggestion a reader
  // cannot paste is worse than none.
  const issued = new Map();
  for (const text of texts.values()) {
    for (const { id } of definitions(text)) {
      const key = id.toLowerCase();
      if (!issued.has(key)) issued.set(key, id);
    }
  }

  /** The decisions rows per change, read once per run. */
  const rows = new Map();

  for (const [path, text] of texts) {
    if (path.startsWith(ARCHIVE)) continue;
    // One row per id per file: sixty-five ids cited twice each is not 130
    // problems, and the line named is the first a reader would reach.
    const unresolved = new Map();
    for (const { id, line } of citations(text)) {
      const key = id.toLowerCase();
      if (issued.has(key)) continue;
      if (!unresolved.has(key)) unresolved.set(key, { id, line, more: 0 });
      else unresolved.get(key).more++;
    }
    for (const [key, one] of unresolved) {
      const guess = meant(issued, key);
      add(
        "cited",
        path,
        `line ${one.line}${one.more > 0 ? ` and ${one.more} more` : ""}: \`${one.id}\` is issued nowhere in the store` +
          (guess ? ` — did you mean \`${guess}\`?` : ""),
      );
    }

    const change = IN_CHANGE.exec(path)?.[1];
    const asked = change === undefined ? NONE : rowsOf(texts, change, rows);
    const unasked = new Map();
    for (const { id, line } of matches(text, Q_CITATION, (one) => one[1])) {
      if (asked.has(id)) continue;
      if (!unasked.has(id)) unasked.set(id, { line, more: 0 });
      else unasked.get(id).more++;
    }
    for (const [id, one] of unasked) {
      add(
        "cited",
        path,
        `line ${one.line}${one.more > 0 ? ` and ${one.more} more` : ""}: \`${id}\`${
          change === undefined
            ? " names a decisions row, and nothing outside a change's directory issues one"
            : ` is no \`## Decisions\` row of ${change}`
        }`,
      );
    }
  }
}

const NONE = new Set();

/** The decisions rows one change issues, read from its own `decisions.md`,
 * once per change however many of its files cite one. `rows` is the run's own
 * cache — a store read again is read again. A change with no such file issues
 * none, which is what a citation of one reads against. */
function rowsOf(texts, change, rows) {
  const held = rows.get(change);
  if (held) return held;
  const text = texts.get(`openspec/changes/${change}/decisions.md`);
  const read = text === undefined ? NONE : questionIdsOf(text);
  rows.set(change, read);
  return read;
}
