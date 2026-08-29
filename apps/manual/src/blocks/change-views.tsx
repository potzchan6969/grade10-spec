import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { ArrowSquareOut, CheckCircle } from "@phosphor-icons/react";
import { Link } from "react-router";
import { byLastMoved, taskTotals } from "../api/derive";
import { changeSourceUrl } from "../api/paths";
import { relativeTime } from "../api/time";
import type { ChangeEntry } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";
import { BrokenCard } from "./broken-card";
import { ClampedText } from "./clamped-text";
import { InlineMarkdown } from "./inline-markdown";

const KIND_TONE: Record<string, "success" | "info" | "error" | "default"> = {
  ADDED: "success",
  MODIFIED: "info",
  REMOVED: "error",
  RENAMED: "default",
};

export function TaskProgress({
  done,
  total,
  label,
}: {
  done: number;
  total: number;
  label?: string;
}) {
  const share = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between gap-2">
        <Text as="span" size="xs" tone="secondary">
          {label ?? "Tasks"}
        </Text>
        <Text as="span" className="font-mono" size="xs" tone="secondary">
          {done}/{total}
        </Text>
      </div>
      <div
        aria-label={`${done} of ${total} tasks done`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={share}
        className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
      >
        <div
          className={`h-full rounded-full transition-[width] ${share === 100 ? "bg-success" : "bg-primary"}`}
          style={{ width: `${share}%` }}
        />
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: ChangeEntry["status"] }) {
  return (
    <Badge size="sm" variant={status === "archived" ? "default" : "warning"}>
      {status === "archived" ? "archived" : "in flight"}
    </Badge>
  );
}

export function DeltaKinds({ kinds }: { kinds: string[] }) {
  return (
    <>
      {kinds.map((kind) => (
        <Badge key={kind} size="sm" variant={KIND_TONE[kind] ?? "default"}>
          {kind.toLowerCase()}
        </Badge>
      ))}
    </>
  );
}

/**
 * Who to name on a change. Owners come from the tasks' `(owner: @handle)` tags
 * and most changes carry none, so the proposal's author stands in — said
 * lighter, because proposing is not owning.
 */
export function Attribution({ change }: { change: ChangeEntry }) {
  if (change.owners.length > 0) {
    return (
      <Text as="span" className="font-mono" size="xs" tone="secondary">
        {change.owners.map((owner) => `@${owner}`).join(" ")}
      </Text>
    );
  }
  if (change.author) {
    return (
      <Text as="span" size="xs" tone="secondary">
        proposed by <span className="font-mono">@{change.author}</span>
      </Text>
    );
  }
  return (
    <Text as="span" size="xs" tone="secondary">
      unowned
    </Text>
  );
}

/** Compact card: the shape the ribbon repeats. Links into the planning board. */
export function ChangeChip({ change }: { change: ChangeEntry }) {
  if (change.error) {
    return <BrokenCard error={change.error} what={`Change ${change.id}`} />;
  }
  const { done, total } = taskTotals(change);

  return (
    <article className="flex flex-col gap-2.5 rounded-(--radius-xl) border border-border bg-card p-3.5">
      <div className="flex items-center gap-2">
        <StatusBadge status={change.status} />
        <Text as="span" className="ml-auto" size="xs" tone="secondary">
          {change.lastMoved
            ? `moved ${relativeTime(change.lastMoved)}`
            : "never moved"}
        </Text>
      </div>

      <Link
        className="font-medium text-sm hover:underline"
        to={`/planning#${change.id}`}
      >
        <InlineMarkdown text={change.title} />
      </Link>

      <TaskProgress done={done} total={total} />

      <div className="flex flex-wrap items-center gap-1.5">
        <Attribution change={change} />
        <span className="ml-auto flex flex-wrap gap-1">
          <DeltaKinds
            kinds={[...new Set(change.deltas.flatMap((d) => d.kinds))]}
          />
        </span>
      </div>
    </article>
  );
}

/** The ribbon a spec page carries: what is moving against this spec, right now. */
export function ChangeRibbon({
  changes,
  specId,
}: {
  changes: ChangeEntry[];
  specId: string;
}) {
  if (changes.length === 0) {
    return (
      <div className="my-5 flex items-center gap-2 rounded-(--radius-xl) border border-border-subtle bg-background-subtle px-4 py-2.5">
        <span className="inline-flex text-success">
          <CheckCircle aria-hidden size={16} weight="fill" />
        </span>
        <Text as="span" size="sm" tone="secondary">
          Nothing in flight against {specId}.
        </Text>
      </div>
    );
  }

  return (
    <section
      aria-label={`Changes in flight against ${specId}`}
      className="my-5"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {[...changes].sort(byLastMoved).map((change) => (
          <ChangeChip change={change} key={change.id} />
        ))}
      </div>
    </section>
  );
}

/**
 * A delta's spec id, linked to the page that documents it. Most do not have one
 * yet — a delta may introduce the capability — and that reads as plain text
 * saying so, rather than as a link into a page that is not there.
 */
function DeltaSpec({ spec }: { spec: string }) {
  const route = useManualIndex().routeBySpec.get(spec);
  const label = <span className="font-mono text-xs">{spec}</span>;

  return route ? (
    <Link
      className="text-secondary-foreground hover:text-foreground"
      to={route}
    >
      {label}
    </Link>
  ) : (
    <span
      className="text-secondary-foreground"
      title={`No manual page documents ${spec} yet`}
    >
      {label}
    </span>
  );
}

/** The full card the planning board shows, anchored by change id. */
export function ChangeCard({ change }: { change: ChangeEntry }) {
  if (change.error) {
    return <BrokenCard error={change.error} what={`Change ${change.id}`} />;
  }
  const { done, total } = taskTotals(change);

  return (
    <article
      className="scroll-mt-24 rounded-(--radius-2xl) border border-border bg-card p-4"
      id={change.id}
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={change.status} />
        <Badge size="sm" variant="outline">
          {change.schema}
        </Badge>
        <Text as="span" className="ml-auto" size="xs" tone="secondary">
          {change.lastMoved
            ? `moved ${relativeTime(change.lastMoved)}`
            : `created ${change.created}`}
        </Text>
      </div>

      <h3 className="mt-2 font-heading font-medium text-base">
        <InlineMarkdown text={change.title} />
      </h3>
      <ClampedText className="mt-1" lines={4} text={change.why} />

      <div className="mt-3 space-y-2">
        {change.taskGroups.map((group) => (
          <TaskProgress
            done={group.done}
            key={`${group.repo}/${group.title}`}
            label={`${group.title} · ${group.repo}`}
            total={group.total}
          />
        ))}
        {change.taskGroups.length > 1 ? (
          <TaskProgress done={done} label="All tasks" total={total} />
        ) : null}
        {change.taskGroups.length === 0 ? (
          <Text as="p" size="xs" tone="secondary">
            No task list yet.
          </Text>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-border-subtle border-t pt-3">
        <Attribution change={change} />
        <ul className="flex flex-wrap items-center gap-2">
          {change.deltas.map((delta) => (
            <li className="flex items-center gap-1" key={delta.spec}>
              <DeltaSpec spec={delta.spec} />
              <DeltaKinds kinds={delta.kinds} />
            </li>
          ))}
        </ul>
        <a
          className="ml-auto inline-flex items-center gap-1 text-secondary-foreground text-xs hover:text-foreground"
          href={changeSourceUrl(change.id)}
          rel="noreferrer noopener"
          target="_blank"
        >
          {change.id}
          <ArrowSquareOut aria-hidden size={12} />
        </a>
      </div>
    </article>
  );
}
