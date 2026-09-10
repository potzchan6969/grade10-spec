import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import {
  ArrowSquareOut,
  CalendarBlank,
  CaretRight,
  CheckCircle,
  Circle,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router";
import { laneOf, type ManualIndex, taskTotals } from "../api/derive";
import { changeSourceUrl } from "../api/paths";
import { formatDate, relativeTime } from "../api/time";
import type { ChangeEntry, TaskGroup, TaskLine } from "../api/types";
import { WithdrawAction } from "../editor/withdraw-action";
import { useHashTarget } from "./anchor";
import { BrokenCard } from "./broken-card";
import { ChangeFacts, Cites } from "./change-facts";
import { TaskProgress } from "./change-views";
import { ClampedText } from "./clamped-text";
import { DeltaList } from "./delta-view";
import { InlineMarkdown } from "./inline-markdown";

/**
 * The board's card. It answers what a weekly review asks — who owns it, what it
 * is waiting on, when it is due, what it will change, which box is still open —
 * from the artifacts the change has written and nothing else.
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

function countRequirements(change: ChangeEntry): number {
  return change.deltas.reduce(
    (sum, delta) => sum + delta.requirements.length,
    0,
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
