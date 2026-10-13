/** Fence-aware heading outline. Every store reader walks markdown through
 * this, so a `#` inside a code fence is never mistaken for a section. */

export type Section = {
  level: number;
  heading: string;
  /** 1-based line of the heading itself. */
  line: number;
  /** Lines under the heading, up to the next heading of any level. */
  body: string;
  /** Body plus every descendant section, verbatim. */
  raw: string;
  children: Section[];
};

const HEADING_RE = /^(#{1,6})\s+(.+?)\s*$/;
const FENCE_RE = /^(`{3,}|~{3,})/;

export function outline(text: string): Section[] {
  const lines = text.split("\n");
  const marks: { level: number; heading: string; line: number }[] = [];
  let fence: string | null = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
      continue;
    }
    const fenced = FENCE_RE.exec(line);
    if (fenced) {
      fence = fenced[1];
      continue;
    }
    const heading = HEADING_RE.exec(line);
    if (heading) {
      marks.push({
        level: heading[1].length,
        heading: heading[2],
        line: i + 1,
      });
    }
  }

  const flat = marks.map((mark, index): Section => {
    const next = marks[index + 1];
    let rawEnd = lines.length;
    for (let j = index + 1; j < marks.length; j += 1) {
      if (marks[j].level <= mark.level) {
        rawEnd = marks[j].line - 1;
        break;
      }
    }
    return {
      level: mark.level,
      heading: mark.heading,
      line: mark.line,
      body: trimBlank(
        lines.slice(mark.line, next ? next.line - 1 : lines.length),
      ),
      raw: trimBlank(lines.slice(mark.line, rawEnd)),
      children: [],
    };
  });

  const roots: Section[] = [];
  const stack: Section[] = [];
  for (const section of flat) {
    while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
      stack.pop();
    }
    const parent = stack[stack.length - 1];
    if (parent) parent.children.push(section);
    else roots.push(section);
    stack.push(section);
  }
  return roots;
}

export function findSection(
  sections: Section[],
  heading: string,
): Section | undefined {
  return sections.find((section) => section.heading === heading);
}

/** A `##` section by heading, wherever it sits in the outline. `outline`
 * returns roots and nests by level, so a file opening on a `# Title` hangs
 * every `##` under that one: a reader that searches the roots alone finds
 * nothing there and says nothing about it, which is the shape of a check that
 * passes because it never looked.
 *
 * Level two only, and that is the point of the pair — a `# User journeys`
 * title over a `## User journeys` section is a file naming itself, not two
 * sections, and matching on the heading alone would return the title and read
 * the section beneath it as its content. */
export function findSectionAnywhere(
  sections: Section[],
  heading: string,
): Section | undefined {
  for (const one of sections) {
    if (one.level === 2) {
      if (one.heading === heading) return one;
      continue;
    }
    const found = findSectionAnywhere(one.children, heading);
    if (found) return found;
  }
  return undefined;
}

/** Every section of an outline, depth first, in file order. */
export function everySection(sections: Section[]): Section[] {
  return sections.flatMap((one) => [one, ...everySection(one.children)]);
}

export type SectionSpan = {
  section: Section;
  /** 0-based index of the first line under the heading. */
  from: number;
  /** 0-based index of the next heading at the section's level or above, or
   * the file's line count. */
  until: number;
};

/**
 * One section by heading, and the lines of the file it holds: from the one
 * after its heading to the one before the next heading at its level or above
 * — the span `raw` covers, as line indexes for a reader that walks or writes
 * lines. `heading` is the heading's text, or a pattern it matches.
 *
 * Searched among the file's top sections, under a `# Title` where it opens
 * with one, so the title never answers for a section; `within` narrows the
 * search to one section's children instead. Fence-aware, as `outline` is.
 */
export function sectionSpan(
  text: string,
  heading: string | RegExp,
  within?: Section[],
): SectionSpan | undefined {
  const roots = outline(text);
  const named = (one: Section) =>
    typeof heading === "string"
      ? one.heading === heading
      : heading.test(one.heading);
  const section = (
    within ?? roots.flatMap((one) => (one.level === 1 ? one.children : [one]))
  ).find(named);
  if (!section) return undefined;
  const next = everySection(roots).find(
    (one) => one.line > section.line && one.level <= section.level,
  );
  return {
    section,
    // `line` is the 1-based line of the heading, which is the 0-based index
    // of the line after it.
    from: section.line,
    until: next ? next.line - 1 : text.split("\n").length,
  };
}

/** What a scenario id looks like: the capability, `-SC-`, its number, and a
 * lower-case letter where a scenario was added beside one (`-SC-07a`). Named
 * once; a reader that needs flags or anchors builds them over its `source`. */
export const SCENARIO_ID = /[a-z0-9][a-z0-9-]*-SC-\d+[a-z]?/;

/** Every scenario id a text carries, bounded on both sides as `citesId`
 * bounds one: `x-SC-07a` is never read as `x-SC-07`, nor `alpha-SC-1` inside
 * `demo-alpha-SC-1`. */
export function scenarioIdsIn(text: string): string[] {
  return (
    text.match(new RegExp(`(?<![\\w-])${SCENARIO_ID.source}(?!\\w)`, "g")) ?? []
  );
}

export function trimBlank(lines: string[]): string {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start].trim() === "") start += 1;
  while (end > start && lines[end - 1].trim() === "") end -= 1;
  return lines.slice(start, end).join("\n");
}

/** `# Heading` on the first non-blank line, when the file opens with one. */
export function leadingTitle(sections: Section[]): string | undefined {
  const first = sections[0];
  return first?.level === 1 ? first.heading : undefined;
}

/** The `## ` sections of a delta file, with a `# ` title unwrapped — what
 * `openspec archive` splits the file into. */
export function deltaSections(text: string): Section[] {
  return outline(text).flatMap((one) =>
    one.level === 1 ? one.children : [one],
  );
}

/** The rule under a table's header: every cell of it and nothing else. */
const TABLE_RULE = /^-{2,}$/;

/**
 * The rows of the first markdown table in a body, each as its cells, with the
 * header, the rule under it and a template's own commented placeholders
 * dropped. `undefined` where there is no body at all — which is a different
 * finding from a table with nothing in it.
 *
 * One reader for every table this store reads: the change's decisions rows,
 * its raised rows and the `planned` rules over the same two tables. A second
 * one drifts on the day a template gains a placeholder or a column moves.
 */
export function tableRows(body: string | undefined): string[][] | undefined {
  if (body === undefined) return undefined;
  const rows: string[][] = [];
  for (const line of body.split("\n")) {
    const cells = cellsOf(line);
    if (!cells) continue;
    if (cells.every((cell) => TABLE_RULE.test(cell))) continue;
    if (cells.some((cell) => cell.includes("<!--"))) continue;
    rows.push(cells);
  }
  // The first row left is the header: the rule under it is what makes a
  // markdown table a table, and it is dropped above.
  return rows.slice(1);
}

/** A markdown table row's cells, trimmed; nothing for a line that is not a
 * row. One reader, because a positional regex per table drifts from the
 * columns the file actually writes the moment one is added. The rule under
 * the header is a row too — `tableRows` is what drops it. */
export function cellsOf(line: string): string[] | undefined {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|")) return undefined;
  return trimmed
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}
