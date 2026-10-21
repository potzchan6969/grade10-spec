import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { calibrateAssessment, wilsonLowerBound } from "../src/calibration.mjs";
import { assessReport } from "../src/scoring.mjs";

function assessment(overrides = {}) {
  const expected = {
    caseId: "storefront-home",
    targetId: "grade10-site",
    capturePointId: "final",
    profileId: "desktop",
    scorerId: "visual-agent",
    scorerVersion: "2.1.0",
    scorerModel: "gpt-visual-1",
    rubricVersion: "ui-rubric-v1",
    contractHash: "c".repeat(64),
    siteSha256: "d".repeat(64),
    referenceSha256: "e".repeat(64),
    captureStatus: "captured",
    provenanceVerified: true,
    failureCount: 0,
  };
  const report = {
    schemaVersion: 1,
    caseId: expected.caseId,
    targetId: expected.targetId,
    capturePointId: expected.capturePointId,
    profileId: expected.profileId,
    scorer: {
      id: expected.scorerId,
      version: expected.scorerVersion,
      model: "gpt-visual-1",
    },
    rubricVersion: expected.rubricVersion,
    contractHash: expected.contractHash,
    imageHashes: {
      site: expected.siteSha256,
      reference: expected.referenceSha256,
    },
    similarity: 99.5,
    dimensions: Object.fromEntries(
      ["layout", "typography", "color", "imagery", "content"].map((name) => [
        name,
        { score: 99, findings: [] },
      ]),
    ),
    criticalMismatches: [],
  };
  return assessReport({
    report: { ...report, ...overrides.report },
    expected: { ...expected, ...overrides.expected },
  });
}

function sampleId(index) {
  return createHash("sha256").update(`assessment-${index}`).digest("hex");
}

function observations(count, overrides = {}) {
  return Array.from({ length: count }, (_, index) => ({
    sourceAssessmentId: sampleId(index),
    siteSha256: createHash("sha256").update(`site-${index}`).digest("hex"),
    referenceSha256: createHash("sha256")
      .update(`reference-${index}`)
      .digest("hex"),
    split: "held-out",
    independent: true,
    reviewerId: `human-${index}`,
    humanApproved: true,
    similarity: 99,
    criticalVeto: false,
    unknownCategory: false,
    provenanceVerified: true,
    captureStatus: "captured",
    ...overrides,
  }));
}

function calibration(current, rows) {
  return {
    schemaVersion: 1,
    key: {
      scorerId: current.scorer.id,
      scorerVersion: current.scorer.version,
      scorerModel: current.scorer.model,
      profileId: current.profileId,
      contractHash: current.contractHash,
      rubricVersion: current.rubricVersion,
      labelPolicyVersion: "human-approval-v1",
    },
    observations: rows,
  };
}

const policy = { labelPolicyVersion: "human-approval-v1" };

test("autoaccept requires 400 exact-key held-out approvals and uses a Wilson lower bound", () => {
  const current = assessment();
  const result = calibrateAssessment({
    assessment: current,
    calibration: calibration(current, observations(400)),
    policy,
  });

  assert.equal(result.sampleSize, 400);
  assert.equal(result.approvedCount, 400);
  assert.equal(result.method, "wilson-lower-95");
  assert.equal(Object.hasOwn(result.calibrationKey, "locale"), false);
  assert.ok(result.confidenceLowerBound >= 0.99);
  assert.equal(result.decision, "autoaccept");
  assert.equal(wilsonLowerBound(400, 400), result.confidenceLowerBound);
});

test("training labels and every duplicate image pair are excluded from calibration", () => {
  const current = assessment();
  const rows = observations(399);
  rows[0].split = "training";
  rows.push({ ...rows[1], sourceAssessmentId: sampleId(500) });
  const result = calibrateAssessment({
    assessment: current,
    calibration: calibration(current, rows),
    policy,
  });

  assert.equal(result.sampleSize, 397);
  assert.equal(result.decision, "shadow");
  assert.ok(result.reasons.includes("insufficient-held-out-sample"));
});

test("calibration keys and duplicate image pairs are isolated by locale", () => {
  const current = assessment({
    expected: { locale: "zh-Hant" },
    report: { locale: "zh-Hant" },
  });
  const rows = observations(2, { locale: "zh-Hant" });
  rows[0].siteSha256 = "1".repeat(64);
  rows[0].referenceSha256 = "2".repeat(64);
  rows[1].locale = "en";
  rows[1].siteSha256 = rows[0].siteSha256;
  rows[1].referenceSha256 = rows[0].referenceSha256;
  const recipe = calibration(current, rows);
  recipe.key.locale = "zh-Hant";

  const result = calibrateAssessment({
    assessment: current,
    calibration: recipe,
    policy,
  });
  assert.equal(result.calibrationKey.locale, "zh-Hant");
  assert.equal(result.sampleSize, 1);

  recipe.key.locale = "en";
  const mismatched = calibrateAssessment({
    assessment: current,
    calibration: recipe,
    policy,
  });
  assert.equal(mismatched.sampleSize, 0);
  assert.ok(mismatched.reasons.includes("calibration-key-mismatch"));
});

test("a mismatched scorer key, unknown assessment category, or one failed label remains in shadow", () => {
  const current = assessment();
  const exact = calibration(current, observations(400));
  const mismatch = { ...exact, key: { ...exact.key, scorerVersion: "2.0.0" } };
  const oneRejected = observations(400, { humanApproved: true });
  oneRejected[0].humanApproved = false;
  const unknown = assessment({
    report: {
      criticalMismatches: [
        { category: "unknown_layout_issue", evidence: "Unmapped concern" },
      ],
    },
  });

  const mismatchResult = calibrateAssessment({
    assessment: current,
    calibration: mismatch,
    policy,
  });
  const rejectResult = calibrateAssessment({
    assessment: current,
    calibration: calibration(current, oneRejected),
    policy,
  });
  const unknownResult = calibrateAssessment({
    assessment: unknown,
    calibration: exact,
    policy,
  });

  assert.equal(mismatchResult.decision, "shadow");
  assert.ok(mismatchResult.reasons.includes("calibration-key-mismatch"));
  assert.equal(rejectResult.confidenceLowerBound < 0.99, true);
  assert.equal(rejectResult.decision, "shadow");
  assert.equal(unknownResult.decision, "shadow");
  assert.ok(unknownResult.reasons.includes("unknown-category"));
});
