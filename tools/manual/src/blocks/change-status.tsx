import { cn } from "@grade10/design-system/lib/utils";
import type { ReactNode } from "react";
import { dependenciesOf, type ManualIndex } from "../api/derive";
import { handoffsOf, type LandingDates } from "../api/handoff";
import { overlaysOf } from "../api/overlays";
import { roundlessGroupsOf } from "../api/rounds";
import { stageShown } from "../api/stage-view";
import { taskTotals } from "../api/stages";
import type { ChangeDocument, ChangeEntry } from "../api/types";
import {
  ArtifactList,
  DeliveryRow,
  HandoffRow,
  QuestionList,
  RoundsList,
} from "./artifact-list";
import { MainStateNote, SpecLines } from "./change-facts";
import { OverlayChips } from "./change-overlays";
import { Attribution, TaskProgress } from "./change-views";
import { HandsTable } from "./hands-table";
import { OnThePages } from "./on-the-pages";
import { ThreadSection } from "./thread-section";

/**
 * Where the change stands, as the page reads it: one labelled row per fact.
 * A fact the change does not carry is left off, with two exceptions - On the
 * pages and the Thread stand whatever the change holds, because "this change
 * marks no page section" and "no history" are facts a reviewer came to read,
 * and each says so in one compact secondary line. The board's card says the
 * same things in the same components, unlabelled, because a card is read as a
 * whole and a page is read a line at a time.
 *
 * The rows the stage brought are in the order the page asks for them — the
 * hands, the artifacts, delivery, then the handoff — and the rows that were
 * here before follow. The handoff waits on the change's document, because the
 * only thing that dates a stage landing is when each artifact landed.
 *
 * "Beside the stage" carries the whole dependency and suite reading, not just
 * the overlay's own compact chip: a separate "Blocked by" row and a "Test
 * cases" row used to repeat the same blocking dependency and the same
 * verdict a second time, in fuller form. `OverlayChips` takes the change's
 * dependencies and suites directly now, so the one row is where both facts
 * live.
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
  const stage = stageShown(change);
  const artifacts = index.snapshot.schemas[change.schema] ?? [];
  const questions = change.questions ?? [];
  const overlays = overlaysOf(change, {
    now: Date.now(),
    released: new Set(archived.map((one) => one.id)),
    artifacts,
  });
  const handoffs = document
    ? handoffsOf(change, stage, artifacts, datesOf(document))
    : [];
  const rounds = change.rounds ?? [];
  const showRounds =
    rounds.length > 0 ||
    roundlessGroupsOf(rounds, change.taskGroups).length > 0;

  return (
    <dl className="my-5 grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
      {change.mainState ? (
        <Row className="[&>div]:mt-0">
          <MainStateNote change={change} />
        </Row>
      ) : null}

      {overlays.length > 0 || dependencies.length > 0 ? (
        <Row className="[&>ul]:mt-0" label="Beside the stage">
          <OverlayChips
            dependencies={dependencies}
            overlays={overlays}
            suites={change.suites ?? []}
          />
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

      {/* After the artifacts and before delivery: the marked lines are what
          the artifacts are written about, said in the words the pages say
          them in. */}
      <Row label="On the pages">
        <OnThePages change={change} index={index} />
      </Row>

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

      {showRounds ? (
        <Row label="Rounds">
          <RoundsList rounds={rounds} taskGroups={change.taskGroups} />
        </Row>
      ) : null}

      {/* Last, because it is the only row that is not a state: the facts read
          first and the history after them. It waits on the change's document,
          which is where the commits are read. */}
      {document ? (
        <Row label="Thread">
          <ThreadSection
            askedAt={document.askedAt}
            change={change}
            history={document.history}
          />
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
