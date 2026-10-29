import type {
  ImageArtifact,
  VerificationManifest,
} from "@grade10/ui-verification/model";
import {
  validateManifest,
  validateObjectKey,
} from "@grade10/ui-verification/model";

export interface VerificationIdentity {
  caseId: string;
  targetId: string;
  capturePointId: string;
}

export interface ArchiveRunPage {
  runs: VerificationManifest[];
  cursor?: string;
}

export type ArchiveRecord = Record<string, unknown>;

export function isRecord(value: unknown): value is ArchiveRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function verificationIdentity(
  value: unknown,
): VerificationIdentity | null {
  if (!isRecord(value)) return null;
  const { caseId, targetId, capturePointId } = value;
  if (
    typeof caseId !== "string" ||
    typeof targetId !== "string" ||
    typeof capturePointId !== "string"
  ) {
    return null;
  }
  return { caseId, targetId, capturePointId };
}

export function identityKey(identity: VerificationIdentity): string {
  return `${identity.caseId}::${identity.targetId}::${identity.capturePointId}`;
}

export function sameIdentity(
  left: VerificationIdentity,
  right: VerificationIdentity,
): boolean {
  return identityKey(left) === identityKey(right);
}

function apiUrl(base: string, pathname: string, query?: URLSearchParams): URL {
  const url = new URL(`${base}${pathname}`);
  if (query) url.search = query.toString();
  return url;
}

function errorMessage(payload: unknown): string | undefined {
  if (!isRecord(payload)) return undefined;
  if (typeof payload.message === "string") return payload.message;
  if (typeof payload.error === "string") return payload.error;
  if (isRecord(payload.error) && typeof payload.error.message === "string") {
    return payload.error.message;
  }
  return undefined;
}

async function requestJson(url: URL, init: RequestInit = {}): Promise<unknown> {
  let response: Response;
  try {
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    response = await fetch(url, {
      ...init,
      credentials: "include",
      headers,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new Error(
      error instanceof Error
        ? `Could not reach the archive: ${error.message}`
        : "Could not reach the archive.",
    );
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`Archive request failed with HTTP ${response.status}.`);
    }
    throw new Error("The archive returned an unreadable JSON response.");
  }
  if (!response.ok) {
    throw new Error(
      errorMessage(payload) ??
        `Archive request failed with HTTP ${response.status}.`,
    );
  }
  return payload;
}

function requireObject(value: unknown, label: string): ArchiveRecord {
  if (!isRecord(value))
    throw new Error(`The archive response ${label} is invalid.`);
  return value;
}

export async function listRuns(
  base: string,
  caseId: string,
  cursor: string | undefined,
  signal: AbortSignal,
): Promise<ArchiveRunPage> {
  const query = new URLSearchParams({ caseId, cursor: cursor ?? "" });
  const payload = requireObject(
    await requestJson(apiUrl(base, "/api/runs", query), { signal }),
    "for run history",
  );
  if (!Array.isArray(payload.runs)) {
    throw new Error("The archive response for run history has no runs list.");
  }
  const runs = payload.runs.map((value, index) => {
    try {
      return validateManifest(value);
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "invalid manifest";
      throw new Error(`Archived run ${index + 1} is invalid: ${detail}`);
    }
  });
  return {
    runs,
    ...(typeof payload.cursor === "string" && payload.cursor !== ""
      ? { cursor: payload.cursor }
      : {}),
  };
}

export async function getRun(
  base: string,
  runId: string,
  signal: AbortSignal,
): Promise<VerificationManifest> {
  const payload = await requestJson(
    apiUrl(base, `/api/runs/${encodeURIComponent(runId)}`),
    { signal },
  );
  try {
    return validateManifest(payload);
  } catch (error) {
    const detail = error instanceof Error ? error.message : "invalid manifest";
    throw new Error(`The selected archived run is invalid: ${detail}`);
  }
}

export async function getImageObject(
  base: string,
  artifact: ImageArtifact,
  signal: AbortSignal,
): Promise<Blob> {
  const key = validateObjectKey(artifact.key);
  let response: Response;
  try {
    response = await fetch(
      apiUrl(base, "/api/objects", new URLSearchParams({ key })),
      { credentials: "include", signal },
    );
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new Error(
      error instanceof Error
        ? `Could not load archived image: ${error.message}`
        : "Could not load archived image.",
    );
  }
  if (!response.ok) {
    throw new Error(
      `Archived image request failed with HTTP ${response.status}.`,
    );
  }
  return response.blob();
}

/** An archived PNG as an object URL, once its bytes match the sealed hash. */
export async function verifiedPngUrl(
  base: string,
  artifact: ImageArtifact,
  signal: AbortSignal,
): Promise<string> {
  const blob = await getImageObject(base, artifact, signal);
  const bytes = await blob.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const actual = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  if (actual.toLowerCase() !== artifact.sha256.toLowerCase()) {
    throw new Error(`Archived image hash mismatch for ${artifact.key}.`);
  }
  return URL.createObjectURL(new Blob([bytes], { type: "image/png" }));
}
