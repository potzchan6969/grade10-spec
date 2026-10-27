import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Text } from "@grade10/design-system/components/display/text";
import { AppWindow, Code, ListChecks } from "@phosphor-icons/react";
import { type ReactNode, use, useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { dirOf, humanize } from "../api/paths";
import { casesOfPage, type TestCase } from "../api/suites";
import { useBlockScope } from "../blocks/block-scope";
import { BlockView } from "../blocks/block-view";
import { Collapsible } from "../blocks/collapsible";
import { MarkdownView } from "../blocks/markdown";
import { SIDE_TABS, type SideItem, type SideTab } from "../blocks/side-blocks";
import type { DetailBlock } from "../content/grammar";
import { clamp, PAGE_MIN_WIDTH, PANEL_WIDTH, useLayout } from "./layout";
import { type PageSection, PageSectionsContext } from "./page-sections";
import { ResizeHandle } from "./resize-handle";

const TAB_LABEL: Record<SideTab, string> = {
  ui: "UI",
  tech: "Technical",
  qa: "QA",
};

const TAB_ICON: Record<SideTab, ReactNode> = {
  ui: <AppWindow aria-hidden size={16} />,
  tech: <Code aria-hidden size={16} />,
  qa: <ListChecks aria-hidden size={16} />,
};

/**
 * The column beside the page, while the rail is folded on a wide screen. It
 * is an empty slot the page draws into, and it shows only once something is
 * drawn, so a page with nothing beside it keeps the whole width.
 */
export function SidePanelSlot({ rowWidth }: { rowWidth: () => number }) {
  const layout = useLayout();
  const [draft, setDraft] = useState<number | null>(null);
  const max = () => rowWidth() - PAGE_MIN_WIDTH;
  const width = draft ?? layout.panelWidth;
  const filled = layout.split && layout.panelFilled;

  return (
    <>
      {filled ? (
        <ResizeHandle
          grows={-1}
          label="Resize the side panel"
          max={max()}
          min={PANEL_WIDTH.min}
          onCommit={(next) => {
            setDraft(null);
            layout.setPanelWidth(clamp(next, PANEL_WIDTH.min, max()));
          }}
          onMove={(next) => setDraft(clamp(next, PANEL_WIDTH.min, max()))}
          width={width}
        />
      ) : null}
      <aside
        aria-label="Beside this section"
        className={
          filled
            ? "sticky top-16 h-[calc(100dvh-4rem)] shrink-0 overflow-y-auto overscroll-contain border-border border-l bg-background [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]"
            : "hidden"
        }
        data-slot="manual-side-panel"
        ref={layout.setPanel}
        style={filled ? { width } : undefined}
      />
    </>
  );
}

/** The `##` the reader is in: the active heading, or the one an active `###`
 * sits under. */
function activeH2(
  sections: PageSection[],
  active?: string,
): PageSection | null {
  const at = sections.findIndex((section) => section.id === active);
  for (let index = at; index >= 0; index -= 1) {
    if (sections[index].level === 2) return sections[index];
  }
  return sections.find((section) => section.level === 2) ?? null;
}

type Shelf = {
  blocks: Record<SideTab, SideItem[]>;
  cases: { testCase: TestCase; rules: string[] }[];
};

/**
 * What a page carries beside its reading, drawn into the shell's slot: the
 * section being read, and per tab what that section holds — its stories, its
 * engineering detail, the cases that trace it.
 */
export function PageSide({ side }: { side: SideItem[] }) {
  const layout = useLayout();
  const { index, pagePath } = useBlockScope();
  const { sections, active } = use(PageSectionsContext);
  const cases = useMemo(
    () => casesOfPage(index.snapshot.suites ?? [], pagePath),
    [index.snapshot.suites, pagePath],
  );
  const hasAny =
    side.length > 0 || cases.bySection.size > 0 || cases.page.length > 0;
  const { setPanelFilled } = layout;

  useLayoutEffect(() => {
    if (!hasAny) return;
    setPanelFilled(true);
    return () => setPanelFilled(false);
  }, [hasAny, setPanelFilled]);

  if (!layout.split || !layout.panel || !hasAny) return null;

  const section = activeH2(sections, active);
  const first = sections.find((candidate) => candidate.level === 2);
  const shelfOf = (id: string): Shelf => {
    const here = (item: SideItem) =>
      item.section === id || (item.section === "" && id === first?.id);
    const blocks = { ui: [], tech: [], qa: [] } as Shelf["blocks"];
    for (const item of side) if (here(item)) blocks[item.tab].push(item);
    return { blocks, cases: cases.bySection.get(id) ?? [] };
  };
  const shelf = shelfOf(section?.id ?? "");
  const count = (tab: SideTab, of: Shelf) =>
    tab === "qa" ? of.cases.length : of.blocks[tab].length;
  const elsewhere = (tab: SideTab) =>
    sections.filter(
      (candidate) =>
        candidate.level === 2 &&
        candidate.id !== section?.id &&
        count(tab, shelfOf(candidate.id)) > 0,
    );

  return createPortal(
    <Tabs
      onValueChange={(value) => layout.setTab(value as SideTab)}
      value={layout.tab}
    >
      <div className="sticky top-0 z-10 border-border border-b bg-background/95 px-4 pt-3 backdrop-blur">
        <Text as="p" className="truncate" size="xs" tone="secondary">
          {section ? section.title : "This page"}
        </Text>
        <TabsList className="mt-1" fullWidth size="sm" variant="list">
          {SIDE_TABS.map((tab) => (
            <TabsTrigger className="gap-1.5" key={tab} value={tab}>
              {TAB_ICON[tab]}
              {TAB_LABEL[tab]}
              {count(tab, shelf) > 0 ? (
                <Badge size="sm" variant="outline">
                  {count(tab, shelf)}
                </Badge>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {SIDE_TABS.map((tab) => (
        <TabsContent className="flex flex-col gap-4 p-4" key={tab} value={tab}>
          {count(tab, shelf) === 0 ? (
            <Empty
              elsewhere={elsewhere(tab)}
              section={section?.title}
              tab={tab}
            />
          ) : tab === "qa" ? (
            shelf.cases.map(({ testCase, rules }) => (
              <CaseCard key={testCase.id} rules={rules} testCase={testCase} />
            ))
          ) : (
            shelf.blocks[tab].map((item, position) =>
              item.block.type === "detail" ? (
                <SideDetail
                  block={item.block}
                  // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
                  key={`detail-${position}`}
                />
              ) : (
                <BlockView
                  block={item.block}
                  // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
                  key={`${item.block.type}-${position}`}
                />
              ),
            )
          )}
          {tab === "qa" && cases.page.length > 0 ? (
            <Collapsible
              badge={
                <Badge size="sm" variant="outline">
                  {cases.page.length}
                </Badge>
              }
              id="side-page-cases"
              linkLabel="Copy link to the page's cases"
              title="Across the page"
              variant="ghost"
            >
              <div className="flex flex-col gap-3">
                {cases.page.map((testCase) => (
                  <CaseCard key={testCase.id} rules={[]} testCase={testCase} />
                ))}
              </div>
            </Collapsible>
          ) : null}
        </TabsContent>
      ))}
    </Tabs>,
    layout.panel,
  );
}

const EMPTY: Record<SideTab, string> = {
  ui: "No story or design",
  tech: "No engineering detail",
  qa: "No test case",
};

function Empty({
  tab,
  section,
  elsewhere,
}: {
  tab: SideTab;
  section?: string;
  elsewhere: PageSection[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <Text as="p" size="sm" tone="secondary">
        {EMPTY[tab]} {section ? `in ${section}` : "here"}.
      </Text>
      {elsewhere.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {elsewhere.map((candidate) => (
            <li key={candidate.id}>
              <a
                className="text-foreground text-sm underline decoration-border-strong underline-offset-4 hover:decoration-foreground"
                href={`#${candidate.id}`}
              >
                {candidate.title}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** An engineer's detail, open: the panel is where it was asked for. */
function SideDetail({ block }: { block: DetailBlock }) {
  return (
    <section className="flex flex-col gap-2">
      <Text as="h3" size="sm" weight="bold">
        {block.title}
      </Text>
      <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {block.body.map((item, position) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: blocks are a fixed positional sequence parsed from one immutable source; position is their identity.
          <BlockView block={item} key={`${item.type}-${position}`} />
        ))}
      </div>
    </section>
  );
}

/** One case: its title and the rules it checks, its steps a click away. */
function CaseCard({
  testCase,
  rules,
}: {
  testCase: TestCase;
  rules: string[];
}) {
  const { index } = useBlockScope();
  return (
    <Collapsible
      badge={
        <span className="flex flex-wrap items-center gap-1">
          {rules.map((rule) => (
            <Badge key={rule} size="sm" variant="outline">
              {humanize(rule)}
            </Badge>
          ))}
        </span>
      }
      id={`case-${testCase.id.replace(/\W+/g, "-").toLowerCase()}`}
      linkLabel="Copy link to this case"
      title={testCase.title}
    >
      <div className="flex flex-col gap-2 border-border-subtle border-t px-4 py-3">
        <Text as="p" face="mono" size="xs" tone="secondary">
          {testCase.id}
          {testCase.severity ? ` · ${testCase.severity}` : ""}
        </Text>
        <MarkdownView
          baseDir={dirOf(testCase.suite)}
          className="text-sm"
          index={index}
          text={testCase.body}
        />
      </div>
    </Collapsible>
  );
}
