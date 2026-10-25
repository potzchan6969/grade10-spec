import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { journeyAnchor } from "../api/anchors";
import { specDir } from "../api/paths";
import type { Journey, Requirement, Scenario, SpecEntry } from "../api/types";
import { AnchorLink } from "./anchor";
import { useBlockScope } from "./block-scope";
import { MarkdownView } from "./markdown";

export function JourneyCard({
  spec,
  journey,
}: {
  spec: SpecEntry;
  journey: Journey;
}) {
  const { index } = useBlockScope();
  const id = journeyAnchor(journey);
  // Derived, never stored: a scenario names the story it serves, and the story
  // names nothing. The two files pointing at each other is what let each be
  // written from the other.
  const accepted = spec.requirements
    .flatMap((requirement) => requirement.scenarios)
    .filter((scenario) => scenario.id && scenario.serves?.includes(journey.id))
    .map((scenario) => ({ id: scenario.id as string, name: scenario.name }));

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
            Served by
          </Text>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {accepted.map((scenario) => (
              <li key={scenario.id}>
                <a
                  className="flex h-full flex-col gap-0.5 rounded-(--radius-lg) border border-border bg-card px-2 py-1.5 text-xs transition-colors hover:border-border-strong hover:bg-muted"
                  href={`#${scenario.id}`}
                >
                  <span className="font-mono text-secondary-foreground">
                    {scenario.id}
                  </span>
                  <span className="leading-snug">
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
