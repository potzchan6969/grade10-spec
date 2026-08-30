import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { CaretRight, Kanban, Lightbulb } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router";
import {
  byLastMoved,
  isProposal,
  type ManualIndex,
  productTitle,
} from "../api/derive";
import { ownerOfSpec, slugify } from "../api/paths";
import { relativeTime } from "../api/time";
import type { ChangeEntry } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";
import { useHashTarget } from "../blocks/anchor";
import { ChangeCard } from "../blocks/change-views";
import { ClampedText } from "../blocks/clamped-text";
import { InlineMarkdown } from "../blocks/inline-markdown";
import { WithdrawAction } from "../editor/withdraw-action";
import { ArchiveTimeline } from "./archive-timeline";
import { MaintenancePanel } from "./maintenance-panel";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

const UNSCOPED = "Unscoped";

/** A change belongs to the product its first delta touches — one home, one anchor. */
function groupByProduct(changes: ChangeEntry[]): [string, ChangeEntry[]][] {
  const groups = new Map<string, ChangeEntry[]>();
  for (const change of [...changes].sort(byLastMoved)) {
    const key = change.deltas[0]
      ? ownerOfSpec(change.deltas[0].spec)
      : UNSCOPED;
    const list = groups.get(key) ?? [];
    list.push(change);
    groups.set(key, list);
  }
  return [...groups].sort(([a], [b]) =>
    a === UNSCOPED ? 1 : b === UNSCOPED ? -1 : a.localeCompare(b),
  );
}

/**
 * A group is named for the product its changes touch — and some of those
 * products are a slug read out of a delta path with no page behind it. Say so,
 * rather than letting a derived name pass as a product the manual documents.
 */
function GroupHeading({ index, id }: { index: ManualIndex; id: string }) {
  if (id === UNSCOPED) {
    return <h2 className="font-heading font-bold text-lg">{UNSCOPED}</h2>;
  }

  const route = [`/p/${id}`, `/platform/${id}`].find((candidate) =>
    index.pageByRoute.has(candidate),
  );

  return (
    <>
      <h2 className="font-heading font-bold text-lg" id={slugify(id)}>
        {route ? (
          <Link className="hover:underline" to={route}>
            {productTitle(index, id)}
          </Link>
        ) : (
          productTitle(index, id)
        )}
      </h2>
      {route ? null : (
        <Text as="span" size="xs" tone="secondary">
          no manual page
        </Text>
      )}
    </>
  );
}

export function PlanningPage() {
  const index = useManualIndex();
  useDocumentTitle("Planning");
  const changes = index.snapshot.changes;
  const proposed = changes.filter(isProposal);
  const planned = changes.filter((change) => !isProposal(change));
  const groups = groupByProduct(planned);
  const total = planned.length;

  return (
    <>
      <PageHeading
        summary="Every change in flight, grouped by the product its deltas touch."
        title="Planning"
      />

      {total === 0 ? (
        <EmptyState
          description="No change is in flight in this snapshot."
          icon={<Kanban aria-hidden />}
          title="Nothing in flight"
        />
      ) : (
        groups.map(([key, changes]) => (
          <section className="mb-10" key={key}>
            <div className="mb-3 flex flex-wrap items-baseline gap-2">
              <GroupHeading id={key} index={index} />
              <Text as="span" size="xs" tone="secondary">
                {changes.length} {changes.length === 1 ? "change" : "changes"}
              </Text>
            </div>
            <div className="space-y-3">
              {changes.map((change) => (
                <ChangeCard change={change} key={change.id} />
              ))}
            </div>
          </section>
        ))
      )}

      <ProposedLane changes={proposed} />
      <ArchiveTimeline title="Archive" />
      <MaintenancePanel />
    </>
  );
}

/**
 * Changes nobody has planned yet: a title, a reason, and the ids it cites. They
 * stand apart from the product groups on purpose — a proposal carries no
 * deltas, so it belongs to no product's work in flight, and reading it as
 * something moving would misfile a thought as a commitment.
 *
 * Collapsed until asked for, and opened by a link that names one.
 */
function ProposedLane({ changes }: { changes: ChangeEntry[] }) {
  const targeted = useHashTarget(...changes.map((change) => change.id));
  const [open, setOpen] = useState(false);

  if (changes.length === 0) return null;
  const expanded = open || targeted;

  return (
    <section className="mt-12 border-border-subtle border-t pt-8">
      <button
        aria-expanded={expanded}
        className="-mx-2 flex w-[calc(100%+1rem)] cursor-pointer items-center gap-2 rounded-(--radius-lg) px-2 py-1 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
        onClick={() => setOpen((on) => !on)}
        type="button"
      >
        <span
          className={`inline-flex shrink-0 text-secondary-foreground transition-transform ${expanded ? "rotate-90" : ""}`}
        >
          <CaretRight aria-hidden size={14} weight="bold" />
        </span>
        <span className="inline-flex text-secondary-foreground">
          <Lightbulb aria-hidden size={16} />
        </span>
        <h2 className="font-heading font-bold text-lg" id="proposed">
          Proposed
        </h2>
        <Badge size="sm" variant="outline">
          {changes.length}
        </Badge>
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!expanded}>
          <Text as="p" className="mt-3" size="sm" tone="secondary">
            Reasons for a change, with no task list yet. The delta is what the
            discussion is for.
          </Text>
          <ul className="mt-4 space-y-3">
            {[...changes]
              .sort((a, b) => b.created.localeCompare(a.created))
              .map((change) => (
                <li key={change.id}>
                  <ProposalCard change={change} />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ProposalCard({ change }: { change: ChangeEntry }) {
  return (
    <article
      className="scroll-mt-24 rounded-(--radius-2xl) border border-border bg-card p-4"
      id={change.id}
    >
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h3 className="font-heading font-medium text-base">
          <InlineMarkdown text={change.title} />
        </h3>
        <Text as="span" className="ml-auto" size="xs" tone="secondary">
          {change.author ? (
            <>
              <span className="font-mono">@{change.author}</span>
              {" · "}
            </>
          ) : null}
          {change.created ? relativeTime(change.created) : "undated"}
        </Text>
      </div>

      <ClampedText className="mt-1.5" lines={3} text={change.why} />

      <div className="mt-3 flex flex-wrap items-center gap-2 border-border-subtle border-t pt-2">
        <Text as="span" className="font-mono" size="xs" tone="secondary">
          {change.id}
        </Text>
        {change.deltas.length === 0 ? (
          <span className="ml-auto">
            <WithdrawAction change={change} />
          </span>
        ) : null}
      </div>
    </article>
  );
}
