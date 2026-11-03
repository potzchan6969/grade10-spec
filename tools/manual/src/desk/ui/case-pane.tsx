import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { FilterChip } from "@grade10/design-system/components/forms/filter-chip";
import { Textarea } from "@grade10/design-system/components/forms/textarea";
import { cn } from "@grade10/design-system/lib/utils";
import {
  ArrowSquareOut,
  Bug,
  ClockCounterClockwise,
} from "@phosphor-icons/react";
import {
  type ReactNode,
  type Ref,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Link } from "react-router";
import type { ManualIndex } from "../../api/derive";
import {
  MARK_LABEL,
  type Mark,
  type MarkValue,
  type RowObjects,
  type RunCase,
  type RunRow,
  SURFACE_LABEL,
  SURFACES,
  type Surface,
  triagesFor,
} from "../../api/desk";
import { dirOf } from "../../api/paths";
import { relativeTime } from "../../api/time";
import { MarkdownView } from "../../blocks/markdown";
import { type Check, checksOf, ruleWords } from "../checks";
import {
  casePlaceholders,
  type ExpectationChoice,
  expectationText,
  issueLabel,
  NO_ISSUE,
  offeredValues,
  placeholderAnswer,
  type RunReading,
  settledValue,
  stepsBeside,
  valueOn,
} from "../model";
import { type Binding, BoundText } from "./bound-text";
import { MarkChip } from "./marks";

const LABEL =
  "mb-1.5 font-bold text-[0.65625rem] text-secondary-foreground uppercase tracking-wider";
const MARK_BUTTONS: { value: MarkValue; key: string }[] = [
  { value: "pass", key: "p" },
  { value: "fail", key: "f" },
  { value: "blocked", key: "b" },
  { value: "skipped", key: "s" },
  { value: "na", key: "n" },
  { value: "todo", key: "t" },
];

function Part({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="flex flex-col">
      <h3 className={LABEL}>{label}</h3>
      {children}
    </section>
  );
}

export type FailAsk = { row: string };

export type CasePaneProps = {
  testCase: RunCase;
  reading: RunReading;
  index: ManualIndex;
  surface: Surface;
  focusRow: string | null;
  pendingMarks: Set<string>;
  closed: boolean;
  ask: FailAsk | null;
  choices: ExpectationChoice[];
  history: Mark[] | null;
  handleOf: (email: string) => string;
  bugUrl: (row: RunRow, mark: Mark) => string;
  onRow: (row: string) => void;
  onMark: (value: MarkValue) => void;
  onExpectation: (index: number | undefined) => void;
  onCancelAsk: () => void;
  onAmend: (
    mark: Mark,
    patch: Partial<Pick<Mark, "triage" | "issue" | "note">>,
  ) => void;
  onObjects: (row: string, objects: RowObjects) => void;
  onHistory: (row: string) => void;
};

export function CasePane(props: CasePaneProps) {
  const { testCase, reading, surface, focusRow } = props;
  const rows = reading.rowsByCase.get(testCase.id) ?? [];
  const row = rows.find((one) => one.key === focusRow) ?? rows[0];
  const objects = (row && reading.view.objects[row.key]) ?? {};
  const bind: Binding = (name) =>
    objects[name] ??
    settledValue(reading.view.spec, name, (other) => objects[other]);
  const { steps, after } = stepsBeside(testCase);
  const current = row ? reading.current.get(row.key)?.[surface] : undefined;

  return (
    <article
      aria-label="The case in focus"
      className="flex min-w-0 flex-col gap-5 rounded-(--radius-2xl) border border-border-strong bg-background p-4 lg:p-5"
      data-slot="case-pane"
    >
      <header className="flex flex-col gap-1.5">
        <Text as="p" className="font-mono" size="xs" tone="secondary">
          {[
            testCase.id,
            testCase.marker,
            testCase.rev ? `rev ${testCase.rev}` : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </Text>
        <h2 className="font-bold text-manual-h3 leading-snug">
          {testCase.title}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {[
            testCase.severity,
            testCase.priority,
            testCase.status,
            testCase.phase,
          ]
            .filter(Boolean)
            .map((tag) => (
              <Badge key={tag} size="sm" variant="outline">
                {tag}
              </Badge>
            ))}
          <Badge size="sm" variant="outline">
            {testCase.surfaces.map((one) => SURFACE_LABEL[one]).join(", ") ||
              "no surface"}
          </Badge>
          <Badge size="sm" variant="outline">
            {rows.length} {rows.length === 1 ? "row" : "rows"}
          </Badge>
        </div>
      </header>

      <Checks index={props.index} testCase={testCase} />

      {testCase.lead && !/^Runs once per row/.test(testCase.lead) ? (
        <Text as="p" size="sm">
          <BoundText bind={bind} text={testCase.lead} />
        </Text>
      ) : null}

      {testCase.given.length > 0 ? (
        <Part label="Before you start">
          <ul className="flex list-disc flex-col gap-1 pl-5 text-sm">
            {testCase.given.map((line) => (
              <li key={line}>
                <BoundText bind={bind} text={line} />
              </li>
            ))}
          </ul>
        </Part>
      ) : null}

      {steps.length > 0 || after.length > 0 ? (
        <Part label="Steps and what each should show">
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm">
            {steps.map((step) => (
              <li key={step.text}>
                <span className="block">
                  <BoundText bind={bind} text={step.text} />
                </span>
                {step.expect.map((line) => (
                  <span
                    className="mt-1 block border-success/60 border-l-2 pl-2 text-secondary-foreground"
                    key={line}
                  >
                    <BoundText bind={bind} text={line} />
                  </span>
                ))}
              </li>
            ))}
          </ol>
          {after.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1 text-secondary-foreground text-sm">
              {after.map((line) => (
                <li className="border-success/60 border-l-2 pl-2" key={line}>
                  <BoundText bind={bind} text={line} />
                </li>
              ))}
            </ul>
          ) : null}
        </Part>
      ) : null}

      {(testCase.other ?? []).map((part) => (
        <Part key={part.label} label={part.label}>
          <MarkdownView
            baseDir={dirOf(testCase.suite)}
            className="manual-prose min-w-0 text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
            index={props.index}
            text={part.text}
          />
        </Part>
      ))}

      <RowsTable {...props} row={row} rows={rows} />

      {row ? <TestData {...props} objects={objects} row={row} /> : null}

      {row ? (
        <History
          handleOf={props.handleOf}
          history={props.history}
          onOpen={() => props.onHistory(row.key)}
          row={row}
        />
      ) : null}

      <KeyHints surface={surface} />

      {row ? (
        <MarkStrip
          {...props}
          current={current}
          objects={objects}
          row={row}
          testCase={testCase}
        />
      ) : null}
    </article>
  );
}

/** What waits on a key while the picker is open. */
export const pickerPrompt = (count: number): string =>
  `Pick the expectation: ${count === 1 ? "1" : `1–${count}`}, ↵ none, esc cancel`;

/** The mark bar, the expectation picker and the mark's own details, held at
 * the bottom of the screen so a key's answer is always in sight. */
function MarkStrip({
  row,
  current,
  objects,
  ...props
}: CasePaneProps & {
  row: RunRow;
  current: Mark | undefined;
  objects: RowObjects;
}) {
  const asking = props.ask !== null && props.ask.row === row.key;
  const strip = useRef<HTMLElement>(null);
  // The strip holds to the screen's foot: opening the picker shows it from
  // its prompt, and moves the page only where the strip is out of sight.
  useEffect(() => {
    if (!asking || !strip.current) return;
    strip.current.scrollTop = 0;
    strip.current.scrollIntoView?.({ block: "nearest" });
  }, [asking]);
  const triaged =
    current && ["fail", "blocked", "skipped"].includes(current.value);
  return (
    <section
      aria-label="Mark the row in focus"
      className="sticky bottom-0 z-10 -mx-4 -mb-4 flex max-h-[60dvh] flex-col gap-2 overflow-y-auto rounded-b-(--radius-2xl) border-border-strong border-t bg-background px-4 py-3 shadow-[0_-8px_16px_-12px_var(--foreground)] lg:-mx-5 lg:-mb-5 lg:px-5"
      data-slot="mark-strip"
      ref={strip}
    >
      <MarkBar
        closed={props.closed}
        current={current}
        onMark={props.onMark}
        row={row}
        surface={props.surface}
      />
      {asking ? (
        <>
          <Text
            as="p"
            data-slot="picker-prompt"
            role="status"
            size="xs"
            weight="bold"
          >
            {pickerPrompt(props.choices.length)}
          </Text>
          <ExpectationPicker
            choices={props.choices}
            onCancel={props.onCancelAsk}
            onPick={props.onExpectation}
          />
        </>
      ) : current && triaged ? (
        <Triage
          bugUrl={props.bugUrl(row, current)}
          closed={props.closed}
          expectation={expectationText(
            props.testCase,
            row,
            current.expectation,
          )}
          mark={current}
          objects={objects}
          onAmend={props.onAmend}
          pending={props.pendingMarks.has(current.id)}
        />
      ) : current ? (
        <NoteField
          closed={props.closed}
          mark={current}
          onAmend={props.onAmend}
        />
      ) : null}
    </section>
  );
}

/** A mark's note: every mark may carry one, as the Sheet's Notes column
 * did. */
function NoteField({
  mark,
  closed,
  onAmend,
  rows = 1,
}: {
  mark: Mark;
  closed: boolean;
  onAmend: CasePaneProps["onAmend"];
  rows?: number;
}) {
  const [note, setNote] = useState(mark.note ?? "");
  useEffect(() => setNote(mark.note ?? ""), [mark.note]);
  const noteId = useId();
  return (
    <label className="flex flex-col gap-1" htmlFor={noteId}>
      <Text as="span" size="xs" tone="secondary">
        Note on this {MARK_LABEL[mark.value]}
      </Text>
      <Textarea
        data-slot="mark-note"
        disabled={closed}
        id={noteId}
        onBlur={() => {
          if (note.trim() !== (mark.note ?? ""))
            onAmend(mark, { note: note.trim() });
        }}
        onChange={(event) => setNote(event.target.value)}
        rows={rows}
        value={note}
      />
    </label>
  );
}

function Checks({
  testCase,
  index,
}: {
  testCase: RunCase;
  index: ManualIndex;
}) {
  const checks = checksOf(testCase, index);
  const quoted = checks.filter((one) => one.kind !== "unresolved");
  if (quoted.length === 0 && !testCase.journey) {
    if (checks.length === 0) return null;
    return (
      <Part label="Checks">
        <Text as="p" className="font-mono" size="xs" tone="secondary">
          {checks.map((one) => one.trace).join(", ")}
        </Text>
      </Part>
    );
  }
  return (
    <Part label="Checks">
      <ul className="flex flex-col gap-1.5 border-border-strong border-l-3 pl-3 text-secondary-foreground text-sm">
        {checks.map((check) => (
          <li key={check.trace}>
            <CheckLine check={check} />
          </li>
        ))}
        {quoted.length === 0 && testCase.journey ? (
          <li>{testCase.journey}</li>
        ) : null}
      </ul>
    </Part>
  );
}

function CheckLine({ check }: { check: Check }) {
  if (check.kind === "unresolved")
    return (
      <span
        className="font-mono text-muted-foreground text-xs"
        title="No page in this manual answers this trace"
      >
        {check.trace}
      </span>
    );
  const where = (
    <Link
      className="whitespace-nowrap text-accent-foreground text-xs underline-offset-2 hover:underline"
      to={check.to}
    >
      {check.pageTitle} › {check.sectionTitle}
    </Link>
  );
  if (check.kind === "section")
    return (
      <>
        <b className="text-foreground">{check.sectionTitle}</b>, the whole
        section {where}
      </>
    );
  return (
    <>
      <b className="text-foreground">{check.name}</b> —{" "}
      <BoundText
        bind={() => undefined}
        text={ruleWords(check.text, check.name)}
      />{" "}
      {where}
    </>
  );
}

function RowsTable({
  testCase,
  reading,
  surface,
  rows,
  row,
  pendingMarks,
  onRow,
}: CasePaneProps & { rows: RunRow[]; row: RunRow | undefined }) {
  const header = testCase.data?.header ?? [];
  return (
    <Part label={`Rows · ${SURFACE_LABEL[surface]} is yours`}>
      <div className="overflow-x-auto rounded-(--radius-lg) border border-border">
        <table className="w-full border-collapse text-[0.8125rem]">
          <thead className="bg-background-subtle text-left text-secondary-foreground text-xs">
            <tr>
              <th className="px-2 py-1.5 font-semibold">#</th>
              {header.map((name) => (
                <th className="px-2 py-1.5 font-semibold" key={name}>
                  {name}
                </th>
              ))}
              {SURFACES.map((one) => (
                <th
                  className={cn(
                    "px-2 py-1.5 font-semibold",
                    one === surface && "bg-info/10 text-foreground",
                  )}
                  key={one}
                >
                  {SURFACE_LABEL[one]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((one) => {
              const cells =
                one.index > 0 ? (testCase.data?.rows[one.index - 1] ?? []) : [];
              const bind: Binding = (name) =>
                reading.view.objects[one.key]?.[name];
              return (
                <tr
                  aria-selected={one.key === row?.key}
                  className={cn(
                    "cursor-pointer border-border border-t align-top",
                    one.key === row?.key &&
                      "shadow-[inset_0_-2px_0_var(--foreground)]",
                  )}
                  data-row={one.key}
                  key={one.key}
                  onClick={() => onRow(one.key)}
                >
                  <td className="px-2 py-1.5 text-muted-foreground">
                    {one.index || 1}
                  </td>
                  {header.map((name, at) => (
                    <td className="px-2 py-1.5" key={name}>
                      <BoundText bind={bind} text={cells[at] ?? ""} />
                    </td>
                  ))}
                  {SURFACES.map((each) => {
                    const mark = reading.current.get(one.key)?.[each];
                    return (
                      <td
                        className={cn(
                          "px-2 py-1.5",
                          each === surface && "bg-info/10",
                        )}
                        key={each}
                      >
                        <MarkChip
                          pending={mark ? pendingMarks.has(mark.id) : false}
                          value={valueOn(reading, one, each)}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Part>
  );
}

function MarkBar({
  row,
  surface,
  current,
  closed,
  onMark,
}: {
  row: RunRow;
  surface: Surface;
  current: Mark | undefined;
  closed: boolean;
  onMark: (value: MarkValue) => void;
}) {
  return (
    <fieldset
      aria-label={`Mark row ${row.index || 1} on ${SURFACE_LABEL[surface]}`}
      className="flex min-w-0 flex-wrap items-center gap-1.5"
    >
      <Text as="span" className="mr-1" size="xs" tone="secondary">
        Row {row.index || 1} on {SURFACE_LABEL[surface]}
      </Text>
      {MARK_BUTTONS.map(({ value, key }) => (
        <FilterChip
          aria-keyshortcuts={key}
          disabled={closed}
          key={value}
          onClick={() => onMark(value)}
          selected={current?.value === value}
          size="sm"
        >
          {MARK_LABEL[value]}
          <kbd className="ml-1 font-mono text-[0.625rem] opacity-60">{key}</kbd>
        </FilterChip>
      ))}
    </fieldset>
  );
}

/** Which expectation broke: a number picks one, ↵ goes on without naming. */
export function ExpectationPicker({
  choices,
  onPick,
  onCancel,
  ref,
}: {
  choices: ExpectationChoice[];
  onPick: (index: number | undefined) => void;
  onCancel: () => void;
  ref?: Ref<HTMLFieldSetElement>;
}) {
  return (
    <fieldset
      aria-label="Which expectation broke"
      className="flex min-w-0 flex-col gap-1.5 rounded-(--radius-xl) border border-destructive/45 bg-destructive/5 p-3"
      data-slot="expectation-picker"
      ref={ref}
    >
      <Text as="p" size="sm" weight="bold">
        Which expectation broke?
      </Text>
      <ol className="flex flex-col gap-1">
        {choices.map((choice, at) => (
          <li key={choice.index}>
            <button
              className="grid w-full grid-cols-[1.5rem_minmax(0,1fr)] gap-x-2 rounded-(--radius-md) px-1.5 py-1 text-left text-sm outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring sm:grid-cols-[1.5rem_4.5rem_minmax(0,1fr)]"
              data-expectation={choice.index}
              onClick={() => onPick(choice.index)}
              type="button"
            >
              <kbd className="font-mono text-muted-foreground text-xs max-sm:row-span-2">
                {at + 1}
              </kbd>
              <span className="font-semibold text-secondary-foreground text-xs">
                {choice.from}
              </span>
              <span>
                <BoundText bind={() => undefined} text={choice.text} />
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => onPick(undefined)} size="sm" variant="outline">
          Skip <kbd className="font-mono text-[0.625rem] opacity-60">↵</kbd>
        </Button>
        <Button onClick={onCancel} size="sm" variant="ghost">
          Cancel <kbd className="font-mono text-[0.625rem] opacity-60">esc</kbd>
        </Button>
      </div>
    </fieldset>
  );
}

function Triage({
  mark,
  expectation,
  objects,
  bugUrl,
  pending,
  closed,
  onAmend,
}: {
  mark: Mark;
  expectation?: string;
  objects: RowObjects;
  bugUrl: string;
  pending: boolean;
  closed: boolean;
  onAmend: CasePaneProps["onAmend"];
}) {
  const [issue, setIssue] = useState(mark.issue ?? "");
  useEffect(() => setIssue(mark.issue ?? ""), [mark.issue]);
  const bind: Binding = (name) => objects[name];
  const used = Object.values(objects).filter(Boolean);
  const issueId = useId();
  return (
    <div
      className="flex flex-col gap-2 rounded-(--radius-xl) border border-destructive/45 bg-destructive/5 p-3 text-sm"
      data-slot="triage"
    >
      <div className="flex flex-wrap items-center gap-2">
        <MarkChip pending={pending} value={mark.value} />
        <Text as="span" size="xs" tone="secondary">
          {pending ? "waiting to send" : relativeTime(mark.at)}
        </Text>
        {mark.triage === "bug" && !mark.issue ? (
          <Badge size="sm" variant="warning">
            {NO_ISSUE}
          </Badge>
        ) : null}
      </div>
      {mark.value === "fail" ? (
        <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2 text-secondary-foreground">
          <span className="font-bold text-muted-foreground text-xs">Broke</span>
          <span>
            {expectation ? (
              <BoundText bind={bind} text={expectation} />
            ) : (
              "not named"
            )}
          </span>
        </div>
      ) : null}
      {used.length > 0 ? (
        <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2 text-secondary-foreground">
          <span className="font-bold text-muted-foreground text-xs">Used</span>
          <span>{used.join(", ")}</span>
        </div>
      ) : null}
      <fieldset
        className="flex min-w-0 flex-wrap items-center gap-1.5"
        aria-label="Triage"
      >
        <Text as="span" className="mr-1" size="xs" tone="secondary">
          Triage
        </Text>
        {triagesFor(mark.surface, mark.value).map((triage) => (
          <FilterChip
            disabled={closed}
            key={triage}
            onClick={() =>
              onAmend(mark, {
                triage: mark.triage === triage ? undefined : triage,
              })
            }
            selected={mark.triage === triage}
            size="sm"
          >
            {triage}
          </FilterChip>
        ))}
      </fieldset>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (issue.trim() !== (mark.issue ?? ""))
            onAmend(mark, { issue: issue.trim() });
        }}
      >
        <label className="flex min-w-0 flex-1 flex-col gap-1" htmlFor={issueId}>
          <Text as="span" size="xs" tone="secondary">
            Issue link
          </Text>
          <input
            className="h-8 min-w-0 rounded-(--radius-md) border border-border bg-input px-2 text-sm outline-none focus-visible:border-border-strong focus-visible:ring-1 focus-visible:ring-ring"
            disabled={closed}
            id={issueId}
            onBlur={() => {
              if (issue.trim() !== (mark.issue ?? ""))
                onAmend(mark, { issue: issue.trim() });
            }}
            onChange={(event) => setIssue(event.target.value)}
            placeholder="https://github.com/9gag/grade10/issues/…"
            value={issue}
          />
        </label>
        {mark.issue ? (
          <Button
            nativeButton={false}
            render={<a href={mark.issue} rel="noreferrer" target="_blank" />}
            size="sm"
            variant="ghost"
          >
            {issueLabel(mark.issue)} <ArrowSquareOut aria-hidden />
          </Button>
        ) : null}
        {mark.value === "fail" ? (
          <Button
            nativeButton={false}
            render={<a href={bugUrl} rel="noreferrer" target="_blank" />}
            size="sm"
            variant="outline"
          >
            <Bug aria-hidden /> File bug
          </Button>
        ) : null}
      </form>
      <NoteField closed={closed} mark={mark} onAmend={onAmend} rows={2} />
    </div>
  );
}

function TestData({
  testCase,
  reading,
  row,
  objects,
  closed,
  onObjects,
}: CasePaneProps & { row: RunRow; objects: RowObjects }) {
  const names = casePlaceholders(testCase);
  const listId = useId();
  if (names.length === 0) return null;
  const spec = reading.view.spec;
  return (
    <Part label={`Test data in use · row ${row.index || 1}`}>
      <div className="overflow-x-auto rounded-(--radius-lg) border border-border">
        <table className="w-full border-collapse text-[0.8125rem]">
          <thead className="bg-background-subtle text-left text-secondary-foreground text-xs">
            <tr>
              <th className="px-2 py-1.5 font-semibold">Placeholder</th>
              <th className="px-2 py-1.5 font-semibold">The suite says</th>
              <th className="px-2 py-1.5 font-semibold">Used on this row</th>
            </tr>
          </thead>
          <tbody>
            {names.map((name, at) => {
              const answer = placeholderAnswer(
                name,
                spec.placeholders[name],
                spec.env,
                (other) => objects[other],
              );
              const offered = offeredValues(
                reading.view.objects,
                name,
                row.key,
              );
              return (
                <tr
                  className="border-border border-t align-top"
                  data-placeholder={name}
                  key={name}
                >
                  <td className="whitespace-nowrap px-2 py-1.5 font-mono text-xs">
                    {name}
                  </td>
                  <td className="px-2 py-1.5 text-secondary-foreground">
                    {spec.placeholders[name] ? (
                      <BoundText
                        bind={() => undefined}
                        text={spec.placeholders[name]}
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-2 py-1.5">
                    {answer.kind === "environment" ? (
                      <span>
                        {answer.value}{" "}
                        <span className="text-muted-foreground text-xs">
                          {answer.known
                            ? "· the run's environment, never asked"
                            : "· the environment's name: its site is not known here, never asked"}
                        </span>
                      </span>
                    ) : answer.kind === "follows" ? (
                      <span className="text-secondary-foreground">
                        {answer.value ?? `follows ${answer.from}`}{" "}
                        <span className="text-muted-foreground text-xs">
                          · never asked
                        </span>
                      </span>
                    ) : (
                      <ObjectInput
                        closed={closed}
                        list={
                          offered.length > 0 ? `${listId}-${at}` : undefined
                        }
                        name={name}
                        offered={offered}
                        onSave={(value) =>
                          onObjects(row.key, { [name]: value })
                        }
                        value={objects[name] ?? ""}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Part>
  );
}

function ObjectInput({
  name,
  value,
  offered,
  list,
  closed,
  onSave,
}: {
  name: string;
  value: string;
  offered: string[];
  list?: string;
  closed: boolean;
  onSave: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const save = () => {
    if (draft.trim() !== value) onSave(draft.trim());
  };
  return (
    <>
      <input
        aria-label={`The value ${name} stood for on this row`}
        className="h-8 w-full min-w-32 rounded-(--radius-md) border border-border bg-input px-2 text-sm outline-none focus-visible:border-border-strong focus-visible:ring-1 focus-visible:ring-ring"
        disabled={closed}
        list={list}
        onBlur={save}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            save();
          }
        }}
        placeholder={
          offered.length > 0
            ? `used before: ${offered.join(", ")}`
            : "what this row used"
        }
        value={draft}
      />
      {list ? (
        <datalist id={list}>
          {offered.map((one) => (
            <option key={one} value={one} />
          ))}
        </datalist>
      ) : null}
    </>
  );
}

function History({
  row,
  history,
  handleOf,
  onOpen,
}: {
  row: RunRow;
  history: Mark[] | null;
  handleOf: (email: string) => string;
  onOpen: () => void;
}) {
  return (
    <details
      className="group rounded-(--radius-lg) border border-border px-3 py-2 text-sm"
      onToggle={(event) => {
        if ((event.currentTarget as HTMLDetailsElement).open) onOpen();
      }}
    >
      <summary className="flex cursor-pointer items-center gap-2 text-secondary-foreground">
        <ClockCounterClockwise aria-hidden size={14} /> Row {row.index || 1}'s
        marks, newest first
      </summary>
      {history === null ? (
        <Text as="p" className="mt-2" size="xs" tone="secondary">
          Reading the row's history…
        </Text>
      ) : history.length === 0 ? (
        <Text as="p" className="mt-2" size="xs" tone="secondary">
          Nobody has marked this row yet.
        </Text>
      ) : (
        <ol className="mt-2 flex flex-col gap-1">
          {[...history].reverse().map((mark) => (
            <li className="flex flex-wrap items-center gap-2" key={mark.id}>
              <MarkChip value={mark.value} />
              <span className="text-xs">{SURFACE_LABEL[mark.surface]}</span>
              {mark.triage ? (
                <span className="text-xs">· {mark.triage}</span>
              ) : null}
              {mark.issue ? (
                <span className="text-xs">· {issueLabel(mark.issue)}</span>
              ) : null}
              <span className="text-muted-foreground text-xs">
                {handleOf(mark.by)} · {new Date(mark.at).toLocaleString()}
              </span>
              {mark.note ? (
                <span className="basis-full pl-1 text-secondary-foreground text-xs">
                  {mark.note}
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </details>
  );
}

function KeyHints({ surface }: { surface: Surface }) {
  const kbd =
    "rounded-(--radius-sm) border border-border px-1 font-mono text-[0.625rem]";
  return (
    <Text
      as="p"
      className="flex flex-wrap gap-x-3 gap-y-1 max-lg:hidden"
      size="xs"
      tone="secondary"
    >
      <span>
        <kbd className={kbd}>p</kbd> pass
      </span>
      <span>
        <kbd className={kbd}>f</kbd> fail, then which expectation, or{" "}
        <kbd className={kbd}>↵</kbd> to skip
      </span>
      <span>
        <kbd className={kbd}>b</kbd> blocked <kbd className={kbd}>s</kbd>{" "}
        skipped <kbd className={kbd}>n</kbd> n/a <kbd className={kbd}>t</kbd> to
        do
      </span>
      <span>— the row in focus, on {SURFACE_LABEL[surface]}</span>
      <span>
        <kbd className={kbd}>↵</kbd> next row · <kbd className={kbd}>j</kbd>{" "}
        <kbd className={kbd}>k</kbd> next or previous case ·{" "}
        <kbd className={kbd}>x</kbd> select rows for blocked, skipped, n/a or to
        do · <kbd className={kbd}>/</kbd> find a case
      </span>
    </Text>
  );
}
