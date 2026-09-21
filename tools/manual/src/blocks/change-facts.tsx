import { Text } from "@grade10/design-system/components/display/text";
import { Warning } from "@phosphor-icons/react";
import { Link } from "react-router";
import { citeTarget, type ManualIndex } from "../api/derive";
import type { Overlay } from "../api/overlays";
import { draftedOf, roleTitle, stageShown } from "../api/stage-view";
import { handOf, taskTotals } from "../api/stages";
import type { ChangeEntry, SchemaArtifact } from "../api/types";
import { Hands } from "./change-hand";
import { OverlayChips } from "./change-overlays";
import {
  Attribution,
  DeltaKinds,
  DeltaSpec,
  TaskProgress,
} from "./change-views";
import { CopyableCommand } from "./copyable-command";

/**
 * What a review reads off a change at a glance, wherever the change is shown:
 * whose turn it is, what sits beside its stage, where it stands against main,
 * who owns it and which specs it touches, how far the tasks are, and the next
 * action. The board's card composes them in one column; the change page lays
 * the same components out as a labelled grid, so the two never disagree about
 * a fact.
 *
 * The overlays are the card's one list of chips: exactly the five, read from
 * the derivation the change page and every message read, so a dependency and
 * a suite are each named once rather than twice under two names. What one of
 * them carries beyond its chip — every dependency, a suite's counts — is the
 * change page's, a labelled line at a time.
 */
export function ChangeFacts({
  change,
  artifacts = [],
  overlays = [],
  progress = false,
}: {
  change: ChangeEntry;
  /** The change's schema artifacts, for whose turn it is and whose each
   * artifact is. */
  artifacts?: SchemaArtifact[];
  /** What sits beside the stage, as the board derived it. */
  overlays?: Overlay[];
  /** Show the task bar here — where the task groups are not laid out below. */
  progress?: boolean;
}) {
  const { done, total } = taskTotals(change);

  return (
    <>
      <MainStateNote change={change} />

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <Hands
          change={change}
          roles={handOf(change, stageShown(change), artifacts)}
        />
        <Attribution change={change} claim />
        <ul className="flex flex-wrap items-center gap-2">
          {change.deltas.map((delta) => (
            <li className="flex items-center gap-1" key={delta.spec}>
              <DeltaSpec spec={delta.spec} />
              <DeltaKinds kinds={delta.kinds} />
            </li>
          ))}
        </ul>
      </div>

      <OverlayChips overlays={overlays} />

      {total > 0 && progress ? (
        <div className="mt-3">
          <TaskProgress
            done={done}
            label={`${change.taskGroups.length} ${change.taskGroups.length === 1 ? "group" : "groups"}`}
            total={total}
          />
        </div>
      ) : null}

      <NextAction change={change} />
    </>
  );
}

/**
 * The next action for the change's own stage, as text to paste at an agent —
 * the loop's continuation used to live nowhere, and its first casualty guessed
 * a skill name off a badge.
 *
 * Read from the stage and never from a lane: what a change is waiting on is
 * the command the hand of its stage pastes, and the five stages an agent
 * drafts each name their own. The three it drafts nothing for — the deploy,
 * the cut and the fold — leave the archive, which is the work still to do.
 */
export function nextAction(
  change: ChangeEntry,
): { command: string; note: string }[] {
  const stage = stageShown(change);
  const drafted = draftedOf(stage, change.id);
  // One per hand the stage names: Designed is taken by two, and a card that
  // offered one of their commands left the other hand nothing to paste.
  if (drafted)
    return drafted.moves.map((one) => ({
      command: one.command,
      note: `${roleTitle(one.role)}: ${one.move}`,
    }));
  if (stage === "archived") return [];
  return [
    {
      command: `/archive-change ${change.id}`,
      note: "confirm it deployed, then fold it into the durable specs",
    },
  ];
}

export function NextAction({ change }: { change: ChangeEntry }) {
  return (
    <>
      {nextAction(change).map((action) => (
        <div
          className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1"
          key={action.command}
        >
          <Text as="span" size="xs" tone="secondary">
            Next
          </Text>
          <CopyableCommand command={action.command} />
          <Text as="span" size="xs" tone="secondary">
            {action.note}
          </Text>
        </div>
      ))}
    </>
  );
}

/**
 * Where the change stands against the store's main, where the plan is read.
 * `pnpm plan claim` refuses a change that is not there, and a checkout copy
 * that differs from it is not the brief the team settled.
 */
export function MainStateNote({ change }: { change: ChangeEntry }) {
  const state = change.mainState;
  if (!state) return null;
  const stage = stageShown(change);
  const blocked =
    stage === "on-staging" || stage === "released" || stage === "archived"
      ? "archived"
      : "claimed or implemented";

  return (
    <div className="mt-2.5 flex items-baseline gap-1.5 text-warning">
      <span className="inline-flex translate-y-0.5">
        <Warning aria-hidden size={13} weight="fill" />
      </span>
      <Text as="span" size="xs">
        {state.state === "unmerged"
          ? `not on ${state.ref} — it cannot be ${blocked} until the store branch merges`
          : `${state.files} artifact(s) in this checkout differ from ${state.ref} — merge these edits, or update this checkout to ${state.ref}, before building against this`}
      </Text>
    </div>
  );
}

/** Past this many specs the list stops being a fact and becomes the
 * Requirements tab's job. */
const FIRST_SPECS = 3;

/** Which specs a change touches, one line apiece. */
export function SpecLines({ change }: { change: ChangeEntry }) {
  if (change.deltas.length === 0) return null;
  const shown = change.deltas.slice(0, FIRST_SPECS);
  const rest = change.deltas.length - shown.length;

  return (
    <ul className="space-y-1">
      {shown.map((delta) => (
        <li className="flex flex-wrap items-center gap-1.5" key={delta.spec}>
          <DeltaSpec spec={delta.spec} />
          <DeltaKinds kinds={delta.kinds} />
        </li>
      ))}
      {rest > 0 ? (
        <li>
          <Link
            className="text-secondary-foreground text-xs hover:text-foreground"
            to={`/in-flight/${change.id}?tab=specs`}
          >
            +{rest} more
          </Link>
        </li>
      ) : null}
    </ul>
  );
}

/** The ids a proposal's `## References` names, as the deep links they were
 * written to be — the row somebody was reading when they proposed it. */
export function Cites({
  index,
  cites,
}: {
  index: ManualIndex;
  cites: string[];
}) {
  return (
    <div className="mt-3">
      <Text as="p" className="mb-1.5" size="xs" tone="secondary">
        About
      </Text>
      <ul className="flex flex-wrap gap-1.5">
        {cites.map((id) => {
          const target = citeTarget(index, id);
          return (
            <li key={id}>
              {target.to ? (
                <Link
                  className="flex items-baseline gap-1.5 rounded-(--radius-lg) border border-border bg-background-subtle px-2 py-1 text-xs transition-colors hover:border-border-strong hover:bg-muted"
                  to={target.to}
                >
                  <span className="shrink-0 font-mono text-secondary-foreground">
                    {id}
                  </span>
                  {target.label === id ? null : (
                    <span className="min-w-0 leading-snug">{target.label}</span>
                  )}
                </Link>
              ) : (
                <span
                  className="flex items-baseline gap-1.5 rounded-(--radius-lg) border border-border-subtle px-2 py-1 text-xs"
                  title="Nothing in this snapshot answers to that id yet"
                >
                  <span className="font-mono text-secondary-foreground">
                    {id}
                  </span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
