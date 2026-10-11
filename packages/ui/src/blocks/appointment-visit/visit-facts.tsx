import { Text } from "@grade10/design-system/components/display/text";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { FactCard, type FactRow } from "../page-blocks/fact-card";
import type { VisitFact } from "./types";

type VisitFactsCopy = { title: string };

type VisitFactsProps = {
  copy: VisitFactsCopy;
  facts: readonly VisitFact[];
};

/** Your visit: when, where, what, for whom, and how to reach the shop. */
function VisitFacts({ copy, facts }: VisitFactsProps) {
  const rows: FactRow[] = facts.map((fact) => ({
    label: fact.label,
    value: (
      <VStack gap="none">
        <Text
          as="span"
          className={fact.struck ? "line-through" : undefined}
          face={fact.mono ? "mono" : "sans"}
          tone={fact.struck ? "secondary" : "primary"}
          weight="medium"
        >
          {fact.value}
        </Text>
        {fact.sub ? (
          <Text as="span" size="sm" tone="secondary">
            {fact.sub}
          </Text>
        ) : null}
      </VStack>
    ),
  }));
  return <FactCard copy={copy} rows={rows} slot="visit-facts" />;
}

export type { VisitFactsCopy, VisitFactsProps };
export { VisitFacts };
