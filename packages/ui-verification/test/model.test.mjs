import assert from "node:assert/strict";
import test from "node:test";
import {
  canonicalJson,
  fingerprint,
  PROFILES,
  validateDeclaration,
  validateDeclarations,
  validateManifest,
  validateObjectKey,
} from "../src/model.mjs";

const declaration = (overrides = {}) => ({
  schemaVersion: 1,
  caseId: "018f8a02-82cc-7db4-9f19-0fb40be3b921",
  targetId: "grade10-site",
  capturePointId: "final",
  storyId: "storefront-home",
  label: "Storefront home",
  scoreProfile: "desktop",
  recipe: { path: "/" },
  reference: { storyId: "storefront-home-reference", selector: "main" },
  ...overrides,
});

const manifest = () => {
  const caseDefinition = declaration();
  const appCommit = "a".repeat(40);
  const referenceCommit = "b".repeat(40);
  const inputFingerprint = "c".repeat(64);
  const captures = Object.entries(PROFILES).map(([profileId, dimensions]) => ({
    caseId: caseDefinition.caseId,
    targetId: caseDefinition.targetId,
    capturePointId: caseDefinition.capturePointId,
    profileId,
    status: "captured",
    inputFingerprint,
    provenance: {
      verified: true,
      appCommit,
      referenceCommit,
      capturedAt: "2026-10-09T10:00:00.000Z",
    },
    site: {
      key: `ui-verification/run-1/${profileId}-site.png`,
      sha256: "d".repeat(64),
      ...dimensions,
    },
    ...(profileId === caseDefinition.scoreProfile
      ? {
          reference: {
            key: `ui-verification/run-1/${profileId}-reference.png`,
            sha256: "e".repeat(64),
            ...dimensions,
          },
        }
      : {}),
  }));
  return {
    schemaVersion: 1,
    runId: "run-2026-10-09-001",
    createdAt: "2026-10-09T10:01:00.000Z",
    checkpoint: {
      app: { ref: "refs/tags/build-2026-10-09", commit: appCommit },
      reference: { ref: "refs/tags/spec-2026-10-09", commit: referenceCommit },
    },
    catalogue: [{ ...caseDefinition, status: "active" }],
    captures,
  };
};

test("declarations use the three fixed full-viewport profiles", () => {
  assert.deepEqual(PROFILES, {
    desktop: { width: 1440, height: 900 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 390, height: 844 },
  });
});

test("a declaration preserves its stable case ID and authored recipe", () => {
  const value = declaration();

  assert.deepEqual(validateDeclaration(value), value);
  assert.deepEqual(validateDeclarations([value]), [value]);
});

test("declarations reject path traversal IDs and unsupported score profiles", () => {
  assert.throws(
    () => validateDeclaration(declaration({ caseId: "../capture" })),
    /caseId/,
  );
  assert.throws(
    () => validateDeclaration(declaration({ scoreProfile: "wide" })),
    /scoreProfile/,
  );
});

test("catalogues permit a case on multiple targets and reject duplicate case-target points", () => {
  assert.deepEqual(
    validateDeclarations([
      declaration(),
      declaration({ targetId: "grade10-admin" }),
    ]).length,
    2,
  );
  assert.throws(
    () =>
      validateDeclarations([
        declaration(),
        declaration({ label: "Renamed label" }),
      ]),
    /duplicate.*identity/i,
  );
});

test("capture points accept stable path-safe IDs beyond final", () => {
  assert.equal(
    validateDeclaration(declaration({ capturePointId: "cart-open" }))
      .capturePointId,
    "cart-open",
  );
});

test("a manifest records all three site viewports and the scored reference viewport", () => {
  const value = manifest();

  assert.deepEqual(validateManifest(value), value);
});

test("a manifest rejects missing viewport outcomes and a missing scored reference", () => {
  const missingViewport = manifest();
  missingViewport.captures.pop();
  assert.throws(() => validateManifest(missingViewport), /exactly 3 outcomes/);

  const missingReference = manifest();
  delete missingReference.captures[0].reference;
  assert.throws(
    () => validateManifest(missingReference),
    /manifest\.captures\[0\]\.reference/,
  );
});

test("unverified captured images are valid but cannot claim reusable provenance", () => {
  const value = manifest();
  const provenance = value.captures[0].provenance;
  provenance.verified = false;

  assert.deepEqual(validateManifest(value), value);

  provenance.reusedFrom = {
    runId: "run-previous",
    appCommit: provenance.appCommit,
    referenceCommit: provenance.referenceCommit,
    capturedAt: provenance.capturedAt,
  };
  assert.throws(() => validateManifest(value), /reuse.*verified/i);
});

test("canonical JSON sorts object keys and fingerprints its exact canonical bytes", async () => {
  assert.equal(canonicalJson({ z: 2, a: 1 }), '{"a":1,"z":2}');
  assert.equal(
    await fingerprint({ b: 2, a: 1 }),
    "43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777",
  );
});

test("image object keys reject traversal and platform-specific separators", () => {
  assert.equal(
    validateObjectKey("ui-verification/run-1/mobile-site.png"),
    "ui-verification/run-1/mobile-site.png",
  );
  assert.throws(() => validateObjectKey("../private.png"), /non-traversing/);
  assert.throws(
    () => validateObjectKey("ui-verification\\private.png"),
    /non-traversing/,
  );
});
