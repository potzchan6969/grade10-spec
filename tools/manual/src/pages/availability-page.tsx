import { Badge } from "@grade10/design-system/components/display/badge";
import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "react-router";
import { availabilityIsStale, visibleAvailabilityState } from "../api/availability";
import { useManualIndex } from "../api/use-manual-index";
import type { ChangeEntry, EnvironmentAvailability } from "../api/types";
import { useArchive } from "../api/use-archive";
import { InlineMarkdown } from "../blocks/inline-markdown";
import { PageHeading } from "./page-heading";
import { useDocumentTitle } from "./use-document-title";

type ServingChange = {
  change: ChangeEntry;
  availability: EnvironmentAvailability;
};

const environmentLabel = (environment: string) => {
  const normalized = environment.toLowerCase();
  if (normalized.includes("uat")) return "UAT";
  if (normalized.includes("prod")) return "Production";
  if (normalized.includes("preview")) return "Preview";
  return environment;
};

const stateVariant = (state: EnvironmentAvailability["state"]) =>
  state === "newly" || state === "still"
    ? "success"
    : state === "partial" || state === "stale"
      ? "warning"
      : "outline";

/** Environment availability is a view over deployment receipts. The record
 * includes archived changes because the environment answers what QA can walk,
 * not what engineering is still building. */
export function AvailabilityPage() {
  const index = useManualIndex();
  const archive = useArchive();
  useDocumentTitle("Environment availability");

  const changes = [
    ...index.snapshot.changes,
    ...(archive.status === "ready" ? archive.archive.changes : []),
  ];
  const byEnvironment = new Map<string, ServingChange[]>();
  for (const change of changes) {
    for (const availability of change.availability ?? []) {
      const rows = byEnvironment.get(availability.environment) ?? [];
      rows.push({ change, availability });
      byEnvironment.set(availability.environment, rows);
    }
  }
  for (const rows of byEnvironment.values()) {
    rows.sort((left, right) => left.change.title.localeCompare(right.change.title));
  }
  for (const environment of index.snapshot.availabilityEnvironments ?? []) {
    if (!byEnvironment.has(environment.environment)) byEnvironment.set(environment.environment, []);
  }

  return (
    <>
      <PageHeading
        title="Environment availability"
        summary="Deployment receipts show which accepted changes are serving in each environment, what QA can walk, and what changed after a rollback or partial deployment."
      />
      {index.snapshot.availabilityStatus === "unconfigured" ? (
        <Text as="p" className="mb-5" size="sm" tone="error">
          Availability is unknown because APP_DEPLOYMENTS_READ_TOKEN is not configured for the manual workflow.
        </Text>
      ) : null}
      {byEnvironment.size === 0 ? (
        <Text as="p" size="sm" tone="secondary">
          Availability is unknown until this manual reads a GitHub Deployment receipt.
        </Text>
      ) : (
        <div className="space-y-10">
          {[...byEnvironment].map(([environment, rows]) => (
            <section key={environment}>
              <h2 className="mb-3 font-heading font-bold text-xl">{environmentLabel(environment)}</h2>
              {(() => {
                const evidence = index.snapshot.availabilityEnvironments?.find((one) => one.environment === environment);
                if (!evidence) return null;
                return (
                  <Text as="p" className="mb-3" size="sm" tone="secondary">
                    {availabilityIsStale(evidence)
                      ? `Stale receipt; last fetched ${evidence.fetchedAt ? new Date(evidence.fetchedAt).toLocaleString() : "unknown"}.`
                      : `Last fetched ${evidence.fetchedAt ? new Date(evidence.fetchedAt).toLocaleString() : "unknown"}.`}
                    {evidence.deploymentUrl ? <> {" "}<a className="underline" href={evidence.deploymentUrl}>Deployment</a></> : null}
                  </Text>
                );
              })()}
              {rows.length === 0 ? (
                <Text as="p" size="sm" tone="secondary">No changes are recorded for this environment; serving availability is unknown.</Text>
              ) : (
                <>
                  <ul className="space-y-3">
                  {rows.filter(({ availability }) => availability.state !== "unknown").map(({ change, availability }) => (
                    <li className="rounded-(--radius-lg) border border-border bg-card p-4" key={`${environment}:${change.id}`}>
                      <div className="flex flex-wrap items-baseline gap-2">
                        {availability.manualUrl ? (
                          <a className="font-medium hover:underline" href={availability.manualUrl}><InlineMarkdown text={change.title} /></a>
                        ) : (
                          <Link className="font-medium hover:underline" to={`/in-flight/${change.id}`}>
                            <InlineMarkdown text={change.title} />
                          </Link>
                        )}
                        <Badge size="sm" variant={stateVariant(visibleAvailabilityState(availability))}>
                          {visibleAvailabilityState(availability)}
                        </Badge>
                        {availability.observedAt ? (
                          <time className="text-xs text-muted-foreground" dateTime={availability.observedAt}>
                            Observed {new Date(availability.observedAt).toLocaleString()}
                          </time>
                        ) : null}
                      </div>
                      {availability.summary ? (
                        <Text as="p" className="mt-2" size="sm" tone="secondary">{availability.summary}</Text>
                      ) : null}
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                        {availability.manualUrl ? <a className="underline" href={availability.manualUrl}>Manual</a> : null}
                        {availability.qaUrl ? <a className="underline" href={availability.qaUrl}>QA walk</a> : null}
                        {availability.components.map((component) => component.url ? (
                          <a className="underline" href={component.url} key={component.name} title={component.resolvedRef}>{component.name}: {component.status}</a>
                        ) : (
                          <span className="text-muted-foreground" key={component.name}>{`${component.name}: ${component.status}${component.resolvedRef ? ` (${component.resolvedRef.slice(0, 12)})` : ""}`}</span>
                        ))}
                      </div>
                      {availability.resolvedRef ? (
                        <Text as="p" className="mt-2 font-mono" size="xs" tone="secondary">
                          Resolved ref {availability.resolvedRef}
                        </Text>
                      ) : null}
                    </li>
                  ))}
                  </ul>
                  {rows.some(({ availability }) => availability.state === "unknown") ? (
                    <details className="mt-4 text-sm">
                      <summary className="cursor-pointer text-muted-foreground">
                        {rows.filter(({ availability }) => availability.state === "unknown").length} accepted change(s) have unknown availability
                      </summary>
                      <ul className="mt-3 space-y-3">
                        {rows.filter(({ availability }) => availability.state === "unknown").map(({ change, availability }) => (
                          <li className="rounded-(--radius-lg) border border-border bg-card p-4" key={`${environment}:${change.id}`}>
                            <div className="flex flex-wrap items-baseline gap-2">
                              <Link className="font-medium hover:underline" to={`/in-flight/${change.id}`}>
                                <InlineMarkdown text={change.title} />
                              </Link>
                              <Badge size="sm" variant="outline">unknown</Badge>
                            </div>
                            {availability.summary ? <Text as="p" className="mt-2" size="sm" tone="secondary">{availability.summary}</Text> : null}
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : null}
                </>
              )}
            </section>
          ))}
        </div>
      )}
    </>
  );
}
