import { Alert } from "@grade10/design-system/components/display/alert";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import {
  Drawer,
  DrawerContent,
} from "@grade10/design-system/components/overlays/drawer";
import {
  CaretLeft,
  CaretRight,
  ListBullets,
  Warning,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import {
  type Mark,
  type MarkValue,
  type RowObjects,
  type RunRow,
  SURFACES,
  type Surface,
} from "../api/desk";
import { useManualIndex } from "../api/use-manual-index";
import { bugReportUrl } from "../desk/bug-report";
import { handleOf } from "../desk/checks";
import { newId } from "../desk/client";
import {
  amend,
  type CaseSort,
  type Counts,
  canRerun,
  caseLabels,
  expectationChoices,
  type Filters,
  firstRow,
  focusOf,
  keyCommand,
  markCommand,
  markSaid,
  nextRow,
  pageGroups,
  plural,
  readRun,
  shownCases,
  sortCases,
  stepCase,
  surfaceCounts,
  walkCases,
  walkGroups,
} from "../desk/model";
import { useSurface } from "../desk/surface";
import { CasePane, type FailAsk } from "../desk/ui/case-pane";
import { RunHeader } from "../desk/ui/run-header";
import { DESK_SEARCH_ID, type RowPick, RunList } from "../desk/ui/run-list";
import { Toolbar } from "../desk/ui/toolbar";
import { WalkPane } from "../desk/ui/walk-pane";
import { useDesk } from "../desk/use-desk";
import { useRun } from "../desk/use-run";
import { useLayout } from "../shell/layout";
import { useDocumentTitle } from "./use-document-title";

/** Desk keys act only where the desk is, or where nothing has focus: a key
 * pressed on the manual's own links and fields stays theirs. */
const inDesk = (target: EventTarget | null): boolean =>
  target === null ||
  target === document.body ||
  target === document.documentElement ||
  (target instanceof Element && target.closest("[data-desk-keys]") !== null);

const typing = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
    target.closest("[role=dialog],[role=menu],[role=listbox]") !== null);

/** One run: the list beside the case being walked. */
export function RunPage() {
  const { id = "" } = useParams();
  useDocumentTitle(`Run ${id}`);
  const desk = useDesk();
  const index = useManualIndex();
  const team = index.snapshot.team;
  const [me, setMe] = useState("");
  useEffect(() => {
    desk?.me().then(
      (who) => setMe(who.email),
      (cause: unknown) =>
        console.error("desk could not say who is signed in", cause),
    );
  }, [desk]);
  const run = useRun(desk, id, me);

  if (run.error && !run.view)
    return (
      <div className="py-10">
        <EmptyState
          description={run.error}
          icon={<Warning aria-hidden />}
          title={`Run ${id} cannot be read`}
          actions={
            <Button
              nativeButton={false}
              render={<Link to="/runs" />}
              size="sm"
              variant="outline"
            >
              All runs
            </Button>
          }
        />
      </div>
    );
  if (!run.view)
    return (
      <Text as="p" className="py-10" size="sm" tone="secondary">
        Reading run {id}…
      </Text>
    );
  return (
    <Desk handle={run} id={id} me={me} who={(email) => handleOf(email, team)} />
  );
}

function Desk({
  id,
  handle,
  me,
  who,
}: {
  id: string;
  handle: ReturnType<typeof useRun>;
  me: string;
  who: (email: string) => string;
}) {
  const view = handle.view as NonNullable<typeof handle.view>;
  const index = useManualIndex();
  const layout = useLayout();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [surface, setSurface] = useSurface();
  const [filters, setFilters] = useState<Filters>({});
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<CaseSort>("run");
  const [said, setSaid] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [ask, setAsk] = useState<FailAsk | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [fetched, setFetched] = useState<{ row: string; marks: Mark[] } | null>(
    null,
  );

  // A run is walked beside its list, not the manual's: the rail folds while
  // the desk is open and comes back on leaving, unless it was folded before.
  // biome-ignore lint/correctness/useExhaustiveDependencies: once, on entering the desk
  useEffect(() => {
    if (!layout.wide || layout.navCollapsed) return;
    layout.setNavCollapsed(true);
    return () => layout.setNavCollapsed(false);
  }, []);

  const reading = useMemo(() => readRun(view), [view]);
  const shown = useMemo(
    () => shownCases(reading, filters, surface, query),
    [reading, filters, surface, query],
  );
  const pageTitle = useCallback(
    (path: string) =>
      index.pageByPath.get(path)?.ast?.frontmatter.title ??
      path.slice(path.lastIndexOf("/") + 1).replace(/\.md$/, ""),
    [index],
  );
  const pages = useMemo(
    () =>
      pageGroups(view.spec, pageTitle).map((page) => ({
        ...page,
        sections: page.sections.map((section) => ({
          ...section,
          cases: sortCases(section.cases, sort),
        })),
      })),
    [view.spec, pageTitle, sort],
  );
  const labels = useMemo(() => caseLabels(view.spec.cases), [view.spec.cases]);
  const walks = useMemo(() => walkGroups(reading, surface), [reading, surface]);
  const counts = useMemo(
    () =>
      Object.fromEntries(
        SURFACES.map((one) => [one, surfaceCounts(reading, one)]),
      ) as Record<Surface, Counts>,
    [reading],
  );
  const phaseName = (phase: string) =>
    index.snapshot.phases?.find((one) => one.id === phase)?.name ?? phase;

  const walkId = params.get("walk");
  const walk = view.spec.walks.find((one) => one.id === walkId) ?? null;
  const listOrder = useMemo(
    () =>
      pages
        .flatMap((page) =>
          page.sections.flatMap((section) =>
            section.cases.map((one) => one.id),
          ),
        )
        .filter((one) => shown.has(one)),
    [pages, shown],
  );
  const order = walk ? walkCases(view.spec, walk.id) : listOrder;
  const focused = focusOf(reading, order, {
    case: params.get("case"),
    row: params.get("row"),
    walk: walk !== null,
  });
  const caseId = focused.case;
  const rowKey = focused.row;
  const testCase = caseId ? reading.caseById.get(caseId) : undefined;
  const row = rowKey ? reading.rowByKey.get(rowKey) : undefined;
  const closed = view.run.state === "closed";
  // Keys pressed faster than the page renders act on where the last key
  // moved focus, never on the case shown a moment before.
  const held = useRef({ case: caseId, row: rowKey });
  held.current = { case: caseId, row: rowKey };

  const focus = useCallback(
    (next: {
      case?: string | null;
      row?: string | null;
      walk?: string | null;
    }) => {
      if ("case" in next || "row" in next)
        held.current = {
          case: next.case ?? null,
          row: next.row ?? null,
        };
      setParams(
        (held) => {
          const out = new URLSearchParams(held);
          for (const [key, value] of Object.entries(next)) {
            if (value) out.set(key, value);
            else out.delete(key);
          }
          return out;
        },
        { replace: true },
      );
      setAsk(null);
    },
    [setParams],
  );

  const rowLabel = useCallback(
    (key: string) => {
      const one = reading.rowByKey.get(key);
      if (!one) return key;
      return `${labels.get(one.case) ?? one.case} row ${one.index || 1}`;
    },
    [reading, labels],
  );

  const sendMark = useCallback(
    (value: MarkValue) => {
      if (closed) {
        setNotice("The run is closed; marking has ended.");
        return;
      }
      const now = held.current;
      const target = now.case ? reading.caseById.get(now.case) : undefined;
      const command = markCommand({
        value,
        surface,
        focus: now.row,
        selected: [...selected],
        hasExpectations: target ? expectationChoices(target).length > 0 : false,
        makeId: newId,
      });
      if (command.kind === "refused") setNotice(command.reason);
      else if (command.kind === "ask-expectation") setAsk({ row: command.row });
      else {
        handle.mark(command.marks);
        setSaid(markSaid(command.marks, rowLabel));
        setSelected(new Set());
        setNotice(null);
      }
    },
    [closed, surface, selected, reading, handle, rowLabel],
  );

  const choices = testCase ? expectationChoices(testCase, row) : [];
  const pickExpectation = useCallback(
    (expectation: number | undefined) => {
      if (!ask) return;
      const marks = [
        {
          id: newId(),
          row: ask.row,
          surface,
          value: "fail" as const,
          ...(expectation !== undefined ? { expectation } : {}),
        },
      ];
      handle.mark(marks);
      setSaid(markSaid(marks, rowLabel));
      setAsk(null);
    },
    [ask, handle, surface, rowLabel],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        typing(event.target) ||
        !inDesk(event.target)
      )
        return;
      if (event.key === "/" && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        const search = document.getElementById(DESK_SEARCH_ID);
        if (search && search.offsetParent !== null) search.focus();
        else {
          setListOpen(true);
          setTimeout(() => document.getElementById(DESK_SEARCH_ID)?.focus());
        }
        return;
      }
      if (ask) {
        if (/^[1-9]$/.test(event.key)) {
          const choice = choices[Number(event.key) - 1];
          if (choice) {
            event.preventDefault();
            pickExpectation(choice.index);
          }
        } else if (event.key === "Enter") {
          event.preventDefault();
          pickExpectation(undefined);
        } else if (event.key === "Escape") {
          event.preventDefault();
          setAsk(null);
        }
        return;
      }
      const command = keyCommand(event);
      if (!command) return;
      if (
        command.kind === "row" &&
        event.target instanceof HTMLElement &&
        event.target.closest("button,a") &&
        !event.target.closest("[data-slot=run-list]")
      )
        return;
      event.preventDefault();
      const at = held.current;
      if (command.kind === "case") {
        const next = stepCase(order, at.case, command.step);
        if (next) focus({ case: next, row: firstRow(reading, next) });
      } else if (command.kind === "row") {
        const next = nextRow(reading, order, at);
        focus({ case: next.case, row: next.row });
      } else if (command.kind === "mark") sendMark(command.value);
      else if (command.kind === "select") {
        const key = at.row;
        if (!key) return;
        setSelected((chosen) => {
          const out = new Set(chosen);
          if (out.has(key)) out.delete(key);
          else out.add(key);
          return out;
        });
      } else if (command.kind === "clear") {
        setSelected(new Set());
        setNotice(null);
      } else if (command.kind === "list") setListOpen((open) => !open);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ask, choices, pickExpectation, order, reading, focus, sendMark]);

  const pickRow = ({ row: key, extend }: RowPick) => {
    const owner = reading.rowByKey.get(key)?.case ?? null;
    if (extend)
      setSelected((held) => {
        const out = new Set(held);
        if (rowKey && out.size === 0) out.add(rowKey);
        if (out.has(key)) out.delete(key);
        else out.add(key);
        return out;
      });
    focus({ case: owner, row: key });
  };

  const download = async (what: "csv" | "record") => {
    const file = await handle.act((desk) => desk.download(id, what));
    if (!file) return;
    const url = URL.createObjectURL(file.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1_000);
  };

  const historyOf = (key: string): Mark[] | null => {
    const seen = handle.seen.get(key) ?? [];
    if (!fetched || fetched.row !== key) return seen.length > 0 ? seen : null;
    const all = new Map(
      [...fetched.marks, ...seen].map((mark) => [mark.id, mark]),
    );
    return [...all.values()].sort((a, b) => a.seq - b.seq);
  };

  const bugUrl = (target: RunRow, mark: Mark) =>
    testCase
      ? bugReportUrl({
          testCase,
          row: target,
          run: view.run,
          surface: mark.surface,
          expectation: choices.find((one) => one.index === mark.expectation)
            ?.text,
          objects: view.objects[target.key] ?? {},
          note: mark.note,
          back: `${window.location.origin}/runs/${encodeURIComponent(id)}?case=${encodeURIComponent(target.case)}&row=${encodeURIComponent(target.key)}`,
          browser: `${navigator.userAgent.slice(0, 120)} · ${window.innerWidth}px wide`,
        })
      : "";

  const sections = new Set(
    view.spec.cases.map(
      (one) => `${one.page ?? one.suite}#${one.section ?? ""}`,
    ),
  ).size;
  const rerunnable = canRerun(reading);

  const list = (
    <RunList
      activeWalk={walk?.id ?? null}
      focusCase={caseId}
      focusRow={rowKey}
      onCase={(next) => {
        focus({ case: next, row: firstRow(reading, next) });
        setListOpen(false);
      }}
      onRow={(pick) => {
        pickRow(pick);
        if (!pick.extend) setListOpen(false);
      }}
      onWalk={(next) => {
        focus({ walk: next, case: null, row: null });
        setListOpen(false);
      }}
      pages={pages}
      onQuery={setQuery}
      pendingMarks={handle.pendingMarks}
      query={query}
      reading={reading}
      selected={selected}
      shown={shown}
      surface={surface}
      walks={walks}
    />
  );

  const notices = [
    ...handle.notices.map((text, at) => ({ text, at })),
    ...(notice ? [{ text: notice, at: -1 }] : []),
    ...(focused.unknown
      ? [
          {
            text: `Run ${id} holds no case ${focused.unknown}. Choose one from the list; no key marks anything until you do.`,
            at: -2,
          },
        ]
      : []),
  ];
  const step = (by: 1 | -1) => {
    const next = stepCase(order, caseId, by);
    if (next) focus({ case: next, row: firstRow(reading, next) });
  };

  return (
    <div
      className="flex min-w-0 flex-col gap-3 pb-16 max-lg:gap-2"
      data-desk-keys
      data-slot="run-desk"
    >
      <p aria-live="polite" className="sr-only" data-slot="desk-said">
        {said}
      </p>
      <RunHeader
        canRerun={rerunnable}
        counts={counts}
        onDownload={download}
        onRerun={async () => {
          const next = await handle.act((desk) => desk.rerun(id));
          if (next) navigate(`/runs/${encodeURIComponent(next.id)}`);
        }}
        onState={async (state) => {
          if (await handle.act((desk) => desk.setState(id, state)))
            handle.reload();
        }}
        run={view.run}
        sections={sections}
        status={handle.status}
        surface={surface}
        waiting={handle.waiting}
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Toolbar
          filters={filters}
          onFilter={(key, values) =>
            setFilters((held) => ({ ...held, [key]: values }))
          }
          onSort={setSort}
          onSurface={setSurface}
          phaseName={phaseName}
          reading={reading}
          shown={shown.size}
          sort={sort}
          surface={surface}
        />
        <Text as="span" size="xs" tone="secondary">
          <span className="max-lg:hidden">
            {me ? `Signed in as ${who(me)}` : null}
            {me && selected.size > 0 ? " · " : ""}
          </span>
          {selected.size > 0 ? `${plural(selected.size, "row")} selected` : ""}
        </Text>
      </div>
      {notices.map(({ text, at }) => (
        <Alert
          dismissible
          key={`${at}-${text}`}
          layout="inline"
          onDismiss={() =>
            at === -2
              ? focus({ case: null, row: null })
              : at === -1
                ? setNotice(null)
                : handle.dismiss(at)
          }
          role="alert"
          status="warning"
          title={text}
        />
      ))}

      <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[18.75rem_minmax(0,1fr)]">
        {layout.wide ? (
          <div
            className="sticky top-20 max-h-[calc(100dvh-6rem)] min-w-0 overflow-y-auto"
            data-desk-scroll
          >
            {list}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <Button
                onClick={() => setListOpen(true)}
                size="sm"
                variant="outline"
              >
                <ListBullets aria-hidden /> Cases
              </Button>
              <div className="flex gap-1">
                <Button
                  aria-label="Previous case"
                  onClick={() => step(-1)}
                  size="sm"
                  variant="ghost"
                >
                  <CaretLeft aria-hidden />
                </Button>
                <Button
                  aria-label="Next case"
                  onClick={() => step(1)}
                  size="sm"
                  variant="ghost"
                >
                  <CaretRight aria-hidden />
                </Button>
              </div>
            </div>
            <Drawer
              onOpenChange={setListOpen}
              open={listOpen}
              swipeDirection="left"
            >
              <DrawerContent
                className="[--drawer-content-width:min(22rem,calc(100vw-2rem))]"
                data-desk-keys
              >
                <div
                  className="min-h-0 flex-1 overflow-y-auto p-2"
                  data-desk-scroll
                >
                  {list}
                </div>
              </DrawerContent>
            </Drawer>
          </>
        )}

        {walk && !testCase ? (
          <WalkPane
            closed={closed}
            onCase={(next) =>
              focus({ case: next, row: firstRow(reading, next) })
            }
            onLeave={() => focus({ walk: null })}
            onObserve={(stepAt, seen) =>
              handle.observe([
                { id: newId(), walk: walk.id, step: stepAt, seen },
              ])
            }
            reading={reading}
            surface={surface}
            walk={walk}
          />
        ) : testCase ? (
          <div className="flex min-w-0 flex-col gap-3">
            {walk ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-(--radius-lg) border border-border border-dashed px-3 py-2">
                <Text as="span" size="xs" tone="secondary">
                  {walk.title} · case {order.indexOf(testCase.id) + 1} of{" "}
                  {order.length}, in route order
                </Text>
                <Button
                  onClick={() => focus({ case: null, row: null })}
                  size="sm"
                  variant="ghost"
                >
                  Back to the walk
                </Button>
              </div>
            ) : null}
            <CasePane
              ask={ask}
              bugUrl={bugUrl}
              choices={choices}
              closed={closed}
              focusRow={rowKey}
              handleOf={who}
              history={rowKey ? historyOf(rowKey) : null}
              index={index}
              onAmend={(mark, patch) =>
                handle.mark([amend(mark, patch, newId)])
              }
              onCancelAsk={() => setAsk(null)}
              onExpectation={pickExpectation}
              onHistory={async (key) => {
                const found = await handle.act((desk) => desk.history(id, key));
                setFetched({ row: key, marks: found?.marks ?? [] });
              }}
              onMark={sendMark}
              onObjects={(key: string, objects: RowObjects) =>
                handle.putObjects(key, objects)
              }
              onRow={(key) => focus({ case: caseId, row: key })}
              pendingMarks={handle.pendingMarks}
              reading={reading}
              surface={surface}
              testCase={testCase}
            />
          </div>
        ) : focused.unknown ? (
          <EmptyState
            description="Choose a case from the list to mark it."
            title={`No case ${focused.unknown} in this run`}
          />
        ) : (
          <EmptyState
            description="Clear a filter or the search to see the run's cases again."
            title="No case shows"
          />
        )}
      </div>
    </div>
  );
}
