import { type OpenMark, openMarksOfPage } from "../api/open-marks.ts";
import { askedText, handOfMark } from "../api/stages.ts";
import type { ChangeEntry, OpenQuestion, PageEntry } from "../api/types.ts";
import type { PageAst } from "../content/grammar.ts";

/**
 * The open questions a change's linked page sections still carry, merged
 * onto `questions` beside the change's own decisions rows.
 *
 * In the snapshot, where the changes and the pages are both at hand — the
 * manual's render and the scripts that send a message both read the merged
 * field rather than each walking the pages again, the way `markUpstream`
 * marks what is before an artifact. One walk per page, however many sections
 * of it a change links, because a page with twenty marks and six linked
 * sections is one reading of the page and not six.
 *
 * A mark is the section's when the page's own prose, a callout or a flow is
 * what it sits in — the boundary `sectionTextOf` draws. A `detail` and an
 * `example` stay the page's own: a `Product decisions` table carries what the
 * page keeps against every change that ever touched it, so reading its rows
 * as one change's would hand each change every question anybody has left
 * there.
 */
export function markQuestions(
  changes: ChangeEntry[],
  pages: PageEntry[],
  asts: Map<string, PageAst>,
): void {
  const byPath = new Map(pages.map((page) => [page.path, page]));
  /** The marks of one page that belong to a section, by that section. */
  const askedUnder = new Map<string, Map<string, OpenMark[]>>();
  const under = (path: string): Map<string, OpenMark[]> => {
    const held = askedUnder.get(path);
    if (held) return held;
    const bySection = new Map<string, OpenMark[]>();
    for (const mark of openMarksOfPage({ path, ast: asts.get(path) ?? null })) {
      const anchor = mark.where?.anchor;
      if (anchor === undefined || anchor !== mark.section) continue;
      bySection.set(anchor, [...(bySection.get(anchor) ?? []), mark]);
    }
    askedUnder.set(path, bySection);
    return bySection;
  };

  for (const change of changes) {
    if (change.status !== "in-flight") continue;
    const linked = (change.sections ?? []).flatMap(({ page, slug }) => {
      if (!byPath.has(page)) return [];
      return (under(page).get(slug) ?? []).map((mark): OpenQuestion => {
        const role = handOfMark(mark.text);
        return {
          artifact: "proposal",
          page,
          section: slug,
          role,
          hand: change.hands?.[role] ?? role,
          text: askedText(mark.text),
        };
      });
    });
    if (linked.length > 0) {
      change.questions = [...(change.questions ?? []), ...linked];
    }
  }
}
