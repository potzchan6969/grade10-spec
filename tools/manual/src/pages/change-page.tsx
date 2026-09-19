import { Badge } from "@grade10/design-system/components/display/badge";
import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { Text } from "@grade10/design-system/components/display/text";
import { ArrowSquareOut, CalendarBlank, Kanban } from "@phosphor-icons/react";
import { Link, useParams } from "react-router";
import { changeSourceUrl } from "../api/paths";
import { STAGE_LABEL, stageShown } from "../api/stage-view";
import { formatDate, relativeTime } from "../api/time";
import type { ChangeEntry } from "../api/types";
import { useArchive } from "../api/use-archive";
import { useChangeDocument } from "../api/use-change-document";
import { useManualIndex } from "../api/use-manual-index";
import { BrokenCard } from "../blocks/broken-card";
import { ChangeTabs } from "../blocks/change-document";
import { ChangeStatus } from "../blocks/change-status";
import { InlineMarkdown } from "../blocks/inline-markdown";
import { MarkdownView } from "../blocks/markdown";
import { StageStepper } from "../blocks/stage-stepper";
import { YourTurnCard } from "../blocks/your-turn-card";
import { WithdrawAction } from "../editor/withdraw-action";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

/**
 * One change as a page of its own: what it is, where it stands, then the files
 * it is made of. The board renders every change at once, which is the wrong
 * shape for a link handed to a colleague; this is where "look at this change"
 * lands.
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
          eyebrow="In Flight"
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
              ? "The archive timeline on the In Flight board keeps its record."
              : "The In Flight board lists what's still moving."
          }
          icon={<Kanban aria-hidden />}
          title={shipped ? "In the archive" : "Not on the board"}
        />
        <Text as="p" className="mt-4" size="sm">
          <Link className="underline underline-offset-2" to="/in-flight">
            Open the In Flight board
          </Link>
        </Text>
      </>
    );
  }

  return (
    <>
      <Text as="p" className="mb-4" size="sm" tone="secondary">
        <Link className="hover:underline" to="/in-flight">
          ← In Flight
        </Link>
      </Text>
      <ChangeHeader change={change} />
      {change.error ? (
        <BrokenCard error={change.error} what={`Change ${change.id}`} />
      ) : (
        <ChangeBody change={change} />
      )}
    </>
  );
}

function ChangeHeader({ change }: { change: ChangeEntry }) {
  const stage = stageShown(change);

  return (
    <PageHeading
      eyebrow={
        <span className="flex flex-wrap items-center gap-2">
          <span>In Flight</span>
          <Badge
            size="sm"
            variant={
              stage === "released" || stage === "archived"
                ? "success"
                : "outline"
            }
          >
            {STAGE_LABEL[stage]}
          </Badge>
          {change.target ? (
            <Badge size="sm" variant="info">
              <CalendarBlank aria-hidden size={12} />
              {formatDate(change.target)}
            </Badge>
          ) : null}
        </span>
      }
      title={<InlineMarkdown text={change.title} />}
    >
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <Text as="span" className="font-mono" size="xs" tone="secondary">
          openspec/changes/{change.id}
        </Text>
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
        <Text as="span" size="xs" tone="secondary">
          {change.lastMoved
            ? `moved ${relativeTime(change.lastMoved)}`
            : change.created
              ? `created ${formatDate(change.created)}`
              : "undated"}
        </Text>
        {change.deltas.length === 0 ? (
          <span className="ml-auto">
            <WithdrawAction change={change} />
          </span>
        ) : null}
      </div>
    </PageHeading>
  );
}

function ChangeBody({ change }: { change: ChangeEntry }) {
  const index = useManualIndex();
  const archive = useArchive();
  const document = useChangeDocument(change.id);
  const stage = stageShown(change);
  const artifacts = index.snapshot.schemas[change.schema] ?? [];

  return (
    <>
      <StageStepper stage={stage} />
      <YourTurnCard artifacts={artifacts} change={change} stage={stage} />

      <ChangeStatus
        archived={
          archive.status === "ready" ? archive.archive.changes : undefined
        }
        change={change}
        document={document.status === "ready" ? document.document : undefined}
        index={index}
      />

      {document.status === "loading" ? (
        <div aria-busy="true" className="my-5 space-y-3">
          <Skeleton className="h-12 w-full rounded-(--radius-2xl)" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-40 w-full rounded-(--radius-2xl)" />
        </div>
      ) : null}
      {document.status === "unavailable" ? (
        <div className="my-5 space-y-4">
          <EmptyState
            compact
            description={`The change's files could not be read: ${document.reason}. The facts above and the proposer's own why below are what the board already knew.`}
            title="Files unavailable"
          />
          {/* The only place the why is read outside the Product tab: with no
              files in hand, the tab that carries it cannot open. */}
          <section aria-label="Why">
            <MarkdownView
              baseDir={`openspec/changes/${change.id}`}
              className="manual-prose"
              index={index}
              text={change.why}
            />
          </section>
        </div>
      ) : null}
      {document.status === "ready" ? (
        <ChangeTabs
          change={change}
          document={document.document}
          index={index}
        />
      ) : null}
    </>
  );
}
