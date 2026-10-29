import type {
  ImageArtifact,
  ImageRegion,
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

export type ApprovalDecision = "approved" | "changes-requested";

/** A reference the workbench captured from the live story at one size. */
export interface ReferenceRecord extends VerificationIdentity {
  referenceId: string;
  profileId: ProfileId;
  locale: string;
  storyId: string;
  commit: string;
  ref: string;
  verified: boolean;
  image: ImageArtifact;
  region: ImageRegion;
  capturedAt: string;
  capturedBy: string;
}

/** A designer's decision on one captured reference image. */
export interface Approval extends VerificationIdentity {
  approvalId: string;
  referenceId: string;
  profileId: ProfileId;
  locale: string;
  referenceHash: string;
  decision: ApprovalDecision;
  comment: string;
  approver: string;
  createdAt: string;
}

export interface ReferenceCaptureInput extends VerificationIdentity {
  sourceRunId: string;
  locale: string;
  approve: boolean;
  comment?: string;
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

function personOf(value: unknown): string | null {
  if (!isRecord(value)) return null;
  if (typeof value.email === "string") return value.email;
  return typeof value.subject === "string" ? value.subject : null;
}

function isProfile(value: unknown): value is ProfileId {
  return value === "desktop" || value === "tablet" || value === "mobile";
}

function regionOf(value: unknown): ImageRegion | null {
  if (!isRecord(value)) return null;
  const { x, y, width, height } = value;
  return [x, y, width, height].every(Number.isInteger)
    ? {
        x: x as number,
        y: y as number,
        width: width as number,
        height: height as number,
      }
    : null;
}

// The archive validated each record when it was written, so one that does
// not read back is reported rather than shown.
export function referenceRecord(value: unknown): ReferenceRecord {
  const record = requireObject(value, "for a reference");
  const identity = verificationIdentity(record);
  const image = isRecord(record.image) ? record.image : null;
  const region = regionOf(record.region);
  const capturedBy = personOf(record.capturedBy);
  if (
    !identity ||
    typeof record.referenceId !== "string" ||
    !isProfile(record.profileId) ||
    typeof record.locale !== "string" ||
    typeof record.storyId !== "string" ||
    typeof record.commit !== "string" ||
    typeof record.ref !== "string" ||
    typeof record.verified !== "boolean" ||
    typeof image?.key !== "string" ||
    typeof image.sha256 !== "string" ||
    !Number.isInteger(image.width) ||
    !Number.isInteger(image.height) ||
    !region ||
    typeof record.capturedAt !== "string" ||
    !capturedBy
  ) {
    throw new Error("The archive returned an unreadable reference.");
  }
  return {
    ...identity,
    referenceId: record.referenceId,
    profileId: record.profileId,
    locale: record.locale,
    storyId: record.storyId,
    commit: record.commit,
    ref: record.ref,
    verified: record.verified,
    image: {
      key: validateObjectKey(image.key),
      sha256: image.sha256.toLowerCase(),
      width: image.width as number,
      height: image.height as number,
    },
    region,
    capturedAt: record.capturedAt,
    capturedBy,
  };
}

export function approvalRecord(value: unknown): Approval {
  const record = requireObject(value, "for an approval");
  const identity = verificationIdentity(record);
  const approver = personOf(record.approver);
  if (
    !identity ||
    typeof record.approvalId !== "string" ||
    typeof record.referenceId !== "string" ||
    !isProfile(record.profileId) ||
    typeof record.locale !== "string" ||
    typeof record.referenceHash !== "string" ||
    (record.decision !== "approved" &&
      record.decision !== "changes-requested") ||
    typeof record.comment !== "string" ||
    !approver ||
    typeof record.createdAt !== "string"
  ) {
    throw new Error("The archive returned an unreadable approval.");
  }
  return {
    ...identity,
    approvalId: record.approvalId,
    referenceId: record.referenceId,
    profileId: record.profileId,
    locale: record.locale,
    referenceHash: record.referenceHash.toLowerCase(),
    decision: record.decision,
    comment: record.comment,
    approver,
    createdAt: record.createdAt,
  };
}

async function listPage<T>(
  base: string,
  path: string,
  name: string,
  read: (value: unknown) => T,
  caseId: string,
  cursor: string | undefined,
  signal: AbortSignal,
): Promise<{ items: T[]; cursor?: string }> {
  const query = new URLSearchParams({ caseId, cursor: cursor ?? "" });
  const payload = requireObject(
    await requestJson(apiUrl(base, path, query), { signal }),
    `for ${name}`,
  );
  const values = payload[name];
  if (!Array.isArray(values)) {
    throw new Error(`The archive response for ${name} has no list.`);
  }
  return {
    items: values.map(read),
    ...(typeof payload.cursor === "string" && payload.cursor !== ""
      ? { cursor: payload.cursor }
      : {}),
  };
}

export function listReferences(
  base: string,
  caseId: string,
  cursor: string | undefined,
  signal: AbortSignal,
) {
  return listPage(
    base,
    "/api/references",
    "references",
    referenceRecord,
    caseId,
    cursor,
    signal,
  );
}

export function listApprovals(
  base: string,
  caseId: string,
  cursor: string | undefined,
  signal: AbortSignal,
) {
  return listPage(
    base,
    "/api/approvals",
    "approvals",
    approvalRecord,
    caseId,
    cursor,
    signal,
  );
}

/** Asks the workbench to capture the live story at every size, approving it when asked. */
export async function captureReference(
  base: string,
  input: ReferenceCaptureInput,
): Promise<{ references: ReferenceRecord[]; approvals: Approval[] }> {
  const payload = requireObject(
    await requestJson(apiUrl(base, "/api/references"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
    "for the captured reference",
  );
  if (!Array.isArray(payload.references) || !Array.isArray(payload.approvals)) {
    throw new Error("The archive response for the capture has no records.");
  }
  return {
    references: payload.references.map(referenceRecord),
    approvals: payload.approvals.map(approvalRecord),
  };
}

export async function createApproval(
  base: string,
  input: { referenceId: string; decision: ApprovalDecision; comment?: string },
): Promise<Approval> {
  return approvalRecord(
    await requestJson(apiUrl(base, "/api/approvals"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
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
