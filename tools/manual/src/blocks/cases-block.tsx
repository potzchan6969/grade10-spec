import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { useState } from "react";
import { caseAnchor } from "../api/anchors";
import { tracedBy } from "../api/derive";
import type { SpecEntry, TestCaseStatus, TestSuiteStatus } from "../api/types";
import type { CasesBlock } from "../content/grammar";
import { AnchorLink } from "./anchor";
import { useBlockScope } from "./block-scope";
import { BrokenCard, MissingCard } from "./broken-card";
import { findScenario } from "./spec-block";

export function CasesBlockView({ block }: { block: CasesBlock }) {
  const { index } = useBlockScope();
  const spec = index.specById.get(block.id);

  if (!spec) {
    return (
      <MissingCard
        title={`No spec \`${block.id}\` in this snapshot`}
        tone="error"
      >
        Test cases were asked for from a spec the store did not hand over.
      </MissingCard>
    );
  }
  if (spec.error) {
    return <BrokenCard error={spec.error} what={`Spec ${spec.id}`} />;
  }
  // The suite's break belongs to the suite. It is loud here and nowhere else
  // — the requirements and journeys beside it keep rendering.
  if (spec.testCasesError) {
    return (
      <BrokenCard
        error={spec.testCasesError}
        what={`Test cases for ${spec.id}`}
      />
    );
  }

  return <SuiteView spec={spec} />;
}

/**
 * A suite against the scenarios it traces. `spec` is whatever holds the
 * cases and the scenarios they name: a durable capability, or a delta read
 * as the spec it will become, with the durable rows behind it so a trace to
 * an unchanged scenario still resolves.
 */
export function SuiteView({ spec }: { spec: SpecEntry }) {
  const cases = spec.testCases ?? [];
  if (cases.length === 0) {
    return (
      <Text as="p" className="my-4" size="sm" tone="secondary">
        No test cases yet for {spec.id}.
      </Text>
    );
  }

  // Living cases only — a retired case's traces are history, not coverage.
  const covered = tracedBy(cases, spec.journeys);
  const exempt = new Set(spec.outOfSuite ?? []);
  const scenarios = spec.requirements.flatMap(
    (requirement) => requirement.scenarios,
  );
  const uncovered = scenarios.filter(
    (scenario) =>
      scenario.id && !covered.has(scenario.id) && !exempt.has(scenario.id),
  ).length;

  return (
    <section className="my-6 overflow-hidden rounded-(--radius-2xl) border border-border bg-card">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-border-subtle border-b bg-background-subtle px-4 py-2.5">
        <Text as="span" size="sm" weight="bold">
          Test cases
        </Text>
        <SuiteStatus status={spec.testCasesStatus} />
        <Text as="span" size="xs" tone="secondary">
          {cases.length} cases · {covered.size} scenarios traced
          {uncovered > 0 ? ` · ${uncovered} untraced` : ""}
        </Text>
        <OutOfSuite ids={spec.outOfSuite ?? []} spec={spec} />
      </header>
      <ul className="divide-y divide-border-subtle">
        {cases.map((testCase) => (
          <li
            className="group/anchor scroll-mt-24 px-4 py-3"
            id={caseAnchor(testCase)}
            key={testCase.id}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="font-mono" size="sm" variant="outline">
                {testCase.id}
              </Badge>
              <Text
                as="span"
                className={
                  testCase.status === "deprecated"
                    ? "text-secondary-foreground line-through"
                    : undefined
                }
                size="sm"
                weight="medium"
              >
                {testCase.title}
              </Text>
              <CaseStatus status={testCase.status} />
              <AnchorLink
                className="ml-auto"
                id={caseAnchor(testCase)}
                label="Copy link to this case"
              />
            </div>
            <TraceList spec={spec} traces={testCase.traces} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Scenarios the suite says it will not cover. Subtracted from the untraced
 * count above, so what that number reports is always work — and named here,
 * because a decision nobody can read is indistinguishable from a hole.
 */
function OutOfSuite({ ids, spec }: { ids: string[]; spec: SpecEntry }) {
  const [open, setOpen] = useState(false);
  if (ids.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <button
        aria-expanded={open}
        className="cursor-pointer text-secondary-foreground text-xs underline decoration-border-strong underline-offset-2 hover:text-foreground"
        onClick={() => setOpen((on) => !on)}
        title={`Scenarios the suite deliberately leaves uncovered: ${ids.join(", ")}`}
        type="button"
      >
        {ids.length} out of suite
      </button>
      {open ? (
        <ul className="flex w-full flex-wrap gap-1.5">
          {ids.map((id) => (
            <li key={id}>
              <a
                className="flex items-baseline gap-1.5 rounded-(--radius-lg) border border-border-subtle border-dashed px-2 py-0.5 text-xs transition-colors hover:border-border-strong hover:bg-muted"
                href={`#${id}`}
              >
                <span className="font-mono text-secondary-foreground">
                  {id}
                </span>
                <span className="min-w-0 leading-snug">
                  {findScenario(spec, id)?.scenario.name ?? (
                    <span className="text-destructive line-through">
                      not in this spec
                    </span>
                  )}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

const SUITE_STATUS_TITLES: Record<TestSuiteStatus, string> = {
  "pending-review":
    "Every case here is still a draft; nothing in this file exports.",
  "in-review":
    "A reviewer has started, and at least one case is still a draft; nothing in this file exports.",
  approved: "A reviewer stands behind every case in this suite.",
};

/** The file's own review state, beside the suite it belongs to. Only
 * `approved` wears the approved colour — carrying the status is pointless if
 * a suite still holding a draft can read as signed off. */
function SuiteStatus({ status }: { status?: TestSuiteStatus }) {
  if (!status) return null;
  return (
    <Badge
      size="sm"
      title={SUITE_STATUS_TITLES[status]}
      variant={status === "approved" ? "success" : "warning"}
    >
      {status}
    </Badge>
  );
}

/** `draft` has to read as unreviewed at a glance, and `deprecated` as history
 * kept rather than behaviour claimed. */
function CaseStatus({ status }: { status: TestCaseStatus }) {
  if (status === "actual") {
    return (
      <Badge
        size="sm"
        title="A reviewer read this case against the scenarios it traces and stands behind it."
        variant="success"
      >
        actual
      </Badge>
    );
  }
  if (status === "deprecated") {
    return (
      <Badge
        className="line-through opacity-70"
        size="sm"
        title="The spec no longer states this behaviour. Kept for history, never exported."
        variant="outline"
      >
        deprecated
      </Badge>
    );
  }
  return (
    <Badge
      size="sm"
      title="Generated or edited since its last review. Nobody has stood behind it yet."
      variant="warning"
    >
      draft
    </Badge>
  );
}

function TraceList({ spec, traces }: { spec: SpecEntry; traces: string[] }) {
  if (traces.length === 0) {
    return (
      <Text as="p" className="mt-1.5" size="xs" tone="secondary">
        Traces to nothing yet.
      </Text>
    );
  }

  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {traces.map((trace) => (
        <li key={trace}>
          <a
            className="flex items-baseline gap-1.5 rounded-(--radius-lg) border border-border bg-background-subtle px-2 py-1 text-xs transition-colors hover:border-border-strong hover:bg-muted"
            href={`#${trace}`}
          >
            <span className="shrink-0 font-mono text-secondary-foreground">
              {trace}
            </span>
            <span className="min-w-0 leading-snug">
              {tracedTitle(spec, trace) ?? (
                <span className="text-destructive line-through">
                  not in this spec
                </span>
              )}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** What a trace lands on: the journey a case walks, or — in an older suite —
 * the scenario it named outright. */
function tracedTitle(spec: SpecEntry, trace: string): string | undefined {
  const journey = spec.journeys?.find((one) => one.id === trace);
  if (journey) return journey.title;
  return findScenario(spec, trace)?.scenario.name;
}
