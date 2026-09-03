import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import {
  ArrowSquareOut,
  CalendarBlank,
  CaretRight,
  Check,
  CheckCircle,
  Circle,
  Copy,
  Warning,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  citeTarget,
  type Dependency,
  dependenciesOf,
  laneOf,
  type ManualIndex,
  taskTotals,
} from "../api/derive";
import { changeSourceUrl } from "../api/paths";
import { formatDate, relativeTime } from "../api/time";
import type {
  ChangeEntry,
  ChangeSuite,
  TaskGroup,
  TaskLine,
} from "../api/types";
import { WithdrawAction } from "../editor/withdraw-action";
import { useHashTarget } from "./anchor";
import { BrokenCard } from "./broken-card";
import {
  Attribution,
  DeltaKinds,
  DeltaSpec,
  TaskProgress,
} from "./change-views";
import { ClampedText } from "./clamped-text";
import { DeltaList } from "./delta-view";
import { InlineMarkdown } from "./inline-markdown";

/**
 * The board's card, and the only detail view a change has. It answers what a
 * weekly review asks — who owns it, what it is waiting on, when it is due, what
 * it will change, which box is still open — from the artifacts the change has
 * written and nothing else.
 *
 * Collapsed by default: twenty expanded cards made the board a 30,000px page
 * nobody could scan. The summary keeps everything a review reads at a glance —
 * lane facts, owners, suites, the next action — and the body opens on demand,
 * or when a deep link lands on the card. `expanded` forces it open where the
 * card is the whole page.
 */
export function ChangeCard({
  index,
  change,
  archived = [],
  expanded = false,
}: {
  index: ManualIndex;
  change: ChangeEntry;
  archived?: ChangeEntry[];
  expanded?: boolean;
}) {
  const targeted = useHashTarget(change.id);
  const [open, setOpen] = useState(false);

  if (change.error) {
    return <BrokenCard error={change.error} what={`Change ${change.id}`} />;
  }

  const lane = laneOf(change);
  const { done, total } = taskTotals(change);
  const cites = change.cites ?? [];
  const shown = expanded || open || targeted;

  return (
    <article
      className="scroll-mt-24 rounded-(--radius-2xl) border border-border bg-card p-4"
      id={change.id}
    >
      <div className="flex flex-wrap items-center gap-2">
        {expanded ? null : (
          <IconButton
            aria-expanded={shown}
            aria-label={shown ? "Collapse this change" : "Expand this change"}
            onClick={() => setOpen((on) => !on)}
            size="xs"
            variant="ghost"
          >
            <span
              className={`inline-flex transition-transform ${shown ? "rotate-90" : ""}`}
            >
              <CaretRight aria-hidden weight="bold" />
            </span>
          </IconButton>
        )}
        <Badge size="sm" variant="outline">
          {change.schema || "change"}
        </Badge>
        {change.target ? (
          <Badge size="sm" variant="info">
            <CalendarBlank aria-hidden size={12} />
            {formatDate(change.target)}
          </Badge>
        ) : null}
        <Text as="span" className="ml-auto" size="xs" tone="secondary">
          {change.lastMoved
            ? `moved ${relativeTime(change.lastMoved)}`
            : change.created
              ? // `created:` is a date, not a timestamp — read out as one, a
                // change filed minutes ago would already be "15 hours ago".
                `created ${formatDate(change.created)}`
              : "undated"}
        </Text>
      </div>

      <h3 className="mt-2 font-heading font-medium text-base">
        {expanded ? (
          <InlineMarkdown text={change.title} />
        ) : (
          <button
            aria-expanded={shown}
            className="cursor-pointer text-left"
            onClick={() => setOpen((on) => !on)}
            type="button"
          >
            <InlineMarkdown text={change.title} />
          </button>
        )}
      </h3>
      <ClampedText className="mt-1" lines={3} text={change.why} />

      <ChangeFacts
        archived={archived}
        change={change}
        index={index}
        progress={!shown}
      />

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${shown ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!shown}>
          {change.taskGroups.length > 0 ? (
            <div className="mt-3 space-y-3">
              {change.taskGroups.map((group) => (
                <TaskGroupView
                  group={group}
                  key={`${group.repo}/${group.title}`}
                />
              ))}
              {change.taskGroups.length > 1 ? (
                <TaskProgress done={done} label="All tasks" total={total} />
              ) : null}
            </div>
          ) : null}

          <DeltaList
            defaultOpen={lane === "specified" && countRequirements(change) <= 3}
            deltas={change.deltas}
            index={index}
          />

          {cites.length > 0 ? <Cites cites={cites} index={index} /> : null}

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-border-subtle border-t pt-3">
            <Link
              className="text-secondary-foreground text-xs hover:text-foreground"
              to={`/in-flight/${change.id}`}
            >
              {change.id}
            </Link>
            <a
              aria-label={`Open ${change.id} on GitHub`}
              className="inline-flex items-center gap-1 text-secondary-foreground text-xs hover:text-foreground"
              href={changeSourceUrl(change.id)}
              rel="noreferrer noopener"
              target="_blank"
            >
              source
              <ArrowSquareOut aria-hidden size={12} />
            </a>
            {change.deltas.length === 0 ? (
              <span className="ml-auto">
                <WithdrawAction change={change} />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * What a review reads off a change at a glance, wherever the change is shown:
 * what it is waiting on, where it stands against main, who owns it and which
 * specs it touches, the suites riding it, how far the tasks are, and the next
 * action. The board's card and the change page share it, so the two never
 * disagree about a fact.
 */
export function ChangeFacts({
  index,
  change,
  archived = [],
  progress = false,
}: {
  index: ManualIndex;
  change: ChangeEntry;
  archived?: ChangeEntry[];
  /** Show the task bar here — where the task groups are not laid out below. */
  progress?: boolean;
}) {
  const { done, total } = taskTotals(change);
  const dependencies = dependenciesOf(change, index, archived);

  return (
    <>
      <BlockedBy dependencies={dependencies} />
      <MainStateNote change={change} />

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <Attribution change={change} claim />
        <ul className="flex flex-wrap items-center gap-2">
          {change.deltas.map((delta) => (
            <li className="flex items-center gap-1" key={delta.spec}>
              <DeltaSpec spec={delta.spec} />
              <DeltaKinds kinds={delta.kinds} />
            </li>
          ))}
        </ul>
      </div>

      <SuiteLines change={change} />

      {total > 0 && progress ? (
        <div className="mt-3">
          <TaskProgress
            done={done}
            label={`${change.taskGroups.length} ${change.taskGroups.length === 1 ? "group" : "groups"}`}
            total={total}
          />
        </div>
      ) : null}

      <NextAction change={change} />
    </>
  );
}

function countRequirements(change: ChangeEntry): number {
  return change.deltas.reduce(
    (sum, delta) => sum + delta.requirements.length,
    0,
  );
}

/**
 * The next action for the card's own state, as text to paste at an agent — the
 * loop's continuation used to live nowhere, and its first casualty guessed a
 * skill name off a badge. In progress has no line: the open task rows are the
 * work, and claiming them is the application repo's `pnpm plan claim`.
 */
function NextAction({ change }: { change: ChangeEntry }) {
  const lane = laneOf(change);
  if (lane === "in-progress") return null;

  const action =
    lane === "proposed"
      ? {
          command: `/${change.schema === "full-planning" ? "full-planning" : "pm-planning"} ${change.id}`,
          note: "point an agent at the proposal — it interviews the author, then writes the deltas",
        }
      : lane === "specified"
        ? {
            command: `/full-planning ${change.id}`,
            note: "the engineer picking this up promotes it and plans delivery",
          }
        : {
            command: `/archive-change ${change.id}`,
            note: "confirm it deployed, then fold it into the durable specs",
          };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
      <Text as="span" size="xs" tone="secondary">
        Next
      </Text>
      <CopyableCommand command={action.command} />
      <Text as="span" size="xs" tone="secondary">
        {action.note}
      </Text>
    </div>
  );
}

/** A command with its copy control: `claude`, then paste. */
export function CopyableCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <span className="inline-flex items-center gap-1">
      <code className="rounded-(--radius-lg) border border-border bg-background-subtle px-1.5 py-0.5 font-mono text-xs">
        {command}
      </code>
      <IconButton
        aria-label={copied ? "Copied" : `Copy ${command}`}
        onClick={() => {
          navigator.clipboard
            .writeText(command)
            .then(() => setCopied(true))
            // A refused clipboard is not a broken card; the text is selectable.
            .catch(() => {});
        }}
        size="xs"
        title={copied ? "Copied" : "Copy for an agent session"}
        variant="ghost"
      >
        {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
      </IconButton>
    </span>
  );
}

/**
 * Where the change stands against the store's main. The plan is read there, so
 * an unsettled change looks buildable on the board while `pnpm plan claim` and
 * the archive both refuse it — the one fact the browser used to hide.
 */
function MainStateNote({ change }: { change: ChangeEntry }) {
  const state = change.mainState;
  if (!state) return null;
  const blocked =
    laneOf(change) === "complete" ? "archived" : "claimed or implemented";

  return (
    <div className="mt-2.5 flex items-baseline gap-1.5 text-warning">
      <span className="inline-flex translate-y-0.5">
        <Warning aria-hidden size={13} weight="fill" />
      </span>
      <Text as="span" size="xs">
        {state.state === "unmerged"
          ? `not on ${state.ref} — it cannot be ${blocked} until the store branch merges`
          : `${state.files} artifact(s) ahead of ${state.ref} — push them before building against this`}
      </Text>
    </div>
  );
}

/**
 * The suites riding this change's deltas, with their review counts — the
 * QA work in flight that no durable surface can show, and the one line that
 * tells a PM their review request landed.
 */
function SuiteLines({ change }: { change: ChangeEntry }) {
  const suites = change.suites ?? [];
  if (suites.length === 0) return null;

  return (
    <ul className="mt-2.5 space-y-1">
      {suites.map((suite) => (
        <li
          className="flex flex-wrap items-center gap-x-2 gap-y-1"
          key={suite.spec}
        >
          <Text as="span" size="xs" tone="secondary">
            Test cases · <span className="font-mono">{suite.spec}</span>
          </Text>
          {suite.error ? (
            <Text as="span" className="text-destructive" size="xs">
              {suite.error.message}
            </Text>
          ) : (
            <>
              <Badge
                size="sm"
                variant={suite.status === "approved" ? "success" : "warning"}
              >
                {suite.status}
              </Badge>
              <SuiteCounts suite={suite} />
              {suite.cases.draft > 0 ? (
                <CopyableCommand command={`/tcs-review ${change.id}`} />
              ) : null}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function SuiteCounts({ suite }: { suite: ChangeSuite }) {
  const { cases } = suite;
  const parts = [
    cases.draft > 0 ? `${cases.draft} draft` : null,
    cases.actual > 0 ? `${cases.actual} reviewed` : null,
    cases.deprecated > 0 ? `${cases.deprecated} retired` : null,
  ].filter((part): part is string => part !== null);

  return (
    <Text as="span" size="xs" tone="secondary">
      {cases.total} {cases.total === 1 ? "case" : "cases"}
      {parts.length > 0 ? ` · ${parts.join(" · ")}` : ""}
    </Text>
  );
}

/**
 * What a change is waiting on. A dependency still in flight is the loud one —
 * it is the reason this change cannot ship — a shipped one is said quietly so
 * the edge stays visible, and an id naming no change at all is a lie the board
 * says out loud rather than dropping.
 */
function BlockedBy({ dependencies }: { dependencies: Dependency[] }) {
  if (dependencies.length === 0) return null;

  return (
    <ul className="mt-2.5 flex flex-wrap items-center gap-1.5">
      <li>
        <Text as="span" size="xs" tone="secondary">
          Blocked by
        </Text>
      </li>
      {dependencies.map((dependency) => (
        <li key={dependency.id}>
          <DependencyPill dependency={dependency} />
        </li>
      ))}
    </ul>
  );
}

function DependencyPill({ dependency }: { dependency: Dependency }) {
  const label = dependency.change?.title ?? dependency.id;

  if (dependency.state === "missing") {
    return (
      <Badge
        size="sm"
        title={`\`depends_on: ${dependency.id}\` names no change, in flight or archived`}
        variant="error"
      >
        {dependency.id} — names no change
      </Badge>
    );
  }

  const blocking = dependency.state === "blocking";
  return (
    <Link title={label} to={`/in-flight#${dependency.id}`}>
      <Badge size="sm" variant={blocking ? "warning" : "outline"}>
        <span className="max-w-56 truncate">{dependency.id}</span>
        <span className="opacity-70">{blocking ? "in flight" : "shipped"}</span>
      </Badge>
    </Link>
  );
}

const FIRST_OPEN = 4;

/**
 * A group's progress, and which box is behind it. "5 of 6" is a number nobody
 * can act on; the open lines are the work, so they are what the card shows
 * without being asked — the finished ones wait behind the toggle.
 */
export function TaskGroupView({ group }: { group: TaskGroup }) {
  const [all, setAll] = useState(false);
  const tasks = group.tasks ?? [];
  const open = tasks.filter((task) => !task.done);
  const shown = all ? tasks : open.slice(0, FIRST_OPEN);
  const hidden = tasks.length - shown.length;

  return (
    <div>
      <TaskProgress
        done={group.done}
        idle={group.idle}
        label={group.repo ? `${group.title} · ${group.repo}` : group.title}
        owner={group.owner ? `@${group.owner}` : "unclaimed"}
        total={group.total}
      />
      {shown.length > 0 ? (
        <ul className="mt-1.5 space-y-0.5">
          {shown.map((task) => (
            <li key={`${task.done}:${task.text}`}>
              <TaskRow task={task} />
            </li>
          ))}
        </ul>
      ) : null}
      {hidden > 0 || all ? (
        <button
          aria-expanded={all}
          className="mt-1 cursor-pointer text-secondary-foreground text-xs underline decoration-border-strong underline-offset-2 hover:text-foreground"
          onClick={() => setAll((on) => !on)}
          type="button"
        >
          {all ? "Show open only" : `Show all ${group.total}`}
        </button>
      ) : null}
    </div>
  );
}

function TaskRow({ task }: { task: TaskLine }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span
        className={`inline-flex shrink-0 translate-y-0.5 ${task.done ? "text-success" : "text-warning"}`}
      >
        {task.done ? (
          <CheckCircle aria-hidden size={11} weight="fill" />
        ) : (
          <Circle aria-hidden size={11} weight="bold" />
        )}
      </span>
      <Text
        as="span"
        className={`min-w-0 ${task.done ? "opacity-60" : ""}`}
        size="xs"
        tone={task.done ? "secondary" : "primary"}
      >
        {task.text}
      </Text>
      {task.owner ? (
        <Text as="span" className="font-mono" size="xs" tone="secondary">
          @{task.owner}
        </Text>
      ) : null}
    </div>
  );
}

/** The ids a proposal's `## References` names, as the deep links they were
 * written to be — the row somebody was reading when they proposed it. */
export function Cites({
  index,
  cites,
}: {
  index: ManualIndex;
  cites: string[];
}) {
  return (
    <div className="mt-3">
      <Text as="p" className="mb-1.5" size="xs" tone="secondary">
        About
      </Text>
      <ul className="flex flex-wrap gap-1.5">
        {cites.map((id) => {
          const target = citeTarget(index, id);
          return (
            <li key={id}>
              {target.to ? (
                <Link
                  className="flex items-baseline gap-1.5 rounded-(--radius-lg) border border-border bg-background-subtle px-2 py-1 text-xs transition-colors hover:border-border-strong hover:bg-muted"
                  to={target.to}
                >
                  <span className="shrink-0 font-mono text-secondary-foreground">
                    {id}
                  </span>
                  {target.label === id ? null : (
                    <span className="min-w-0 leading-snug">{target.label}</span>
                  )}
                </Link>
              ) : (
                <span
                  className="flex items-baseline gap-1.5 rounded-(--radius-lg) border border-border-subtle px-2 py-1 text-xs"
                  title="Nothing in this snapshot answers to that id yet"
                >
                  <span className="font-mono text-secondary-foreground">
                    {id}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
