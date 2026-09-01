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
