import { Text } from "@grade10/design-system/components/display/text";
import type { JourneysBlock } from "../content/grammar";
import { useBlockScope } from "./block-scope";
import { BrokenCard, MissingCard } from "./broken-card";
import { JourneyCard } from "./spec-block";

export function JourneysBlockView({ block }: { block: JourneysBlock }) {
  const { index } = useBlockScope();
  const spec = index.specById.get(block.id);

  if (!spec) {
    return (
      <MissingCard
        title={`No spec \`${block.id}\` in this snapshot`}
        tone="error"
      >
        Journeys were asked for from a spec the store did not hand over.
      </MissingCard>
    );
  }
  if (spec.error) {
    return <BrokenCard error={spec.error} what={`Spec ${spec.id}`} />;
  }

  const journeys = spec.journeys ?? [];
  if (journeys.length === 0) {
    return (
      <Text as="p" className="my-4" size="sm" tone="secondary">
        No user journeys written for {spec.id} yet.
      </Text>
    );
  }

  return (
    <section className="my-6 space-y-3">
      {journeys.map((journey) => (
        <JourneyCard journey={journey} key={journey.id} spec={spec} />
      ))}
    </section>
  );
}
