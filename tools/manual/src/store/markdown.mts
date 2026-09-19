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
