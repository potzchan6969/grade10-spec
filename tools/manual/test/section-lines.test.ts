import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { sectionSlug } from "../src/api/paths";
import { parsePage } from "../src/content/grammar";
import { sectionLinesOf, sectionTextOf } from "../src/content/sections";

/**
 * A round gives a reader the lines a linked section spans, and freshness
 * hashes the text `sectionTextOf` draws from the same section. The two read
 * one boundary: the lines open on the section's own heading, hold every line
 * the hash reads, and end where its text ends, but for the blocks the hash
 * leaves to the page.
 */

const STORE = fileURLToPath(new URL("../../../", import.meta.url));

const OPEN = /^:::([a-z][a-z0-9-]*)(\{.*\})?\s*$/;
const CLOSE = /^:::\s*$/;
const LEAF = /^::[a-z][a-z0-9-]*(\{.*\})?\s*$/;
const FENCE = /^(`{3,}|~{3,})/;
/** The blocks whose bodies `sectionTextOf` reads as the section's lines. */
const HELD = new Set(["callout", "flow"]);

/** A range's lines as the hash reads them: no block's own fence lines, no
 * leaf block, and nothing of a block whose body the hash leaves out. */
function asHashed(lines: string[]): string[] {
  const kept: string[] = [];
  let container: string | null = null;
  let fence: string | null = null;
  const keeps = () => container === null || HELD.has(container);
  for (const line of lines) {
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
      if (keeps()) kept.push(line);
      continue;
    }
    const opened = FENCE.exec(line);
    if (opened) {
      fence = opened[1];
      if (keeps()) kept.push(line);
      continue;
    }
    if (container !== null) {
      if (CLOSE.test(line)) container = null;
      else if (keeps() && !LEAF.test(line)) kept.push(line);
      continue;
    }
    const open = OPEN.exec(line);
    if (open) {
      container = open[1];
      continue;
    }
    if (!LEAF.test(line)) kept.push(line);
  }
  return kept;
}

/** Every page section an active change's proposal links. */
function linkedSections(): { page: string; slug: string }[] {
  const dir = join(STORE, "openspec", "changes");
  const found = new Map<string, { page: string; slug: string }>();
  for (const change of readdirSync(dir)) {
    const proposal = join(dir, change, "proposal.md");
    if (change === "archive" || !existsSync(proposal)) continue;
    for (const [, target, slug] of readFileSync(proposal, "utf8").matchAll(
      /\]\(([^)\s#]+\.md)#([^)\s]+)\)/g,
    )) {
      const at = target.indexOf("docs/prds/");
      if (at === -1) continue;
      const page = target.slice(at);
      if (existsSync(join(STORE, page)))
        found.set(`${page}#${slug}`, { page, slug });
    }
  }
  return [...found.values()];
}

const nonBlank = (lines: string[]) => lines.filter((line) => line.trim());

describe("sectionLinesOf", () => {
  it("spans a section through a flow whose steps are headings", () => {
    const text = [
      "---",
      "title: Rounds",
      "---",
      "",
      "## The Walk",
      "",
      "The round reads the draft.",
      "",
      ':::flow{title="A round"}',
      "## *Hand* — **Asks**",
      "",
      "The step.",
      ":::",
      "",
      "After the flow.",
      "",
      "## The Next Thing",
      "",
      "Not the walk.",
      "",
    ].join("\n");

    expect(sectionLinesOf(text, "the-walk")).toEqual({ start: 5, end: 15 });
    expect(sectionLinesOf(text, "the-next-thing")).toEqual({
      start: 17,
      end: 19,
    });
    expect(sectionLinesOf(text, "hand-asks")).toBeUndefined();
    expect(sectionLinesOf(text, "nowhere")).toBeUndefined();
  });

  const links = linkedSections();

  it("reads the sections the active proposals link", () => {
    expect(links.length).toBeGreaterThan(0);
  });

  it.each(links.map((link) => [`${link.page}#${link.slug}`, link] as const))(
    "%s spans what the hash reads",
    (_, { page, slug }) => {
      const source = readFileSync(join(STORE, page), "utf8");
      const hashed = sectionTextOf({ ast: parsePage(source) }, slug);
      const range = sectionLinesOf(source, slug);
      expect(range === undefined).toBe(hashed === undefined);
      if (range === undefined || hashed === undefined) return;

      const lines = source.split("\n").slice(range.start - 1, range.end);
      const heading = /^#{2,4}\s+(.+?)\s*$/.exec(lines[0]);
      expect(heading && sectionSlug(heading[1])).toBe(slug);

      let at = 0;
      for (const line of nonBlank(hashed.split("\n"))) {
        const found = lines.indexOf(line, at);
        expect(found, line).toBeGreaterThanOrEqual(0);
        at = found + 1;
      }
      expect(nonBlank(asHashed(lines)).at(-1)).toBe(
        nonBlank(hashed.split("\n")).at(-1),
      );
    },
  );
});
