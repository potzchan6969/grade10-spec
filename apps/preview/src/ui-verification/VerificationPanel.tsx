import type {
  CaptureOutcome,
  ImageArtifact,
  ImageRegion,
  ProfileId,
  VerificationManifest,
} from "@grade10/ui-verification/model";
import type { FormEvent } from "react";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useStorybookApi, useStorybookState } from "storybook/manager-api";
import type {
  ArchiveRecord,
  ArchiveStorage,
  VerificationIdentity,
} from "./archive-client";
import {
  createReview,
  getArchiveInfo,
  getImageObject,
  getRun,
  identityKey,
  isRecord,
  listCalibrations,
  listRecords,
  listRuns,
  sameIdentity,
  verificationIdentity,
} from "./archive-client";

import "./verification-panel.css";

// The Storybook manager builder compiles this TSX with React.createElement.
void React;

const ARCHIVE_BASE =
  typeof window === "undefined" ? "" : window.location.origin;
const PROFILE_TABS: readonly { id: ProfileId; label: string; size: string }[] =
  [
    { id: "desktop", label: "Desktop 1440x900", size: "1440 × 900" },
    { id: "tablet", label: "Tablet 768x1024", size: "768 × 1024" },
    { id: "mobile", label: "Mobile 390x844", size: "390 × 844" },
  ];

interface IdentityOption {
  identity: VerificationIdentity;
  label: string;
  status: string;
  storyId: string;
  referenceStoryId: string;
  storyIds: string[];
  createdAt: string;
}

interface VersionOption {
  key: string;
  appRef: string;
  appCommit: string;
  referenceRef: string;
  referenceCommit: string;
  runs: VerificationManifest[];
  latestCreatedAt: string;
}

interface ImageUrls {
  site?: string;
  reference?: string;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "The archive request failed.";
}

function isProfileId(value: unknown): value is ProfileId {
  return value === "desktop" || value === "tablet" || value === "mobile";
}

function entryIdentity(value: unknown): VerificationIdentity | null {
  return verificationIdentity(value);
}

function caseIdOf(value: unknown): string {
  return isRecord(value) && typeof value.caseId === "string"
    ? value.caseId
    : "";
}

function identityOptions(runs: VerificationManifest[]): IdentityOption[] {
  const latest = new Map<string, IdentityOption>();
  for (const run of runs) {
    for (const entry of run.catalogue) {
      const identity = entryIdentity(entry);
      if (!identity) continue;
      const key = identityKey(identity);
      const prior = latest.get(key);
      const referenceStoryId =
        isRecord(entry.reference) && typeof entry.reference.storyId === "string"
          ? entry.reference.storyId
          : "";
      const storyIds = [
        ...new Set(
          [...(prior?.storyIds ?? []), entry.storyId, referenceStoryId].filter(
            Boolean,
          ),
        ),
      ];
      if (prior && prior.createdAt >= run.createdAt) {
        latest.set(key, { ...prior, storyIds });
        continue;
      }
      latest.set(key, {
        identity,
        label: entry.label,
        status: entry.status,
        storyId: entry.storyId,
        referenceStoryId,
        storyIds,
        createdAt: run.createdAt,
      });
    }
  }
  return [...latest.values()].sort((left, right) =>
    left.label.localeCompare(right.label),
  );
}

function versionKeyOf(run: VerificationManifest): string {
  return JSON.stringify([
    run.checkpoint.app.commit,
    run.checkpoint.reference.commit,
  ]);
}

function versionOptions(runs: VerificationManifest[]): VersionOption[] {
  const versions = new Map<string, VersionOption>();
  const newestFirst = [...runs].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
  for (const run of newestFirst) {
    const key = versionKeyOf(run);
    const prior = versions.get(key);
    if (prior) {
      prior.runs.push(run);
      continue;
    }
    versions.set(key, {
      key,
      appRef: run.checkpoint.app.ref,
      appCommit: run.checkpoint.app.commit,
      referenceRef: run.checkpoint.reference.ref,
      referenceCommit: run.checkpoint.reference.commit,
      runs: [run],
      latestCreatedAt: run.createdAt,
    });
  }
  return [...versions.values()];
}

function versionLabel(version: VersionOption): string {
  return `${version.appRef} ${version.appCommit.slice(0, 12)} / ${version.referenceRef} ${version.referenceCommit.slice(0, 12)} · ${version.runs.length} run${version.runs.length === 1 ? "" : "s"}`;
}

function runHasIdentity(
  run: VerificationManifest,
  identity: VerificationIdentity,
): boolean {
  return run.catalogue.some((entry) => {
    const entryId = entryIdentity(entry);
    return entryId !== null && sameIdentity(entryId, identity);
  });
}

function isCaseOnlyVerification(value: unknown, caseId: string): boolean {
  return (
    isRecord(value) &&
    caseIdOf(value) === caseId &&
    !("targetId" in value) &&
    !("capturePointId" in value)
  );
}

async function listAllRuns(
  base: string,
  caseId: string,
  signal: AbortSignal,
): Promise<VerificationManifest[]> {
  const byId = new Map<string, VerificationManifest>();
  const seenCursors = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await listRuns(base, caseId, cursor, signal);
    for (const run of page.runs) byId.set(run.runId, run);
    cursor = page.cursor;
    if (cursor && seenCursors.has(cursor)) {
      throw new Error("The archive repeated a run history cursor.");
    }
    if (cursor) seenCursors.add(cursor);
  } while (cursor && !signal.aborted);
  if (signal.aborted) {
    throw new DOMException("The request was aborted.", "AbortError");
  }
  return [...byId.values()].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

function matchingRecords(
  records: ArchiveRecord[],
  runId: string,
  identity: VerificationIdentity,
  profileId: ProfileId,
): ArchiveRecord[] {
  return records.filter((record) => {
    const recordIdentity = entryIdentity(record);
    return (
      record.runId === runId &&
      record.profileId === profileId &&
      recordIdentity !== null &&
      sameIdentity(recordIdentity, identity)
    );
  });
}

function timestampOf(value: ArchiveRecord): string {
  if (typeof value.createdAt === "string") return value.createdAt;
  if (typeof value.reviewedAt === "string") return value.reviewedAt;
  return "Time not recorded";
}

function latestRecord(values: ArchiveRecord[]): ArchiveRecord | null {
  return (
    [...values].sort((left, right) =>
      timestampOf(right).localeCompare(timestampOf(left)),
    )[0] ?? null
  );
}

function isSyntheticShadowAssessment(value: ArchiveRecord | null): boolean {
  return Boolean(
    value?.decision === "shadow" &&
      (value.synthetic === true ||
        value.source === "synthetic" ||
        value.rubricVersion === "demo-only" ||
        (isRecord(value.scorer) &&
          value.scorer.id === "synthetic-demo" &&
          value.scorer.model === "fixture-only")),
  );
}

function automaticStatus(
  value: ArchiveRecord | null,
  scoringProfile: ProfileId | undefined,
  selectedProfile: ProfileId,
): string {
  if (!value) {
    if (scoringProfile && selectedProfile !== scoringProfile) {
      return `The selected target is scored at the ${scoringProfile} profile. No assessment is expected for ${selectedProfile}.`;
    }
    return `No external model assessment is recorded for the ${selectedProfile} scoring profile in this run.`;
  }
  if (isSyntheticShadowAssessment(value)) {
    return "Synthetic shadow assessment (not produced by an external model)";
  }
  if (typeof value.decision === "string") {
    return `Model decision: ${value.decision}`;
  }
  if (typeof value.status === "string") {
    return `Assessment status: ${value.status}`;
  }
  return "Assessment recorded; no automatic acceptance is stated";
}

function scoreDetails(value: ArchiveRecord | null): string[] {
  if (!value) return [];
  const details: string[] = [];
  if (typeof value.assessmentId === "string") {
    details.push(`Assessment ID: ${value.assessmentId}`);
  }
  if (isRecord(value.scorer)) {
    details.push(
      `Scorer: ${String(value.scorer.id ?? "unknown")} ${String(value.scorer.version ?? "")} (${String(value.scorer.model ?? "model not recorded")})`,
    );
  }
  if (typeof value.rubricVersion === "string") {
    details.push(`Rubric: ${value.rubricVersion}`);
  }
  if (typeof value.contractHash === "string") {
    details.push(`Contract SHA-256: ${value.contractHash}`);
  }
  if (
    typeof value.similarity === "number" &&
    Number.isFinite(value.similarity)
  ) {
    const threshold =
      typeof value.similarityThreshold === "number"
        ? ` / threshold ${value.similarityThreshold}`
        : "";
    details.push(
      `Image similarity: ${value.similarity}${threshold} (${value.similarityPass === true ? "pass" : "below threshold"})`,
    );
  }
  if (value.confidence === null) {
    details.push("Model confidence: not supplied by the scorer");
  }
  if (isRecord(value.dimensions)) {
    for (const [name, rawDimension] of Object.entries(value.dimensions)) {
      if (!isRecord(rawDimension)) continue;
      const score =
        typeof rawDimension.score === "number"
          ? `: ${rawDimension.score}/100`
          : "";
      const findings = Array.isArray(rawDimension.findings)
        ? rawDimension.findings.filter(
            (finding): finding is string => typeof finding === "string",
          )
        : [];
      details.push(
        `${name}${score}${findings.length ? ` - ${findings.join("; ")}` : ""}`,
      );
    }
  }
  if (value.criticalVeto === true) {
    const mismatches = Array.isArray(value.criticalMismatches)
      ? value.criticalMismatches.filter(isRecord).map((mismatch) => {
          const category =
            typeof mismatch.category === "string"
              ? mismatch.category
              : "critical mismatch";
          const evidence =
            typeof mismatch.evidence === "string" ? mismatch.evidence : "";
          return evidence ? `${category}: ${evidence}` : category;
        })
      : [];
    details.push(
      `Critical mismatch veto: ${mismatches.join("; ") || "recorded"}`,
    );
  }
  if (value.unknownCategory === true) {
    const categories = Array.isArray(value.unknownCategories)
      ? value.unknownCategories.filter(
          (category): category is string => typeof category === "string",
        )
      : [];
    details.push(`Unknown category: ${categories.join(", ") || "yes"}`);
  }
  details.push(
    `Capture provenance: ${value.provenanceVerified === true ? "verified" : "unverified"}`,
  );
  if (typeof value.failureCount === "number")
    details.push(`Scoring failures: ${value.failureCount}`);
  details.push(
    `Autoaccept candidate: ${value.autoAcceptCandidate === true ? "yes" : "no"}`,
  );
  if (Array.isArray(value.reasons)) {
    details.push(
      ...value.reasons.filter(
        (reason): reason is string => typeof reason === "string",
      ),
    );
  }
  return [...new Set(details)];
}

function matchingCalibration(
  assessment: ArchiveRecord | null,
  calibrations: ArchiveRecord[],
): ArchiveRecord | null {
  if (
    !assessment ||
    typeof assessment.assessmentId !== "string" ||
    !isRecord(assessment.scorer)
  ) {
    return null;
  }
  const scorer = assessment.scorer;
  const matches = calibrations.filter((calibration) => {
    if (
      calibration.assessmentId !== assessment.assessmentId ||
      !isRecord(calibration.calibrationKey)
    ) {
      return false;
    }
    const key = calibration.calibrationKey;
    return (
      key.scorerId === scorer.id &&
      key.scorerVersion === scorer.version &&
      key.scorerModel === scorer.model &&
      key.profileId === assessment.profileId &&
      typeof key.contractHash === "string" &&
      typeof assessment.contractHash === "string" &&
      key.contractHash.toLowerCase() ===
        assessment.contractHash.toLowerCase() &&
      key.rubricVersion === assessment.rubricVersion &&
      typeof key.labelPolicyVersion === "string" &&
      key.labelPolicyVersion.trim() !== ""
    );
  });
  return latestRecord(matches);
}

function calibrationAutoaccepts(
  assessment: ArchiveRecord | null,
  calibration: ArchiveRecord | null,
): boolean {
  if (!assessment || !calibration || calibration.decision !== "autoaccept")
    return false;
  if (!isRecord(calibration.policy)) return false;
  const policy = calibration.policy;
  return (
    assessment.autoAcceptCandidate === true &&
    assessment.criticalVeto === false &&
    assessment.unknownCategory === false &&
    assessment.provenanceVerified === true &&
    assessment.failureCount === 0 &&
    typeof assessment.similarity === "number" &&
    typeof policy.similarityThreshold === "number" &&
    assessment.similarity >= policy.similarityThreshold &&
    typeof calibration.sampleSize === "number" &&
    typeof policy.minSampleSize === "number" &&
    calibration.sampleSize >= policy.minSampleSize &&
    typeof calibration.confidenceLowerBound === "number" &&
    typeof policy.confidenceThreshold === "number" &&
    calibration.confidenceLowerBound >= policy.confidenceThreshold &&
    calibration.method === "wilson-lower-95" &&
    (!Array.isArray(calibration.reasons) || calibration.reasons.length === 0)
  );
}

function calibrationDetails(value: ArchiveRecord | null): string[] {
  if (!value) return [];
  const details: string[] = [];
  if (typeof value.calibrationId === "string")
    details.push(`Calibration ID: ${value.calibrationId}`);
  if (typeof value.decision === "string")
    details.push(`Calibration decision: ${value.decision}`);
  if (typeof value.confidenceLowerBound === "number") {
    details.push(
      `Calibrated confidence lower bound: ${(value.confidenceLowerBound * 100).toFixed(2)}%`,
    );
  }
  if (
    typeof value.sampleSize === "number" &&
    typeof value.approvedCount === "number"
  ) {
    details.push(
      `Held-out approvals: ${value.approvedCount}/${value.sampleSize}`,
    );
  }
  if (isRecord(value.policy)) {
    const threshold = value.policy.confidenceThreshold;
    const minSampleSize = value.policy.minSampleSize;
    if (typeof threshold === "number")
      details.push(`Confidence threshold: ${(threshold * 100).toFixed(2)}%`);
    if (typeof minSampleSize === "number")
      details.push(`Minimum held-out sample: ${minSampleSize}`);
    if (typeof value.policy.similarityThreshold === "number") {
      details.push(`Similarity threshold: ${value.policy.similarityThreshold}`);
    }
  }
  if (typeof value.method === "string") details.push(`Method: ${value.method}`);
  if (
    isRecord(value.calibrationKey) &&
    typeof value.calibrationKey.labelPolicyVersion === "string"
  ) {
    details.push(`Label policy: ${value.calibrationKey.labelPolicyVersion}`);
  }
  if (typeof value.createdAt === "string")
    details.push(`Calibration recorded: ${value.createdAt}`);
  if (isRecord(value.excludedCounts)) {
    const exclusions = Object.entries(value.excludedCounts)
      .filter(([, count]) => typeof count === "number" && count > 0)
      .map(([reason, count]) => `${reason}: ${count}`);
    if (exclusions.length > 0) {
      details.push(`Excluded observations: ${exclusions.join(", ")}`);
    }
  }
  if (Array.isArray(value.reasons)) {
    details.push(
      ...value.reasons.filter(
        (reason): reason is string => typeof reason === "string",
      ),
    );
  }
  return [...new Set(details)];
}

function recordDecision(value: ArchiveRecord): string {
  if (value.decision === "approved") return "Human approved";
  if (value.decision === "changes-requested") return "Changes requested";
  return typeof value.decision === "string"
    ? value.decision
    : "Review recorded";
}

function reviewerLabel(value: ArchiveRecord): string {
  if (typeof value.reviewer === "string") return value.reviewer;
  if (isRecord(value.reviewer)) {
    if (typeof value.reviewer.subject === "string")
      return value.reviewer.subject;
    if (typeof value.reviewer.email === "string") return value.reviewer.email;
  }
  return "Reviewer not recorded";
}

function formatIdentity(identity: VerificationIdentity): string {
  return `${identity.caseId} · ${identity.targetId} · ${identity.capturePointId}`;
}

async function verifiedPngUrl(
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

function captureFor(
  manifest: VerificationManifest | null,
  identity: VerificationIdentity | null,
  profileId: ProfileId,
): CaptureOutcome | null {
  if (!manifest || !identity) return null;
  return (
    manifest.captures.find(
      (capture) =>
        capture.caseId === identity.caseId &&
        capture.targetId === identity.targetId &&
        capture.capturePointId === identity.capturePointId &&
        capture.profileId === profileId,
    ) ?? null
  );
}

function ImageEvidence({
  title,
  artifact,
  imageUrl,
  cropRegion,
}: {
  title: string;
  artifact: ImageArtifact;
  imageUrl: string | undefined;
  cropRegion?: ImageRegion;
}) {
  const imageStyle = cropRegion
    ? {
        left: `${(-cropRegion.x / cropRegion.width) * 100}%`,
        top: `${(-cropRegion.y / cropRegion.height) * 100}%`,
        width: `${(artifact.width / cropRegion.width) * 100}%`,
        height: `${(artifact.height / cropRegion.height) * 100}%`,
      }
    : undefined;
  return (
    <section
      className="verification-image-card"
      aria-label={`${title} evidence`}
    >
      <div className="verification-image-heading">
        <h3>{title}</h3>
        <span>
          {artifact.width} × {artifact.height}
        </span>
      </div>
      <div
        className={`verification-image-frame${cropRegion ? " verification-image-frame--crop" : ""}`}
        style={{
          aspectRatio: cropRegion
            ? `${cropRegion.width} / ${cropRegion.height}`
            : `${artifact.width} / ${artifact.height}`,
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={
              cropRegion ? `${title} capture region` : `${title} full viewport`
            }
            style={imageStyle}
          />
        ) : (
          <p role="status">Loading original PNG…</p>
        )}
      </div>
      {imageUrl ? (
        <a href={imageUrl} download={`${title.toLocaleLowerCase()}.png`}>
          Download original {title} PNG · SHA-256 {artifact.sha256}
        </a>
      ) : (
        <span>SHA-256 {artifact.sha256}</span>
      )}
      {title === "Reference" && !cropRegion ? (
        <p className="verification-notice">
          No reference region was recorded; showing the full reference image.
        </p>
      ) : null}
    </section>
  );
}

export function VerificationPanel({ active }: { active: boolean }) {
  const managerApi = useStorybookApi();
  const managerState = useStorybookState();
  const currentStoryId = managerState.storyId;
  const verificationParameter = currentStoryId
    ? managerApi.getParameters(currentStoryId, "verification")
    : undefined;
  const caseIdHint = caseIdOf(verificationParameter);
  const exactIdentityHint = useMemo(
    () => verificationIdentity(verificationParameter),
    [verificationParameter],
  );

  const archiveBase = ARCHIVE_BASE;
  const [archiveStorage, setArchiveStorage] = useState<ArchiveStorage | null>(
    null,
  );
  const [archiveInfoError, setArchiveInfoError] = useState("");
  const [loadingArchiveInfo, setLoadingArchiveInfo] = useState(false);
  const [storyListOpen, setStoryListOpen] = useState(false);
  const [identitySearch, setIdentitySearch] = useState("");
  const [selectedIdentityKey, setSelectedIdentityKey] = useState("");
  const [selectedVersionKey, setSelectedVersionKey] = useState("");
  const [selectedCurrentCaseId, setSelectedCurrentCaseId] = useState("");
  const [selectedCurrentIdentityKey, setSelectedCurrentIdentityKey] =
    useState("");
  const [runs, setRuns] = useState<VerificationManifest[]>([]);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [manifest, setManifest] = useState<VerificationManifest | null>(null);
  const [profileId, setProfileId] = useState<ProfileId>("desktop");
  const [imageUrls, setImageUrls] = useState<ImageUrls>({});
  const [reviews, setReviews] = useState<ArchiveRecord[]>([]);
  const [assessments, setAssessments] = useState<ArchiveRecord[]>([]);
  const [calibrations, setCalibrations] = useState<ArchiveRecord[]>([]);
  const [historyError, setHistoryError] = useState("");
  const [manifestError, setManifestError] = useState("");
  const [imageError, setImageError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [assessmentError, setAssessmentError] = useState("");
  const [calibrationError, setCalibrationError] = useState("");
  const [loadingCalibrations, setLoadingCalibrations] = useState(false);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [loadingRun, setLoadingRun] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [savingReview, setSavingReview] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const [reviewDecision, setReviewDecision] = useState<
    "approved" | "changes-requested"
  >("approved");
  const [reviewComment, setReviewComment] = useState("");
  const identityChoices = useMemo(() => identityOptions(runs), [runs]);
  const currentIdentityChoices = useMemo(() => {
    if (caseIdHint) {
      const choices = identityChoices.filter(
        (choice) => choice.identity.caseId === caseIdHint,
      );
      if (
        exactIdentityHint &&
        !choices.some((choice) =>
          sameIdentity(choice.identity, exactIdentityHint),
        )
      ) {
        choices.unshift({
          identity: exactIdentityHint,
          label: currentStoryId || exactIdentityHint.caseId,
          status: "current, not archived",
          storyId: currentStoryId || "Current story",
          referenceStoryId: "",
          storyIds: [currentStoryId || "Current story"],
          createdAt: "",
        });
      }
      return choices;
    }
    if (!currentStoryId) return [];
    return identityChoices.filter((choice) =>
      choice.storyIds.includes(currentStoryId),
    );
  }, [caseIdHint, currentStoryId, exactIdentityHint, identityChoices]);
  const currentCaseIds = useMemo(
    () =>
      [
        ...new Set(
          currentIdentityChoices.map((choice) => choice.identity.caseId),
        ),
      ].sort(),
    [currentIdentityChoices],
  );
  const effectiveCurrentCaseId =
    (currentCaseIds.includes(caseIdHint) ? caseIdHint : "") ||
    (currentCaseIds.includes(selectedCurrentCaseId)
      ? selectedCurrentCaseId
      : currentCaseIds.length === 1
        ? currentCaseIds[0]
        : "");
  const currentTargetChoices = currentIdentityChoices.filter(
    (choice) => choice.identity.caseId === effectiveCurrentCaseId,
  );
  const currentTargetKeys = currentTargetChoices.map((choice) =>
    identityKey(choice.identity),
  );
  const effectiveCurrentIdentityKey =
    (currentTargetKeys.includes(selectedCurrentIdentityKey)
      ? selectedCurrentIdentityKey
      : "") ||
    (exactIdentityHint &&
    currentTargetKeys.includes(identityKey(exactIdentityHint))
      ? identityKey(exactIdentityHint)
      : "") ||
    (currentTargetChoices.length === 1
      ? identityKey(currentTargetChoices[0].identity)
      : "");
  const currentIdentity =
    currentTargetChoices.find(
      (choice) => identityKey(choice.identity) === effectiveCurrentIdentityKey,
    )?.identity ?? null;
  const currentVersionRuns = currentIdentity
    ? runs.filter((run) => runHasIdentity(run, currentIdentity))
    : runs;
  const availableVersions = useMemo(
    () => versionOptions(storyListOpen ? runs : currentVersionRuns),
    [currentVersionRuns, runs, storyListOpen],
  );
  const effectiveVersionKey = availableVersions.some(
    (version) => version.key === selectedVersionKey,
  )
    ? selectedVersionKey
    : (availableVersions[0]?.key ?? "");
  const selectedVersion =
    availableVersions.find((version) => version.key === effectiveVersionKey) ??
    null;
  const versionIdentityChoices = useMemo(
    () => identityOptions(selectedVersion?.runs ?? []),
    [selectedVersion],
  );
  const filteredVersionIdentityChoices = useMemo(() => {
    const query = identitySearch.trim().toLocaleLowerCase();
    if (!query) return versionIdentityChoices;
    return versionIdentityChoices.filter((choice) =>
      [
        choice.label,
        choice.identity.caseId,
        choice.identity.targetId,
        choice.identity.capturePointId,
        choice.storyId,
        ...choice.storyIds,
        choice.status,
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query),
    );
  }, [identitySearch, versionIdentityChoices]);
  const effectiveIdentityKey = storyListOpen
    ? versionIdentityChoices.some(
        (choice) => identityKey(choice.identity) === selectedIdentityKey,
      )
      ? selectedIdentityKey
      : ""
    : effectiveCurrentIdentityKey;
  const selectedStoryChoice = storyListOpen
    ? (versionIdentityChoices.find(
        (choice) => identityKey(choice.identity) === effectiveIdentityKey,
      ) ?? null)
    : null;
  const selectedIdentity = storyListOpen
    ? (selectedStoryChoice?.identity ?? null)
    : currentIdentity;
  const listFilterCaseId = storyListOpen ? "" : caseIdHint;
  const listStoryScope = storyListOpen ? "" : (currentStoryId ?? "");
  const matchingRuns = useMemo(
    () =>
      selectedIdentity && selectedVersion
        ? selectedVersion.runs.filter((run) =>
            runHasIdentity(run, selectedIdentity),
          )
        : [],
    [selectedIdentity, selectedVersion],
  );
  const effectiveRunId = matchingRuns.some((run) => run.runId === selectedRunId)
    ? selectedRunId
    : (matchingRuns[0]?.runId ?? "");
  const selectedCapture = useMemo(
    () => captureFor(manifest, selectedIdentity, profileId),
    [manifest, profileId, selectedIdentity],
  );
  const selectedAssessment = latestRecord(
    selectedIdentity && manifest
      ? matchingRecords(
          assessments,
          manifest.runId,
          selectedIdentity,
          profileId,
        )
      : [],
  );
  const selectedReview = latestRecord(
    selectedIdentity && manifest
      ? matchingRecords(reviews, manifest.runId, selectedIdentity, profileId)
      : [],
  );
  const selectedCalibration = matchingCalibration(
    selectedAssessment,
    calibrations,
  );
  const isCalibratedAutoaccept = calibrationAutoaccepts(
    selectedAssessment,
    selectedCalibration,
  );
  const selectedCalibrationDetails = calibrationDetails(selectedCalibration);
  const profile =
    PROFILE_TABS.find((item) => item.id === profileId) ?? PROFILE_TABS[0];

  useEffect(() => {
    if (!active || !archiveBase) return;
    const controller = new AbortController();
    setLoadingArchiveInfo(true);
    setArchiveInfoError("");
    void getArchiveInfo(archiveBase, controller.signal)
      .then((storage) => {
        if (!controller.signal.aborted) setArchiveStorage(storage);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setArchiveInfoError(messageOf(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingArchiveInfo(false);
      });
    return () => controller.abort();
  }, [active]);

  useEffect(() => {
    if (!active || !archiveBase || (!storyListOpen && !listStoryScope)) {
      setRuns([]);
      setLoadingRuns(false);
      return;
    }
    const controller = new AbortController();
    setLoadingRuns(true);
    setHistoryError("");
    setRuns([]);
    if (refreshVersion > 0) setSelectedRunId("");
    void listAllRuns(archiveBase, listFilterCaseId, controller.signal)
      .then((nextRuns) => {
        if (controller.signal.aborted) return;
        setRuns(nextRuns);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setHistoryError(messageOf(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingRuns(false);
      });
    return () => controller.abort();
  }, [active, listFilterCaseId, listStoryScope, refreshVersion, storyListOpen]);

  useEffect(() => {
    if (!active || !archiveBase || !effectiveRunId || !selectedIdentity) {
      setManifest(null);
      setReviews([]);
      setAssessments([]);
      setCalibrations([]);
      setCalibrationError("");
      setLoadingRun(false);
      return;
    }
    const controller = new AbortController();
    setLoadingRun(true);
    setManifest(null);
    setManifestError("");
    setReviewError("");
    setAssessmentError("");
    if (refreshVersion > 0) {
      setReviews([]);
      setAssessments([]);
    }
    const load = async () => {
      const [runResult, reviewResult, assessmentResult] =
        await Promise.allSettled([
          getRun(archiveBase, effectiveRunId, controller.signal),
          listRecords(
            archiveBase,
            "reviews",
            effectiveRunId,
            selectedIdentity.caseId,
            controller.signal,
          ),
          listRecords(
            archiveBase,
            "assessments",
            effectiveRunId,
            selectedIdentity.caseId,
            controller.signal,
          ),
        ]);
      if (controller.signal.aborted) return;
      if (runResult.status === "fulfilled") setManifest(runResult.value);
      else setManifestError(messageOf(runResult.reason));
      if (reviewResult.status === "fulfilled") setReviews(reviewResult.value);
      else setReviewError(messageOf(reviewResult.reason));
      if (assessmentResult.status === "fulfilled")
        setAssessments(assessmentResult.value);
      else setAssessmentError(messageOf(assessmentResult.reason));
      setLoadingRun(false);
    };
    void load().catch((error: unknown) => {
      if (!controller.signal.aborted) {
        setManifestError(messageOf(error));
        setLoadingRun(false);
      }
    });
    return () => controller.abort();
  }, [active, effectiveRunId, refreshVersion, selectedIdentity]);

  useEffect(() => {
    if (!active || !archiveBase || !selectedAssessment) {
      setCalibrations([]);
      setCalibrationError("");
      setLoadingCalibrations(false);
      return;
    }
    const controller = new AbortController();
    setCalibrations([]);
    setCalibrationError("");
    setLoadingCalibrations(true);
    void listCalibrations(archiveBase, selectedAssessment, controller.signal)
      .then((records) => {
        if (!controller.signal.aborted) setCalibrations(records);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setCalibrationError(messageOf(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingCalibrations(false);
      });
    return () => controller.abort();
  }, [active, selectedAssessment]);

  useEffect(() => {
    const capture = selectedCapture;
    if (!active || !archiveBase || !capture || capture.status !== "captured") {
      setImageUrls({});
      setLoadingImages(false);
      return;
    }
    const controller = new AbortController();
    const createdUrls: string[] = [];
    setImageUrls({});
    setImageError("");
    setLoadingImages(true);
    const load = async () => {
      const site = await verifiedPngUrl(
        archiveBase,
        capture.site,
        controller.signal,
      );
      createdUrls.push(site);
      let reference: string | undefined;
      if (capture.reference) {
        reference = await verifiedPngUrl(
          archiveBase,
          capture.reference,
          controller.signal,
        );
        createdUrls.push(reference);
      }
      if (controller.signal.aborted) {
        for (const url of createdUrls) URL.revokeObjectURL(url);
        return;
      }
      setImageUrls({ site, ...(reference ? { reference } : {}) });
    };
    void load()
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setImageError(messageOf(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingImages(false);
      });
    return () => {
      controller.abort();
      for (const url of createdUrls) URL.revokeObjectURL(url);
    };
  }, [active, selectedCapture]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !archiveBase ||
      !archiveStorage ||
      !effectiveRunId ||
      !selectedIdentity ||
      !isProfileId(profileId)
    )
      return;
    setSavingReview(true);
    setReviewError("");
    try {
      await createReview(archiveBase, {
        runId: effectiveRunId,
        caseId: selectedIdentity.caseId,
        targetId: selectedIdentity.targetId,
        capturePointId: selectedIdentity.capturePointId,
        profileId,
        decision: reviewDecision,
        comment: reviewComment.trim(),
      });
      setReviewComment("");
      setReviews(
        await listRecords(
          archiveBase,
          "reviews",
          effectiveRunId,
          selectedIdentity.caseId,
          new AbortController().signal,
        ),
      );
    } catch (error) {
      setReviewError(messageOf(error));
    } finally {
      setSavingReview(false);
    }
  }

  const selectedDeclaration = manifest?.catalogue.find(
    (entry) =>
      selectedIdentity !== null &&
      entry.caseId === selectedIdentity.caseId &&
      entry.targetId === selectedIdentity.targetId &&
      entry.capturePointId === selectedIdentity.capturePointId,
  );
  const relevantReviews = selectedReview ? [selectedReview] : [];
  const selectedAssessmentDetails = scoreDetails(selectedAssessment);
  function storyNavigation(choice: IdentityOption) {
    if (choice.storyId && managerApi.resolveStory(choice.storyId)) {
      return { target: choice.storyId, notice: "" };
    }
    if (
      choice.referenceStoryId &&
      managerApi.resolveStory(choice.referenceStoryId)
    ) {
      return {
        target: choice.referenceStoryId,
        notice:
          "Recorded story unavailable; the reference story is available in this Storybook.",
      };
    }

    const exactMatches: string[] = [];
    const caseOnlyMatches: string[] = [];
    for (const indexedEntry of Object.values(managerState.index ?? {})) {
      if (indexedEntry.type !== "story") continue;
      const indexedStory = managerApi.getData(indexedEntry.id);
      if (indexedStory?.type !== "story") continue;
      const verification = indexedStory.parameters?.verification;
      const indexedIdentity = verificationIdentity(verification);
      if (indexedIdentity && sameIdentity(indexedIdentity, choice.identity)) {
        exactMatches.push(indexedStory.id);
      } else if (isCaseOnlyVerification(verification, choice.identity.caseId)) {
        caseOnlyMatches.push(indexedStory.id);
      }
    }
    if (exactMatches.length === 1) {
      return {
        target: exactMatches[0],
        notice:
          "Recorded story IDs are unavailable; opened the unique Storybook story with the matching verification identity.",
      };
    }
    if (exactMatches.length === 0 && caseOnlyMatches.length === 1) {
      return {
        target: caseOnlyMatches[0],
        notice:
          "Recorded story IDs are unavailable; opened the unique Storybook story mapped to this case.",
      };
    }
    if (exactMatches.length > 1 || caseOnlyMatches.length > 1) {
      return {
        target: "",
        notice:
          "Recorded story IDs are unavailable, and the current Storybook mapping is ambiguous. Historical evidence remains available.",
      };
    }
    return {
      target: "",
      notice:
        "The recorded story is no longer in this Storybook. Historical evidence remains available.",
    };
  }

  const selectedStoryNavigation = selectedStoryChoice
    ? storyNavigation(selectedStoryChoice)
    : null;

  function selectArchivedStory(choice: IdentityOption) {
    setSelectedIdentityKey(identityKey(choice.identity));
    setSelectedRunId("");
    const navigation = storyNavigation(choice);
    if (navigation.target) managerApi.selectStory(navigation.target);
  }

  return (
    <div className="verification-panel">
      <header className="verification-panel-header">
        <div>
          <h2>Verification history</h2>
          <p>
            The current Storybook story is live; archived evidence stays tied to
            its run.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setRefreshVersion((value) => value + 1)}
          disabled={!archiveBase}
        >
          Refresh
        </button>
      </header>

      <section
        className="verification-section"
        aria-labelledby="verification-story-heading"
      >
        <h3 id="verification-story-heading">Current Storybook story</h3>
        <p>{currentStoryId || "No story is selected"}</p>
        {caseIdHint ? (
          <p className="verification-metadata">
            {storyListOpen ? "Current live case: " : "Mapped case: "}
            {caseIdHint}
          </p>
        ) : currentIdentityChoices.length > 0 ? (
          <p className="verification-metadata">
            {storyListOpen
              ? "The current live story matches an archived entry."
              : "Archived entries match this story ID or its reference story ID."}
          </p>
        ) : currentStoryId ? (
          <p className="verification-muted">
            No archived verification entries match this story.
          </p>
        ) : null}
        {!storyListOpen && currentCaseIds.length > 1 ? (
          <label className="verification-field">
            Current verification case
            <select
              value={effectiveCurrentCaseId}
              onChange={(event) => {
                setSelectedCurrentCaseId(event.currentTarget.value);
                setSelectedCurrentIdentityKey("");
              }}
            >
              <option value="">Choose a case</option>
              {currentCaseIds.map((caseId) => (
                <option key={caseId} value={caseId}>
                  {caseId}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {!storyListOpen && currentTargetChoices.length > 0 ? (
          <label className="verification-field">
            Verification target
            <select
              value={effectiveCurrentIdentityKey}
              onChange={(event) =>
                setSelectedCurrentIdentityKey(event.currentTarget.value)
              }
              disabled={currentTargetChoices.length === 1}
            >
              {currentTargetChoices.length > 1 ? (
                <option value="">Choose a target</option>
              ) : null}
              {currentTargetChoices.map((choice) => (
                <option
                  key={identityKey(choice.identity)}
                  value={identityKey(choice.identity)}
                >
                  {choice.label} · {choice.identity.targetId} ·{" "}
                  {choice.identity.capturePointId}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {currentIdentity ? (
          <p className="verification-metadata">
            {storyListOpen ? "Current live identity: " : "Mapped identity: "}
            {formatIdentity(currentIdentity)}
          </p>
        ) : null}
        {availableVersions.length > 0 ? (
          <label className="verification-field">
            Selected version
            <select
              value={effectiveVersionKey}
              onChange={(event) => {
                setSelectedVersionKey(event.currentTarget.value);
                setSelectedIdentityKey("");
                setSelectedRunId("");
              }}
            >
              {availableVersions.map((version) => (
                <option key={version.key} value={version.key}>
                  {versionLabel(version)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {storyListOpen ? (
          <>
            <div className="verification-inline-actions">
              <button
                type="button"
                onClick={() => {
                  setStoryListOpen(false);
                }}
              >
                Return to current story
              </button>
            </div>
            <label className="verification-field">
              Search archived stories
              <input
                type="search"
                value={identitySearch}
                onChange={(event) =>
                  setIdentitySearch(event.currentTarget.value)
                }
                placeholder="Label, case ID, target, capture point, or story ID"
              />
            </label>
            <fieldset className="verification-story-field">
              <legend>Archived stories</legend>
              <div className="verification-story-list">
                {filteredVersionIdentityChoices.length > 0 ? (
                  filteredVersionIdentityChoices.map((choice) => {
                    const key = identityKey(choice.identity);
                    const isSelected = key === effectiveIdentityKey;
                    return (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={isSelected}
                        className="verification-story-choice"
                        onClick={() => selectArchivedStory(choice)}
                      >
                        <span>{choice.label}</span>
                        <span className="verification-metadata">
                          {choice.identity.targetId} ·{" "}
                          {choice.identity.capturePointId} · {choice.status} ·{" "}
                          {choice.storyId}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <p className="verification-muted">
                    No archived stories in this version.
                  </p>
                )}
              </div>
            </fieldset>
            {selectedStoryNavigation?.notice ? (
              <p className="verification-notice">
                {selectedStoryNavigation.notice}
              </p>
            ) : null}
          </>
        ) : null}
        {!storyListOpen ? (
          <button
            type="button"
            onClick={() => {
              setSelectedVersionKey(effectiveVersionKey);
              setSelectedIdentityKey(
                currentIdentity &&
                  versionIdentityChoices.some((choice) =>
                    sameIdentity(choice.identity, currentIdentity),
                  )
                  ? identityKey(currentIdentity)
                  : "",
              );
              setIdentitySearch("");
              setStoryListOpen(true);
            }}
          >
            All recordings
          </button>
        ) : null}
      </section>

      {!storyListOpen && !currentStoryId ? (
        <p className="verification-empty">
          Select a story with a verification mapping or open a story list for a
          selected version.
        </p>
      ) : null}
      {!storyListOpen &&
      currentStoryId &&
      currentIdentityChoices.length > 0 &&
      !currentIdentity ? (
        <p className="verification-empty">
          Choose a verification case and target to view its archived history.
        </p>
      ) : null}
      {!storyListOpen &&
      currentStoryId &&
      caseIdHint &&
      currentIdentityChoices.length === 0 &&
      !loadingRuns &&
      !historyError ? (
        <p className="verification-empty">
          No archived entries match this verification case.
        </p>
      ) : null}

      {historyError ? (
        <p role="alert" className="verification-error">
          Run history: {historyError}
        </p>
      ) : null}
      {loadingRuns ? <p role="status">Loading archived runs…</p> : null}
      {archiveBase &&
      selectedIdentity &&
      !loadingRuns &&
      matchingRuns.length === 0 &&
      !historyError ? (
        <p className="verification-empty">
          No archived runs match this verification identity.
        </p>
      ) : null}

      {matchingRuns.length > 0 && selectedIdentity ? (
        <section
          className="verification-section"
          aria-labelledby="verification-run-heading"
        >
          <h3 id="verification-run-heading">Archived run</h3>
          <label className="verification-field">
            Archived run
            <select
              value={effectiveRunId}
              onChange={(event) => setSelectedRunId(event.currentTarget.value)}
            >
              {matchingRuns.map((run) => (
                <option key={run.runId} value={run.runId}>
                  {run.runId} · {run.createdAt}
                </option>
              ))}
            </select>
          </label>
        </section>
      ) : null}

      {manifestError ? (
        <p role="alert" className="verification-error">
          Selected run: {manifestError}
        </p>
      ) : null}
      {loadingRun ? <p role="status">Loading archived evidence…</p> : null}

      {manifest && selectedIdentity ? (
        <>
          <section className="verification-section" aria-label="Run provenance">
            <h3>{manifest.runId}</h3>
            <p>Run created: {manifest.createdAt}</p>
            <dl className="verification-provenance">
              <div>
                <dt>App checkpoint</dt>
                <dd>
                  {manifest.checkpoint.app.ref} ·{" "}
                  {manifest.checkpoint.app.commit}
                </dd>
              </div>
              <div>
                <dt>Story reference</dt>
                <dd>
                  {manifest.checkpoint.reference.ref} ·{" "}
                  {manifest.checkpoint.reference.commit}
                </dd>
              </div>
              <div>
                <dt>Recorded story</dt>
                <dd>
                  {selectedDeclaration?.storyId ?? "Not present in this run"}
                </dd>
              </div>
              <div>
                <dt>Identity</dt>
                <dd>{formatIdentity(selectedIdentity)}</dd>
              </div>
              <div>
                <dt>Source capture time</dt>
                <dd>
                  {selectedCapture?.provenance.capturedAt ?? "Not recorded"}
                </dd>
              </div>
              <div>
                <dt>Capture source commits</dt>
                <dd>
                  {selectedCapture
                    ? `${selectedCapture.provenance.appCommit} · ${selectedCapture.provenance.referenceCommit}`
                    : "Not recorded"}
                </dd>
              </div>
            </dl>
          </section>

          {selectedDeclaration?.status === "retired" ? (
            <p className="verification-notice">Retired at capture</p>
          ) : null}
          {selectedCapture?.provenance.verified === false ? (
            <p className="verification-notice">
              Capture provenance is unverified
            </p>
          ) : null}
          {selectedCapture?.provenance.reusedFrom ? (
            <p className="verification-metadata">
              Reused from {selectedCapture.provenance.reusedFrom.runId},
              captured {selectedCapture.provenance.reusedFrom.capturedAt}, app{" "}
              {selectedCapture.provenance.reusedFrom.appCommit}, reference{" "}
              {selectedCapture.provenance.reusedFrom.referenceCommit}
            </p>
          ) : null}

          <section
            className="verification-section"
            aria-label="Viewport evidence"
          >
            <div
              className="verification-tabs"
              role="tablist"
              aria-label="Viewport profile"
            >
              {PROFILE_TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={profileId === item.id}
                  aria-controls="verification-profile-panel"
                  onClick={() => setProfileId(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div
              id="verification-profile-panel"
              role="tabpanel"
              aria-label={`${profile.label} evidence`}
            >
              <p className="verification-metadata">
                Recorded viewport: {profile.size}
              </p>
              {!selectedCapture ? (
                <p role="alert">
                  This run has no outcome for the selected identity and profile.
                </p>
              ) : selectedCapture.status === "failed" ? (
                <p role="alert">
                  Capture failed: {selectedCapture.failure.message}
                </p>
              ) : selectedCapture.status === "not-selected" ? (
                <p className="verification-notice">
                  This profile was not selected
                </p>
              ) : (
                <>
                  {selectedCapture.reference ? (
                    <div className="verification-image-grid">
                      <ImageEvidence
                        title="Reference"
                        artifact={selectedCapture.reference}
                        imageUrl={imageUrls.reference}
                        cropRegion={selectedCapture.referenceRegion}
                      />
                      <ImageEvidence
                        title="Site"
                        artifact={selectedCapture.site}
                        imageUrl={imageUrls.site}
                      />
                    </div>
                  ) : (
                    <>
                      <p className="verification-notice">
                        No matching reference at this viewport
                      </p>
                      <p className="verification-notice">
                        Not scored at this profile
                      </p>
                      <div className="verification-image-grid">
                        <ImageEvidence
                          title="Site"
                          artifact={selectedCapture.site}
                          imageUrl={imageUrls.site}
                        />
                      </div>
                    </>
                  )}
                  {loadingImages ? (
                    <p role="status">Loading original screenshots…</p>
                  ) : null}
                  {imageError ? (
                    <p role="alert" className="verification-error">
                      Images: {imageError}
                    </p>
                  ) : null}
                </>
              )}
            </div>
          </section>

          <section
            className="verification-section"
            aria-label="Assessment and review status"
          >
            <h3>Assessment</h3>
            <p>
              {automaticStatus(
                selectedAssessment,
                selectedDeclaration?.scoreProfile,
                profileId,
              )}
            </p>
            {isSyntheticShadowAssessment(selectedAssessment) ? (
              <p className="verification-notice">
                This synthetic shadow assessment does not evaluate visual
                quality. No external model produced this result.
              </p>
            ) : null}
            {selectedAssessmentDetails.length > 0 ? (
              <ul className="verification-details">
                {selectedAssessmentDetails.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
            {assessmentError ? (
              <p role="alert" className="verification-error">
                Assessment history: {assessmentError}
              </p>
            ) : null}
            <h4>Calibration</h4>
            <p>
              {loadingCalibrations
                ? "Loading calibration history…"
                : isCalibratedAutoaccept
                  ? "Calibrated autoaccept: manual human review is not required for this assessment"
                  : selectedCalibration
                    ? `Calibration decision: ${String(selectedCalibration.decision ?? "unknown")} - human review is required`
                    : "No matching calibration - human review is required"}
            </p>
            {selectedCalibrationDetails.length > 0 ? (
              <ul className="verification-details">
                {selectedCalibrationDetails.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
            {calibrationError ? (
              <p role="alert" className="verification-error">
                Calibration history: {calibrationError}
              </p>
            ) : null}
            <h3>Human review</h3>
            <p>
              {selectedReview
                ? recordDecision(selectedReview)
                : isCalibratedAutoaccept
                  ? "Human review not required by the matching calibrated policy"
                  : "Human review pending"}
            </p>
            {selectedReview ? (
              <p className="verification-metadata">
                {reviewerLabel(selectedReview)} · {timestampOf(selectedReview)}
              </p>
            ) : null}
            {relevantReviews.map((review) => (
              <blockquote
                key={
                  typeof review.reviewId === "string"
                    ? review.reviewId
                    : `${timestampOf(review)}:${String(review.decision ?? "review")}`
                }
              >
                {typeof review.comment === "string" && review.comment !== ""
                  ? review.comment
                  : "No comment recorded."}
              </blockquote>
            ))}
            {reviewError ? (
              <p role="alert" className="verification-error">
                Review history: {reviewError}
              </p>
            ) : null}
            <form
              className="verification-review-form"
              onSubmit={(event) => void submitReview(event)}
            >
              <label className="verification-field">
                Review decision
                <select
                  value={reviewDecision}
                  onChange={(event) =>
                    setReviewDecision(
                      event.currentTarget.value as
                        | "approved"
                        | "changes-requested",
                    )
                  }
                >
                  <option value="approved">Approve this archived pair</option>
                  <option value="changes-requested">Request changes</option>
                </select>
              </label>
              <label className="verification-field">
                Review comment
                <textarea
                  value={reviewComment}
                  onChange={(event) =>
                    setReviewComment(event.currentTarget.value)
                  }
                  rows={3}
                  maxLength={4000}
                />
              </label>
              {loadingArchiveInfo ? (
                <p role="status" className="verification-metadata">
                  Checking archive destination…
                </p>
              ) : archiveStorage ? (
                <p className="verification-metadata">
                  Review saves to{" "}
                  {archiveStorage.kind === "filesystem"
                    ? "local archive"
                    : "R2 archive"}
                  : {archiveStorage.location}
                </p>
              ) : archiveInfoError ? (
                <p role="alert" className="verification-error">
                  Archive destination: {archiveInfoError}
                </p>
              ) : (
                <p role="status" className="verification-metadata">
                  Archive destination is unavailable.
                </p>
              )}
              <button
                type="submit"
                disabled={
                  !archiveBase ||
                  !archiveStorage ||
                  !manifest ||
                  !selectedIdentity ||
                  !selectedCapture ||
                  selectedCapture.status !== "captured" ||
                  !selectedCapture.reference ||
                  savingReview
                }
              >
                {savingReview ? "Saving review…" : "Submit review"}
              </button>
            </form>
          </section>
        </>
      ) : null}
    </div>
  );
}
