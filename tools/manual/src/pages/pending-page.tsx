import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { PauseCircle, Tray } from "@phosphor-icons/react";
import { Link } from "react-router";
import { type PendingItem, pendingByHand } from "../api/derive";
import { humanize } from "../api/paths";
import { formatDate } from "../api/time";
import type { SchemaArtifact } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";
import { InlineMarkdown } from "../blocks/inline-markdown";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

/**
 * What each hand owes, across every change in flight.
 *
 * The In Flight board answers how far a change has come; this answers whose
 * turn it is, which is the question somebody arriving with an afternoon free
 * actually has. Both read the same artifacts — nothing here is assigned, and
 * a row leaves the moment its file is written.
 *
 * A row with a reason is one the change declared in `awaiting:`, because
 * nothing could derive it: a screen nobody has drawn, an answer nobody has
 * given. The rest are simply the next artifact, its turn having come.
 */
export function PendingPage() {
  const index = useManualIndex();
  useDocumentTitle("Pending");
  const schemas = index.snapshot.schemas;
  const hands = pendingByHand(index.snapshot.changes, schemas);
  const named = new Map(
    Object.values(schemas).flatMap((artifacts) =>
      artifacts.map((one) => [one.id, fileOf(one)] as const),
    ),
  );

  return (
    <>
      <PageHeading
        summary="What each hand owes, across every change in flight — derived from the artifacts each change has written, never assigned."
        title="Pending"
      />

      {hands.length === 0 ? (
        <EmptyState
          description="No change in flight names a workflow schema this store defines, so nothing here knows what one owes."
          icon={<Tray aria-hidden />}
          title="No schema to read"
        />
      ) : (
        hands.map(({ hand, items }) => (
          <section className="mt-8 first:mt-0" key={hand}>
            <div className="mb-2.5 flex items-baseline gap-2">
              <h2 className="font-heading font-bold text-base">
                {humanize(hand)}
              </h2>
              <Badge size="sm" variant="outline">
                {items.length}
              </Badge>
            </div>
            {items.length === 0 ? (
              <Text as="p" size="sm" tone="secondary">
                Nothing — every change in flight has written what this hand
                owes. A change asks for one it has not by writing{" "}
                <code className="font-mono">awaiting:</code> in its{" "}
                <code className="font-mono">.openspec.yaml</code>.
              </Text>
            ) : (
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={`${item.change.id}/${item.artifact}`}>
                    <Row file={named.get(item.artifact)} item={item} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))
      )}

      <Text as="p" className="mt-8" size="sm" tone="secondary">
        A suite already written but not yet reviewed is QA's, and sits on the{" "}
        <Link className="underline underline-offset-2" to="/qa">
          QA worklist
        </Link>{" "}
        instead.
      </Text>
    </>
  );
}

function Row({ item, file }: { item: PendingItem; file?: string }) {
  return (
    <article className="rounded-(--radius-2xl) border border-border bg-card p-3.5">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <Link
          className="font-medium text-sm hover:underline"
          to={`/in-flight/${item.change.id}`}
        >
          <InlineMarkdown text={item.change.title} />
        </Link>
        <Text as="span" className="font-mono" size="xs" tone="secondary">
          {file ?? item.artifact}
        </Text>
        <span className="ml-auto flex items-center gap-2">
          {item.why ? (
            <Badge size="sm" variant="warning">
              waiting
            </Badge>
          ) : null}
          <Text as="span" size="xs" tone="secondary">
            {item.change.created
              ? `filed ${formatDate(item.change.created)}`
              : "undated"}
          </Text>
        </span>
      </div>
      {item.why ? (
        <Text
          as="p"
          className="mt-1.5 flex items-start gap-1.5"
          size="sm"
          tone="secondary"
        >
          <span className="mt-0.5 inline-flex shrink-0">
            <PauseCircle aria-hidden size={13} />
          </span>
          <InlineMarkdown text={item.why} />
        </Text>
      ) : null}
    </article>
  );
}

/** A per-capability artifact generates one file in each delta directory, so
 * the pattern's last segment is the name somebody writes. */
function fileOf({ generates }: SchemaArtifact): string {
  return generates.slice(generates.lastIndexOf("/") + 1);
}
