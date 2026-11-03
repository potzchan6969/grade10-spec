import { type ReactNode, useMemo } from "react";
import type { ManualIndex, ParsedPage } from "../api/derive";
import { pageMarks } from "../api/page-phases";
import { casesOfPage } from "../api/suites";
import { releaseOf, useDeskVerdicts } from "../api/use-release";
import { BlockList } from "../blocks/block-list";
import { BlockScopeProvider } from "../blocks/block-scope";
import { BrokenCard } from "../blocks/broken-card";
import { PhaseMarksProvider } from "../blocks/phase-chip";
import { sectionRows } from "../blocks/side-blocks";
import { useEditMode } from "../editor/edit-mode";
import { PageEditor } from "../editor/page-editor";
import { useLayoutMaybe } from "../shell/layout";
import {
  type PageRelease,
  PageReleaseProvider,
} from "../shell/section-readiness";
import {
  HintedPage,
  hasSide,
  ReadingRunout,
  SplitPage,
} from "../shell/side-panel";
import { PageWarnings, warningsForPage } from "./check-warnings";
import { NotFoundPage } from "./not-found";
import { PageChips } from "./page-chips";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

type PageViewProps = {
  index: ManualIndex;
  path: string;
  eyebrow?: ReactNode;
  /** Rendered after the page's own blocks. */
  children?: ReactNode;
};

/**
 * One page, rendered the same way wherever it sits: heading from frontmatter,
 * blocks in order.
 */
export function PageView({ index, path, eyebrow, children }: PageViewProps) {
  const page = index.pageByPath.get(path);
  useDocumentTitle(page?.ast?.frontmatter.title);
  const { editing } = useEditMode();
  const layout = useLayoutMaybe();
  const blocks = page?.ast?.blocks;
  const suites = index.snapshot.suites;
  const rows = useMemo(() => sectionRows(blocks ?? []), [blocks]);
  const cases = useMemo(() => casesOfPage(suites ?? [], path), [suites, path]);
  const reading = releaseOf(index);
  const marks = useMemo(
    () => (reading ? pageMarks(reading, path) : null),
    [reading, path],
  );
  const inRelease = useMemo(
    () => reading?.units.some((unit) => unit.pages.includes(path)) ?? false,
    [reading, path],
  );
  const verdicts = useDeskVerdicts(path, inRelease);
  const team = index.snapshot.team;
  const release = useMemo<PageRelease | null>(
    () => (reading && marks ? { reading, marks, verdicts, team } : null),
    [reading, marks, verdicts, team],
  );
  const phaseMarks = useMemo(
    () => (reading && marks ? { marks, phases: reading.phases } : null),
    [reading, marks],
  );
  const side = hasSide(rows, cases, release);
  const split = (layout?.split ?? false) && side;
  // Each section's hint on a wide page holds its stories and engineering
  // detail, so the reading leaves them out; a narrow screen keeps them.
  const hinted = (layout?.wide ?? false) && side;

  if (!page) return <NotFoundPage index={index} path={path} />;
  // A page that does not parse is exactly the page you want to open.
  if (editing) return <PageEditor path={path} />;
  if (!page.ast) return <PageBroken page={page} />;

  const { frontmatter } = page.ast;
  const head = (
    <>
      <PageHeading
        chips={release ? <PageChips release={release} /> : null}
        eyebrow={eyebrow}
        summary={frontmatter.summary}
        title={frontmatter.title}
      />
      <PageWarnings warnings={warningsForPage(index.snapshot.warnings, path)} />
    </>
  );
  return (
    <BlockScopeProvider value={{ index, pagePath: path }}>
      <PageReleaseProvider value={release}>
        <PhaseMarksProvider value={phaseMarks}>
          {/* Folded rail, wide screen: each section's stories, engineering
          detail and cases sit beside it. */}
          {split ? (
            <SplitPage cases={cases} head={head} rows={rows}>
              {children}
            </SplitPage>
          ) : (
            <>
              {head}
              {hinted ? (
                <HintedPage cases={cases} rows={rows} />
              ) : (
                <BlockList blocks={page.ast.blocks} />
              )}
              {children}
            </>
          )}
          {layout && side ? <ReadingRunout /> : null}
        </PhaseMarksProvider>
      </PageReleaseProvider>
    </BlockScopeProvider>
  );
}

function PageBroken({ page }: { page: ParsedPage }) {
  useDocumentTitle("Unreadable page");
  return (
    <>
      <PageHeading eyebrow="Manual" title="This page does not parse" />
      <BrokenCard
        error={{ file: page.path, message: page.error ?? "unknown error" }}
        what="The page"
      />
    </>
  );
}
