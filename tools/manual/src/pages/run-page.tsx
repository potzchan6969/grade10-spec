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
import { useCallback, useEffect, useMemo, useState } from "react";
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
  type Counts,
  expectationChoices,
  type Filters,
  firstRow,
  keyCommand,
  markCommand,
  nextRow,
  pageGroups,
  readRun,
  shownCases,
  stepCase,
  surfaceCounts,
  walkCases,
  walkGroups,
} from "../desk/model";
import { useSurface } from "../desk/surface";
import { CasePane, type FailAsk } from "../desk/ui/case-pane";
import { RunHeader } from "../desk/ui/run-header";
import { type RowPick, RunList } from "../desk/ui/run-list";
import { Toolbar } from "../desk/ui/toolbar";
import { WalkPane } from "../desk/ui/walk-pane";
import { useDesk } from "../desk/use-desk";
import { useRun } from "../desk/use-run";
import { useLayout } from "../shell/layout";
import { useDocumentTitle } from "./use-document-title";

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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [ask, setAsk] = useState<FailAsk | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [fetched, setFetched] = useState<{ row: string; marks: Mark[] } | null>(
    null,
  );

  const reading = useMemo(() => readRun(view), [view]);
  const shown = useMemo(
    () => shownCases(reading, filters, surface),
    [reading, filters, surface],
  );
  const pageTitle = useCallback(
    (path: string) =>
      index.pageByPath.get(path)?.ast?.frontmatter.title ??
      path.slice(path.lastIndexOf("/") + 1).replace(/\.md$/, ""),
    [index],
  );
  const pages = useMemo(
    () => pageGroups(view.spec, pageTitle),
    [view.spec, pageTitle],
  );
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
  const caseId =
    params.get("case") && reading.caseById.has(params.get("case") as string)
      ? (params.get("case") as string)
      : walk
        ? null
        : (order[0] ?? null);
  const rowKey =
    params.get("row") &&
    reading.rowByKey.get(params.get("row") as string)?.case === caseId
      ? (params.get("row") as string)
      : caseId
        ? firstRow(reading, caseId)
        : null;
  const testCase = caseId ? reading.caseById.get(caseId) : undefined;
  const row = rowKey ? reading.rowByKey.get(rowKey) : undefined;
  const closed = view.run.state === "closed";

  const focus = useCallback(
    (next: {
      case?: string | null;
      row?: string | null;
      walk?: string | null;
    }) => {
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

  const sendMark = useCallback(
    (value: MarkValue) => {
      if (closed) {
        setNotice("The run is closed; marking has ended.");
        return;
      }
      const command = markCommand({
        value,
        surface,
        focus: rowKey,
        selected: [...selected],
        hasExpectations: testCase
          ? expectationChoices(testCase, row).length > 0
          : false,
        makeId: newId,
      });
      if (command.kind === "refused") setNotice(command.reason);
      else if (command.kind === "ask-expectation") setAsk({ row: command.row });
      else {
        handle.mark(command.marks);
        setSelected(new Set());
        setNotice(null);
      }
    },
    [closed, surface, rowKey, selected, testCase, row, handle],
  );

  const choices = testCase ? expectationChoices(testCase, row) : [];
  const pickExpectation = useCallback(
    (expectation: number | undefined) => {
      if (!ask) return;
      handle.mark([
        {
          id: newId(),
          row: ask.row,
          surface,
          value: "fail",
          ...(expectation !== undefined ? { expectation } : {}),
        },
      ]);
      setAsk(null);
    },
    [ask, handle, surface],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || typing(event.target)) return;
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
      if (command.kind === "case") {
        const next = stepCase(order, caseId, command.step);
        if (next) focus({ case: next, row: firstRow(reading, next) });
      } else if (command.kind === "row") {
        const next = nextRow(reading, order, { case: caseId, row: rowKey });
        focus({ case: next.case, row: next.row });
      } else if (command.kind === "mark") sendMark(command.value);
      else if (command.kind === "select") {
        if (!rowKey) return;
        setSelected((held) => {
          const out = new Set(held);
          if (out.has(rowKey)) out.delete(rowKey);
          else out.add(rowKey);
          return out;
        });
      } else if (command.kind === "clear") {
        setSelected(new Set());
        setNotice(null);
      } else if (command.kind === "list") setListOpen((open) => !open);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    ask,
    choices,
    pickExpectation,
    order,
    caseId,
    rowKey,
    reading,
    focus,
    sendMark,
  ]);

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
  const canRerun = view.rows.some((one) =>
    SURFACES.some((each) =>
      ["fail", "blocked"].includes(
        reading.current.get(one.key)?.[each]?.value ?? "",
      ),
    ),
  );

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
      pendingMarks={handle.pendingMarks}
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
  ];
  const step = (by: 1 | -1) => {
    const next = stepCase(order, caseId, by);
    if (next) focus({ case: next, row: firstRow(reading, next) });
  };

  return (
    <div className="flex min-w-0 flex-col gap-3 pb-16" data-slot="run-desk">
      <RunHeader
        canRerun={canRerun}
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
          onFilter={(key, value) =>
            setFilters((held) => ({ ...held, [key]: value }))
          }
          onSurface={setSurface}
          phaseName={phaseName}
          reading={reading}
          shown={shown.size}
          surface={surface}
        />
        <Text as="span" size="xs" tone="secondary">
          {me ? `Signed in as ${who(me)}` : null}
          {selected.size > 0 ? ` · ${selected.size} rows selected` : ""}
        </Text>
      </div>
      {notices.map(({ text, at }) => (
        <Alert
          dismissible
          key={`${at}-${text}`}
          layout="inline"
          onDismiss={() => (at === -1 ? setNotice(null) : handle.dismiss(at))}
          role="alert"
          status="warning"
          title={text}
        />
      ))}

      <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-[18.75rem_minmax(0,1fr)]">
        {layout.wide ? (
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] min-w-0 overflow-y-auto">
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
              <DrawerContent className="[--drawer-content-width:min(22rem,calc(100vw-2rem))]">
                <div className="min-h-0 flex-1 overflow-y-auto p-2">{list}</div>
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
        ) : (
          <EmptyState
            description="Clear a filter to see the run's cases again."
            title="No case shows"
          />
        )}
      </div>
    </div>
  );
}
