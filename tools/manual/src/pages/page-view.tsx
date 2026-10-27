import { type ReactNode, useMemo } from "react";
import type { ManualIndex, ParsedPage } from "../api/derive";
import { BlockList } from "../blocks/block-list";
import { BlockScopeProvider } from "../blocks/block-scope";
import { BrokenCard } from "../blocks/broken-card";
import { splitPage } from "../blocks/side-blocks";
import { PageActions } from "../editor/edit-actions";
import { useEditMode } from "../editor/edit-mode";
import { PageEditor } from "../editor/page-editor";
import { useLayoutMaybe } from "../shell/layout";
import { PageSide } from "../shell/side-panel";
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
  const split = useLayoutMaybe()?.split ?? false;
  const blocks = page?.ast?.blocks;
  const parts = useMemo(() => splitPage(blocks ?? []), [blocks]);

  if (!page) return <NotFoundPage index={index} path={path} />;
  // A page that does not parse is exactly the page you want to open.
  if (editing) return <PageEditor path={path} />;
  if (!page.ast) return <PageBroken page={page} />;

  const { frontmatter } = page.ast;
  return (
    <>
      <PageActions path={path} />
      <PageHeading
        eyebrow={eyebrow}
        summary={frontmatter.summary}
        title={frontmatter.title}
      />
      <PageWarnings warnings={warningsForPage(index.snapshot.warnings, path)} />
      <BlockScopeProvider value={{ index, pagePath: path }}>
        {/* Folded rail, wide screen: the stories and the engineer's detail
            move beside the page, under the section they sit in. */}
        <BlockList blocks={split ? parts.main : page.ast.blocks} />
        {children}
        {split ? <PageSide side={parts.side} /> : null}
      </BlockScopeProvider>
    </>
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
