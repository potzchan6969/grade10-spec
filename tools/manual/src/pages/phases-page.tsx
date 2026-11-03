import { EmptyState } from "@grade10/design-system/components/display/empty-state";
import { Text } from "@grade10/design-system/components/display/text";
import { SegmentedControl } from "@grade10/design-system/components/forms/segmented-control";
import { SegmentedControlItem } from "@grade10/design-system/components/forms/segmented-control-item";
import { cn } from "@grade10/design-system/lib/utils";
import { FlagBanner } from "@phosphor-icons/react";
import { type ReactNode, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import {
  everyPhase,
  firstUnreleased,
  qaQueue,
  type ReleaseCheck,
  readUnits,
  releaseCheck,
  type UnitReading,
  unitsIn,
  waiterLabel,
  waitingOn,
} from "../api/board";
import type { ManualIndex } from "../api/derive";
import type { Phase, Unit } from "../api/phases";
import { atRisk, STEP_LABEL, type Step } from "../api/readiness";
import { relativeTime } from "../api/time";
import type { TeamMember } from "../api/types";
import { useManualIndex } from "../api/use-manual-index";
import {
  releaseOf,
  useDeskVerdicts,
  type VerdictsState,
  verdictsOf,
} from "../api/use-release";
import { AtRiskChip, STEP_TONE, StepChip } from "../blocks/phase-chip";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

/**
 * The phase board: every unit in a phase, P0 first, opening on the
 * release's own check. Derived from the pages, the suites and the run
 * desk's verdicts, fetched once when the board opens.
 */
export function PhasesPage() {
  const index = useManualIndex();
  const reading = releaseOf(index);
  const params = useParams();
  useDocumentTitle("Release phases");
  const verdicts = useDeskVerdicts("board", reading !== null);
  const readings = useMemo(
    () => (reading ? readUnits(reading, verdictsOf(verdicts)) : []),
    [reading, verdicts],
  );

  const head = (
    <PageHeading
      summary="Every unit in a phase, P0 first, with its readiness, its lines, its cases and its latest run."
      title="Release phases"
    />
  );
  if (!reading) {
    return (
      <>
        {head}
        <EmptyState
          description="This manual has no phases.yaml, so nothing is placed in a release."
          icon={<FlagBanner aria-hidden />}
          title="No phases"
        />
      </>
    );
  }
  const phase = params.phase
    ? reading.phases.find((one) => one.id === params.phase)
    : firstUnreleased(reading.phases);
  if (!phase) {
    return (
      <>
        {head}
        <EmptyState
          description={`phases.yaml names no phase \`${params.phase}\`.`}
          icon={<FlagBanner aria-hidden />}
          title="No such phase"
        />
      </>
    );
  }

  return (
    <>
      {head}
      <PhaseStrip
        current={phase.id}
        phases={reading.phases}
        readings={readings}
      />
      <Board
        index={index}
        phase={phase}
        phases={reading.phases}
        readings={readings}
        verdicts={verdicts}
      />
      <QaQueue index={index} readings={readings} />
      <EveryPhase phases={reading.phases} readings={readings} />
    </>
  );
}

function StepBar({
  steps,
  label,
  className,
}: {
  steps: [Step, number][];
  label: string;
  className?: string;
}) {
  return (
    <div
      aria-label={label}
      className={cn(
        "flex h-2 gap-px overflow-hidden rounded-full bg-muted",
        className,
      )}
      role="img"
    >
      {steps.map(([step, count]) => (
        <span
          className={STEP_TONE[step].dot}
          key={step}
          style={{ flexGrow: count }}
        />
      ))}
    </div>
  );
}

const stepsLabel = (name: string, steps: [Step, number][]) =>
  `${name}: ${
    steps.length === 0
      ? "no units"
      : steps.map(([step, count]) => `${count} ${STEP_LABEL[step]}`).join(", ")
  }`;

/** The phases in release order, each with its units by readiness; the one
 * open on the board is pressed. */
function PhaseStrip({
  phases,
  readings,
  current,
}: {
  phases: Phase[];
  readings: UnitReading[];
  current: string;
}) {
  const counts = everyPhase(readings, phases);
  return (
    <nav aria-label="Phases" className="mb-8">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
        {counts.map(({ phase, units, steps }) => (
          <li key={phase.id}>
            <Link
              aria-current={phase.id === current ? "page" : undefined}
              className={cn(
                "flex h-full flex-col gap-2 rounded-(--radius-xl) border bg-card p-3 outline-none transition-colors hover:border-border-strong focus-visible:ring-3 focus-visible:ring-ring/50",
                phase.id === current ? "border-foreground" : "border-border",
              )}
              to={`/phases/${phase.id}`}
            >
              <span className="flex items-baseline gap-1.5">
                <Text as="span" face="mono" size="xs" tone="muted">
                  {phase.order + 1}
                </Text>
                <Text as="span" size="sm" weight="bold">
                  {phase.name}
                </Text>
              </span>
              <StepBar label={stepsLabel(phase.name, steps)} steps={steps} />
              <Text as="span" size="xs" tone="secondary">
                {phase.released
                  ? `Released ${phase.released}`
                  : `${units} unit${units === 1 ? "" : "s"}`}
              </Text>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

type Grouping = "priority" | "waiting";

function Board({
  index,
  phase,
  phases,
  readings,
  verdicts,
}: {
  index: ManualIndex;
  phase: Phase;
  phases: Phase[];
  readings: UnitReading[];
  verdicts: VerdictsState;
}) {
  const [grouping, setGrouping] = useState<Grouping>("priority");
  const inPhase = unitsIn(readings, phase.id);
  const check = releaseCheck(inPhase, phases, phase.id);
  const steps = everyPhase(inPhase, [phase])[0].steps;
  const today = new Date();
  const team = index.snapshot.team;
  const runs = new Map(
    (verdictsOf(verdicts)?.runs ?? []).map((run) => [run.id, run.name]),
  );

  return (
    <section aria-labelledby="board-phase" className="mb-12">
      <h2
        className="font-bold font-heading text-foreground text-manual-h2 leading-tight"
        id="board-phase"
      >
        {phase.name}
      </h2>
      <Text as="p" className="mt-1" size="sm" tone="secondary">
        QA on {phase.env} ·{" "}
        {phase.target ? `target ${phase.target}` : "no target yet"}
        {phase.released ? ` · released ${phase.released}` : ""}
      </Text>

      <LaunchCheck check={check} phase={phase} verdicts={verdicts} />

      {inPhase.length === 0 ? (
        <Text as="p" className="mt-6" size="sm" tone="secondary">
          No page places a line in {phase.name} yet.
        </Text>
      ) : (
        <>
          <div className="mt-6 flex flex-col gap-2">
            <StepBar
              className="h-2.5"
              label={stepsLabel(phase.name, steps)}
              steps={steps}
            />
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {steps.map(([step, count]) => (
                <li
                  className="flex items-center gap-1.5 text-secondary-foreground text-xs"
                  key={step}
                >
                  <span
                    aria-hidden
                    className={cn("size-2 rounded-full", STEP_TONE[step].dot)}
                  />
                  {STEP_LABEL[step]}
                  <span className="font-semibold text-foreground tabular-nums">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 mb-3 flex flex-wrap items-center justify-between gap-3">
            <Text as="h3" size="base" weight="bold">
              Units
            </Text>
            <SegmentedControl
              aria-label="Group the units"
              onValueChange={(value) => {
                const next = value[0] as Grouping | undefined;
                if (next) setGrouping(next);
              }}
              size="sm"
              value={[grouping]}
            >
              <SegmentedControlItem value="priority">
                P0 first
              </SegmentedControlItem>
              <SegmentedControlItem value="waiting">
                Waiting on
              </SegmentedControlItem>
            </SegmentedControl>
          </div>

          {grouping === "priority" ? (
            <UnitTable
              index={index}
              rows={inPhase.map((reading) => ({ reading }))}
              runs={runs}
              team={team}
              today={today}
            />
          ) : (
            <div className="flex flex-col gap-6">
              {waitingOn(inPhase).map((group) => (
                <section
                  aria-label={`Waiting on ${waiterLabel(group.waiter, team)}`}
                  key={group.waiter}
                >
                  <Text as="h3" className="mb-2" size="sm" weight="bold">
                    {group.waiter === "nobody"
                      ? "Nobody: passed, waiting for the launch"
                      : `Waiting on ${waiterLabel(group.waiter, team)}`}
                    <Text as="span" size="sm" tone="muted">
                      {" "}
                      · {group.units.length}
                    </Text>
                  </Text>
                  <UnitTable
                    index={index}
                    rows={group.units.map(({ reading, why }) => ({
                      reading,
                      why,
                    }))}
                    runs={runs}
                    team={team}
                    today={today}
                  />
                </section>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

/** The release's own check, read by the reader `phase:release` reads by. */
function LaunchCheck({
  check,
  phase,
  verdicts,
}: {
  check: ReleaseCheck;
  phase: Phase;
  verdicts: VerdictsState;
}) {
  const moves = (["P1", "P2"] as const)
    .filter((priority) => check.moves.byPriority[priority] > 0)
    .map((priority) => `${check.moves.byPriority[priority]} ${priority}`)
    .join(", ");
  const facts: { bad: boolean; figure: string; text: string }[] = [
    {
      bad: check.p0.passed < check.p0.total,
      figure: `${check.p0.passed} of ${check.p0.total}`,
      text: "P0 units passed",
    },
    {
      bad: check.failing.units > 0,
      figure: String(check.failing.units),
      text:
        check.failing.units === 0
          ? "failing or blocked"
          : `failing or blocked: ${check.failing.byTriage
              .map(([triage, count]) => `${count} ${triage}`)
              .join(", ")}`,
    },
    {
      bad: check.untriagedAutomatedFails > 0,
      figure: String(check.untriagedAutomatedFails),
      text: "automated fails not triaged",
    },
    {
      bad: check.questions.count > 0,
      figure: String(check.questions.count),
      text: `questions in units that would launch${
        check.questions.units > 0
          ? `, across ${plural(check.questions.units, "unit")}`
          : ""
      }`,
    },
    {
      bad: false,
      figure: String(check.moves.units),
      text: check.to
        ? `will move to ${check.to.name}${moves ? `: ${moves}` : ""}`
        : `not passed, with no phase after ${phase.name}${moves ? `: ${moves}` : ""}`,
    },
  ];
  return (
    <section
      aria-label={`Can ${phase.name} launch`}
      className="mt-5 flex flex-col gap-3 rounded-(--radius-2xl) border border-border-strong bg-background-subtle p-4"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Text as="h3" size="base" weight="bold">
          Can it launch?
        </Text>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 font-medium text-xs leading-none",
            check.launches
              ? "border-step-passed/40 bg-step-passed/12"
              : "border-step-failing/40 bg-step-failing/12",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "size-1.5 rounded-full",
              check.launches ? "bg-step-passed" : "bg-step-failing",
            )}
          />
          {check.launches ? "Yes" : "Not yet"}
        </span>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(9.5rem,1fr))] gap-2">
        {facts.map((fact) => (
          <li
            className={cn(
              "flex flex-col gap-0.5 rounded-(--radius-lg) border bg-background px-3 py-2",
              fact.bad ? "border-step-failing/45" : "border-border",
            )}
            key={fact.text}
          >
            <span className="font-bold text-foreground text-lg tabular-nums">
              {fact.figure}
            </span>
            <Text as="span" size="xs" tone="secondary">
              {fact.text}
            </Text>
          </li>
        ))}
      </ul>
      {verdicts.status === "none" ? (
        <Text as="p" size="xs" tone="muted">
          No run results yet: readiness reads as far as Reviewed.
        </Text>
      ) : null}
    </section>
  );
}

/** Where a unit is read: its section on its page, its capability's page,
 * or its page. */
export function unitPlace(
  index: ManualIndex,
  unit: Unit,
): { title: string; under: string; to: string | null } {
  const page = index.pageByPath.get(unit.pages[0] ?? "");
  const pageTitle = page?.ast?.frontmatter.title ?? unit.pages[0] ?? "";
  const route = page?.route ?? null;
  if (unit.kind === "section" && unit.section) {
    return {
      title: unit.section.title,
      under: pageTitle,
      to: route ? `${route}#${unit.section.anchor}` : null,
    };
  }
  if (unit.kind === "capability" && unit.spec) {
    return {
      title: index.titleBySpec.get(unit.spec) ?? unit.spec,
      under:
        unit.pages.length > 1
          ? `${unit.spec} · ${unit.pages.length} pages`
          : unit.spec,
      to: index.routeBySpec.get(unit.spec) ?? route,
    };
  }
  return { title: pageTitle, under: "Whole page", to: route };
}

type Row = { reading: UnitReading; why?: string[] };

const GRID =
  "@3xl:grid @3xl:grid-cols-[2.5rem_minmax(0,1.7fr)_6.5rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.5fr)] @3xl:items-start @3xl:gap-x-3";

function UnitTable({
  rows,
  index,
  today,
  team,
  runs,
}: {
  rows: Row[];
  index: ManualIndex;
  today: Date;
  team?: TeamMember[];
  runs: Map<string, string>;
}) {
  return (
    <div className="@container">
      <div
        aria-hidden
        className={cn(
          GRID,
          "hidden px-3 pb-1.5 font-medium text-secondary-foreground text-xs",
        )}
      >
        <span>Pri.</span>
        <span>Unit</span>
        <span>Readiness</span>
        <span>Lines</span>
        <span>Cases</span>
        <span>Latest run</span>
        <span>Next</span>
      </div>
      <ul className="divide-y divide-border-subtle overflow-hidden rounded-(--radius-xl) border border-border bg-card">
        {rows.map((row) => (
          <UnitLine
            index={index}
            key={row.reading.unit.key}
            row={row}
            runs={runs}
            team={team}
            today={today}
          />
        ))}
      </ul>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 gap-2 text-sm max-@3xl:mt-1">
      <span className="w-20 shrink-0 text-secondary-foreground text-xs leading-5 @3xl:hidden">
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function UnitLine({
  row,
  index,
  today,
  team,
  runs,
}: {
  row: Row;
  index: ManualIndex;
  today: Date;
  team?: TeamMember[];
  runs: Map<string, string>;
}) {
  const { unit, readiness, phase } = row.reading;
  const place = unitPlace(index, unit);
  const risky = atRisk(unit, readiness, phase, today);
  const runName = readiness.run ? runs.get(readiness.run) : undefined;
  const next =
    row.why ??
    readiness.waitingOn.map(
      (turn) => `${waiterLabel(turn.role, team)}: ${turn.why}`,
    );

  return (
    <li className={cn(GRID, "px-3 py-2.5")}>
      <div className="flex items-center gap-2 @3xl:block">
        <span
          className={cn(
            "inline-flex rounded-(--radius-sm) border px-1.5 py-0.5 font-mono font-semibold text-[0.6875rem] leading-none",
            unit.priority === "P0"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-muted text-foreground",
          )}
        >
          {unit.priority}
        </span>
        <span className="flex flex-wrap items-center gap-1.5 @3xl:hidden">
          <StepChip step={readiness.step} />
          {risky ? <AtRiskChip /> : null}
        </span>
      </div>
      <div className="min-w-0 max-@3xl:mt-1.5">
        {place.to ? (
          <Link
            className="font-semibold text-foreground text-sm underline-offset-2 hover:underline"
            to={place.to}
          >
            {place.title}
          </Link>
        ) : (
          <span className="font-semibold text-sm">{place.title}</span>
        )}
        <Text as="p" className="truncate" size="xs" tone="secondary">
          {place.under}
        </Text>
      </div>
      <div className="hidden flex-col items-start gap-1 @3xl:flex">
        <StepChip step={readiness.step} />
        {risky ? <AtRiskChip /> : null}
      </div>
      <Cell label="Lines">
        <span className="tabular-nums">
          {plural(unit.lines, "line")}
          {unit.rules.length > 0
            ? ` · ${plural(unit.rules.length, "rule")}`
            : ""}
        </span>
        {readiness.questions > 0 || readiness.building > 0 ? (
          <Text as="span" className="block" size="xs" tone="secondary">
            {[
              readiness.questions > 0 && `❓ ${readiness.questions}`,
              readiness.building > 0 && `🚧 ${readiness.building}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </Text>
        ) : null}
      </Cell>
      <Cell label="Cases">
        {readiness.step === "no-suite" ? (
          <span className="text-secondary-foreground">no suite</span>
        ) : readiness.cases === 0 ? (
          <span className="text-secondary-foreground">none</span>
        ) : (
          <span className="tabular-nums">
            {plural(readiness.cases, "case")}
            <Text as="span" className="block" size="xs" tone="secondary">
              {readiness.drafts > 0 ? `${readiness.drafts} draft` : "reviewed"}
              {readiness.uncovered.length > 0
                ? ` · ${plural(readiness.uncovered.length, "rule")} uncovered`
                : ""}
              {readiness.stale > 0 ? ` · ${readiness.stale} stale` : ""}
            </Text>
          </span>
        )}
      </Cell>
      <Cell label="Latest run">
        {readiness.run ? (
          <span className="flex flex-col gap-1">
            <Link
              className="text-foreground underline underline-offset-2"
              to={`/runs/${readiness.run}`}
            >
              {`Run ${readiness.run}${runName ? ` · ${runName}` : ""}`}
            </Link>
            <Text as="span" size="xs" tone="secondary">
              {[
                readiness.counts.pass && `${readiness.counts.pass} pass`,
                readiness.counts.fail && `${readiness.counts.fail} fail`,
                readiness.counts.blocked &&
                  `${readiness.counts.blocked} blocked`,
                readiness.counts.notrun && `${readiness.counts.notrun} to do`,
              ]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          </span>
        ) : (
          <span className="text-secondary-foreground">none</span>
        )}
      </Cell>
      <Cell label="Next">
        {next.length === 0 ? (
          <span className="text-secondary-foreground">
            {readiness.step === "released"
              ? "Released"
              : "Launches with the phase"}
          </span>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {next.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        )}
      </Cell>
    </li>
  );
}

/** The newest commit date among a unit's pages: what it has waited since. */
export function waitedSince(
  index: ManualIndex,
  unit: Unit,
): string | undefined {
  let newest: string | undefined;
  for (const path of unit.pages) {
    const date = index.pageByPath.get(path)?.entry.lastCommit?.date;
    if (date && (newest === undefined || date > newest)) newest = date;
  }
  return newest;
}

function QaQueue({
  index,
  readings,
}: {
  index: ManualIndex;
  readings: UnitReading[];
}) {
  const queue = qaQueue(readings, (unit) => waitedSince(index, unit));
  return (
    <section aria-labelledby="qa-queue" className="mb-12">
      <h2
        className="font-bold font-heading text-foreground text-manual-h3 leading-tight"
        id="qa-queue"
      >
        QA's queue
      </h2>
      <Text as="p" className="mt-1 mb-3" size="sm" tone="secondary">
        Units reviewed and waiting for a run: by phase, then release priority,
        then the longest waiting.
      </Text>
      {queue.length === 0 ? (
        <Text as="p" size="sm" tone="secondary">
          Nothing reviewed is waiting for a run.
        </Text>
      ) : (
        <ol className="divide-y divide-border-subtle overflow-hidden rounded-(--radius-xl) border border-border bg-card">
          {queue.map(({ unit, phase }) => {
            const place = unitPlace(index, unit);
            const since = waitedSince(index, unit);
            return (
              <li
                className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 px-3 py-2"
                key={unit.key}
              >
                <Text
                  as="span"
                  className="w-36 shrink-0"
                  size="xs"
                  tone="secondary"
                >
                  {phase?.name ?? unit.phase} · {unit.priority}
                </Text>
                <span className="min-w-0 flex-1">
                  {place.to ? (
                    <Link
                      className="font-medium text-sm underline-offset-2 hover:underline"
                      to={place.to}
                    >
                      {place.title}
                    </Link>
                  ) : (
                    <span className="font-medium text-sm">{place.title}</span>
                  )}
                  <Text as="span" size="xs" tone="secondary">
                    {" "}
                    · {place.under}
                  </Text>
                </span>
                <Text as="span" size="xs" tone="muted">
                  {since ? `waiting since ${relativeTime(since)}` : ""}
                </Text>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

function EveryPhase({
  phases,
  readings,
}: {
  phases: Phase[];
  readings: UnitReading[];
}) {
  return (
    <section aria-labelledby="every-phase" className="mb-12">
      <h2
        className="font-bold font-heading text-foreground text-manual-h3 leading-tight"
        id="every-phase"
      >
        Every phase
      </h2>
      <Text as="p" className="mt-1 mb-3" size="sm" tone="secondary">
        Each phase's units counted by readiness, beside its target.
      </Text>
      <ul className="divide-y divide-border-subtle overflow-hidden rounded-(--radius-xl) border border-border bg-card">
        {everyPhase(readings, phases).map(({ phase, units, steps }) => (
          <li className="flex flex-col gap-2 px-3 py-3" key={phase.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <Link
                className="font-semibold text-sm underline-offset-2 hover:underline"
                to={`/phases/${phase.id}`}
              >
                {phase.name}
              </Link>
              <Text as="span" size="xs" tone="secondary">
                {phase.released
                  ? `released ${phase.released}`
                  : phase.target
                    ? `target ${phase.target}`
                    : "no target yet"}
                {` · ${plural(units, "unit")}`}
              </Text>
            </div>
            <StepBar label={stepsLabel(phase.name, steps)} steps={steps} />
            {steps.length > 0 ? (
              <ul className="flex flex-wrap gap-x-3 gap-y-0.5">
                {steps.map(([step, count]) => (
                  <li className="text-secondary-foreground text-xs" key={step}>
                    {STEP_LABEL[step]}{" "}
                    <span className="font-semibold text-foreground tabular-nums">
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
