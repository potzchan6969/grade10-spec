import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import {
  ArrowSquareOut,
  CalendarBlank,
  CheckCircle,
  Circle,
} from "@phosphor-icons/react";
import { useState } from "react";
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
import type { ChangeEntry, TaskGroup, TaskLine } from "../api/types";
import { WithdrawAction } from "../editor/withdraw-action";
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
 */
export function ChangeCard({
  index,
  change,
  archived = [],
}: {
  index: ManualIndex;
  change: ChangeEntry;
  archived?: ChangeEntry[];
}) {
  if (change.error) {
    return <BrokenCard error={change.error} what={`Change ${change.id}`} />;
  }

  const lane = laneOf(change);
  const { done, total } = taskTotals(change);
  const dependencies = dependenciesOf(change, index, archived);
  const cites = change.cites ?? [];

  return (
    <article
      className="scroll-mt-24 rounded-(--radius-2xl) border border-border bg-card p-4"
      id={change.id}
    >
      <div className="flex flex-wrap items-center gap-2">
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
              ? `created ${relativeTime(change.created)}`
              : "undated"}
        </Text>
      </div>

      <h3 className="mt-2 font-heading font-medium text-base">
        <InlineMarkdown text={change.title} />
      </h3>
      <ClampedText className="mt-1" lines={3} text={change.why} />

      <BlockedBy dependencies={dependencies} />

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

      {change.taskGroups.length > 0 ? (
        <div className="mt-3 space-y-3">
          {change.taskGroups.map((group) => (
            <TaskGroupView group={group} key={`${group.repo}/${group.title}`} />
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
        <a
          className="inline-flex items-center gap-1 text-secondary-foreground text-xs hover:text-foreground"
          href={changeSourceUrl(change.id)}
          rel="noreferrer noopener"
          target="_blank"
        >
          {change.id}
          <ArrowSquareOut aria-hidden size={12} />
        </a>
        {change.deltas.length === 0 ? (
          <span className="ml-auto">
            <WithdrawAction change={change} />
          </span>
        ) : null}
      </div>
    </article>
  );
}

function countRequirements(change: ChangeEntry): number {
  return change.deltas.reduce(
    (sum, delta) => sum + delta.requirements.length,
    0,
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
    <Link title={label} to={`/planning#${dependency.id}`}>
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
function TaskGroupView({ group }: { group: TaskGroup }) {
  const [all, setAll] = useState(false);
  const tasks = group.tasks ?? [];
  const open = tasks.filter((task) => !task.done);
  const shown = all ? tasks : open.slice(0, FIRST_OPEN);
  const hidden = tasks.length - shown.length;

  return (
    <div>
      <TaskProgress
        done={group.done}
        label={group.repo ? `${group.title} · ${group.repo}` : group.title}
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
function Cites({ index, cites }: { index: ManualIndex; cites: string[] }) {
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
