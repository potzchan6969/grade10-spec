import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { Kanban } from "@phosphor-icons/react";
import { Link, useParams } from "react-router";
import { useArchive } from "../api/use-archive";
import { useManualIndex } from "../api/use-manual-index";
import { ChangeCard } from "../blocks/change-detail";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

/**
 * One change as a page of its own. The board renders every change at once,
 * which is the wrong shape for a link handed to a colleague — "look at this
 * change" used to mean an anchor thirty screens into `/planning`, and the
 * guessable URL 404'd.
 */
export function ChangePage() {
  const { change: id = "" } = useParams();
  const index = useManualIndex();
  const archive = useArchive();
  const change = index.changeById.get(id);
  useDocumentTitle(change?.title ?? id);

  if (!change) {
    const shipped =
      archive.status === "ready" &&
      archive.archive.changes.some((one) => one.id === id);
    return (
      <>
        <PageHeading
          eyebrow="Planning"
          summary={
            shipped
              ? "This change has shipped and been archived — its deltas are folded into the durable specs."
              : "No change in flight answers to that id."
          }
          title={shipped ? "Shipped and folded in" : "No such change"}
        />
        <Text as="p" className="mb-6 font-mono" size="sm" tone="secondary">
          {id}
        </Text>
        <EmptyState
          description={
            shipped
              ? "The archive timeline on the planning board keeps its record."
              : "The planning board lists everything in flight."
          }
          icon={<Kanban aria-hidden />}
          title={shipped ? "In the archive" : "Not on the board"}
        />
        <Text as="p" className="mt-4" size="sm">
          <Link className="underline underline-offset-2" to="/planning">
            Open the planning board
          </Link>
        </Text>
      </>
    );
  }

  return (
    <>
      <Text as="p" className="mb-4" size="sm" tone="secondary">
        <Link className="hover:underline" to="/planning">
          ← Planning
        </Link>
      </Text>
      <ChangeCard
        archived={
          archive.status === "ready" ? archive.archive.changes : undefined
        }
        change={change}
        expanded
        index={index}
      />
    </>
  );
}
