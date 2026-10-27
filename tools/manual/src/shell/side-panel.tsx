import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Text } from "@grade10/design-system/components/display/text";
import { AppWindow, Code, ListChecks } from "@phosphor-icons/react";
import {
  type CSSProperties,
  type ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { dirOf, humanize } from "../api/paths";
import type { PageCases, TestCase } from "../api/suites";
import { BlockList } from "../blocks/block-list";
import { useBlockScope } from "../blocks/block-scope";
import { BlockView } from "../blocks/block-view";
import { Collapsible } from "../blocks/collapsible";
import { MarkdownView } from "../blocks/markdown";
import {
  type SectionRow,
  SIDE_TABS,
  type SideItem,
  type SideTab,
} from "../blocks/side-blocks";
import type { DetailBlock } from "../content/grammar";
import { clamp, PAGE_MIN_WIDTH, PANEL_WIDTH, useLayout } from "./layout";
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

/** The space between the two columns; the handle sits in its middle. */
const GAP = 40;

type CaseRow = { testCase: TestCase; rules: string[] };

/** What one section shows beside it, tab by tab. */
type Shelf = Record<"ui" | "tech", SideItem[]> & { qa: CaseRow[] };

function shelfOf(row: SectionRow, cases: PageCases): Shelf {
  return {
    ui: row.side.filter((item) => item.tab === "ui"),
    tech: row.side.filter((item) => item.tab === "tech"),
    qa: [
      ...(cases.bySection.get(row.section) ?? []),
      // The cases that trace the page as a whole sit by its opening.
      ...(row.section === ""
        ? cases.page.map((testCase) => ({ testCase, rules: [] }))
        : []),
    ],
  };
}

const isEmpty = (shelf: Shelf) =>
  SIDE_TABS.every((tab) => shelf[tab].length === 0);

/** Whether a page has anything to read beside it. */
export function hasSide(rows: SectionRow[], cases: PageCases): boolean {
  return rows.some((row) => !isEmpty(shelfOf(row, cases)));
}

/**
 * A page read in two columns, one row a section, in the one scroll the page
 * already has. Each section's side holds still beside it while the section
 * is read, and leaves with it.
 */
export function SplitPage({
  head,
  rows,
  cases,
  children,
}: {
  head: ReactNode;
  rows: SectionRow[];
  cases: PageCases;
  children?: ReactNode;
}) {
  const layout = useLayout();
  const frame = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<number | null>(null);
  const { setSideShown } = layout;
  const max = () => (frame.current?.clientWidth ?? 0) - PAGE_MIN_WIDTH;
  const width = draft ?? layout.panelWidth;

  useLayoutEffect(() => {
    setSideShown(true);
    return () => setSideShown(false);
  }, [setSideShown]);

  return (
    <div
      className="relative"
      ref={frame}
      style={{ "--side-width": `${width}px` } as CSSProperties}
    >
      <div style={{ marginRight: width + GAP }}>{head}</div>
      {rows.map((row) => {
        const shelf = shelfOf(row, cases);
        return (
          <div
            className="grid grid-cols-[minmax(0,1fr)_var(--side-width)]"
            data-section={row.section || undefined}
            key={row.section || "opening"}
            style={{ columnGap: GAP }}
          >
            <div className="min-w-0">
              <BlockList blocks={row.main} />
            </div>
            <div className="min-w-0">
              {isEmpty(shelf) ? null : (
                <div className="sticky top-20 py-4">
                  <SideCard shelf={shelf} />
                </div>
              )}
            </div>
          </div>
        );
      })}
      {children ? (
        <div style={{ marginRight: width + GAP }}>{children}</div>
      ) : null}
      <ResizeHandle
        className="absolute inset-y-0 top-0 h-auto"
        grows={-1}
        label="Resize the side column"
        max={max()}
        min={PANEL_WIDTH.min}
        onCommit={(next) => {
          setDraft(null);
          layout.setPanelWidth(clamp(next, PANEL_WIDTH.min, max()));
        }}
        onMove={(next) => setDraft(clamp(next, PANEL_WIDTH.min, max()))}
        style={{ right: width + GAP / 2 }}
        width={width}
      />
    </div>
  );
}

const EMPTY: Record<SideTab, string> = {
  ui: "No story or design in this section.",
  tech: "No engineering detail in this section.",
  qa: "No test case traces this section.",
};

/** One section's side: the tabs, shared across the page, and what this
 * section holds under each. */
function SideCard({ shelf }: { shelf: Shelf }) {
  const layout = useLayout();
  return (
    <Tabs
      className="rounded-(--radius-xl) border border-border bg-background"
      onValueChange={(value) => layout.setTab(value as SideTab)}
      value={layout.tab}
    >
      <TabsList className="px-2" fullWidth size="sm" variant="list">
        {SIDE_TABS.map((tab) => (
          <TabsTrigger className="gap-1.5" key={tab} value={tab}>
            {TAB_ICON[tab]}
            {TAB_LABEL[tab]}
            {shelf[tab].length > 0 ? (
              <Badge size="sm" variant="outline">
                {shelf[tab].length}
              </Badge>
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>

      {SIDE_TABS.map((tab) => (
        <TabsContent
          className="flex max-h-[calc(100dvh-9rem)] flex-col gap-3 overflow-y-auto overscroll-contain p-3 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]"
          key={tab}
          value={tab}
        >
          {tab === "qa"
            ? shelf.qa.map(({ testCase, rules }) => (
                <CaseCard key={testCase.id} rules={rules} testCase={testCase} />
              ))
            : shelf[tab].map((item, position) =>
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
              )}
          {shelf[tab].length === 0 ? (
            <Text as="p" className="px-1 py-2" size="sm" tone="secondary">
              {EMPTY[tab]}
            </Text>
          ) : null}
        </TabsContent>
      ))}
    </Tabs>
  );
}

/** An engineer's detail, open: the side is where it was asked for. */
function SideDetail({ block }: { block: DetailBlock }) {
  return (
    <section className="flex flex-col gap-2 px-1">
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
function CaseCard({ testCase, rules }: CaseRow) {
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
