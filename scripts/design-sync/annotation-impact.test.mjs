import assert from "node:assert/strict";
import test from "node:test";
import {
  IMPACT_SCHEMA_VERSION,
  validateImpactReview,
} from "./annotation-impact.mjs";
import { liveAssociation } from "./annotation-live.mjs";
import { buildReconciliationReport } from "./annotation-report.mjs";

const storeRoot = new URL("../../", import.meta.url).pathname.replace(
  /\/$/,
  "",
);

const LIVE = liveAssociation(storeRoot);

function reportFor(
  ids,
  { scope = "spec", digest = "sha256:observation" } = {},
) {
  return buildReconciliationReport({
    scope,
    scanner: {
      schemaVersion: 2,
      scope,
      status: "drift",
      blockers: [],
      findings: ids.map((id) => ({ id })),
      observationDigest: digest,
      baselineDigest: "sha256:baseline",
      observationSchemaVersion: 2,
    },
  });
}

function implementedFinding(
  findingId,
  {
    repository = "grade10-spec",
    outcome = "implemented",
    digest = "sha256:observation",
  } = {},
) {
  return {
    findingId,
    expectedBehavior: "The reviewed behavior is available to its callers.",
    outcome,
    implementationEvidence: {
      repository,
      locations: [
        {
          path: "packages/ui/src/blocks/example.tsx",
          line: 42,
          evidence: "The public block renders the reviewed behavior.",
        },
      ],
    },
    testEvidence: {
      command: "pnpm run test:design-sync",
      scenario: "the reviewed behavior is covered",
      exitCode: 0,
      result: "passed",
    },
    runtimeEvidence: {
      environment: "local preview",
      check: "opened the rendered block",
      observed: "the reviewed behavior was visible",
    },
    association: { capability: "shared/design-sync/coverage" },
    observationDigest: digest,
  };
}

function reviewFor(
  findings,
  { scope = "spec", digest = "sha256:observation" } = {},
) {
  return {
    schemaVersion: IMPACT_SCHEMA_VERSION,
    scope,
    observationDigest: digest,
    findings,
    planningGroups: [],
  };
}

test("accepts a complete implementation review for every selected finding", () => {
  const result = validateImpactReview({
    scope: "spec",
    report: reportFor(["implemented"]),
    ids: ["implemented"],
    review: reviewFor([implementedFinding("implemented")]),
    storeRoot,
  });

  assert.equal(result.scope, "spec");
  assert.equal(result.observationDigest, "sha256:observation");
  assert.deepEqual(result.selectedIds, ["implemented"]);
  assert.deepEqual(result.acceptanceEligibleIds, ["implemented"]);
  assert.deepEqual(result.planningGroups, []);
  assert.deepEqual(result.blockedIds, []);
});

test("rejects an implemented outcome when focused or runtime evidence is missing", () => {
  const finding = implementedFinding("incomplete");
  delete finding.runtimeEvidence;

  assert.throws(
    () =>
      validateImpactReview({
        scope: "spec",
        report: reportFor(["incomplete"]),
        ids: ["incomplete"],
        review: reviewFor([finding]),
        storeRoot,
      }),
    /runtime evidence/i,
  );
});

test("rejects implementation evidence that belongs to another repository", () => {
  assert.throws(
    () =>
      validateImpactReview({
        scope: "spec",
        report: reportFor(["cross-scope"]),
        ids: ["cross-scope"],
        review: reviewFor([
          implementedFinding("cross-scope", { repository: "grade10" }),
        ]),
        storeRoot,
      }),
    /grade10-spec|owning repository|scope/i,
  );
});

test("uses product evidence only when the selected scope is product", () => {
  const result = validateImpactReview({
    scope: "product",
    report: reportFor(["product"], { scope: "product" }),
    ids: ["product"],
    review: reviewFor(
      [implementedFinding("product", { repository: "grade10" })],
      { scope: "product" },
    ),
    storeRoot,
  });

  assert.deepEqual(result.acceptanceEligibleIds, ["product"]);
});

test("rejects an impact review pinned to a different observation", () => {
  assert.throws(
    () =>
      validateImpactReview({
        scope: "spec",
        report: reportFor(["stale"]),
        ids: ["stale"],
        review: reviewFor([implementedFinding("stale")], {
          digest: "sha256:old-observation",
        }),
        storeRoot,
      }),
    /digest|stale/i,
  );
});

test("accepts explicit no-impact, covered, gap, and blocked outcomes", () => {
  const review = reviewFor([
    {
      findingId: "no-impact",
      expectedBehavior: "The note remains documentation only.",
      outcome: "no-impact",
      implementationEvidence: null,
      testEvidence: null,
      runtimeEvidence: null,
      noImpactReason:
        "The annotation records an already settled design decision.",
    },
    {
      findingId: "covered",
      expectedBehavior: "The planned change will provide the missing behavior.",
      outcome: "covered",
      implementationEvidence: null,
      testEvidence: null,
      runtimeEvidence: null,
      association: LIVE,
    },
    {
      findingId: "gap",
      expectedBehavior: "The selected behavior must be implemented.",
      outcome: "gap",
      implementationEvidence: null,
      testEvidence: null,
      runtimeEvidence: null,
      missingBehavior:
        "No owning implementation currently provides this behavior.",
    },
    {
      findingId: "blocked",
      expectedBehavior: "The selected behavior needs an evidence decision.",
      outcome: "blocked",
      implementationEvidence: null,
      testEvidence: null,
      runtimeEvidence: null,
      blockers: ["The required runtime environment is unavailable."],
    },
  ]);
  review.planningGroups = [
    {
      findingIds: ["gap"],
      capabilityPath: "shared/design-sync/annotation-verification",
      proposedChangeName: "implement-missing-annotation-behavior",
      planningLane: "grade10-planning",
      affectedRepositories: ["grade10-spec"],
      nonGoals: ["Do not accept the selected annotation in this run."],
    },
  ];

  const result = validateImpactReview({
    scope: "spec",
    report: reportFor(["no-impact", "covered", "gap", "blocked"]),
    ids: ["no-impact", "covered", "gap", "blocked"],
    review,
    storeRoot,
  });

  assert.deepEqual(result.acceptanceEligibleIds, ["no-impact", "covered"]);
  assert.deepEqual(result.planningGroups[0].findingIds, ["gap"]);
  assert.deepEqual(result.blockedIds, ["blocked"]);
  assert.equal(result.status, "blocked");
  assert.equal(result.exitCode, 2);
});

test("requires outcome-specific evidence fields", () => {
  assert.throws(
    () =>
      validateImpactReview({
        scope: "spec",
        report: reportFor(["no-impact"]),
        ids: ["no-impact"],
        review: reviewFor([
          {
            findingId: "no-impact",
            expectedBehavior: "The note remains documentation only.",
            outcome: "no-impact",
            implementationEvidence: null,
            testEvidence: null,
            runtimeEvidence: null,
            noImpactReason: "   ",
          },
        ]),
        storeRoot,
      }),
    /no-impact reason/i,
  );
});

function gapFinding(findingId) {
  return {
    findingId,
    expectedBehavior: "The selected behavior must be implemented.",
    outcome: "gap",
    implementationEvidence: null,
    testEvidence: null,
    runtimeEvidence: null,
    missingBehavior: `The owning repository lacks ${findingId}.`,
  };
}

function planningGroup(findingIds, overrides = {}) {
  return {
    findingIds,
    capabilityPath: "shared/design-sync/annotation-verification",
    proposedChangeName: "implement-missing-annotation-behavior",
    planningLane: "grade10-planning",
    affectedRepositories: ["grade10-spec"],
    nonGoals: ["Do not accept a gap in the current run."],
    ...overrides,
  };
}

test("groups related gaps and returns the planning partition", () => {
  const ids = ["gap-a", "gap-b"];
  const review = reviewFor(ids.map(gapFinding));
  review.planningGroups = [planningGroup(ids)];

  const result = validateImpactReview({
    scope: "spec",
    report: reportFor(ids),
    ids,
    review,
    storeRoot,
  });

  assert.equal(result.status, "planning");
  assert.equal(result.exitCode, 1);
  assert.deepEqual(result.acceptanceEligibleIds, []);
  assert.deepEqual(result.blockedIds, []);
  assert.deepEqual(result.planningGroups[0].findingIds, ids);
});

test("rejects an omitted gap, an eligible finding in planning, invalid lanes, and duplicate changes", () => {
  const gap = gapFinding("gap");
  const omitted = reviewFor([gap]);
  assert.throws(
    () =>
      validateImpactReview({
        scope: "spec",
        report: reportFor(["gap"]),
        ids: ["gap"],
        review: omitted,
        storeRoot,
      }),
    /every gap finding/i,
  );

  const eligible = implementedFinding("eligible");
  const eligibleReview = reviewFor([eligible]);
  eligibleReview.planningGroups = [planningGroup(["eligible"])];
  assert.throws(
    () =>
      validateImpactReview({
        scope: "spec",
        report: reportFor(["eligible"]),
        ids: ["eligible"],
        review: eligibleReview,
        storeRoot,
      }),
    /non-gap/i,
  );

  const invalidLane = reviewFor([gapFinding("invalid-lane")]);
  invalidLane.planningGroups = [
    planningGroup(["invalid-lane"], { planningLane: "implement" }),
  ];
  assert.throws(
    () =>
      validateImpactReview({
        scope: "spec",
        report: reportFor(["invalid-lane"]),
        ids: ["invalid-lane"],
        review: invalidLane,
        storeRoot,
      }),
    /planning lane/i,
  );

  const duplicateChanges = reviewFor([
    gapFinding("gap-a"),
    gapFinding("gap-b"),
  ]);
  duplicateChanges.planningGroups = [
    planningGroup(["gap-a"]),
    planningGroup(["gap-b"]),
  ];
  assert.throws(
    () =>
      validateImpactReview({
        scope: "spec",
        report: reportFor(["gap-a", "gap-b"]),
        ids: ["gap-a", "gap-b"],
        review: duplicateChanges,
        storeRoot,
      }),
    /unique change names/i,
  );
});
