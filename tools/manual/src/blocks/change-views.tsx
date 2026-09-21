import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { CheckCircle } from "@phosphor-icons/react";
import { Link } from "react-router";
import { byLastMoved } from "../api/derive";
import { taskTotals } from "../api/stages";
import { formatDate, relativeTime } from "../api/time";
import type { ChangeEntry, IdleClaim } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";
import { BrokenCard } from "./broken-card";
import { InlineMarkdown } from "./inline-markdown";

type DeltaTone = "success" | "info" | "error" | "default";

const KIND_TONE: Record<string, DeltaTone> = {
  added: "success",
  modified: "info",
  removed: "error",
  renamed: "default",
};

/** One hue per delta kind, wherever a kind is named — section or row. */
export function deltaTone(kind: string): DeltaTone {
  return KIND_TONE[kind.toLowerCase()] ?? "default";
}

/**
 * Past three days a claim is worth asking about; past seven it is worth
 * handing back. The thresholds `openspec-viewer` applies on its own board,
 * mirrored here so the two tools cannot call the same claim stale and fine.
 */
const QUIET_DAYS = 3;
const STALE_DAYS = 7;

const IDLE_WORD = {
  claim: "claimed, nothing checked off since",
  progress: "last checkmark",
} as const;

/**
 * How long a claim has sat still, where that is long enough to act on.
 *
 * Nothing under three days: most claimed groups are simply being worked on,
 * and a badge on every one of them would bury the two that need an answer.
 * The exact date and which clock won ride in the tooltip, because "7d" is the
 * prompt and the date is what you check before nudging anyone.
 */
export function IdleBadge({ idle }: { idle?: IdleClaim }) {
  if (!idle || idle.days < QUIET_DAYS) return null;
  const stale = idle.days >= STALE_DAYS;
  return (
    <Badge
      size="sm"
      title={`${IDLE_WORD[idle.source]} ${formatDate(idle.since)}`}
      variant={stale ? "error" : "warning"}
    >
      {stale ? "idle" : "quiet"} {idle.days}d
    </Badge>
  );
}

export function TaskProgress({
  done,
  total,
  label,
  owner,
  idle,
}: {
  done: number;
  total: number;
  label?: string;
  /** Who claimed this group — `@handle`, or the word for nobody. Groups are
   * what gets claimed, so the name belongs on the group's own row. */
  owner?: string;
  /** Set only for a group whose claim git can date. */
  idle?: IdleClaim;
}) {
  const share = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between gap-2">
        <Text as="span" size="xs" tone="secondary">
          {label ?? "Tasks"}
        </Text>
        <span className="flex items-baseline gap-2">
          <IdleBadge idle={idle} />
          {owner ? (
            <Text as="span" className="font-mono" size="xs" tone="secondary">
              {owner}
            </Text>
          ) : null}
          <Text as="span" className="font-mono" size="xs" tone="secondary">
            {done}/{total}
          </Text>
        </span>
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
        <Badge key={kind} size="sm" variant={deltaTone(kind)}>
          {kind.toLowerCase()}
        </Badge>
      ))}
    </>
  );
}

/**
 * Who to name on a change. Owners come from `.openspec.yaml` and the tasks'
 * `(owner: @handle)` tags, and most changes carry none — so the proposal's
 * author stands in, said lighter, because proposing is not owning. `claim`
 * adds the word a review needs: no group has been claimed. The promoter is
 * named too — a promoted card that still read "unclaimed · proposed by" told
 * its author nothing had happened.
 */
export function Attribution({
  change,
  claim = false,
}: {
  change: ChangeEntry;
  claim?: boolean;
}) {
  const planned =
    change.promotedBy && !change.owners.includes(change.promotedBy) ? (
      <>
        {" "}
        · planned by <span className="font-mono">@{change.promotedBy}</span>
      </>
    ) : null;

  if (change.owners.length > 0) {
    return (
      <Text as="span" size="xs" tone="secondary">
        <span className="font-mono">
          {change.owners.map((owner) => `@${owner}`).join(" ")}
        </span>
        {planned}
      </Text>
    );
  }
  if (change.author) {
    return (
      <Text as="span" size="xs" tone="secondary">
        {claim ? "no group claimed · " : ""}proposed by{" "}
        <span className="font-mono">@{change.author}</span>
        {planned}
      </Text>
    );
  }
  return (
    <Text as="span" size="xs" tone="secondary">
      unclaimed{planned}
    </Text>
  );
}

/** Compact card: the shape the ribbon repeats. Links into the Board. */
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
        to={`/in-flight/${change.id}`}
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

/**
 * The ribbon a spec page carries: what is moving against this spec, right now,
 * and what somebody has proposed about it. A proposal has no delta, so nothing
 * else on the page would mention it — and it is not work in flight, so it never
 * wears the same card.
 */
export function ChangeRibbon({
  changes,
  proposals = [],
  specId,
}: {
  changes: ChangeEntry[];
  proposals?: ChangeEntry[];
  specId: string;
}) {
  if (changes.length === 0 && proposals.length === 0) {
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
      {changes.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[...changes].sort(byLastMoved).map((change) => (
            <ChangeChip change={change} key={change.id} />
          ))}
        </div>
      ) : null}
      {proposals.length > 0 ? (
        <ul className={changes.length > 0 ? "mt-2 space-y-1.5" : "space-y-1.5"}>
          {[...proposals]
            .sort((a, b) => b.created.localeCompare(a.created))
            .map((change) => (
              <li key={change.id}>
                <ProposedChip change={change} />
              </li>
            ))}
        </ul>
      ) : null}
    </section>
  );
}

/** Quieter than a change by a whole card: a proposal is a reason somebody
 * wrote down, and reading it as work in flight would misfile a thought as a
 * commitment. */
function ProposedChip({ change }: { change: ChangeEntry }) {
  return (
    <Link
      className="flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-(--radius-xl) border border-border-subtle border-dashed bg-background-subtle px-3 py-2 transition-colors hover:border-border-strong hover:bg-muted"
      to={`/in-flight/${change.id}`}
    >
      <Badge size="sm" variant="outline">
        proposed
      </Badge>
      <Text as="span" className="min-w-0 flex-1" size="sm">
        <InlineMarkdown text={change.title} />
      </Text>
      <Text as="span" size="xs" tone="secondary">
        no delta yet
      </Text>
    </Link>
  );
}

/**
 * A delta's spec id, linked to the page that documents it. Most do not have one
 * yet — a delta may introduce the capability — and that reads as plain text
 * saying so, rather than as a link into a page that is not there.
 */
export function DeltaSpec({ spec }: { spec: string }) {
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
