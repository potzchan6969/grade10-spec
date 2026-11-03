import {
  type Assignment,
  type OutlineLine,
  type Unit,
  unplacedOf,
} from "./phases.ts";
import type { ReleaseReading } from "./units.ts";

/**
 * What a page wears of its phases: the chip beside its title, a chip on a
 * heading or a rule only where its phase differs from the one above it, the
 * Unplanned count, and the units its sections are read into.
 */
export type PageMarks = {
  /** The page's own block. */
  page?: Assignment;
  /** The unit the page's chip carries readiness for: its capability, or the
   * page itself where it names none. A store page's units are its sections. */
  pageUnit?: Unit;
  /** Lines still being built in no phase, on a page that names one. */
  unplanned: number;
  /** A heading's chip, where its own block differs from the heading above. */
  heading(anchor: string): Assignment | undefined;
  /** A rule's chip, where its phase differs from its heading's or its parent
   * rule's. `heading` null asks by the rule alone, answered only where every
   * line naming it on the page agrees. */
  rule(heading: string | null, rule: string): Assignment | undefined;
  /** The units a `##` section is read into: two where part of it launches
   * in another phase. */
  sectionUnits(section: string): Unit[];
};

export const sameAssignment = (a?: Assignment, b?: Assignment) =>
  a?.phase === b?.phase && a?.priority === b?.priority;

const key = (heading: string | null, rule: string) =>
  `${heading ?? ""}\u0000${rule}`;

export function pageMarks(
  reading: ReleaseReading,
  path: string,
): PageMarks | null {
  const page = reading.pages.get(path);
  if (!page) return null;
  const { outline, phases } = page;

  const headings = new Map<string, Assignment>();
  for (const placed of outline.phases) {
    if (placed.heading === null || placed.rules.length > 0) continue;
    if (headings.has(placed.heading)) continue;
    const own = phases.heading(placed.heading);
    const parent = outline.headings.find(
      (one) => one.anchor === placed.heading,
    )?.parent;
    const above = phases.heading(parent ?? null);
    if (own && !sameAssignment(own, above)) headings.set(placed.heading, own);
  }

  const rules = new Map<string, Assignment>();
  /** A rule's answer when asked without its heading: undefined for none,
   * null where two lines naming it disagree. */
  const byRule = new Map<string, Assignment | null>();
  outline.lines.forEach((line, at) => {
    if (!line.rule) return;
    const own = phases.line(line);
    const above = parentOf(outline.lines, at, line);
    const chip =
      own &&
      !sameAssignment(
        own,
        above ? phases.line(above) : phases.heading(line.heading),
      )
        ? own
        : undefined;
    if (chip) rules.set(key(line.heading, line.rule.anchor), chip);
    const seen = byRule.get(line.rule.anchor);
    if (!byRule.has(line.rule.anchor))
      byRule.set(line.rule.anchor, chip ?? null);
    else if (!sameAssignment(seen ?? undefined, chip))
      byRule.set(line.rule.anchor, null);
  });

  const assignment = phases.page;
  const pageUnit =
    assignment && !page.traced
      ? reading.units.find(
          (unit) =>
            unit.key ===
            (page.spec
              ? `spec:${page.spec}@${assignment.phase}`
              : `${path}@${assignment.phase}`),
        )
      : undefined;

  return {
    ...(assignment ? { page: assignment } : {}),
    ...(pageUnit ? { pageUnit } : {}),
    unplanned: phases.named
      ? unplacedOf(page).filter((line) => line.mark === "building").length
      : 0,
    heading: (anchor) => headings.get(anchor),
    rule: (heading, rule) =>
      heading === null
        ? (byRule.get(rule) ?? undefined)
        : rules.get(key(heading, rule)),
    sectionUnits: (section) =>
      page.traced
        ? reading.units.filter(
            (unit) =>
              unit.kind === "section" &&
              unit.pages[0] === path &&
              unit.section?.anchor === section,
          )
        : [],
  };
}

/** The rule line a nested rule sits in, under the same heading. */
function parentOf(
  lines: OutlineLine[],
  at: number,
  line: OutlineLine,
): OutlineLine | undefined {
  const parent = line.within[0];
  if (!parent) return undefined;
  for (let back = at - 1; back >= 0; back -= 1) {
    const one = lines[back];
    if (one.heading !== line.heading) return undefined;
    if (one.rule?.anchor === parent) return one;
  }
  return undefined;
}
