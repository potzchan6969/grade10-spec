import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import { Check, CircleHalf, X } from "@phosphor-icons/react";
import { createContext, type ReactNode, use, useMemo } from "react";
import { Link } from "react-router";
import { waiterLabel } from "../api/board";
import type { PageMarks } from "../api/page-phases";
import type { Unit } from "../api/phases";
import {
  type CaseResult,
  type Readiness,
  readinessOf,
  resultOf,
  type Step,
} from "../api/readiness";
import type { TeamMember } from "../api/types";
import type { ReleaseReading } from "../api/units";
import { type VerdictsState, verdictsOf } from "../api/use-release";
import { PhaseChip, phaseNamed, StepChip } from "../blocks/phase-chip";

/** What a page reads of its release: its units, and the desk's verdicts
 * fetched when it opened. */
export type PageRelease = {
  reading: ReleaseReading;
  marks: PageMarks;
  verdicts: VerdictsState;
  team?: TeamMember[];
};

const PageReleaseContext = createContext<PageRelease | null>(null);

export function PageReleaseProvider({
  value,
  children,
}: {
  value: PageRelease | null;
  children: ReactNode;
}) {
  return <PageReleaseContext value={value}>{children}</PageReleaseContext>;
}

export function usePageRelease(): PageRelease | null {
  return use(PageReleaseContext);
}

export type SectionReading = { unit: Unit; readiness: Readiness };

/** A section's units with their readiness, and each case's latest result. */
export function useSectionReadings(section: string): {
  readings: SectionReading[];
  results: Map<string, CaseResult>;
} {
  const release = usePageRelease();
  return useMemo(() => {
    const results = new Map<string, CaseResult>();
    if (!release) return { readings: [], results };
    const verdicts = verdictsOf(release.verdicts);
    const readings = release.marks.sectionUnits(section).map((unit) => {
      const phase = phaseNamed(release.reading.phases, unit.phase);
      const cases = release.reading.casesOf(unit);
      for (const one of cases) {
        const found = resultOf(verdicts, phase?.env ?? "", one);
        if (found) results.set(one.id, found);
      }
      return { unit, readiness: readinessOf(unit, cases, phase, verdicts) };
    });
    return { readings, results };
  }, [release, section]);
}

const ORDER: Step[] = [
  "planned",
  "prepared",
  "reviewed",
  "in-qa",
  "passed",
  "released",
];

const rank = (step: Step): number => {
  if (step === "no-suite") return 0;
  if (step === "failing" || step === "blocked") return ORDER.indexOf("in-qa");
  return ORDER.indexOf(step);
};

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

/** done, waiting on someone, or failing: only a fail or a block is red. */
type Rung = { state: "done" | "held" | "failing"; text: ReactNode };

/** The ladder up to where the unit stands: each step passed, then the one
 * holding it. */
export function rungsOf(readiness: Readiness, runName?: string): Rung[] {
  const at = rank(readiness.step);
  const rungs: Rung[] = [
    { state: "done", text: "Planned: a phase block covers it" },
  ];
  const { cases, drafts, uncovered, counts } = readiness;
  if (readiness.step === "no-suite") {
    rungs.push({
      state: "held",
      text: "No suite: its capability has no cases",
    });
    return rungs;
  }
  rungs.push(
    at >= 1
      ? {
          state: "done",
          text: `Prepared: ${plural(cases, "case")} cover${cases === 1 ? "s" : ""} it`,
        }
      : {
          state: "held",
          text:
            uncovered.length > 0
              ? `Prepared: ${plural(uncovered.length, "rule")} with no case`
              : "Prepared: no cases yet",
        },
  );
  if (at < 1) return rungs;
  rungs.push(
    at >= 2
      ? { state: "done", text: `Reviewed: ${cases} of ${cases}` }
      : { state: "held", text: `Reviewed: ${drafts} of ${cases} still draft` },
  );
  if (at < 2) return rungs;
  if (at < 3) {
    rungs.push({ state: "held", text: "In QA: in no run yet" });
    return rungs;
  }
  const run = readiness.run
    ? `Run ${readiness.run}${runName ? ` · ${runName}` : ""}`
    : undefined;
  rungs.push({
    state: "done",
    text: run ? (
      <>
        In QA:{" "}
        <Link
          className="underline underline-offset-2"
          to={`/runs/${readiness.run}`}
        >
          {run}
        </Link>
      </>
    ) : (
      "In QA"
    ),
  });
  const tally = [
    counts.pass && `${counts.pass} pass`,
    counts.fail && `${counts.fail} fail`,
    counts.blocked && `${counts.blocked} blocked`,
    counts.skipped && `${counts.skipped} skipped`,
    counts.notrun && `${counts.notrun} to do`,
  ]
    .filter(Boolean)
    .join(", ");
  rungs.push(
    at >= 4
      ? { state: "done", text: `Passed: every case passes` }
      : {
          state: counts.fail || counts.blocked ? "failing" : "held",
          text: `Passed: ${tally}`,
        },
  );
  if (readiness.step === "released")
    rungs.push({ state: "done", text: "Released" });
  return rungs;
}

const RUNG_ICON = {
  done: (
    <span className="text-step-passed">
      <Check aria-hidden size={12} weight="bold" />
    </span>
  ),
  held: (
    <span className="text-step-prepared">
      <CircleHalf aria-hidden size={12} weight="bold" />
    </span>
  ),
  failing: (
    <span className="text-step-failing">
      <X aria-hidden size={12} weight="bold" />
    </span>
  ),
};

/** One unit's readiness at the head of its section's cases. */
export function ReadinessCard({ reading }: { reading: SectionReading }) {
  const release = usePageRelease();
  if (!release) return null;
  const { unit, readiness } = reading;
  const phase = phaseNamed(release.reading.phases, unit.phase);
  const verdicts = verdictsOf(release.verdicts);
  const runName = verdicts?.runs.find((run) => run.id === readiness.run)?.name;
  const rungs = rungsOf(readiness, runName);
  const overlays = [
    readiness.questions > 0 && `❓ ${plural(readiness.questions, "question")}`,
    readiness.building > 0 &&
      `🚧 ${plural(readiness.building, "line")} still being built`,
    readiness.stale > 0 && `${plural(readiness.stale, "case")} stale`,
  ].filter((one): one is string => Boolean(one));

  return (
    <section
      aria-label={`Readiness in ${phase?.name ?? unit.phase}`}
      className="flex flex-col gap-2 rounded-(--radius-xl) border border-border bg-background p-3"
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <StepChip step={readiness.step} />
        <PhaseChip assignment={unit} phase={phase} small />
        {phase ? (
          <Text as="span" face="mono" size="xs" tone="muted">
            {phase.env}
          </Text>
        ) : null}
      </div>
      <ul className="flex flex-col gap-1">
        {rungs.map((rung, at) => (
          <li
            className={cn(
              "flex items-start gap-2 text-sm",
              rung.state === "held"
                ? "text-foreground"
                : "text-secondary-foreground",
            )}
            // biome-ignore lint/suspicious/noArrayIndexKey: the ladder is a fixed order; a rung's place is its identity.
            key={at}
          >
            <span className="mt-1 inline-flex">{RUNG_ICON[rung.state]}</span>
            <span className="min-w-0">{rung.text}</span>
          </li>
        ))}
        {overlays.map((text) => (
          <li
            className="flex items-start gap-2 text-secondary-foreground text-sm"
            key={text}
          >
            <span className="mt-1 inline-flex text-step-prepared">
              <CircleHalf aria-hidden size={12} weight="bold" />
            </span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
      {readiness.waitingOn.length > 0 ? (
        <Text as="p" size="sm">
          <Text as="span" size="sm" weight="bold">
            Next:{" "}
          </Text>
          {readiness.waitingOn
            .map(
              (turn) => `${waiterLabel(turn.role, release.team)}, ${turn.why}`,
            )
            .join("; ")}
        </Text>
      ) : null}
      {release.verdicts.status === "none" ? (
        <Text as="p" size="xs" tone="muted">
          No run results yet: readiness reads as far as Reviewed.
        </Text>
      ) : null}
    </section>
  );
}
