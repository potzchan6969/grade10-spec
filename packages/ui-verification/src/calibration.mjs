import { createHash } from "node:crypto";
import { canonicalJson, validateLocale } from "./model.mjs";

const HASH = /^[a-f0-9]{64}$/i;
const CALIBRATION_KEY_FIELDS = [
  "scorerId",
  "scorerVersion",
  "scorerModel",
  "profileId",
  "contractHash",
  "rubricVersion",
  "labelPolicyVersion",
];

export const CALIBRATION_DEFAULTS = Object.freeze({
  similarityThreshold: 98,
  confidenceThreshold: 0.99,
  minSampleSize: 400,
  confidenceLevel: 0.95,
  z: 1.96,
  method: "wilson-lower-95",
});

function object(value, path) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new TypeError(`${path} must be an object`);
  }
  return value;
}

function nonEmpty(value, path) {
  if (typeof value !== "string" || value.trim() === "")
    throw new TypeError(`${path} must be non-empty text`);
  return value;
}

function digest(value, path) {
  if (typeof value !== "string" || !HASH.test(value))
    throw new TypeError(`${path} must be a SHA-256 digest`);
  return value.toLowerCase();
}

function boundedNumber(value, path, min, max) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  ) {
    throw new TypeError(`${path} must be a number from ${min} to ${max}`);
  }
  return value;
}

function exactCalibrationKey(assessment, labelPolicyVersion, includeLocale) {
  return {
    scorerId: assessment.scorer.id,
    scorerVersion: assessment.scorer.version,
    scorerModel: assessment.scorer.model,
    profileId: assessment.profileId,
    contractHash: assessment.contractHash,
    rubricVersion: assessment.rubricVersion,
    labelPolicyVersion,
    ...(includeLocale
      ? {
          locale:
            assessment.locale === undefined
              ? "en"
              : validateLocale(assessment.locale, "assessment.locale"),
        }
      : {}),
  };
}

function validateKey(value) {
  const key = object(value, "calibration.key");
  const normalized = {};
  for (const field of CALIBRATION_KEY_FIELDS)
    normalized[field] = nonEmpty(key[field], `calibration.key.${field}`);
  normalized.contractHash = digest(
    key.contractHash,
    "calibration.key.contractHash",
  );
  if (key.locale !== undefined)
    normalized.locale = validateLocale(key.locale, "calibration.key.locale");
  return normalized;
}

function validateObservation(value, index) {
  const path = `calibration.observations[${index}]`;
  const row = object(value, path);
  for (const field of ["sourceAssessmentId", "reviewerId"])
    nonEmpty(row[field], `${path}.${field}`);
  for (const field of ["siteSha256", "referenceSha256"])
    digest(row[field], `${path}.${field}`);
  if (!["held-out", "training"].includes(row.split))
    throw new TypeError(`${path}.split must be held-out or training`);
  for (const field of [
    "independent",
    "humanApproved",
    "criticalVeto",
    "unknownCategory",
    "provenanceVerified",
  ]) {
    if (typeof row[field] !== "boolean")
      throw new TypeError(`${path}.${field} must be a boolean`);
  }
  if (!["captured", "failed"].includes(row.captureStatus))
    throw new TypeError(`${path}.captureStatus must be captured or failed`);
  return {
    sourceAssessmentId: row.sourceAssessmentId,
    reviewerId: row.reviewerId,
    siteSha256: row.siteSha256.toLowerCase(),
    referenceSha256: row.referenceSha256.toLowerCase(),
    split: row.split,
    independent: row.independent,
    humanApproved: row.humanApproved,
    similarity: boundedNumber(row.similarity, `${path}.similarity`, 0, 100),
    criticalVeto: row.criticalVeto,
    unknownCategory: row.unknownCategory,
    provenanceVerified: row.provenanceVerified,
    captureStatus: row.captureStatus,
    ...(row.locale === undefined
      ? {}
      : { locale: validateLocale(row.locale, `${path}.locale`) }),
  };
}

function pairKey(row) {
  return `${localeKey(row)}:${row.siteSha256}:${row.referenceSha256}`;
}

function localeKey(value) {
  const locale = value?.locale ?? "en";
  return validateLocale(locale).toLowerCase();
}

function countsBy(values, keyOf) {
  const counts = new Map();
  for (const value of values)
    counts.set(keyOf(value), (counts.get(keyOf(value)) ?? 0) + 1);
  return counts;
}

function resolvePolicy(rawPolicy) {
  const policy = object(rawPolicy, "policy");
  const labelPolicyVersion = nonEmpty(
    policy.labelPolicyVersion,
    "policy.labelPolicyVersion",
  );
  const similarityThreshold = boundedNumber(
    policy.similarityThreshold ?? CALIBRATION_DEFAULTS.similarityThreshold,
    "policy.similarityThreshold",
    0,
    100,
  );
  const confidenceThreshold = boundedNumber(
    policy.confidenceThreshold ?? CALIBRATION_DEFAULTS.confidenceThreshold,
    "policy.confidenceThreshold",
    0,
    1,
  );
  const minSampleSize =
    policy.minSampleSize ?? CALIBRATION_DEFAULTS.minSampleSize;
  if (!Number.isInteger(minSampleSize) || minSampleSize < 1)
    throw new TypeError("policy.minSampleSize must be a positive integer");
  return {
    labelPolicyVersion,
    similarityThreshold,
    confidenceThreshold,
    minSampleSize,
  };
}

export function wilsonLowerBound(
  approvedCount,
  sampleSize,
  z = CALIBRATION_DEFAULTS.z,
) {
  if (
    !Number.isInteger(approvedCount) ||
    approvedCount < 0 ||
    !Number.isInteger(sampleSize) ||
    sampleSize < 0 ||
    approvedCount > sampleSize
  ) {
    throw new TypeError(
      "approvedCount and sampleSize must be non-negative integers with approvedCount <= sampleSize",
    );
  }
  if (!Number.isFinite(z) || z <= 0)
    throw new TypeError("z must be a positive finite number");
  if (sampleSize === 0) return 0;
  const proportion = approvedCount / sampleSize;
  const zSquared = z * z;
  const denominator = 1 + zSquared / sampleSize;
  const center = proportion + zSquared / (2 * sampleSize);
  const margin =
    z *
    Math.sqrt(
      (proportion * (1 - proportion) + zSquared / (4 * sampleSize)) /
        sampleSize,
    );
  return (center - margin) / denominator;
}

export function calibrateAssessment({
  assessment: rawAssessment,
  calibration: rawCalibration,
  policy: rawPolicy,
}) {
  const assessment = object(rawAssessment, "assessment");
  const calibration = object(rawCalibration, "calibration");
  if (assessment.schemaVersion !== 1)
    throw new TypeError("assessment.schemaVersion must be 1");
  if (calibration.schemaVersion !== 1)
    throw new TypeError("calibration.schemaVersion must be 1");
  const policy = resolvePolicy(rawPolicy);
  if (!Array.isArray(calibration.observations))
    throw new TypeError("calibration.observations must be an array");
  const rows = calibration.observations.map(validateObservation);
  const localeTagged =
    assessment.locale !== undefined ||
    calibration.key?.locale !== undefined ||
    rows.some((row) => row.locale !== undefined);
  const currentLocale = localeKey(assessment);
  const key = exactCalibrationKey(
    assessment,
    policy.labelPolicyVersion,
    localeTagged,
  );
  const suppliedKey = validateKey(calibration.key);
  const keyMatches =
    CALIBRATION_KEY_FIELDS.every(
      (field) => suppliedKey[field] === key[field],
    ) && localeKey(suppliedKey) === currentLocale;
  const pairCounts = countsBy(rows, pairKey);
  const assessmentCounts = countsBy(
    rows,
    (row) => `${localeKey(row)}:${row.sourceAssessmentId}`,
  );
  const currentPair = `${currentLocale}:${digest(assessment.imageHashes.site, "assessment.imageHashes.site")}:${digest(assessment.imageHashes.reference, "assessment.imageHashes.reference")}`;
  const excludedCounts = {
    training: 0,
    notIndependent: 0,
    duplicateImagePair: 0,
    duplicateAssessment: 0,
    selfLabel: 0,
    belowSimilarityThreshold: 0,
    criticalVeto: 0,
    unknownCategory: 0,
    unverifiedProvenance: 0,
    captureFailed: 0,
    ...(localeTagged ? { localeMismatch: 0 } : {}),
  };
  const eligible = [];

  if (keyMatches) {
    for (const row of rows) {
      let excluded = false;
      const exclude = (reason) => {
        excludedCounts[reason] += 1;
        excluded = true;
      };
      if (row.split !== "held-out") exclude("training");
      if (localeKey(row) !== currentLocale && localeTagged)
        exclude("localeMismatch");
      if (!row.independent) exclude("notIndependent");
      if (pairCounts.get(pairKey(row)) !== 1) exclude("duplicateImagePair");
      if (
        assessmentCounts.get(`${localeKey(row)}:${row.sourceAssessmentId}`) !==
        1
      )
        exclude("duplicateAssessment");
      if (
        (row.sourceAssessmentId === assessment.assessmentId &&
          localeKey(row) === currentLocale) ||
        pairKey(row) === currentPair
      )
        exclude("selfLabel");
      if (row.similarity < policy.similarityThreshold)
        exclude("belowSimilarityThreshold");
      if (row.criticalVeto) exclude("criticalVeto");
      if (row.unknownCategory) exclude("unknownCategory");
      if (!row.provenanceVerified) exclude("unverifiedProvenance");
      if (row.captureStatus !== "captured") exclude("captureFailed");
      if (!excluded) eligible.push(row);
    }
  }

  const sampleSize = eligible.length;
  const approvedCount = eligible.filter((row) => row.humanApproved).length;
  const confidenceLowerBound = wilsonLowerBound(approvedCount, sampleSize);
  const candidate =
    assessment.autoAcceptCandidate === true &&
    assessment.similarity >= policy.similarityThreshold &&
    assessment.criticalVeto === false &&
    assessment.unknownCategory === false &&
    assessment.provenanceVerified === true &&
    assessment.failureCount === 0;
  const reasons = [];
  if (!keyMatches) reasons.push("calibration-key-mismatch");
  if (assessment.unknownCategory) reasons.push("unknown-category");
  if (assessment.criticalVeto) reasons.push("critical-veto");
  if (!assessment.provenanceVerified || assessment.failureCount !== 0)
    reasons.push("capture-not-verified");
  if (
    !candidate &&
    !assessment.unknownCategory &&
    !assessment.criticalVeto &&
    assessment.provenanceVerified &&
    assessment.failureCount === 0
  ) {
    reasons.push("assessment-not-candidate");
  }
  if (sampleSize < policy.minSampleSize)
    reasons.push("insufficient-held-out-sample");
  if (confidenceLowerBound < policy.confidenceThreshold)
    reasons.push("confidence-below-threshold");
  const decision = reasons.length === 0 ? "autoaccept" : "shadow";
  const sourceAssessmentIds = eligible
    .map((row) => row.sourceAssessmentId)
    .sort();
  const result = {
    schemaVersion: 1,
    assessmentId: assessment.assessmentId,
    calibrationKey: key,
    policy: {
      similarityThreshold: policy.similarityThreshold,
      confidenceThreshold: policy.confidenceThreshold,
      minSampleSize: policy.minSampleSize,
      confidenceLevel: CALIBRATION_DEFAULTS.confidenceLevel,
    },
    sampleSize,
    approvedCount,
    confidenceLowerBound,
    method: CALIBRATION_DEFAULTS.method,
    sourceAssessmentIds,
    excludedCounts,
    decision,
    reasons,
  };
  return {
    ...result,
    calibrationId: createHash("sha256")
      .update(canonicalJson(result))
      .digest("hex"),
  };
}
