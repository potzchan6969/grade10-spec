import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { PauseCircle, Tray } from "@phosphor-icons/react";
import { Link } from "react-router";
import { type PendingItem, pendingByRole } from "../api/derive";
import { humanize } from "../api/paths";
import { relativeTime } from "../api/time";
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
  const roles = pendingByRole(index.snapshot.changes, index.snapshot.artifacts);
  const named = new Map(
    index.snapshot.artifacts.map((one) => [one.id, fileOf(one)]),
  );

  return (
    <>
      <PageHeading
        summary="What each hand owes, across every change in flight — derived from the artifacts each change has written, never assigned."
        title="Pending"
      />

      {roles.length === 0 ? (
        <EmptyState
          description="Every change in flight has written what its schema asks of it."
          icon={<Tray aria-hidden />}
          title="Nothing pending"
        />
      ) : (
        roles.map(({ role, items }) => (
          <section className="mt-8 first:mt-0" key={role}>
            <div className="mb-2.5 flex items-baseline gap-2">
              <h2 className="font-heading font-bold text-base">
                {humanize(role)}
              </h2>
              <Text as="span" size="sm" tone="secondary">
                {items.length}
              </Text>
            </div>
            <ul className="space-y-2.5">
              {items.map((item) => (
                <li key={`${item.change.id}/${item.artifact}`}>
                  <Row file={named.get(item.artifact)} item={item} />
                </li>
              ))}
            </ul>
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
          {item.change.created ? (
            <Text as="span" size="xs" tone="secondary">
              {relativeTime(item.change.created)}
            </Text>
          ) : null}
        </span>
      </div>
      {item.why ? (
        <Text
          as="p"
          className="mt-1.5 flex items-start gap-1.5"
          size="sm"
          tone="secondary"
        >
          <span aria-hidden className="mt-0.5 shrink-0">
            <PauseCircle />
          </span>
          {item.why}
        </Text>
      ) : null}
    </article>
  );
}

/** The file the hand is being asked for. A per-capability artifact generates
 * one file in each delta directory, so the pattern's last segment is the name
 * somebody actually writes. */
function fileOf(artifact: SchemaArtifact): string {
  return artifact.generates.split("/").at(-1) ?? artifact.id;
}
