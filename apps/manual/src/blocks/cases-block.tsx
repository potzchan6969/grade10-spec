import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { caseAnchor } from "../api/anchors";
import type { SpecEntry } from "../api/types";
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

  const cases = spec.testCases ?? [];
  if (cases.length === 0) {
    return (
      <Text as="p" className="my-4" size="sm" tone="secondary">
        No test cases yet for {spec.id}.
      </Text>
    );
  }

  const covered = new Set(cases.flatMap((testCase) => testCase.traces));
  const scenarios = spec.requirements.flatMap(
    (requirement) => requirement.scenarios,
  );
  const uncovered = scenarios.filter(
    (scenario) => scenario.id && !covered.has(scenario.id),
  ).length;

  return (
    <section className="my-6 overflow-hidden rounded-(--radius-2xl) border border-border bg-card">
      <header className="flex flex-wrap items-center gap-x-3 border-border-subtle border-b bg-background-subtle px-4 py-2.5">
        <Text as="span" size="sm" weight="bold">
          Test cases
        </Text>
        <Text as="span" size="xs" tone="secondary">
          {cases.length} cases · {covered.size} scenarios traced
          {uncovered > 0 ? ` · ${uncovered} untraced` : ""}
        </Text>
      </header>
      <ul className="divide-y divide-border-subtle">
        {cases.map((testCase) => (
          <li
            className="group/anchor scroll-mt-24 px-4 py-3"
            id={caseAnchor(testCase)}
            key={testCase.id}
          >
            <div className="flex items-center gap-2">
              <Badge className="font-mono" size="sm" variant="outline">
                {testCase.id}
              </Badge>
              <Text as="span" size="sm" weight="medium">
                {testCase.title}
              </Text>
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
      {traces.map((trace) => {
        const found = findScenario(spec, trace);
        return (
          <li key={trace}>
            <a
              className="flex items-baseline gap-1.5 rounded-(--radius-lg) border border-border bg-background-subtle px-2 py-1 text-xs transition-colors hover:border-border-strong hover:bg-muted"
              href={`#${trace}`}
            >
              <span className="shrink-0 font-mono text-secondary-foreground">
                {trace}
              </span>
              <span className="min-w-0 leading-snug">
                {found ? (
                  found.scenario.name
                ) : (
                  <span className="text-destructive line-through">
                    not in this spec
                  </span>
                )}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
