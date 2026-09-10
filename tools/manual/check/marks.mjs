/* RULE: a 🚧 line is confirmed and being built, so an in-flight change delivers it. */
import { BUILDING, marksOfPage } from "../src/api/open-marks.ts";

const SHOWN = 72;

/** The in-flight changes a page can point at: one carrying a delta for the
 * page's spec, one whose proposal cites that spec, or one whose proposal
 * links a section of the page. */
function delivering(changes, page) {
  const spec = page.ast.frontmatter.spec;
  return changes.some(
    (change) =>
      change.status === "in-flight" &&
      ((spec !== undefined &&
        (change.deltas.some((delta) => delta.spec === spec) ||
          change.cites?.includes(spec))) ||
        change.sections?.some((section) => section.page === page.path)),
  );
}

/** An archive that folded the spec and left the page's marks on, or a mark
 * put on a line nobody is building: the page says something is being built
 * and nothing is. Product pages only — a guide writes the mark to explain it. */
export function checkMarks(ctx, changes, pages) {
  const products = `${ctx.roots.manual}/products/`;
  for (const page of pages) {
    if (!page.ast || !page.path.startsWith(products)) continue;
    const marks = marksOfPage(page, BUILDING);
    if (marks.length === 0 || delivering(changes, page)) continue;
    const spec = page.ast.frontmatter.spec;
    const nobody =
      spec === undefined
        ? "no in-flight change links this page"
        : `no in-flight change on \`${spec}\``;
    for (const mark of marks) {
      const where = mark.where ? ` under \`${mark.where.title}\`` : "";
      ctx.add(
        "marks",
        page.path,
        `🚧 \`${shorten(mark.text)}\`${where} — ${nobody} delivers it`,
      );
    }
  }
}

const MARK = /^🚧\s*/;
const INLINE = /[*_`]/g;

function shorten(text) {
  const plain = text.replace(MARK, "").replace(INLINE, "");
  return plain.length <= SHOWN
    ? plain
    : `${plain.slice(0, SHOWN - 1).trimEnd()}…`;
}
