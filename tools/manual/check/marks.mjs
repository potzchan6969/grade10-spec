/*
 * RULE: a 🚧 line is confirmed and being built, so an in-flight change
 * delivers it.
 * RULE: a mark counts where `../src/api/open-marks.ts` counts it.
 */
import {
  BUILDING,
  MARKED,
  marksOfPage,
  openMarksOfPage,
} from "../src/api/open-marks.ts";
import { productPages } from "./context.mjs";

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
 * and nothing is. */
export function checkMarks(ctx, changes, pages) {
  const products = productPages(ctx.roots);
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

/** A ❓ or `TBC` read as words: the readers that pool a page's open items
 * never see it, so nobody is asked to answer it. A warning, never a failure —
 * only the author can say which they meant. Product pages only, because
 * nothing pools a guide's marks. */
export function checkMarkInProse(ctx, pages) {
  const products = productPages(ctx.roots);
  for (const page of pages) {
    if (!page.ast || !page.path.startsWith(products)) continue;
    const counted = new Set(openMarksOfPage(page).map((one) => one.text));
    for (const mark of marksOfPage(page, MARKED)) {
      if (counted.has(mark.text) || !MARKED.test(spoken(mark.text))) continue;
      const where = mark.where ? ` under \`${mark.where.title}\`` : "";
      ctx.add(
        "prose",
        page.path,
        `a mark inside a sentence${where} — \`${around(mark.text)}\` reads as words, not as an open item`,
      );
    }
  }
}

const CODE_SPAN = /`[^`]*`/g;

/** The line with its backtick spans dropped: a mark written `❓` or `TBC` is
 * the mark named rather than a mark, so a page of record can state the
 * grammar. */
const spoken = (text) => text.replace(CODE_SPAN, "");

const MARK = /^🚧\s*/;
const INLINE = /[*_`]/g;
/** Words of the line the report keeps before the mark, so a mark past the
 * line's first 72 characters is still shown in its own sentence. */
const BEFORE = 24;

function shorten(text) {
  const plain = text.replace(MARK, "").replace(INLINE, "");
  return plain.length <= SHOWN
    ? plain
    : `${plain.slice(0, SHOWN - 1).trimEnd()}…`;
}

/** The mark and the words around it: a line read as words is long by
 * definition, and its first 72 characters need not hold the mark at all. */
function around(text) {
  const plain = text.replace(MARK, "").replace(INLINE, "");
  const at = plain.search(MARKED);
  if (at <= BEFORE) return shorten(plain);
  const from = at - BEFORE;
  const cut = plain.slice(from, from + SHOWN).trim();
  return `…${from + SHOWN < plain.length ? `${cut}…` : cut}`;
}
