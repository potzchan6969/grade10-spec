import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "react-router";
import { artifactLabel } from "../api/change-artifacts";
import type { Handoff } from "../api/handoff";
import { askedIdsOf, roundArtifactOf, roundlessGroupsOf } from "../api/rounds";
import {
  behindLabelOf,
  type HandShown,
  handShown,
  ROLE_LABEL,
  STAGE_LABEL,
} from "../api/stage-view";
import { behindOf } from "../api/stages";
import { suiteTotalsOf } from "../api/suites";
import type {
  ChangeEntry,
  OpenQuestion,
  RoundRow,
  SchemaArtifact,
  TaskGroup,
} from "../api/types";
import { waiverOf } from "../api/waivers";
import { HandFace } from "./change-hand";
import { ClampedText } from "./clamped-text";
import { InlineMarkdown } from "./inline-markdown";

/**
 * Each artifact of a change: whether it is fresh, behind, not owed or not yet
 * written, what it still has open, and whose word landed it.
 *
 * In the schema's order, because that is the order they are written in and the
 * order a reader walks the change. A waiver is shown as not owed and fresh
 * with the reason on it — a line that stands for a file is an answer, and
 * showing it as missing would put an impossible row on a designer's list.
 */
export function ArtifactList({
  change,
  artifacts,
  questions,
}: {
  change: ChangeEntry;
  artifacts: SchemaArtifact[];
  questions: OpenQuestion[];
}) {
  const written = new Set(change.written);
  const behind = new Map(
    behindOf(change, artifacts).map((one) => [one.artifact, one]),
  );
  // The store already resolved which draft a round was reading when it
  // raised a numbered question — `read-changes.mts` marks it there, falling
  // back to `decisions`, the file the row lives in, only where no round
  // names one — so grouping here is a plain read of `question.artifact`.
  const asked = new Map<string, OpenQuestion[]>();
  for (const question of questions) {
    asked.set(question.artifact, [
      ...(asked.get(question.artifact) ?? []),
      question,
    ]);
  }

  return (
    <ul className="flex flex-col gap-1">
      {artifacts.map((artifact) => {
        const waiver = waiverOf(change, artifact);
        const late = behind.get(artifact.id);
        const open = asked.get(artifact.id) ?? [];
        const openIds = open.flatMap((one) => (one.id ? [one.id] : []));
        // A numbered question's badge is its own answer; the count text is
        // only owed to a page's ❓ line, which carries no id to show instead.
        const uncounted = open.length - openIds.length;
        const landed = change.landedBy?.[artifact.id];

        return (
          <li
            className="flex flex-wrap items-center gap-x-2 gap-y-1"
            data-artifact={artifact.id}
            key={artifact.id}
          >
            <Text as="span" className="min-w-36" size="xs" tone="secondary">
              {artifactLabel(artifact.id)}
            </Text>

            {waiver !== undefined ? (
              <>
                <Badge size="sm" variant="outline">
                  not owed
                </Badge>
                <Badge size="sm" variant="success">
                  fresh
                </Badge>
                {waiver === "" ? null : (
                  <Text as="span" size="xs" tone="secondary">
                    {waiver}
                  </Text>
                )}
              </>
            ) : !written.has(artifact.id) ? (
              <Badge size="sm" variant="outline">
                not yet written
              </Badge>
            ) : late ? (
              <>
                <Badge size="sm" variant="warning">
                  behind
                </Badge>
                <Text as="span" size="xs" tone="secondary">
                  {behindLabelOf(late)}
                </Text>
              </>
            ) : (
              <Badge size="sm" variant="success">
                fresh
              </Badge>
            )}

            {uncounted > 0 ? (
              <Text as="span" size="xs" tone="secondary">
                {`${uncounted} open question${uncounted === 1 ? "" : "s"}`}
              </Text>
            ) : null}

            {openIds.length > 0 ? (
              <span className="flex flex-wrap items-center gap-1">
                {openIds.map((id) => (
                  <Link key={id} to={`/in-flight/${change.id}?tab=decisions`}>
                    <Badge size="sm" variant="outline">
                      {id}
                    </Badge>
                  </Link>
                ))}
              </span>
            ) : null}

            {landed ? (
              <span className="flex items-center gap-1.5">
                <Text as="span" size="xs" tone="secondary">
                  landed by
                </Text>
                <HandFace handle={landed} />
              </span>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Where the code is: `main`, staging, and the release that carried the
 * change. Each is said either way — "not deployed" is the fact a reader wants
 * from a change whose tasks are all ticked.
 *
 * The suite's own automated count rides here too, against its total: a run
 * sheet leaves those cases out, so this is where a reader sees how many the
 * store already proves on every push rather than on a tester's pass
 * (`shared-planning-agent-rounds-SC-61`).
 */
export function DeliveryRow({ change }: { change: ChangeEntry }) {
  const state = change.mainState;
  const { total: totalCases, automated: automatedCases } = suiteTotalsOf(
    change.suites ?? [],
  );

  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <li className="flex items-center gap-1.5">
        <Text as="span" size="xs" tone="secondary">
          main
        </Text>
        <Badge size="sm" variant={state ? "warning" : "success"}>
          {state
            ? state.state === "unmerged"
              ? `not on ${state.ref}`
              : `differs from ${state.ref}`
            : "landed"}
        </Badge>
      </li>
      <li className="flex items-center gap-1.5">
        <Text as="span" size="xs" tone="secondary">
          staging
        </Text>
        {change.deployedEnv === undefined ? (
          <Badge size="sm" variant="outline">
            not deployed
          </Badge>
        ) : (
          <Badge size="sm" variant="success">
            {change.deployedBuild === undefined
              ? change.deployedEnv
              : `${change.deployedEnv} · ${change.deployedBuild}`}
          </Badge>
        )}
      </li>
      <li className="flex items-center gap-1.5">
        <Text as="span" size="xs" tone="secondary">
          release
        </Text>
        {change.releasedIn === undefined ? (
          <Badge size="sm" variant="outline">
            unreleased
          </Badge>
        ) : (
          <Badge size="sm" variant="success">
            {change.releasedIn}
          </Badge>
        )}
      </li>
      {totalCases > 0 ? (
        <li className="flex items-center gap-1.5">
          <Text as="span" size="xs" tone="secondary">
            automated
          </Text>
          <Badge size="sm" variant="outline">
            {`${automatedCases}/${totalCases}`}
          </Badge>
        </li>
      ) : null}
    </ul>
  );
}

/**
 * Where the days went: for each stage the change has left, the days from that
 * stage landing to the next hand's first word.
 *
 * A stage nothing has answered yet counts to today and says so far, because a
 * stage that landed a fortnight ago with no word after it is the reading worth
 * having. A stage whose landing no commit dates says the landing is undated
 * rather than reading as none: the row cannot tell a landing that never
 * happened from one whose date it could not read.
 */
export function HandoffRow({ handoffs }: { handoffs: Handoff[] }) {
  if (handoffs.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1">
      {handoffs.map((handoff) => (
        <li
          className="flex flex-wrap items-center gap-x-2 gap-y-1"
          key={handoff.stage}
        >
          <Text as="span" className="min-w-36" size="xs" tone="secondary">
            {STAGE_LABEL[handoff.stage]}
          </Text>
          {handoff.days === undefined ? (
            <Text as="span" size="xs" tone="secondary">
              no dated landing
            </Text>
          ) : (
            <Badge size="sm" variant="outline">
              {daysShown(handoff.days, handoff.open)}
            </Badge>
          )}
          {handoff.role === undefined ? (
            handoff.open && handoff.days !== undefined ? (
              <Text as="span" size="xs" tone="secondary">
                nobody has answered it yet
              </Text>
            ) : null
          ) : handoff.hand === undefined ? (
            <Text as="span" size="xs" tone="secondary">
              {`${ROLE_LABEL[handoff.role]} — open`}
            </Text>
          ) : (
            <HandFace handle={handoff.hand} />
          )}
        </li>
      ))}
    </ul>
  );
}

/** How long a stage has been waiting, as the row says it: a stage that landed
 * today and is still open says landed today, because "0 days so far" reads as
 * a count of nothing rather than as the day it is. */
function daysShown(days: number, open: boolean): string {
  if (open && days === 0) return "landed today";
  return `${days} ${days === 1 ? "day" : "days"}${open ? " so far" : ""}`;
}

/**
 * What nobody has settled: one line per open question, with the number the
 * decisions row carries and the hand it is addressed to.
 *
 * A stage moving does not close a question — the questions are listed
 * whatever rung the change has reached, which is what keeps one from being
 * lost behind a stage that moved on without it.
 *
 * The ids are the row's answer: a question is answered by its id, and the
 * thread that carries the answer sits on My turn's rows, where a reader meets
 * one change among many. This page is one change's already, so its thread
 * link is the Your turn card's and nowhere else.
 */
export function QuestionList({ questions }: { questions: OpenQuestion[] }) {
  if (questions.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1">
      {questions.map((question) => (
        <li
          className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
          key={`${question.artifact}:${question.id ?? question.section}:${question.text}`}
        >
          {question.id ? (
            <Badge size="sm" variant="outline">
              {question.id}
            </Badge>
          ) : null}
          {/* A page's ❓ line and a decisions cell are both store prose, so
              the row reads their bold and their backticks rather than the
              marks around them. */}
          <Text as="span" size="xs">
            <InlineMarkdown text={question.text} />
          </Text>
          {/* The hand `handShown` reads: the handle the change names for
              that role, or the role itself where it names nobody. */}
          <Hand shown={handShown(question)} />
        </li>
      ))}
    </ul>
  );
}

/** One question's hand, the handle in its own type and the open role in the
 * row's words. Shared by the artifact rows and On the pages, which show the
 * same fact in the same two ways. */
export function Hand({ shown }: { shown: HandShown }) {
  return (
    <Text
      as="span"
      className={shown.open ? undefined : "font-mono"}
      size="xs"
      tone="secondary"
    >
      {shown.text}
    </Text>
  );
}

/** A round row's own `Artifact` cell, read for a reader: normalised the way
 * every reading of this column is, so a group written `3`, `3.` or `group 3`
 * all become "Group 3" and a round on the plan and a round on the proposal
 * are never confused at a glance. */
function roundArtifactLabel(cell: string): string {
  const resolved = roundArtifactOf(cell) ?? cell.trim();
  return /^\d+$/.test(resolved) ? `Group ${resolved}` : artifactLabel(resolved);
}

/**
 * What each round of the change ran, one line per `rounds.md` row: the
 * artifact or group it read, the perspectives dispatched, what stood and
 * what was asked — and, beside them, a ticked task group no row names yet,
 * shown as carrying none (`shared-planning-agent-rounds-SC-51`).
 *
 * Absent before the first round lands and where no ticked group is missing
 * one, the same way the page's other rows go quiet rather than show an
 * empty list (`shared-planning-agent-rounds-SC-53`).
 */
export function RoundsList({
  rounds,
  taskGroups,
}: {
  rounds: RoundRow[];
  taskGroups: TaskGroup[];
}) {
  const missing = roundlessGroupsOf(rounds, taskGroups);

  return (
    <ul className="flex flex-col gap-1">
      {rounds.map((round) => (
        <li
          className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
          key={`${round.round}:${round.artifact}:${round.asked}`}
        >
          <Badge size="sm" variant="outline">
            {`Round ${round.round}`}
          </Badge>
          <Text as="span" className="min-w-28" size="xs" weight="medium">
            {roundArtifactLabel(round.artifact)}
          </Text>
          <Text as="span" size="xs" tone="secondary">
            {round.perspectives}
          </Text>
          {/* Clamped: what stood is a sentence per reader, and printed whole
              it made every round a paragraph on the change page. Read more
              opens it in place, and `InlineMarkdown` keeps the cell's
              backticks. */}
          <ClampedText lines={2} text={round.stood} />
          {askedIdsOf(round.asked).map((id) => (
            <Badge key={id} size="sm" variant="outline">
              {id}
            </Badge>
          ))}
        </li>
      ))}
      {missing.map((group) => (
        <li
          className="flex flex-wrap items-baseline gap-x-2 gap-y-1"
          key={`group-${group.num}`}
        >
          <Text as="span" className="min-w-28" size="xs" weight="medium">
            {`Group ${group.num}`}
          </Text>
          <Text as="span" size="xs" tone="secondary">
            no round
          </Text>
        </li>
      ))}
    </ul>
  );
}
