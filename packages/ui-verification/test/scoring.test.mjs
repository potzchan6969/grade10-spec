import assert from "node:assert/strict";
import test from "node:test";
import { assessReport } from "../src/scoring.mjs";

function input(overrides = {}) {
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
    similarity: 99.2,
    dimensions: Object.fromEntries(
      ["layout", "typography", "color", "imagery", "content"].map((name) => [
        name,
        { score: 99, findings: [] },
      ]),
    ),
    criticalMismatches: [],
  };
  return {
    report: { ...report, ...overrides.report },
    expected: { ...expected, ...overrides.expected },
  };
}

test("assessment ingestion pins identity, scorer, rubric and both image hashes without confidence", () => {
  const { report, expected } = input();

  const assessment = assessReport({ report, expected });

  assert.equal(assessment.similarity, 99.2);
  assert.equal(assessment.scorer.version, expected.scorerVersion);
  assert.deepEqual(assessment.imageHashes, report.imageHashes);
  assert.match(assessment.assessmentId, /^[a-f0-9]{64}$/);
  assert.equal(assessment.autoAcceptCandidate, true);
  assert.equal(assessment.confidence, null);
});

test("critical mismatches veto a high-similarity assessment and unknown categories block acceptance", () => {
  const critical = input({
    report: {
      criticalMismatches: [
        { category: "missing_control", evidence: "Continue button is absent" },
      ],
    },
  });
  const unknown = input({
    report: {
      criticalMismatches: [
        { category: "font_regression", evidence: "Font differs" },
      ],
    },
  });

  const criticalAssessment = assessReport(critical);
  const unknownAssessment = assessReport(unknown);

  assert.equal(criticalAssessment.criticalVeto, true);
  assert.equal(criticalAssessment.autoAcceptCandidate, false);
  assert.equal(unknownAssessment.unknownCategory, true);
  assert.equal(unknownAssessment.autoAcceptCandidate, false);
});

test("unverified capture provenance and failures cannot become autoaccept candidates", () => {
  const unverified = input({ expected: { provenanceVerified: false } });
  const failed = input({ expected: { failureCount: 1 } });

  assert.equal(assessReport(unverified).autoAcceptCandidate, false);
  assert.equal(assessReport(failed).autoAcceptCandidate, false);
});

test("assessment ingestion rejects reports whose pinned image hashes do not match", () => {
  const mismatched = input({
    report: {
      imageHashes: { site: "f".repeat(64), reference: "e".repeat(64) },
    },
  });

  assert.throws(() => assessReport(mismatched), /image.*hash/i);
});

test("assessment ingestion rejects a scorer model that differs from the pinned model", () => {
  const mismatched = input({
    expected: { scorerModel: "gpt-visual-2" },
  });

  assert.throws(
    () => assessReport(mismatched),
    /scorer\.model.*expected scorer model/i,
  );
});
