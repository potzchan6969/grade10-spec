import type { ReactNode } from "react";
import {
  changesForSpec,
  type ManualIndex,
  type ParsedPage,
  proposalsForSpec,
} from "../api/derive";
import { BlockScopeProvider } from "../blocks/block-scope";
import { BlockView } from "../blocks/block-view";
import { BrokenCard } from "../blocks/broken-card";
import { ChangeRibbon } from "../blocks/change-views";
import { SpecDeltas } from "../blocks/delta-view";
import { PageActions } from "../editor/edit-actions";
import { useEditMode } from "../editor/edit-mode";
import { PageEditor } from "../editor/page-editor";
import { ArchiveTimeline } from "./archive-timeline";
import { PageWarnings, warningsForPage } from "./check-warnings";
import { NotFoundPage } from "./not-found";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

type PageViewProps = {
  index: ManualIndex;
  path: string;
  eyebrow?: ReactNode;
  /** Rendered after the page's own blocks, before the archive. */
  children?: ReactNode;
};

/**
 * One page, rendered the same way wherever it sits: heading from frontmatter,
 * blocks in order, and — when the page names a spec — the ribbon and the
 * archive that spec earns automatically.
 */
export function PageView({ index, path, eyebrow, children }: PageViewProps) {
  const page = index.pageByPath.get(path);
  useDocumentTitle(page?.ast?.frontmatter.title);
  const { editing } = useEditMode();

  if (!page) return <NotFoundPage index={index} path={path} />;
  // A page that does not parse is exactly the page you want to open.
  if (editing) return <PageEditor path={path} />;
  if (!page.ast) return <PageBroken page={page} />;

  const { frontmatter, blocks } = page.ast;
  const specId = frontmatter.spec;

  return (
    <>
      <PageActions path={path} />
      <PageHeading
        eyebrow={eyebrow}
        summary={frontmatter.summary}
        title={frontmatter.title}
      />
      <PageWarnings warnings={warningsForPage(index.snapshot.warnings, path)} />
      {specId ? (
        <>
          <ChangeRibbon
            changes={changesForSpec(index, specId)}
            proposals={proposalsForSpec(index, specId)}
            specId={specId}
          />
          <SpecDeltas index={index} specId={specId} />
        </>
      ) : null}

      <BlockScopeProvider value={{ index, pagePath: path }}>
        {blocks.map((block, position) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
          <BlockView block={block} key={`${block.type}-${position}`} />
        ))}
        {children}
      </BlockScopeProvider>

      {specId ? <ArchiveTimeline specId={specId} /> : null}
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
