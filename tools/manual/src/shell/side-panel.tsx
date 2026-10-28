import { Badge } from "@grade10/design-system/components/display/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@grade10/design-system/components/display/tabs";
import { Text } from "@grade10/design-system/components/display/text";
import { AppWindow, Code, ListChecks } from "@phosphor-icons/react";
import {
  type CSSProperties,
  type ReactNode,
  use,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { PageCases } from "../api/suites";
import { BlockList } from "../blocks/block-list";
import { BlockView } from "../blocks/block-view";
import { BareEmbedContext } from "../blocks/embed-block";
import {
  rulesOf,
  type SectionRow,
  type SectionRule,
  SIDE_TABS,
  type SideItem,
  type SideTab,
} from "../blocks/side-blocks";
import type { DetailBlock } from "../content/grammar";
import { CaseList, type CaseRow } from "./case-list";
import { clamp, PAGE_MIN_WIDTH, PANEL_WIDTH, useLayout } from "./layout";
import { PageSectionsContext } from "./page-sections";
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

/** What one section shows beside it, tab by tab. */
type Shelf = Record<"ui" | "tech", SideItem[]> & {
  qa: CaseRow[];
  /** The rules the section names, which its cases are filed under. */
  rules: SectionRule[];
};

function shelfOf(row: SectionRow, cases: PageCases): Shelf {
  return {
    ui: row.side.filter((item) => item.tab === "ui"),
    tech: row.side.filter((item) => item.tab === "tech"),
    rules: rulesOf(row.main),
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

/** How many items each tab holds across the page. */
function tabTotals(shelves: Shelf[]): Record<SideTab, number> {
  const total = (tab: SideTab) =>
    shelves.reduce((sum, shelf) => sum + shelf[tab].length, 0);
  return { ui: total("ui"), tech: total("tech"), qa: total("qa") };
}

/**
 * A page read in one column while the rail is open. Hovering a section shows,
 * at its right, a button for each tab it has something under; hovering one
 * peeks at it, and choosing one folds the rail, which opens the column on it.
 */
export function HintedPage({
  rows,
  cases,
}: {
  rows: SectionRow[];
  cases: PageCases;
}) {
  return rows.map((row) => (
    <div
      className="group/section relative mt-6"
      data-section={row.section || undefined}
      key={row.section || "opening"}
    >
      <BlockList blocks={row.main} />
      <SectionHint section={row.section} shelf={shelfOf(row, cases)} />
    </div>
  ));
}

/** One section's tabs, held beside it while it is read. */
function SectionHint({ section, shelf }: { section: string; shelf: Shelf }) {
  const layout = useLayout();
  const { sections } = use(PageSectionsContext);
  const [peek, setPeek] = useState<SideTab | null>(null);
  const tabs = SIDE_TABS.filter((tab) => shelf[tab].length > 0);
  if (tabs.length === 0) return null;
  const title =
    sections.find((found) => found.id === section)?.title ?? "Opening";

  return (
    <div className="absolute inset-y-0 left-full ml-3 max-lg:hidden">
      <nav
        aria-label={`Beside ${title}`}
        className={`sticky top-32 flex flex-col gap-0.5 rounded-(--radius-xl) border border-border bg-popover p-1 shadow-sm transition-opacity duration-150 group-hover/section:opacity-100 focus-within:opacity-100 motion-reduce:transition-none ${
          peek ? "opacity-100" : "opacity-0"
        }`}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setPeek(null);
        }}
        onMouseLeave={() => setPeek(null)}
      >
        {tabs.map((tab) => (
          <button
            aria-label={`Open ${TAB_LABEL[tab]} beside the page, ${shelf[tab].length}`}
            className={`relative flex size-7 cursor-pointer items-center justify-center rounded-(--radius-md) outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 ${
              peek === tab
                ? "bg-muted text-foreground"
                : "text-secondary-foreground"
            }`}
            key={tab}
            onClick={() => {
              layout.setTab(tab);
              layout.setNavCollapsed(true);
              // The page reflows into two columns; the section stays in view.
              window.requestAnimationFrame(() =>
                window.requestAnimationFrame(() =>
                  document
                    .getElementById(section)
                    ?.scrollIntoView({ block: "start" }),
                ),
              );
            }}
            onFocus={() => setPeek(tab)}
            onMouseEnter={() => setPeek(tab)}
            type="button"
          >
            {TAB_ICON[tab]}
            <span className="-top-1 -right-1 absolute min-w-3.5 rounded-full bg-muted px-0.5 text-center text-[9px] tabular-nums leading-3.5">
              {shelf[tab].length}
            </span>
          </button>
        ))}
        {/* Padded rather than spaced, so the pointer crosses onto it without
            leaving the tab. */}
        {peek ? (
          <div className="absolute top-0 right-full z-30 pr-2">
            <div className="flex max-h-[70vh] w-md flex-col overflow-y-auto overscroll-contain rounded-(--radius-xl) border border-border bg-popover p-3 shadow-lg [scrollbar-width:thin]">
              <Text as="p" size="xs" tone="secondary" weight="medium">
                {TAB_LABEL[peek]} · {title}
              </Text>
              <BareEmbedContext value>
                <SideList shelf={shelf} tab={peek} />
              </BareEmbedContext>
            </div>
          </div>
        ) : null}
      </nav>
    </div>
  );
}

/** The site header's height. */
const HEADER_HEIGHT = 64;
/** How far down the screen below the header a section's heading has to pass
 * to be the one being read. */
const READING_LINE = 0.3;

/** Room below a page's end, so its last section can scroll up to the
 * reading line. */
export function ReadingRunout() {
  return (
    <div
      aria-hidden
      style={{
        height: `calc((100vh - ${HEADER_HEIGHT}px) * ${1 - READING_LINE})`,
      }}
    />
  );
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

  const shelves = rows.map((row) => shelfOf(row, cases));
  const totals = tabTotals(shelves);

  return (
    <div
      className="relative"
      ref={frame}
      style={{ "--side-width": `${width}px` } as CSSProperties}
    >
      {/* The one switcher, held at the top of the side column for the whole
          page. It takes no height, so the page's opening reads beside it. */}
      <div className="sticky top-16 z-10 flex h-0 items-start justify-end">
        <Tabs
          className="border-border border-b bg-background pt-2 shadow-[0_8px_12px_-12px_var(--shadow-color)]"
          onValueChange={(value) => layout.setTab(value as SideTab)}
          style={{ width }}
          value={layout.tab}
        >
          <TabsList fullWidth size="sm" variant="list">
            {SIDE_TABS.map((tab) => (
              <TabsTrigger className="gap-1.5 mb-2" key={tab} value={tab}>
                {TAB_ICON[tab]}
                {TAB_LABEL[tab]}
                {totals[tab] > 0 ? (
                  <Badge size="sm" variant="outline">
                    {totals[tab]}
                  </Badge>
                ) : null}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <div style={{ marginRight: width + GAP }}>{head}</div>
      {rows.map((row, position) => {
        const shelf = shelves[position];
        return (
          <div
            className="grid grid-cols-[minmax(0,1fr)_var(--side-width)] mt-6"
            data-section={row.section || undefined}
            key={row.section || "opening"}
            style={{ columnGap: GAP }}
          >
            <div className="min-w-0">
              <BlockList blocks={row.main} />
            </div>
            <div className="min-w-0">
              {/* Blank where the section has nothing under the tab. */}
              {shelf[layout.tab].length > 0 ? (
                <BareEmbedContext value>
                  <SideItems shelf={shelf} tab={layout.tab} />
                </BareEmbedContext>
              ) : null}
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

/** What one section holds under the tab, held below the switcher while the
 * section is read. A side taller than the screen scrolls, or its end could
 * never be reached while it is held. */
function SideItems({ shelf, tab }: { shelf: Shelf; tab: SideTab }) {
  return (
    <div className="sticky top-30 overflow-y-auto overscroll-contain py-4 [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin]">
      <SideList shelf={shelf} tab={tab} />
    </div>
  );
}

/** One section's items under one tab. */
function SideList({ shelf, tab }: { shelf: Shelf; tab: SideTab }) {
  return (
    <div className="flex flex-col gap-3">
      {tab === "qa" ? (
        <CaseList rows={shelf.qa} rules={shelf.rules} />
      ) : (
        shelf[tab].map((item, position) =>
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
    </div>
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
