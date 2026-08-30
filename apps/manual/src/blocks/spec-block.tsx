import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { cn } from "@grade10/design-system/lib/utils";
import { ArrowSquareOut, CaretRight } from "@phosphor-icons/react";
import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router";
import {
  journeyAnchor,
  requirementAnchor,
  scenarioAnchor,
} from "../api/anchors";
import {
  changesForRequirement,
  type RequirementChange,
  taskTotals,
} from "../api/derive";
import { specDir, specSourceUrl, specTitle } from "../api/paths";
import { findRequirement } from "../api/requirements";
import type {
  ChangeEntry,
  DeltaKind,
  Journey,
  Requirement,
  Scenario,
  SpecEntry,
} from "../api/types";
import type { SpecBlock } from "../content/grammar";
import { AnchorLink, useHashTarget } from "./anchor";
import { useBlockScope } from "./block-scope";
import { BrokenCard, MissingCard } from "./broken-card";
import { deltaTone } from "./change-views";
import { MarkdownView } from "./markdown";
import { ScenarioView } from "./scenario-view";

export function SpecBlockView({ block }: { block: SpecBlock }) {
  const { index } = useBlockScope();
  const spec = index.specById.get(block.id);

  if (!spec) {
    return (
      <MissingCard
        title={`No spec \`${block.id}\` in this snapshot`}
        tone="error"
      >
        The page asks for a spec the store did not hand over. Check the id
        against `openspec/specs`.
      </MissingCard>
    );
  }
  if (spec.error) {
    return <BrokenCard error={spec.error} what={`Spec ${spec.id}`} />;
  }

  if (block.requirement !== undefined) {
    const requirement = findRequirement(spec.requirements, block.requirement);
    return requirement ? (
      <SpecFrame spec={spec}>
        <RequirementRow alwaysOpen requirement={requirement} spec={spec} />
      </SpecFrame>
    ) : (
      <SelectorMiss kind="requirement" spec={spec} value={block.requirement} />
    );
  }

  if (block.scenario !== undefined) {
    const found = findScenario(spec, block.scenario);
    return found ? (
      <SpecFrame spec={spec}>
        <div className="px-4 py-3">
          <Text as="p" className="mb-2" size="xs" tone="secondary">
            {found.requirement.name}
          </Text>
          <ChangeBadges
            className="mb-3"
            touching={changesForRequirement(
              index,
              spec.id,
              found.requirement.name,
            )}
          />
          <ScenarioView
            requirement={found.requirement}
            scenario={found.scenario}
          />
        </div>
      </SpecFrame>
    ) : (
      <SelectorMiss kind="scenario" spec={spec} value={block.scenario} />
    );
  }

  if (block.story !== undefined) {
    const journey = spec.journeys?.find((item) => item.id === block.story);
    return journey ? (
      <SpecFrame spec={spec}>
        <div className="px-4 py-3">
          <JourneyCard journey={journey} spec={spec} />
        </div>
      </SpecFrame>
    ) : (
      <SelectorMiss kind="story" spec={spec} value={block.story} />
    );
  }

  return (
    <SpecFrame spec={spec}>
      <ul className="divide-y divide-border-subtle">
        {spec.requirements.map((requirement) => (
          <li key={requirement.name}>
            <RequirementRow requirement={requirement} spec={spec} />
          </li>
        ))}
      </ul>
      {spec.requirements.length === 0 ? (
        <Text as="p" className="px-4 py-3" size="sm" tone="secondary">
          This spec carries no requirements yet.
        </Text>
      ) : null}
    </SpecFrame>
  );
}

function SpecFrame({
  spec,
  children,
}: {
  spec: SpecEntry;
  children: ReactNode;
}) {
  const count = spec.requirements.reduce(
    (sum, requirement) => sum + requirement.scenarios.length,
    0,
  );

  return (
    <section className="my-6 overflow-hidden rounded-(--radius-2xl) border border-border bg-card">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-1 border-border-subtle border-b bg-background-subtle px-4 py-2.5">
        <Text as="span" size="sm" title={spec.title} weight="bold">
          {specTitle(spec)}
        </Text>
        <Badge className="font-mono" size="sm" variant="outline">
          {spec.id}
        </Badge>
        <Text as="span" size="xs" tone="secondary">
          {spec.requirements.length} requirements · {count} scenarios
        </Text>
        <a
          className="ml-auto inline-flex items-center gap-1 text-secondary-foreground text-xs hover:text-foreground"
          href={specSourceUrl(spec.id)}
          rel="noreferrer noopener"
          target="_blank"
        >
          spec.md
          <ArrowSquareOut aria-hidden size={12} />
        </a>
      </header>
      {children}
    </section>
  );
}

function RequirementRow({
  spec,
  requirement,
  alwaysOpen = false,
}: {
  spec: SpecEntry;
  requirement: Requirement;
  alwaysOpen?: boolean;
}) {
  const { index } = useBlockScope();
  const id = requirementAnchor(requirement);
  const scenarioIds = requirement.scenarios.map((scenario) =>
    scenarioAnchor(requirement, scenario),
  );
  const targeted = useHashTarget(id, ...scenarioIds);
  const touching = changesForRequirement(index, spec.id, requirement.name);
  const [open, setOpen] = useState(alwaysOpen);

  useEffect(() => {
    if (targeted) setOpen(true);
  }, [targeted]);

  const expanded = alwaysOpen || open;

  return (
    <div className="group/anchor scroll-mt-24" id={id}>
      <div className="flex items-center gap-1 px-2">
        <button
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-(--radius-md) px-2 py-3 text-left outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
          disabled={alwaysOpen}
          onClick={() => setOpen((on) => !on)}
          type="button"
        >
          <span
            className={`inline-flex shrink-0 text-secondary-foreground transition-transform ${expanded ? "rotate-90" : ""}`}
          >
            <CaretRight aria-hidden size={14} weight="bold" />
          </span>
          <Text as="span" className="min-w-0 flex-1" size="sm" weight="medium">
            {requirement.name}
          </Text>
          <Badge size="sm" variant="default">
            {requirement.scenarios.length}
          </Badge>
        </button>
        <AnchorLink id={id} label="Copy link to this requirement" />
      </div>

      <ChangeBadges className="pr-2 pb-2 pl-9" touching={touching} />

      {expanded ? (
        <div className="space-y-3 px-4 pb-4">
          <MarkdownView
            baseDir={specDir(spec.id)}
            className="manual-prose manual-prose-tight"
            index={index}
            text={requirement.text}
          />
          {requirement.scenarios.map((scenario) => (
            <ScenarioView
              key={scenarioAnchor(requirement, scenario)}
              requirement={requirement}
              scenario={scenario}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The row-level sibling of the page's change ribbon: which change in flight
 * touches this one requirement, how, and how far along it is. Quieter than the
 * ribbon on purpose — the row it hangs under is the thing being read.
 */
function ChangeBadges({
  touching,
  className,
}: {
  touching: RequirementChange[];
  className?: string;
}) {
  if (touching.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {touching.map(({ change, kind }) => (
        <ChangeBadge change={change} key={change.id} kind={kind} />
      ))}
    </div>
  );
}

function ChangeBadge({
  change,
  kind,
}: {
  change: ChangeEntry;
  kind: DeltaKind;
}) {
  const { done, total } = taskTotals(change);

  return (
    <Link
      className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border-subtle bg-background-subtle py-0.5 pr-2 pl-0.5 transition-colors hover:border-border-strong hover:bg-muted"
      title={`${change.title} — this requirement is ${kind}`}
      to={`/planning#${change.id}`}
    >
      <Badge size="sm" variant={deltaTone(kind)}>
        {kind}
      </Badge>
      <Text as="span" className="min-w-0 truncate" size="xs" tone="secondary">
        {change.title}
      </Text>
      <Text as="span" className="shrink-0 font-mono" size="xs" tone="secondary">
        {done}/{total}
      </Text>
    </Link>
  );
}

export function JourneyCard({
  spec,
  journey,
}: {
  spec: SpecEntry;
  journey: Journey;
}) {
  const { index } = useBlockScope();
  const id = journeyAnchor(journey);
  const accepted = journey.acceptedBy.map((scenarioId) => ({
    id: scenarioId,
    name: findScenario(spec, scenarioId)?.scenario.name,
  }));

  return (
    <article
      className="group/anchor scroll-mt-24 rounded-(--radius-xl) border border-border-subtle bg-background-subtle p-4"
      id={id}
    >
      <div className="flex items-center gap-2">
        <Badge className="font-mono" size="sm" variant="info">
          {journey.id}
        </Badge>
        <Text as="span" size="sm" weight="bold">
          {journey.title}
        </Text>
        <AnchorLink
          className="ml-auto"
          id={id}
          label="Copy link to this journey"
        />
      </div>

      <MarkdownView
        baseDir={specDir(spec.id)}
        className="manual-prose manual-prose-tight mt-2"
        index={index}
        text={journey.text}
      />

      {accepted.length > 0 ? (
        <div className="mt-3">
          <Text as="p" className="mb-1.5" size="xs" tone="secondary">
            Accepted by
          </Text>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {accepted.map((scenario) => (
              <li key={scenario.id}>
                <a
                  className="flex h-full items-baseline gap-1.5 rounded-(--radius-lg) border border-border bg-card px-2 py-1 text-xs transition-colors hover:border-border-strong hover:bg-muted"
                  href={`#${scenario.id}`}
                >
                  <span className="shrink-0 font-mono text-secondary-foreground">
                    {scenario.id}
                  </span>
                  <span className="min-w-0 leading-snug">
                    {scenario.name ?? (
                      <span className="text-destructive line-through">
                        not in this spec
                      </span>
                    )}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}

function SelectorMiss({
  spec,
  kind,
  value,
}: {
  spec: SpecEntry;
  kind: "requirement" | "scenario" | "story";
  value: string;
}) {
  const known =
    kind === "requirement"
      ? spec.requirements.map((requirement) => requirement.name)
      : kind === "story"
        ? (spec.journeys ?? []).map((journey) => journey.id)
        : spec.requirements.flatMap((requirement) =>
            requirement.scenarios.map(
              (scenario) => scenario.id ?? scenario.name,
            ),
          );

  return (
    <MissingCard
      title={`${kind} “${value}” not found in ${spec.id}`}
      tone="error"
    >
      {known.length === 0
        ? `That spec lists no ${kind}s at all.`
        : `The spec knows: ${known.slice(0, 6).join(", ")}${known.length > 6 ? `, and ${known.length - 6} more` : ""}.`}
    </MissingCard>
  );
}

export function findScenario(
  spec: SpecEntry,
  idOrName: string,
): { requirement: Requirement; scenario: Scenario } | undefined {
  const wanted = idOrName.trim().toLowerCase();
  for (const requirement of spec.requirements) {
    for (const scenario of requirement.scenarios) {
      if (
        scenario.id?.toLowerCase() === wanted ||
        scenario.name.trim().toLowerCase() === wanted
      ) {
        return { requirement, scenario };
      }
    }
  }
  return undefined;
}
