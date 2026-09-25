import type {
  ChangeEntry,
  EnvironmentAvailability,
  EnvironmentReceiptSummary,
} from "../api/types.ts";

export type DeploymentReceipt = {
  version: 1;
  environment: string;
  resolvedRef: string;
  observedAt: string;
  fetchedAt?: string;
  deploymentUrl?: string;
  deploymentEnvironment?: string;
  servingSet?: {
    newly: { change: string; fingerprint: string }[];
    still: { change: string; fingerprint: string }[];
    noLonger: { change: string; fingerprint: string }[];
  };
  components: { name: string; status: string; url?: string; resolvedRef?: string }[];
  changes: {
    change: string;
    title: string;
    fingerprint: string;
    archiveCommit: string;
    summary: string;
    status?: "available" | "partial" | "unknown";
    evidenceError?: string;
    manualUrl?: string;
    qaUrl?: string;
    components: string[];
  }[];
};

/** Receipts arrive from the canonical GitHub Deployments payloads. Invalid
 * payloads are ignored: a malformed or absent observation says unknown. */
export function receiptsFrom(
  source: string | undefined,
): DeploymentReceipt[] {
  if (!source) return [];
  try {
    const parsed: unknown = JSON.parse(source);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(validReceipt);
  } catch {
    return [];
  }
}

function validReceipt(value: unknown): value is DeploymentReceipt {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    item.version === 1 &&
    typeof item.environment === "string" &&
    typeof item.resolvedRef === "string" &&
    typeof item.observedAt === "string" &&
    Number.isFinite(Date.parse(item.observedAt)) &&
    Array.isArray(item.components) &&
    item.components.every(
      (one: unknown) => {
        if (!one || typeof one !== "object") return false;
        const component = one as Record<string, unknown>;
        return typeof component.name === "string" && typeof component.status === "string";
      },
    ) &&
    Array.isArray(item.changes) &&
    item.changes.every(
      (one: unknown) => {
        if (!one || typeof one !== "object") return false;
        const change = one as Record<string, unknown>;
        return (
          typeof change.change === "string" &&
          typeof change.title === "string" &&
          typeof change.fingerprint === "string" &&
          typeof change.archiveCommit === "string" &&
          typeof change.summary === "string" &&
          Array.isArray(change.components) &&
          change.components.every((component: unknown) => typeof component === "string")
        );
      },
    )
  );
}

/** Project each archived or in-flight change against the previous and latest
 * serving set for every environment. The build timestamp is injected so the
 * same receipt produces the same result in a test or a rebuilt manual. */
export function projectAvailability(
  changes: ChangeEntry[],
  receipts: DeploymentReceipt[],
): EnvironmentReceiptSummary[] {
  const history = new Map<string, DeploymentReceipt[]>();
  for (const receipt of receipts) {
    const rows = history.get(receipt.environment) ?? [];
    rows.push(receipt);
    history.set(receipt.environment, rows);
  }
  for (const rows of history.values()) {
    rows.sort((left, right) => Date.parse(left.observedAt) - Date.parse(right.observedAt));
  }

  for (const change of changes) {
    const environments: EnvironmentAvailability[] = [];
    for (const [environment, rows] of history) {
      const latest = rows.at(-1)!;
      const previous = rows.at(-2);
      const listed = latest.changes.find((one) => one.change === change.id);
      const wasListed = previous?.changes.some((one) => one.change === change.id) ?? false;
      const newly = latest.servingSet?.newly.some(
        (one) => one.change === change.id && one.fingerprint === change.acceptanceFingerprint,
      ) ?? (!wasListed && Boolean(listed));
      const still = latest.servingSet?.still.some(
        (one) => one.change === change.id && one.fingerprint === change.acceptanceFingerprint,
      ) ?? (wasListed && Boolean(listed));
      const noLonger = latest.servingSet?.noLonger.some(
        (one) => one.change === change.id,
      ) ?? (wasListed && !listed);
      const components = listed
        ? latest.components.filter((one) => listed.components.includes(one.name))
        : [];
      const validEvidence = Boolean(
        listed &&
          change.accepted &&
          change.implementationComplete &&
          listed.fingerprint === change.acceptanceFingerprint &&
          listed.archiveCommit &&
          (listed.status === undefined || listed.status === "available"),
      );
      const state: EnvironmentAvailability["state"] = listed && (!validEvidence || listed.status === "partial" || listed.status === "unknown")
          ? listed.status === "partial"
            ? "partial"
            : "unknown"
          : listed
            ? still && validEvidence
              ? "still"
              : newly && validEvidence
                ? "newly"
                : "unknown"
            : noLonger
              ? "no-longer"
              : "unknown";
      if (state === "unknown" && !listed && !noLonger) continue;
      environments.push({
        environment,
        state,
        observedAt: latest.observedAt,
        ...(latest.fetchedAt ? { fetchedAt: latest.fetchedAt } : {}),
        resolvedRef: latest.resolvedRef,
        components,
        ...(listed?.summary
          ? { summary: listed.summary }
          : noLonger
            ? { summary: "No longer serving in this environment." }
            : {}),
        ...(listed?.manualUrl ? { manualUrl: listed.manualUrl } : {}),
        ...(listed?.qaUrl ? { qaUrl: listed.qaUrl } : {}),
      });
    }
    if (environments.length > 0) change.availability = environments;
  }
  return [...history].map(([environment, rows]) => {
    const latest = rows.at(-1)!;
    return {
      environment,
      resolvedRef: latest.resolvedRef,
      observedAt: latest.observedAt,
      ...(latest.fetchedAt ? { fetchedAt: latest.fetchedAt } : {}),
      ...(latest.deploymentUrl ? { deploymentUrl: latest.deploymentUrl } : {}),
      components: latest.components,
    };
  });
}
