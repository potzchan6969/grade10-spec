type CampaignFact = { label: string; value: string };

/**
 * The few things a visitor reads before anything else — when it runs, what it
 * gives, where to collect — as one row of short facts.
 */
function CampaignFacts({ facts }: { facts: readonly CampaignFact[] }) {
  return (
    <dl
      className="m-0 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-[repeat(auto-fit,minmax(10rem,1fr))]"
      data-slot="campaign-facts"
    >
      {facts.map((fact) => (
        <div className="grid gap-1 bg-card px-5 py-4" key={fact.label}>
          <dt className="text-xs font-bold tracking-wide text-secondary-foreground uppercase">
            {fact.label}
          </dt>
          <dd className="m-0 text-sm font-bold">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export type { CampaignFact };
export { CampaignFacts };
