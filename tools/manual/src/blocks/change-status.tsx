import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import {
  dependenciesOf,
  type ManualIndex,
  questionsOf,
  taskTotals,
} from "../api/derive";
import { handoffsOf, type LandingDates } from "../api/handoff";
import { stageShown } from "../api/stage-view";
import { overlaysOf } from "../api/stages";
import type { ChangeDocument, ChangeEntry } from "../api/types";
import {
  ArtifactList,
  DeliveryRow,
  HandoffRow,
  QuestionList,
} from "./artifact-list";
import {
  DependencyPills,
  MainStateNote,
  nextAction,
  SpecLines,
  SuiteLines,
} from "./change-facts";
import { OverlayChips } from "./change-overlays";
import { Attribution, TaskProgress } from "./change-views";
import { CopyableCommand } from "./copyable-command";
import { HandsTable } from "./hands-table";

/**
 * Where the change stands, as the page reads it: one labelled row per fact,
 * and no row for a fact the change does not carry. The board's card says the
 * same things in the same components, unlabelled, because a card is read as a
 * whole and a page is read a line at a time.
 *
 * The rows the stage brought are in the order the page asks for them — the
 * hands, the artifacts, delivery, then the handoff — and the rows that were
 * here before follow. The handoff waits on the change's document, because the
 * only thing that dates a stage landing is when each artifact landed.
 */
export function ChangeStatus({
  change,
  index,
  archived = [],
  document,
}: {
  change: ChangeEntry;
  index: ManualIndex;
  archived?: ChangeEntry[];
  /** The change's files, once they have been fetched: what dates the handoff. */
  document?: ChangeDocument;
}) {
  const dependencies = dependenciesOf(change, index, archived);
  const { done, total } = taskTotals(change);
  const groups = change.taskGroups.length;
  const next = nextAction(change);
  const stage = stageShown(change);
  const artifacts = index.snapshot.schemas[change.schema] ?? [];
  const questions = questionsOf(change, index.pages);
  const overlays = overlaysOf(change, {
    now: Date.now(),
    released: new Set(archived.map((one) => one.id)),
    artifacts,
  });
  const handoffs = document ? handoffsOf(change, stage, datesOf(document)) : [];

  return (
    <dl className="my-5 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
      {change.mainState ? (
        <Row className="[&>div]:mt-0">
          <MainStateNote change={change} />
        </Row>
      ) : null}

      {overlays.length > 0 ? (
        <Row className="[&>ul]:mt-0" label="Beside the stage">
          <OverlayChips overlays={overlays} />
        </Row>
      ) : null}

      <Row label="Hands">
        <HandsTable change={change} />
      </Row>

      {artifacts.length > 0 ? (
        <Row label="Artifacts">
          <ArtifactList
            artifacts={artifacts}
            change={change}
            questions={questions}
          />
        </Row>
      ) : null}

      <Row label="Delivery">
        <DeliveryRow change={change} />
      </Row>

      {handoffs.length > 0 ? (
        <Row label="Handoff">
          <HandoffRow handoffs={handoffs} />
        </Row>
      ) : null}

      {questions.length > 0 ? (
        <Row label="Open questions">
          <QuestionList questions={questions} />
        </Row>
      ) : null}

      {dependencies.length > 0 ? (
        <Row label="Blocked by">
          <ul className="flex flex-wrap items-center gap-1.5">
            <DependencyPills dependencies={dependencies} />
          </ul>
        </Row>
      ) : null}

      {change.suites && change.suites.length > 0 ? (
        <Row className="[&>ul]:mt-0" label="Test cases">
          <SuiteLines change={change} />
        </Row>
      ) : null}

      <Row label="Owners">
        <Attribution change={change} claim />
      </Row>

      {change.deltas.length > 0 ? (
        <Row label="Specs">
          <SpecLines change={change} />
        </Row>
      ) : null}

      {total > 0 ? (
        <Row label="Tasks">
          <TaskProgress
            done={done}
            label={`${groups} ${groups === 1 ? "group" : "groups"}`}
            total={total}
          />
        </Row>
      ) : null}

      {next ? (
        <Row label="Next">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <CopyableCommand command={next.command} />
            <Text as="span" size="xs" tone="secondary">
              {next.note}
            </Text>
          </span>
        </Row>
      ) : null}
    </dl>
  );
}

/** When each artifact of the change landed, keyed by the schema's artifact
 * id — the commit dates the document already carries, read as the one thing
 * that can date a stage landing. */
function datesOf(document: ChangeDocument): LandingDates {
  const dates: LandingDates = {};
  for (const artifact of document.artifacts) {
    if (artifact.present && artifact.lastCommit) {
      dates[artifact.name] = artifact.lastCommit.date;
    }
  }
  return dates;
}

/** A label-less row still needs its `dt`: the grid's first column is what
 * keeps every value on the same left edge. */
function Row({
  label,
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <>
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className={cn("min-w-0", className)}>{children}</dd>
    </>
  );
}
