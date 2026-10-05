/** A story, case or journey id a change writes is the durable one's only
 * while it names the same thing. The fold places by id, so a delta that hands
 * a durable id to something new replaces the durable entry without a word.
 * A changed title is that signal; a revision says so explicitly - a case
 * carries the durable case's `trace:case` marker, a story or journey sits
 * under `## MODIFIED User journeys` - or the durable title is the one this
 * change wrote itself at an earlier acceptance. */
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { walkFiles } from "./disk.mts";
import { everySection, outline, type Section } from "./markdown.mts";

export type Reuse = {
  kind: "case" | "story" | "journey";
  id: string;
  durable: string;
  delta: string;
};

type Entry = { id: string; title: string; marker: string | null };

const STORY = /^([a-z0-9][a-z0-9-]*?-US-?(\d+)([a-z]?))\b:?\s*(.*)$/i;
const CASE = /^([a-z0-9][a-z0-9-]*?-US-?\d+[a-z]?-TC\d+)-\d+\b:?\s*(.*)$/i;
const MARKER = /^<!-- trace:case id=(\S+)/;
const DELTA_JOURNEYS = new Set(["User journeys", "Context user journeys"]);
const JOURNEYS = "user-journeys.md";
const SUITES = new Set([
  "feature-tcs.md",
  "domain-tcs.md",
  "product-tcs.md",
  "platform-tcs.md",
]);

const tidy = (title: string) => title.replace(/\s+/g, " ").trim();

/** `winner-order-US8` and `winner-order-US-08` are one story: the suite and
 * the journeys file spell the number differently. */
function storyKey(id: string): string {
  const [, , number, letter] = STORY.exec(id) ?? [];
  const prefix = id.replace(/-US-?\d+[a-z]?$/i, "");
  return `${prefix}-us${Number(number)}${letter ?? ""}`.toLowerCase();
}

function markerAbove(lines: string[], section: Section): string | null {
  for (let at = section.line - 2; at >= 0; at -= 1) {
    if (lines[at].trim() === "") continue;
    return MARKER.exec(lines[at])?.[1] ?? null;
  }
  return null;
}

function suiteEntries(text: string | null | undefined) {
  const stories = new Map<string, Entry>();
  const cases = new Map<string, Entry>();
  if (!text) return { stories, cases };
  const lines = text.split("\n");
  for (const section of everySection(outline(text))) {
    if (section.level === 2) {
      const story = STORY.exec(section.heading);
      if (story)
        stories.set(storyKey(story[1]), {
          id: story[1],
          title: tidy(story[4]),
          marker: null,
        });
    } else if (section.level === 3) {
      const one = CASE.exec(section.heading);
      if (one)
        cases.set(one[1].toLowerCase(), {
          id: one[1],
          title: tidy(one[2]),
          marker: markerAbove(lines, section),
        });
    }
  }
  return { stories, cases };
}

function journeyEntries(
  text: string | null | undefined,
  under: (heading: string) => boolean,
) {
  const journeys = new Map<string, Entry>();
  for (const section of everySection(outline(text ?? "")))
    if (section.level === 2 && under(section.heading))
      for (const journey of section.children) {
        const story = STORY.exec(journey.heading);
        if (story)
          journeys.set(storyKey(story[1]), {
            id: story[1],
            title: tidy(story[4]),
            marker: null,
          });
      }
  return journeys;
}

function retitled(
  kind: Reuse["kind"],
  durable: Map<string, Entry>,
  delta: Map<string, Entry>,
  own: Map<string, Entry>,
  revised: (key: string, entry: Entry, prior: Entry) => boolean,
): Reuse[] {
  const found: Reuse[] = [];
  for (const [key, entry] of delta) {
    const prior = durable.get(key);
    if (!prior?.title || !entry.title || prior.title === entry.title) continue;
    if (own.get(key)?.title === prior.title) continue;
    if (revised(key, entry, prior)) continue;
    found.push({
      kind,
      id: entry.id,
      durable: prior.title,
      delta: entry.title,
    });
  }
  return found;
}

/** The durable stories and cases a change's suite hands to something new.
 * `journeys` is the change's journeys file beside it, whose
 * `## MODIFIED User journeys` revises a story; `own` is the suite this change
 * handed in at its previous acceptance, if any. */
export function reusedSuiteIds(
  durable: string | null | undefined,
  delta: string,
  { journeys, own }: { journeys?: string | null; own?: string | null } = {},
): Reuse[] {
  const held = suiteEntries(durable);
  const written = suiteEntries(delta);
  const prior = suiteEntries(own);
  const modified = journeyEntries(
    journeys,
    (heading) => heading === "MODIFIED User journeys",
  );
  return [
    ...retitled(
      "story",
      held.stories,
      written.stories,
      prior.stories,
      (key, entry) => modified.get(key)?.title === entry.title,
    ),
    ...retitled(
      "case",
      held.cases,
      written.cases,
      prior.cases,
      (_key, entry, was) => was.marker !== null && entry.marker === was.marker,
    ),
  ];
}

/** The durable journeys a change's journeys file restates under a heading
 * that is not a revision, with another title. */
export function reusedJourneyIds(
  durable: string | null | undefined,
  delta: string,
  { own }: { own?: string | null } = {},
): Reuse[] {
  const listed = (heading: string) => DELTA_JOURNEYS.has(heading);
  return retitled(
    "journey",
    journeyEntries(durable, (heading) => heading === "User journeys"),
    journeyEntries(delta, listed),
    journeyEntries(own, listed),
    () => false,
  );
}

const REMEDY: Record<Reuse["kind"], string> = {
  case: "give the new case the next unused TC number, or carry the durable case's `trace:case` marker to revise it",
  story:
    "give the new story the next unused US number, or revise the journey under `## MODIFIED User journeys` with this title",
  journey:
    "give the new journey the next unused US number, or revise it under `## MODIFIED User journeys`",
};

export function describeReuse({ kind, id, durable, delta }: Reuse): string {
  return `${kind} ${id} reuses the durable ${kind}'s id for "${delta}", where the durable ${kind} is "${durable}"; ${REMEDY[kind]}`;
}

/** The files of one role a change's current acceptance snapshotted, by
 * store path: `change-input` for what it handed in, `durable-result` for what
 * the fold wrote. Empty before a first acceptance. */
export function acceptedSnapshots(
  root: string,
  changeId: string,
  role: "change-input" | "durable-result",
): Map<string, string> {
  const dir = join(root, "openspec", "changes", changeId);
  if (!existsSync(join(dir, "acceptance.json"))) return new Map();
  try {
    const { fingerprint } = JSON.parse(
      readFileSync(join(dir, "acceptance.json"), "utf8"),
    );
    const file = join(dir, "acceptance", `${fingerprint}.snapshots.json`);
    if (!existsSync(file)) return new Map();
    const snapshots = JSON.parse(readFileSync(file, "utf8"));
    return new Map(
      (snapshots.files ?? [])
        .filter((entry: { role: string }) => entry.role === role)
        .map((entry: { path: string; contentBase64: string }) => [
          entry.path,
          Buffer.from(entry.contentBase64, "base64").toString("utf8"),
        ]),
    );
  } catch {
    return new Map();
  }
}

/** Every durable id a change's suites and journeys hand to something new,
 * each with the store path of the file that does it. */
export function reusedInChange(
  root: string,
  changeId: string,
): { file: string; reuse: Reuse }[] {
  const specs = `openspec/changes/${changeId}/specs`;
  const read = (path: string) =>
    existsSync(join(root, path))
      ? readFileSync(join(root, path), "utf8")
      : null;
  const handedIn = acceptedSnapshots(root, changeId, "change-input");
  return walkFiles(root, join(root, specs), ".md").flatMap((file) => {
    const name = basename(file);
    if (name !== JOURNEYS && !SUITES.has(name)) return [];
    const text = read(file) ?? "";
    const durable = read(`openspec/specs/${file.slice(specs.length + 1)}`);
    const own = handedIn.get(file);
    const found =
      name === JOURNEYS
        ? reusedJourneyIds(durable, text, { own })
        : reusedSuiteIds(durable, text, {
            journeys: read(join(dirname(file), JOURNEYS)),
            own,
          });
    return found.map((reuse) => ({ file, reuse }));
  });
}
