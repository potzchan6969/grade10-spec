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

test("archive lookup and assessments remain isolated by locale", async () => {
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

test("a captured reference and its finished run are immutable records", async () => {
  const root = await mkdtemp(join(tmpdir(), "ui-verification-reference-"));
  try {
    const archive = createArchive(root);
    const { width, height } = PROFILES.desktop;
    const input = {
      caseId,
      targetId,
      capturePointId,
      profileId: "desktop",
      locale: "zh-Hant",
      storyId: "pages-home--default",
      selector: "main",
      region: { x: 0, y: 0, width: 200, height: 100 },
      commit: "b".repeat(40),
      ref: "main",
      verified: true,
      browser: "chromium 140",
    };
    const bytes = png(width, height, [10, 20, 30, 255]);
    const reference = await archive.createReference(input, bytes, {
      subject: "designer",
    });
    assert.match(reference.referenceId, /^reference-/);
    assert.equal(reference.image.sha256, sha256(bytes));
    assert.equal(reference.locale, "zh-Hant");
    assert.deepEqual(
      await archive.getObject(reference.image.key),
      new Uint8Array(bytes),
    );
    await assert.rejects(
      archive.createReference(input, png(10, 10, [0, 0, 0, 255]), {
        subject: "designer",
      }),
      /must be 1440x900 at desktop/,
    );
    await assert.rejects(
      archive.createReference(
        { ...input, region: { x: 1400, y: 0, width: 200, height: 100 } },
        bytes,
        { subject: "designer" },
      ),
      /must lie inside the image/,
    );

    const run = {
      schemaVersion: 1,
      runId: "capture-run-1",
      lane: "focused",
      state: "succeeded",
      referenceIds: [reference.referenceId],
    };
    await archive.createReferenceRun(run);
    await archive.createReferenceRun(run);
    await assert.rejects(
      archive.createReferenceRun({ ...run, state: "running" }),
      /must be succeeded, failed or superseded/,
    );
    assert.deepEqual((await archive.listReferenceRuns()).runs, [run]);
    assert.equal(
      (await archive.listReferences({ caseId })).references.length,
      1,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
