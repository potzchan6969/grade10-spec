import type {
  ImageArtifact,
  ProfileId,
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

export interface ArchiveStorage {
  kind: "filesystem" | "r2";
  location: string;
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

export async function getArchiveInfo(
  base: string,
  signal: AbortSignal,
): Promise<ArchiveStorage> {
  const payload = requireObject(
    await requestJson(apiUrl(base, "/api/archive-info"), { signal }),
    "for its storage destination",
  );
  const storage = requireObject(payload.storage, "for its storage destination");
  if (
    (storage.kind !== "filesystem" && storage.kind !== "r2") ||
    typeof storage.location !== "string" ||
    storage.location.trim() === ""
  ) {
    throw new Error(
      "The archive response for its storage destination is invalid.",
    );
  }
  return { kind: storage.kind, location: storage.location };
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

export async function listRecords(
  base: string,
  kind: "reviews" | "assessments",
  runId: string,
  caseId: string,
  signal: AbortSignal,
): Promise<ArchiveRecord[]> {
  const query = new URLSearchParams({ runId, caseId, limit: "100" });
  const records: ArchiveRecord[] = [];
  const cursors = new Set<string>();
  let cursor: string | undefined;
  do {
    if (cursor) query.set("cursor", cursor);
    else query.delete("cursor");
    const payload = await requestJson(apiUrl(base, `/api/${kind}`, query), {
      signal,
    });
    const collection = Array.isArray(payload)
      ? payload
      : requireObject(payload, `for ${kind}`)[kind];
    if (!Array.isArray(collection) || !collection.every(isRecord)) {
      throw new Error(`The archive response for ${kind} is invalid.`);
    }
    records.push(...collection);
    const nextCursor =
      !Array.isArray(payload) &&
      isRecord(payload) &&
      typeof payload.cursor === "string" &&
      payload.cursor !== ""
        ? payload.cursor
        : undefined;
    if (nextCursor && cursors.has(nextCursor)) {
      throw new Error(`The archive repeated a ${kind} history cursor.`);
    }
    if (nextCursor) cursors.add(nextCursor);
    cursor = nextCursor;
  } while (cursor && !signal.aborted);
  if (signal.aborted) {
    throw new DOMException("The request was aborted.", "AbortError");
  }
  return records;
}

export async function listCalibrations(
  base: string,
  assessment: ArchiveRecord,
  signal: AbortSignal,
): Promise<ArchiveRecord[]> {
  if (typeof assessment.assessmentId !== "string") return [];
  const query = new URLSearchParams({
    assessmentId: assessment.assessmentId,
    limit: "100",
  });
  if (typeof assessment.profileId === "string") {
    query.set("profileId", assessment.profileId);
  }
  if (isRecord(assessment.scorer)) {
    const scorer = assessment.scorer;
    if (typeof scorer.id === "string") query.set("scorerId", scorer.id);
    if (typeof scorer.version === "string")
      query.set("scorerVersion", scorer.version);
    if (typeof scorer.model === "string")
      query.set("scorerModel", scorer.model);
  }
  if (typeof assessment.contractHash === "string") {
    query.set("contractHash", assessment.contractHash);
  }
  if (typeof assessment.rubricVersion === "string") {
    query.set("rubricVersion", assessment.rubricVersion);
  }

  const calibrations: ArchiveRecord[] = [];
  const cursors = new Set<string>();
  let cursor: string | undefined;
  do {
    if (cursor) query.set("cursor", cursor);
    else query.delete("cursor");
    const payload = requireObject(
      await requestJson(apiUrl(base, "/api/calibrations", query), { signal }),
      "for calibration history",
    );
    if (
      !Array.isArray(payload.calibrations) ||
      !payload.calibrations.every(isRecord)
    ) {
      throw new Error(
        "The archive response for calibration history is invalid.",
      );
    }
    calibrations.push(...payload.calibrations);
    const nextCursor =
      typeof payload.cursor === "string" && payload.cursor !== ""
        ? payload.cursor
        : undefined;
    if (nextCursor && cursors.has(nextCursor)) {
      throw new Error("The archive repeated a calibration history cursor.");
    }
    if (nextCursor) cursors.add(nextCursor);
    cursor = nextCursor;
  } while (cursor && !signal.aborted);
  if (signal.aborted) {
    throw new DOMException("The request was aborted.", "AbortError");
  }
  return calibrations;
}

export async function createReview(
  base: string,
  input: VerificationIdentity & {
    runId: string;
    profileId: ProfileId;
    decision: "approved" | "changes-requested";
    comment: string;
  },
): Promise<ArchiveRecord> {
  const payload = await requestJson(apiUrl(base, "/api/reviews"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return requireObject(payload, "for the submitted review");
}
