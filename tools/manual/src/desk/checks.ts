import type { ManualIndex } from "../api/derive.ts";
import type { RunCase } from "../api/desk.ts";
import { outlineOf, type PageOutline } from "../api/phases.ts";
import type { TeamMember } from "../api/types.ts";

/** One rule a case checks, quoted from its page, or a trace the page no
 * longer answers. */
export type Check =
  | {
      kind: "rule";
      trace: string;
      name: string;
      /** The rule's line as the page writes it, its bold name included. */
      text: string;
      pageTitle: string;
      sectionTitle: string;
      to: string;
    }
  | {
      kind: "section";
      trace: string;
      pageTitle: string;
      sectionTitle: string;
      to: string;
    }
  | { kind: "unresolved"; trace: string };

const outlines = new WeakMap<object, PageOutline>();

function outlineFor(index: ManualIndex, path: string): PageOutline | null {
  const page = index.pageByPath.get(path);
  if (!page?.ast) return null;
  const held = outlines.get(page.ast);
  if (held) return held;
  const outline = outlineOf(page.ast);
  outlines.set(page.ast, outline);
  return outline;
}

const TRACE = /^([a-z0-9-]+)(?:#([a-z0-9-]+)(?:\/([a-z0-9-]+))?)?$/;

/** The page a case's suite traces: a suite under `tests/` traces the pages
 * one level up. */
function pagesDir(suite: string): string {
  const dir = suite.slice(0, suite.lastIndexOf("/"));
  return dir.endsWith("/tests") ? dir.slice(0, -"/tests".length) : dir;
}

/** The rules a case traces, quoted from the pages in this snapshot. */
export function checksOf(testCase: RunCase, index: ManualIndex): Check[] {
  return testCase.traces.map((trace): Check => {
    const parsed = TRACE.exec(trace.trim());
    if (!parsed) return { kind: "unresolved", trace };
    const path = `${pagesDir(testCase.suite)}/${parsed[1]}.md`;
    const page = index.pageByPath.get(path);
    const outline = outlineFor(index, path);
    if (!page || !outline || !page.route) return { kind: "unresolved", trace };
    const pageTitle = page.ast?.frontmatter.title ?? parsed[1];
    const heading = parsed[2]
      ? outline.headings.find(
          (one) => one.level === 2 && one.trace === parsed[2],
        )
      : undefined;
    if (parsed[2] && !heading) return { kind: "unresolved", trace };
    const to = heading ? `${page.route}#${heading.anchor}` : page.route;
    const sectionTitle = heading?.title ?? pageTitle;
    if (!parsed[3])
      return { kind: "section", trace, pageTitle, sectionTitle, to };
    const line = outline.lines.find(
      (one) =>
        one.rule?.anchor === parsed[3] &&
        (!heading || one.section === heading.anchor),
    );
    if (!line?.rule) return { kind: "unresolved", trace };
    return {
      kind: "rule",
      trace,
      name: line.rule.name,
      text: line.text,
      pageTitle,
      sectionTitle,
      to,
    };
  });
}

/** The rule's words after its bold name and the dash that follows it. */
export function ruleWords(text: string, name: string): string {
  const at = text.indexOf(`**${name}**`);
  const rest = at === -1 ? text : text.slice(at + name.length + 4);
  return rest.replace(/^\s*[—–-]\s*/, "").trim();
}

/** The team map's handle for an Access e-mail, or the e-mail itself: the
 * desk never refuses one it cannot name. */
export function handleOf(
  email: string,
  team: TeamMember[] | undefined,
): string {
  const lower = email.toLowerCase();
  return (
    team?.find((one) => one.email?.toLowerCase() === lower)?.handle ?? email
  );
}
