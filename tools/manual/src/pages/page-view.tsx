import { type ReactNode, useMemo } from "react";
import type { ManualIndex, ParsedPage } from "../api/derive";
import { casesOfPage } from "../api/suites";
import { BlockList } from "../blocks/block-list";
import { BlockScopeProvider } from "../blocks/block-scope";
import { BrokenCard } from "../blocks/broken-card";
import { sectionRows } from "../blocks/side-blocks";
import { PageActions } from "../editor/edit-actions";
import { useEditMode } from "../editor/edit-mode";
import { PageEditor } from "../editor/page-editor";
import { useLayoutMaybe } from "../shell/layout";
import { hasSide, SplitPage } from "../shell/side-panel";
import { PageWarnings, warningsForPage } from "./check-warnings";
import { NotFoundPage } from "./not-found";
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
  const split = (layout?.split ?? false) && hasSide(rows, cases);

  if (!page) return <NotFoundPage index={index} path={path} />;
  // A page that does not parse is exactly the page you want to open.
  if (editing) return <PageEditor path={path} />;
  if (!page.ast) return <PageBroken page={page} />;

  const { frontmatter } = page.ast;
  const head = (
    <>
      <PageActions path={path} />
      <PageHeading
        eyebrow={eyebrow}
        summary={frontmatter.summary}
        title={frontmatter.title}
      />
      <PageWarnings warnings={warningsForPage(index.snapshot.warnings, path)} />
    </>
  );
  return (
    <BlockScopeProvider value={{ index, pagePath: path }}>
      {/* Folded rail, wide screen: each section's stories, engineering
          detail and cases sit beside it. */}
      {split ? (
        <SplitPage cases={cases} head={head} rows={rows}>
          {children}
        </SplitPage>
      ) : (
        <>
          {head}
          <BlockList blocks={page.ast.blocks} />
          {children}
        </>
      )}
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
