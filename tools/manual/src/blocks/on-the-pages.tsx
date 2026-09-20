import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "react-router";
import type { ManualIndex, ParsedPage } from "../api/derive";
import { BUILDING, MARKED, marksOfPage } from "../api/open-marks";
import { roleLabelOf } from "../api/stage-view";
import { askedText } from "../api/stages";
import type { ChangeEntry, OpenQuestion } from "../api/types";
import { InlineMarkdown } from "./inline-markdown";

/**
 * Every line this change marks, by page and section.
 *
 * A change's requirements say what will be true; the pages say it in the
 * reader's own words, and the 🚧 and ❓ lines of the sections the proposal
 * links are exactly what this change is delivering. Gathered here so a
 * reviewer reads them on one screen rather than opening each linked page and
 * finding the marked lines among the rest.
 *
 * The marks come from `open-marks.ts`, the one reader of the grammar, and the
 * section is the boundary that reader already draws: a line under another
 * heading of the same page is that section's and not this change's.
 */
export function OnThePages({
  change,
  index,
}: {
  change: ChangeEntry;
  index: ManualIndex;
}) {
  const sections = sectionsOf(change, index);

  if (sections.length === 0) {
    return (
      <Text as="p" size="xs" tone="secondary">
        This change marks no page section.
      </Text>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {sections.map((section) => (
        <li
          className="flex flex-col gap-1"
          key={`${section.page.path}#${section.slug}`}
        >
          <Text as="span" size="xs" tone="secondary">
            {section.route === null ? (
              section.title
            ) : (
              <Link
                className="underline underline-offset-2"
                to={`${section.route}#${section.slug}`}
              >
                {section.title}
              </Link>
            )}
          </Text>
          <ul className="flex flex-col gap-1">
            {section.lines.map((line) => (
              <li
                className="flex flex-wrap items-baseline gap-x-2"
                key={line.text}
              >
                <Text as="span" size="xs">
                  <InlineMarkdown text={line.text} />
                </Text>
                {line.hand === undefined ? null : (
                  <Text
                    as="span"
                    className="font-mono"
                    size="xs"
                    tone="secondary"
                  >
                    {line.hand}
                  </Text>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

/** Every 🚧 and ❓ the grammar reads, in one pass so the lines come back in
 * the order the page writes them. Composed from the two patterns
 * `open-marks.ts` exports rather than written a third time. */
const MARKS = new RegExp(`${BUILDING.source}|${MARKED.source}`);

type MarkedLine = {
  /** The line as the page writes it, its list marker dropped. */
  text: string;
  /** The hand a ❓ line waits on, where the change's questions name one. */
  hand?: string;
};

type MarkedSection = {
  page: ParsedPage;
  slug: string;
  /** The page's title and the section's heading, as the row reads them. */
  title: string;
  route: string | null;
  lines: MarkedLine[];
};

/** The sections the proposal links, in the order it links them, each with the
 * lines it marks. A section the manual has no page for, and one that marks
 * nothing, are both left out: the row says the change marks nothing rather
 * than drawing a heading over an empty list. */
function sectionsOf(change: ChangeEntry, index: ManualIndex): MarkedSection[] {
  const sections: MarkedSection[] = [];
  for (const { page: path, slug } of change.sections ?? []) {
    const page = index.pageByPath.get(path);
    if (!page) continue;
    const marks = marksOfPage(page, MARKS).filter(
      (mark) => mark.section === slug,
    );
    if (marks.length === 0) continue;
    const heading = marks[0].where?.title ?? slug;
    sections.push({
      page,
      slug,
      title: `${page.ast?.frontmatter.title ?? path} › ${heading}`,
      route: page.route,
      lines: marks.map((mark) => ({
        text: mark.text,
        ...handOfLine(change.questions ?? [], path, slug, mark.text),
      })),
    });
  }
  return sections;
}

/** The hand of one line: the change's own question for it, matched on the
 * text `markQuestions` wrote — the line with its ❓ taken off, read by the
 * same function that wrote it. A handle where the change names one, the role
 * as open where it does not. */
function handOfLine(
  questions: OpenQuestion[],
  path: string,
  slug: string,
  text: string,
): { hand?: string } {
  const asked = askedText(text);
  const question = questions.find(
    (one) => one.page === path && one.section === slug && one.text === asked,
  );
  if (!question) return {};
  return {
    hand:
      question.hand === question.role
        ? `${roleLabelOf(question.role)} — open`
        : `@${question.hand}`,
  };
}
