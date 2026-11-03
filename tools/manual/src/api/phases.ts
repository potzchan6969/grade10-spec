import YAML from "yaml";
import type {
  Block,
  PageAst,
  PhaseBlock,
  ReleasePriority,
} from "../content/grammar.ts";
import { BUILDING, OPEN } from "./open-marks.ts";
import { sectionSlug } from "./paths.ts";

/**
 * The one reader of release phases: the registry, the `::phase` blocks a
 * page writes, and the units QA walks. Reachable from plain node — the
 * manual's check, the run sheet and the release command read phases here,
 * so a board, a run and a release cannot disagree.
 */

export const QA_ENVIRONMENTS = [
  "staging-1",
  "staging-2",
  "uat",
  "preview",
  "prod",
] as const;

export type Phase = {
  id: string;
  name: string;
  /** Its place in the release order, from 0. */
  order: number;
  /** The QA environment its runs count on. */
  env: string;
  /** `YYYY-MM` or `YYYY-MM-DD`. */
  target?: string;
  /** `YYYY-MM-DD`, written by the release command alone. */
  released?: string;
};

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MONTH_OR_DAY = /^\d{4}-\d{2}(?:-\d{2})?$/;
const DAY = /^\d{4}-\d{2}-\d{2}$/;

/** `phases.yaml`, read and held to its shape; anything else throws. */
export function readPhases(text: string): Phase[] {
  const parsed = YAML.parse(text) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("phases.yaml must be a mapping with `phases`");
  }
  const list = (parsed as Record<string, unknown>).phases;
  if (!Array.isArray(list) || list.length === 0) {
    throw new Error("phases.yaml needs a non-empty `phases` list");
  }
  const seen = new Set<string>();
  return list.map((raw, order) => {
    const at = `phase ${order + 1}`;
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
      throw new Error(`${at} must be a mapping`);
    }
    const entry = raw as Record<string, unknown>;
    for (const key of Object.keys(entry)) {
      if (!["id", "name", "env", "target", "released"].includes(key)) {
        throw new Error(`${at} has no field \`${key}\``);
      }
    }
    const id = entry.id;
    if (typeof id !== "string" || !ID.test(id)) {
      throw new Error(`${at} needs an \`id\` such as \`store-launch-1\``);
    }
    if (seen.has(id)) throw new Error(`\`${id}\` is listed twice`);
    seen.add(id);
    const name = entry.name;
    if (typeof name !== "string" || name.trim() === "") {
      throw new Error(`\`${id}\` needs a \`name\``);
    }
    if (/\bphase\b/i.test(name)) {
      throw new Error(`\`${id}\`'s name carries the word phase`);
    }
    const env = entry.env;
    if (
      typeof env !== "string" ||
      !(QA_ENVIRONMENTS as readonly string[]).includes(env)
    ) {
      throw new Error(
        `\`${id}\` needs an \`env\`: one of ${QA_ENVIRONMENTS.join(", ")}`,
      );
    }
    const phase: Phase = { id, name, order, env };
    const target = dateField(entry.target);
    if (target !== undefined) {
      if (!MONTH_OR_DAY.test(target)) {
        throw new Error(`\`${id}\`'s \`target\` is YYYY-MM or YYYY-MM-DD`);
      }
      phase.target = target;
    }
    const released = dateField(entry.released);
    if (released !== undefined) {
      if (!DAY.test(released)) {
        throw new Error(`\`${id}\`'s \`released\` is YYYY-MM-DD`);
      }
      phase.released = released;
    }
    return phase;
  });
}

/** YAML reads an unquoted `2026-12-01` as a date; the registry means the day. */
function dateField(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

/** The phase after this one, or none after the last. */
export function nextPhase(phases: Phase[], id: string): Phase | undefined {
  const at = phases.findIndex((phase) => phase.id === id);
  return at === -1 ? undefined : phases[at + 1];
}

export type Assignment = { phase: string; priority: ReleasePriority };

/** A rule's anchor as a case's trace writes it: punctuation dropped, not
 * turned into a dash — `tcs:validate`'s `headingAnchor`. */
export function traceAnchor(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[`*_~]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");
}

export type OutlineHeading = {
  /** The id the heading renders with. */
  anchor: string;
  /** The anchor a case's trace names it by. */
  trace: string;
  title: string;
  level: number;
  /** The heading it sits under, or null under the page. */
  parent: string | null;
  /** The `##` section it belongs to; itself for a `##`. */
  section: string;
};

export type LineMark = "building" | "open" | null;

/** One line of a page's own reading: a list item, a paragraph or a table
 * row, with the heading it sits under and the rule it names or sits in. */
export type OutlineLine = {
  /** The innermost heading it sits under, or null before the first. */
  heading: string | null;
  /** The `##` section it sits in, `""` before the first. */
  section: string;
  /** The rule this line names, as a trace anchor and as written. */
  rule?: { anchor: string; name: string };
  /** The rules this line sits under, innermost first. */
  within: string[];
  mark: LineMark;
  text: string;
};

export type PlacedPhase = {
  /** The heading it sits under, or null for the whole page. */
  heading: string | null;
  block: PhaseBlock;
  /** Rule anchors it names; empty for a whole-heading block. */
  rules: string[];
};

export type PageOutline = {
  headings: OutlineHeading[];
  lines: OutlineLine[];
  phases: PlacedPhase[];
  /** Phase blocks inside a callout, a detail or another block, which cover
   * nothing. */
  misplaced: PhaseBlock[];
};

const HEADING = /^(#{2,4})\s+(.+?)\s*#*\s*$/;
const FENCE = /^(`{3,}|~{3,})/;
const LIST_ITEM = /^(\s*)(?:[-*+]|\d+\.)\s+(.*)$/;
const RULE_NAME = /^(?:(?:🚧|❓)\s*)?\*\*([^*]+?)\*\*/u;
const RULE_TABLE = /^\|\s*Rule\s*\|/;
const TABLE_ROW = /^\s*\|(.*)\|\s*$/;
const ROW_RULE = /^\|\s*(?:(?:🚧|❓)\s*)?(?:\*\*)?([^|*]+?)(?:\*\*)?\s*\|/u;
const DIVIDER = /^\s*\|[\s:|-]+\|\s*$/;
const STARTS = [HEADING, FENCE, LIST_ITEM, TABLE_ROW, /^\s*:{2,}/];

const indentOf = (text: string) =>
  (/^\s*/.exec(text) as RegExpExecArray)[0].replace(/\t/g, "    ").length;

function markOf(line: string): LineMark {
  if (BUILDING.test(line)) return "building";
  if (OPEN.test(line)) return "open";
  return null;
}

/** A page's own reading as headings and lines, and the phase blocks placed
 * under them. A detail, an example and a flow's lines are not the page's
 * reading — a `Product decisions` table is never a section's line — but a
 * callout's are, where its author put it. */
export function outlineOf(ast: PageAst): PageOutline {
  const outline: PageOutline = {
    headings: [],
    lines: [],
    phases: [],
    misplaced: [],
  };
  const stack: OutlineHeading[] = [];
  let section = "";

  const heading = () => stack.at(-1)?.anchor ?? null;

  const scan = (markdown: string, headed: boolean) => {
    let fence: string | null = null;
    let table: "rules" | "plain" | null = null;
    const rules: { indent: number; anchor: string }[] = [];
    let last: OutlineLine | null = null;
    for (const line of markdown.split("\n")) {
      if (fence !== null) {
        if (line.startsWith(fence)) fence = null;
        continue;
      }
      const opened = FENCE.exec(line);
      if (opened) {
        fence = opened[1];
        last = null;
        continue;
      }
      const titled = headed ? HEADING.exec(line) : null;
      if (titled) {
        const level = titled[1].length;
        while (
          stack.length > 0 &&
          (stack.at(-1) as OutlineHeading).level >= level
        )
          stack.pop();
        const anchor = sectionSlug(titled[2]);
        if (level === 2) section = anchor;
        const entry: OutlineHeading = {
          anchor,
          trace: traceAnchor(titled[2]),
          title: titled[2].replace(/[*_`]/g, "").trim(),
          level,
          parent: heading(),
          section: level === 2 ? anchor : section,
        };
        outline.headings.push(entry);
        stack.push(entry);
        rules.length = 0;
        table = null;
        last = null;
        continue;
      }
      if (line.trim() === "") {
        last = null;
        table = null;
        continue;
      }
      const row = TABLE_ROW.exec(line);
      if (row) {
        if (table === null) table = RULE_TABLE.test(line) ? "rules" : "plain";
        if (DIVIDER.test(line) || RULE_TABLE.test(line)) continue;
        const named = table === "rules" ? ROW_RULE.exec(line) : null;
        last = push({
          text: row[1]
            .split("|")
            .map((cell) => cell.trim())
            .filter(Boolean)
            .join(" · "),
          mark: markOf(line),
          ...(named
            ? { rule: { anchor: traceAnchor(named[1]), name: named[1].trim() } }
            : {}),
          within: [],
        });
        continue;
      }
      table = null;
      const item = LIST_ITEM.exec(line);
      if (!item && last && !STARTS.some((start) => start.test(line))) {
        last.text = `${last.text} ${line.trim()}`;
        if (last.mark === null) last.mark = markOf(last.text);
        continue;
      }
      const indent = indentOf(item ? item[1] : line);
      // A line belongs to the list items indented less than it; one at the
      // list's own indent or lower ends them.
      while (
        rules.length > 0 &&
        (rules.at(-1) as { indent: number }).indent >= indent
      )
        rules.pop();
      const within = rules.map((one) => one.anchor).reverse();
      if (item) {
        const named = RULE_NAME.exec(item[2]);
        last = push({
          text: item[2].trim(),
          mark: markOf(line),
          ...(named
            ? { rule: { anchor: traceAnchor(named[1]), name: named[1].trim() } }
            : {}),
          within,
        });
        if (named) rules.push({ indent, anchor: traceAnchor(named[1]) });
        continue;
      }
      last = push({ text: line.trim(), mark: markOf(line), within });
    }
  };

  const push = (
    line: Omit<OutlineLine, "heading" | "section">,
  ): OutlineLine => {
    const entry: OutlineLine = { heading: heading(), section, ...line };
    outline.lines.push(entry);
    return entry;
  };

  const inside = (blocks: Block[]) => {
    for (const block of blocks) {
      if (block.type === "phase") outline.misplaced.push(block);
      else if (block.type === "prose") scan(block.markdown, false);
      else if ("body" in block) inside(block.body);
    }
  };

  for (const block of ast.blocks) {
    if (block.type === "prose") scan(block.markdown, true);
    else if (block.type === "phase") {
      outline.phases.push({
        heading: heading(),
        block,
        rules: block.rules ? block.rules.split(",") : [],
      });
    } else if (block.type === "callout") {
      scan(
        block.body
          .flatMap((item) => (item.type === "prose" ? [item.markdown] : []))
          .join("\n\n"),
        false,
      );
      inside(block.body.filter((item) => item.type !== "prose"));
    } else if ("body" in block) {
      inside(block.body.filter((item) => item.type !== "prose"));
    }
  }
  return outline;
}

/** The headings a heading sits under, itself first, then the page as null. */
function chainOf(
  outline: PageOutline,
  anchor: string | null,
): (string | null)[] {
  const chain: (string | null)[] = [];
  let at = anchor;
  while (at !== null) {
    chain.push(at);
    at = outline.headings.find((one) => one.anchor === at)?.parent ?? null;
  }
  chain.push(null);
  return chain;
}

const assignmentOf = (placed: PlacedPhase): Assignment => ({
  phase: placed.block.id,
  priority: placed.block.priority,
});

/** Where each line of a page launches. */
export type PagePhases = {
  outline: PageOutline;
  /** The page's own block, before its first heading. */
  page?: Assignment;
  /** A heading's phase: its own block, else the heading above's, else the
   * page's. */
  heading(anchor: string | null): Assignment | undefined;
  /** A line's phase: the block naming its rule or a rule it sits in, else
   * its heading's. */
  line(line: OutlineLine): Assignment | undefined;
  /** The block that gives a line its phase. */
  blockOf(line: OutlineLine): PlacedPhase | undefined;
  /** A traced rule's phase under a traced heading, both as traces name them. */
  traced(heading: string, rule?: string): Assignment | undefined;
  /** Whether any block on the page names a phase. */
  named: boolean;
};

export function phasesOf(outline: PageOutline): PagePhases {
  const whole = new Map<string | null, PlacedPhase>();
  const named = new Map<string | null, Map<string, PlacedPhase>>();
  for (const placed of outline.phases) {
    if (placed.rules.length === 0) {
      if (!whole.has(placed.heading)) whole.set(placed.heading, placed);
      continue;
    }
    const byRule = named.get(placed.heading) ?? new Map<string, PlacedPhase>();
    for (const rule of placed.rules)
      if (!byRule.has(rule)) byRule.set(rule, placed);
    named.set(placed.heading, byRule);
  }

  const wholeOf = (anchor: string | null): PlacedPhase | undefined => {
    for (const at of chainOf(outline, anchor)) {
      const placed = whole.get(at);
      if (placed) return placed;
    }
    return undefined;
  };

  const namedOf = (
    anchor: string | null,
    rules: string[],
  ): PlacedPhase | undefined => {
    for (const rule of rules) {
      for (const at of chainOf(outline, anchor)) {
        const placed = named.get(at)?.get(rule);
        if (placed) return placed;
      }
    }
    return undefined;
  };

  const assigned = (placed: PlacedPhase | undefined) =>
    placed ? assignmentOf(placed) : undefined;
  const heading = (anchor: string | null) => assigned(wholeOf(anchor));
  const ruleUnder = (anchor: string | null, rules: string[]) =>
    assigned(namedOf(anchor, rules));
  const blockOf = (line: OutlineLine) =>
    namedOf(line.heading, [
      ...(line.rule ? [line.rule.anchor] : []),
      ...line.within,
    ]) ?? wholeOf(line.heading);

  return {
    outline,
    page: whole.has(null)
      ? assignmentOf(whole.get(null) as PlacedPhase)
      : undefined,
    heading,
    line: (line) => assigned(blockOf(line)),
    blockOf,
    traced: (traced, rule) => {
      const found = outline.headings.find((one) => one.trace === traced);
      const anchor = found ? found.anchor : null;
      if (rule) {
        const line = outline.lines.find(
          (one) =>
            one.rule?.anchor === rule &&
            (found ? chainOf(outline, one.heading).includes(anchor) : true),
        );
        if (line) {
          return (
            ruleUnder(line.heading, [rule, ...line.within]) ??
            heading(line.heading)
          );
        }
        return ruleUnder(anchor, [rule]) ?? heading(anchor);
      }
      return heading(anchor);
    },
    named: outline.phases.length > 0,
  };
}

/** A unit QA walks: a store section in a phase, by the rules its cases
 * trace; elsewhere a capability in a phase, whose cases are its suite. */
export type Unit = {
  key: string;
  kind: "section" | "capability" | "page";
  phase: string;
  /** The most a phase leans on it: P0 over P1 over P2. */
  priority: ReleasePriority;
  /** The pages it is read from; one for a section. */
  pages: string[];
  /** A section unit's `##` section, as the page renders and traces it. */
  section?: { anchor: string; trace: string; title: string };
  /** A capability unit's spec id. */
  spec?: string;
  /** The rules in it, as traces name them. */
  rules: string[];
  /** Lines unconfirmed, counted. */
  questions: number;
  /** Lines still being built, counted. */
  building: number;
  lines: number;
};

export type PageForUnits = {
  path: string;
  title: string;
  spec?: string;
  outline: PageOutline;
  phases: PagePhases;
  /** Whether the page's cases trace its rules: a store page. */
  traced: boolean;
};

const PRIORITY_RANK: Record<ReleasePriority, number> = { P0: 0, P1: 1, P2: 2 };

export function higherPriority(
  a: ReleasePriority,
  b: ReleasePriority,
): ReleasePriority {
  return PRIORITY_RANK[a] <= PRIORITY_RANK[b] ? a : b;
}

export const comparePriority = (a: ReleasePriority, b: ReleasePriority) =>
  PRIORITY_RANK[a] - PRIORITY_RANK[b];

type UnitSeed = Omit<Unit, "rules" | "questions" | "building" | "lines">;

/** The units every page is read into, in page order. */
export function unitsOf(pages: PageForUnits[]): Unit[] {
  const units = new Map<string, Unit>();
  const add = (seed: UnitSeed, page: string, line?: OutlineLine) => {
    let unit = units.get(seed.key);
    if (!unit) {
      unit = { ...seed, rules: [], questions: 0, building: 0, lines: 0 };
      units.set(seed.key, unit);
    }
    unit.priority = higherPriority(unit.priority, seed.priority);
    if (!unit.pages.includes(page)) unit.pages.push(page);
    if (!line) return;
    unit.lines += 1;
    if (line.mark === "open") unit.questions += 1;
    if (line.mark === "building") unit.building += 1;
    if (line.rule && !unit.rules.includes(line.rule.anchor))
      unit.rules.push(line.rule.anchor);
  };

  for (const page of pages) {
    const { outline, phases } = page;
    const seedOf = (assignment: Assignment, section: string): UnitSeed => {
      const base = {
        phase: assignment.phase,
        priority: assignment.priority,
        pages: [],
      };
      if (page.traced) {
        const heading = outline.headings.find(
          (one) => one.anchor === section && one.level === 2,
        );
        return {
          ...base,
          key: `${page.path}#${section}@${assignment.phase}`,
          kind: "section",
          section: {
            anchor: section,
            trace: heading?.trace ?? "",
            title: heading?.title ?? page.title,
          },
        };
      }
      if (page.spec) {
        return {
          ...base,
          key: `spec:${page.spec}@${assignment.phase}`,
          kind: "capability",
          spec: page.spec,
        };
      }
      return { ...base, key: `${page.path}@${assignment.phase}`, kind: "page" };
    };

    for (const line of outline.lines) {
      // A store page's opening introduces it; its sections are what QA walks.
      if (page.traced && line.section === "" && !line.rule) continue;
      const assignment = phases.line(line);
      if (!assignment) continue;
      add(seedOf(assignment, line.section), page.path, line);
    }
    for (const placed of outline.phases) {
      // A store page's own block reaches its sections through their lines.
      if (page.traced && placed.heading === null) continue;
      const section =
        placed.heading === null
          ? ""
          : (outline.headings.find((one) => one.anchor === placed.heading)
              ?.section ?? "");
      if (page.traced && section === "") continue;
      add(seedOf(assignmentOf(placed), section), page.path);
    }
  }
  return [...units.values()];
}

/** A page's lines in no phase. The Unplanned chip counts the ones still
 * being built. */
export function unplacedOf(page: PageForUnits): OutlineLine[] {
  return page.outline.lines.filter((line) => !page.phases.line(line));
}
