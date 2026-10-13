/* RULE: a proposal's `## References` links land on a section that exists. */
import { sectionSlug } from "../src/api/paths.ts";
import { outline } from "../src/store/markdown.mts";

/** The ids the page's own product sections render with. Product outcomes are
 * often focused below the page's `##` capability section, so proposals may
 * bind to its `###` or `####` subsection without flattening the PRD. */
function sectionSlugs(ast) {
  const slugs = new Set();
  const collect = (sections) => {
    for (const section of sections) {
      if (section.level >= 2 && section.level <= 4)
        slugs.add(sectionSlug(section.heading));
      collect(section.children);
    }
  };
  for (const block of ast.blocks) {
    if (block.type !== "prose") continue;
    collect(outline(block.markdown));
  }
  return slugs;
}

export function checkSections(ctx, changes, pages) {
  const byPath = new Map(pages.map((page) => [page.path, page]));
  const slugsOf = new Map();
  for (const change of changes) {
    const file = `openspec/changes/${change.id}/proposal.md`;
    for (const { page, slug } of change.sections ?? []) {
      const found = byPath.get(page);
      if (!found) {
        ctx.add(
          "reference",
          file,
          `links \`${page}#${slug}\`, and no such page`,
        );
        continue;
      }
      if (!slugsOf.has(page)) slugsOf.set(page, sectionSlugs(found.ast));
      if (!slugsOf.get(page).has(slug)) {
        ctx.add(
          "reference",
          file,
          `links \`${page}#${slug}\`, and the page has no product section with that id`,
        );
      }
    }
  }
}
