import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { deflateSync } from "node:zlib";
import { createArchive } from "../src/archive.mjs";
import { PROFILES } from "../src/model.mjs";
import { assessReport } from "../src/scoring.mjs";

const runId = "run-locale-matrix";
const caseId = "storefront-home";
const targetId = "grade10-site";
const capturePointId = "final";
const locales = ["en", "zh-Hant"];

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1)
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const name = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}

function png(width, height, rgba) {
  const stride = width * 4 + 1;
  const data = Buffer.alloc(stride * height);
  const pixel = Buffer.from(rgba);
  for (let y = 0; y < height; y += 1)
    data.fill(pixel, y * stride + 1, (y + 1) * stride);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(data)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function fixture({ id = runId, selectedLocales = locales } = {}) {
  const appCommit = "a".repeat(40);
  const referenceCommit = "b".repeat(40);
  const captures = [];
  const objects = [];
  for (const locale of selectedLocales) {
    for (const [profileId, dimensions] of Object.entries(PROFILES)) {
      const siteBytes = png(
        dimensions.width,
        dimensions.height,
        [45, 95, 145, 255],
      );
      const referenceBytes = png(
        dimensions.width,
        dimensions.height,
        [5, 15, 25, 255],
      );
      const siteKey = `ui-verification/${id}/${profileId}-site-${locale}.png`;
      const referenceKey = `ui-verification/${id}/${profileId}-reference-${locale}.png`;
      objects.push(
        { key: siteKey, bytes: siteBytes },
        { key: referenceKey, bytes: referenceBytes },
      );
      captures.push({
        locale,
        caseId,
        targetId,
        capturePointId,
        profileId,
        status: "captured",
        inputFingerprint: locale === "en" ? "c".repeat(64) : "f".repeat(64),
        provenance: {
          verified: true,
          appCommit,
          referenceCommit,
          capturedAt: "2026-10-09T10:00:00.000Z",
        },
        site: { key: siteKey, sha256: sha256(siteBytes), ...dimensions },
        reference: {
          key: referenceKey,
          sha256: sha256(referenceBytes),
          ...dimensions,
        },
        ...(profileId === "mobile"
          ? {
              siteRegion: { x: 0, y: 0, width: 100, height: 100 },
              referenceRegion: { x: 0, y: 0, width: 100, height: 100 },
            }
          : {}),
      });
    }
  }

  return {
    manifest: {
      schemaVersion: 1,
      runId: id,
      createdAt: "2026-10-09T10:01:00.000Z",
      checkpoint: {
        app: { ref: "refs/tags/app-1", commit: appCommit },
        reference: { ref: "refs/tags/reference-1", commit: referenceCommit },
      },
      catalogue: [
        {
          schemaVersion: 1,
          caseId,
          targetId,
          capturePointId,
          storyId: "homepage-story",
          label: "Homepage",
          scoreProfile: "desktop",
          recipe: { path: "/" },
          reference: { storyId: "homepage-reference", selector: "main" },
          status: "active",
        },
      ],
      locales: selectedLocales,
      captures,
    },
    objects,
  };
}

function assessmentFor(manifest, locale, profileId = "desktop") {
  const capture = manifest.captures.find(
    (entry) => entry.locale === locale && entry.profileId === profileId,
  );
  const report = {
    schemaVersion: 1,
    locale,
    caseId,
    targetId,
    capturePointId,
    profileId,
    scorer: { id: "visual-agent", version: "1", model: "visual-model" },
    rubricVersion: "rubric-1",
    contractHash: "1".repeat(64),
    imageHashes: {
      site: capture.site.sha256,
      reference: capture.reference.sha256,
    },
    similarity: 99,
    dimensions: Object.fromEntries(
      ["layout", "typography", "color", "imagery", "content"].map((name) => [
        name,
        { score: 99, findings: [] },
      ]),
    ),
    criticalMismatches: [],
  };
  const assessment = assessReport({
    report,
    expected: {
      locale,
      caseId,
      targetId,
      capturePointId,
      profileId,
      scorerId: "visual-agent",
      scorerVersion: "1",
      scorerModel: "visual-model",
      rubricVersion: "rubric-1",
      contractHash: "1".repeat(64),
      siteSha256: capture.site.sha256,
      referenceSha256: capture.reference.sha256,
      captureStatus: "captured",
      provenanceVerified: true,
      failureCount: 0,
    },
  });
  return { runId, ...assessment };
}

test("archive lookup, reviews, and assessments remain isolated by locale", async () => {
  const root = await mkdtemp(join(tmpdir(), "ui-verification-locales-"));
  try {
    const archive = createArchive(root);
    const { manifest, objects } = fixture();
    await archive.publish(manifest, objects);
    const chineseOnly = fixture({
      id: "run-chinese-only",
      selectedLocales: ["zh-Hant"],
    });
    await archive.publish(chineseOnly.manifest, chineseOnly.objects);
    const allRuns = await archive.listRuns();
    assert.ok(allRuns.runs.some((run) => run.runId === "run-chinese-only"));
    assert.equal(
      (await archive.listRuns({ locale: "en" })).runs.some(
        (run) => run.runId === "run-chinese-only",
      ),
      false,
    );
    assert.ok(
      (await archive.listRuns({ locale: "zh-Hant" })).runs.some(
        (run) => run.runId === "run-chinese-only",
      ),
    );

    const englishReview = await archive.createReview(
      {
        runId,
        caseId,
        targetId,
        capturePointId,
        profileId: "desktop",
        decision: "approved",
      },
      { subject: "english-reviewer" },
    );
    const chineseReview = await archive.createReview(
      {
        runId,
        caseId,
        targetId,
        capturePointId,
        profileId: "desktop",
        locale: "zh-Hant",
        decision: "approved",
      },
      { subject: "chinese-reviewer" },
    );
    assert.equal(englishReview.locale, "en");
    assert.equal(englishReview.capture.inputFingerprint, "c".repeat(64));
    assert.equal(chineseReview.locale, "zh-Hant");
    assert.equal(chineseReview.capture.inputFingerprint, "f".repeat(64));
    assert.equal((await archive.listReviews()).reviews.length, 2);
    assert.equal(
      (await archive.listReviews({ locale: "en" })).reviews.length,
      1,
    );
    assert.equal(
      (await archive.listReviews({ locale: "zh-Hant" })).reviews[0].reviewId,
      chineseReview.reviewId,
    );

    const englishAssessment = assessmentFor(manifest, "en");
    const chineseAssessment = assessmentFor(manifest, "zh-Hant");
    assert.notEqual(
      englishAssessment.assessmentId,
      chineseAssessment.assessmentId,
    );
    await archive.createAssessment(englishAssessment);
    await archive.createAssessment(chineseAssessment);
    assert.equal(
      (await archive.listAssessments({ runId })).assessments.length,
      2,
    );
    assert.equal(
      (await archive.listAssessments({ runId, locale: "en" })).assessments
        .length,
      1,
    );
    assert.equal(
      (await archive.listAssessments({ runId, locale: "zh-Hant" }))
        .assessments[0].assessmentId,
      chineseAssessment.assessmentId,
    );
    const calibrationKey = {
      scorerId: chineseAssessment.scorer.id,
      scorerVersion: chineseAssessment.scorer.version,
      scorerModel: chineseAssessment.scorer.model,
      profileId: chineseAssessment.profileId,
      contractHash: chineseAssessment.contractHash,
      rubricVersion: chineseAssessment.rubricVersion,
      labelPolicyVersion: "human-approval-v1",
      locale: "zh-Hant",
    };
    const observation = {
      sourceAssessmentId: chineseAssessment.assessmentId,
      sourceRunId: runId,
      reviewId: chineseReview.reviewId,
      reviewerId: "chinese-reviewer",
      locale: "zh-Hant",
      siteSha256: chineseAssessment.imageHashes.site,
      referenceSha256: chineseAssessment.imageHashes.reference,
      split: "held-out",
      independent: true,
      humanApproved: true,
      similarity: chineseAssessment.similarity,
      criticalVeto: chineseAssessment.criticalVeto,
      unknownCategory: chineseAssessment.unknownCategory,
      provenanceVerified: chineseAssessment.provenanceVerified,
      captureStatus: "captured",
    };
    const savedCalibration = await archive.createCalibration({
      runId,
      assessmentId: chineseAssessment.assessmentId,
      locale: "zh-Hant",
      calibration: {
        schemaVersion: 1,
        key: calibrationKey,
        observations: [observation],
      },
      policy: { labelPolicyVersion: "human-approval-v1" },
    });
    assert.equal(savedCalibration.calibrationKey.locale, "zh-Hant");
    const englishCalibrationKey = { ...calibrationKey, locale: "en" };
    await archive.createCalibration({
      runId,
      assessmentId: englishAssessment.assessmentId,
      locale: "en",
      calibration: {
        schemaVersion: 1,
        key: englishCalibrationKey,
        observations: [
          {
            ...observation,
            sourceAssessmentId: englishAssessment.assessmentId,
            reviewId: englishReview.reviewId,
            reviewerId: "english-reviewer",
            locale: "en",
            siteSha256: englishAssessment.imageHashes.site,
            referenceSha256: englishAssessment.imageHashes.reference,
            similarity: englishAssessment.similarity,
            criticalVeto: englishAssessment.criticalVeto,
            unknownCategory: englishAssessment.unknownCategory,
          },
        ],
      },
      policy: { labelPolicyVersion: "human-approval-v1" },
    });
    assert.equal((await archive.listCalibrations()).calibrations.length, 2);
    assert.equal(
      (await archive.listCalibrations({ locale: "en" })).calibrations.length,
      1,
    );
    assert.equal(
      (await archive.listCalibrations({ locale: "zh-Hant" })).calibrations
        .length,
      1,
    );
    await assert.rejects(
      archive.createCalibration({
        runId,
        assessmentId: chineseAssessment.assessmentId,
        locale: "zh-Hant",
        calibration: {
          schemaVersion: 1,
          key: calibrationKey,
          observations: [
            {
              ...observation,
              sourceAssessmentId: englishAssessment.assessmentId,
              locale: "zh-Hant",
            },
          ],
        },
        policy: { labelPolicyVersion: "human-approval-v1" },
      }),
      /source assessment.*not archived/,
    );
    await assert.rejects(
      archive.createReview(
        {
          runId,
          caseId,
          targetId,
          capturePointId,
          profileId: "desktop",
          locale: "zh-Hans",
          decision: "approved",
        },
        { subject: "wrong-locale-reviewer" },
      ),
      /capture was not found/,
    );
    await assert.rejects(
      archive.createAssessment(assessmentFor(manifest, "zh-Hant", "mobile")),
      /scoreProfile/,
    );

    const mismatchedLocaleReuse = structuredClone(manifest);
    mismatchedLocaleReuse.runId = "run-locale-reuse";
    mismatchedLocaleReuse.locales = ["en"];
    mismatchedLocaleReuse.captures = mismatchedLocaleReuse.captures
      .filter((capture) => capture.locale === "en")
      .map((capture) => ({
        ...capture,
        provenance: {
          ...capture.provenance,
          reusedFrom: {
            runId,
            appCommit: capture.provenance.appCommit,
            referenceCommit: capture.provenance.referenceCommit,
            capturedAt: capture.provenance.capturedAt,
          },
        },
      }));
    await assert.rejects(
      archive.publish(mismatchedLocaleReuse, []),
      /same locale matrix/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
