import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { artifactLabel } from "../api/change-artifacts";
import type { Handoff } from "../api/handoff";
import { behindLabelOf, ROLE_LABEL, STAGE_LABEL } from "../api/stage-view";
import { behindOf } from "../api/stages";
import type { ChangeEntry, OpenQuestion, SchemaArtifact } from "../api/types";
import { waiverOf } from "../api/waivers";
import { HandFace } from "./change-hand";

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
  const asked = new Map<string, number>();
  for (const question of questions) {
    asked.set(question.artifact, (asked.get(question.artifact) ?? 0) + 1);
  }

  return (
    <ul className="flex flex-col gap-1">
      {artifacts.map((artifact) => {
        const waiver = waiverOf(change, artifact);
        const late = behind.get(artifact.id);
        const open = asked.get(artifact.id) ?? 0;
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

            {open > 0 ? (
              <Text as="span" size="xs" tone="secondary">
                {`${open} open question${open === 1 ? "" : "s"}`}
              </Text>
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
 */
export function DeliveryRow({ change }: { change: ChangeEntry }) {
  const state = change.mainState;

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
            {change.deployedEnv}
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
    </ul>
  );
}

/**
 * Where the days went: for each stage the change has left, the days from that
 * stage landing to the next hand's first word.
 *
 * A stage nothing has answered yet counts to today and says so far, because a
 * stage that landed a fortnight ago with no word after it is the reading worth
 * having. A stage no commit dates says that instead of reading as none.
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
              no landing dates it
            </Text>
          ) : (
            <Badge size="sm" variant="outline">
              {`${handoff.days} ${handoff.days === 1 ? "day" : "days"}${
                handoff.open ? " so far" : ""
              }`}
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

/**
 * What nobody has settled: one line per open question, with the number the
 * decisions row carries and the hand it is addressed to.
 *
 * A stage moving does not close a question — the questions are listed
 * whatever rung the change has reached, which is what keeps one from being
 * lost behind a stage that moved on without it.
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
          <Text as="span" size="xs">
            {question.text}
          </Text>
          {/* The hand is the handle the change names for that role, and the
              role itself where it names nobody — said as a role rather than
              as a handle nobody answers to. */}
          {question.hand === question.role ? (
            <Text as="span" size="xs" tone="secondary">
              {`${question.role} — open`}
            </Text>
          ) : (
            <Text as="span" className="font-mono" size="xs" tone="secondary">
              {`@${question.hand}`}
            </Text>
          )}
        </li>
      ))}
    </ul>
  );
}
