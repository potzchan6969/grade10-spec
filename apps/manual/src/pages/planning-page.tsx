import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Kanban } from "@phosphor-icons/react";
import { Link } from "react-router";
import { byLastMoved, type ManualIndex, productTitle } from "../api/derive";
import { ownerOfSpec, slugify } from "../api/paths";
import type { ChangeEntry } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";
import { ChangeCard } from "../blocks/change-views";
import { ArchiveTimeline } from "./archive-timeline";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

const UNSCOPED = "Unscoped";

/** A change belongs to the product its first delta touches — one home, one anchor. */
function groupByProduct(index: ManualIndex): [string, ChangeEntry[]][] {
  const groups = new Map<string, ChangeEntry[]>();
  for (const change of [...index.snapshot.changes].sort(byLastMoved)) {
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
  const groups = groupByProduct(index);
  const total = index.snapshot.changes.length;

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

      <ArchiveTimeline title="Archive" />
    </>
  );
}
