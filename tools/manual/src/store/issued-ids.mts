import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { walkFiles } from "./disk.mts";

/**
 * Every journey, scenario and case id the store issues, where it is issued,
 * and the trace id it is issued under — one reading for the `issued` check,
 * `spec:issue` and acceptance, so the three cannot disagree about which ids
 * are taken.
 *
 * An id is issued by the heading that carries it: `### <journey id>:` in a
 * journeys file, `#### Scenario: <scenario id>` in a spec, `### <case id>:`
 * in a suite at any level. A case's issued identity is its readable id with
 * its `<v>` stripped, and the spelling of a journey number does not matter:
 * `US-07` and `US7` are one journey. What a `## REMOVED` section names is
 * retired, not issued.
 */
export type Issued = {
  /** The readable id as written. */
  id: string;
  /** The identity two copies are compared by. */
  key: string;
  kind: "US" | "SC" | "TC";
  /** `durable`, an in-flight change's id, or `archive:<id>`. */
  where: string;
  /** Store-relative path of the file that carries the heading. */
  file: string;
  /** The `trace:` marker above the heading, where one is. */
  trace?: string;
  /** Whether a change's delta issues it under an `## ADDED` section, rather
   * than restating an id issued before; always true in the durable specs and
   * in a suite, whose cases carry their trace id instead. */
  added: boolean;
};

const JOURNEY = /^###\s+([a-z0-9][a-z0-9.-]*?(?:-US-?\d+|\.US\d+)[a-z]?):/;
const SCENARIO =
  /^####\s+Scenario:\s+([a-z0-9][a-z0-9.-]*?(?:-SC-\d+|\.SC\d+)[a-z]?)\b/;
const CASE =
  /^#{3,4}\s+([a-z0-9][a-z0-9.-]*?(?:-US-?\d+[a-z]?-TC-?\d+(?:-\d+)?|\.US\d+[a-z]?-TC\d+))\s*:/;
const MARKER = /^<!--\s*trace:(?:scenario|case)\s+id=(\S+)/;
const FILES = new Set([
  "spec.md",
  "user-journeys.md",
  "feature-tcs.md",
  "domain-tcs.md",
  "product-tcs.md",
  "platform-tcs.md",
]);
const ARCHIVE_DATE = /^\d{4}-\d{2}-\d{2}-/;

/** The identity of a readable id: a case without its `<v>`, a journey number
 * without its padding or its dash. */
export function issuedKey(id: string): string {
  return id
    .replace(/(TC-?\d+)-\d+$/, "$1")
    .replace(/-US-?0*(\d+)/, "-US$1")
    .replace(/\.US0*(\d+)/, ".US$1")
    .replace(/-SC-0*(\d+)/, "-SC-$1")
    .replace(/TC-?0*(\d+)$/, "TC$1")
    .toLowerCase();
}

/** The ids one file's headings issue. */
export function idsInText(text: string, where: string, file: string): Issued[] {
  const found: Issued[] = [];
  const lines = text.split("\n");
  let removed = false;
  let added = where === "durable" || !/(?:spec|user-journeys)\.md$/.test(file);
  const delta = !added;
  let fence = false;
  lines.forEach((line, index) => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    if (fence) return;
    if (/^##\s/.test(line)) {
      removed = /^##\s+REMOVED\b/.test(line);
      if (delta) added = /^##\s+ADDED\b/.test(line);
    }
    if (removed) return;
    const scenario = SCENARIO.exec(line);
    const testCase = scenario ? null : CASE.exec(line);
    const journey = scenario || testCase ? null : JOURNEY.exec(line);
    const id = scenario?.[1] ?? testCase?.[1] ?? journey?.[1];
    if (!id) return;
    const trace = MARKER.exec(lines[index - 1] ?? "")?.[1];
    found.push({
      id,
      key: issuedKey(id),
      kind: scenario ? "SC" : testCase ? "TC" : "US",
      where,
      file,
      ...(trace ? { trace } : {}),
      added,
    });
  });
  return found;
}

/** Every id the store at `root` issues: the durable specs, each in-flight
 * change and each archived one. */
export function issuedIds(root: string): Issued[] {
  const files: { path: string; text: string }[] = [];
  for (const dir of ["openspec/specs", "openspec/changes"]) {
    if (!existsSync(join(root, dir))) continue;
    for (const path of walkFiles(root, join(root, dir), ".md"))
      if (issuing(path))
        files.push({ path, text: readFileSync(join(root, path), "utf8") });
  }
  return issuedIdsIn(files);
}

/** Whether a store path is a file whose headings issue ids. */
export function issuing(path: string): boolean {
  return (
    (path.startsWith("openspec/specs/") ||
      path.startsWith("openspec/changes/")) &&
    FILES.has(path.slice(path.lastIndexOf("/") + 1))
  );
}

/** The ids a set of store files issue, each read where its path puts it. */
export function issuedIdsIn(
  files: Iterable<{ path: string; text: string }>,
): Issued[] {
  const found: Issued[] = [];
  for (const { path, text } of files) {
    if (!issuing(path)) continue;
    found.push(...idsInText(text, whereOf(path), path));
  }
  return found;
}

/** `durable`, an in-flight change's id, or `archive:<id>`. */
function whereOf(path: string): string {
  if (path.startsWith("openspec/specs/")) return "durable";
  const [, , name, next] = path.split("/");
  return name === "archive"
    ? `archive:${next.replace(ARCHIVE_DATE, "")}`
    : name;
}

/**
 * The ids `mine` issues that another place issues too. A journey or a
 * scenario is issued by the durable specs and by the `## ADDED` section of a
 * change's delta, in flight or archived; one `mine` adds that another issues
 * is a clash unless both carry the same trace id. A case is compared by its
 * trace id at every suite level: the same readable id under another trace id
 * is a clash, and a case carried with its own trace id is the same record.
 */
export function heldElsewhere(
  mine: Issued[],
  others: Issued[],
): { id: Issued; by: Issued }[] {
  const byKey = new Map<string, Issued[]>();
  for (const one of others) {
    const held = byKey.get(one.key) ?? [];
    held.push(one);
    byKey.set(one.key, held);
  }
  const clashes: { id: Issued; by: Issued }[] = [];
  const seen = new Set<string>();
  for (const one of mine) {
    if (seen.has(one.key)) continue;
    const by = (byKey.get(one.key) ?? []).find((other) => {
      if (other.where === one.where) return false;
      if (one.trace !== undefined && one.trace === other.trace) return false;
      if (one.kind === "TC")
        return one.trace !== undefined && other.trace !== undefined;
      return one.added && other.added;
    });
    if (!by) continue;
    seen.add(one.key);
    clashes.push({ id: one, by });
  }
  return clashes;
}
