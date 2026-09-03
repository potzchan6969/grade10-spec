import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { runCli } from "./annotation-impact-cli.mjs";
import { buildReconciliationReport } from "./annotation-report.mjs";

const storeRoot = new URL("../../", import.meta.url).pathname.replace(
  /\/$/,
  "",
);

function report() {
  return buildReconciliationReport({
    scope: "spec",
    scanner: {
      schemaVersion: 2,
      scope: "spec",
      status: "drift",
      blockers: [],
      findings: [{ id: "implemented" }],
      observationDigest: "sha256:observation",
      baselineDigest: "sha256:baseline",
      observationSchemaVersion: 2,
    },
  });
}

function review() {
  return {
    schemaVersion: 1,
    scope: "spec",
    observationDigest: "sha256:observation",
    findings: [
      {
        findingId: "implemented",
        expectedBehavior: "The reviewed behavior is available to its callers.",
        outcome: "implemented",
        implementationEvidence: {
          repository: "grade10-spec",
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
      },
    ],
    planningGroups: [],
  };
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

test("impact CLI validates a selected review and emits its partition as JSON", async () => {
  const root = await mkdtemp(join(tmpdir(), "grade10-annotation-impact-"));
  const output = [];
  const originalLog = console.log;
  try {
    const reportPath = join(root, "report.json");
    const reviewPath = join(root, "impact.json");
    await writeJson(reportPath, report());
    await writeJson(reviewPath, review());
    console.log = (...args) => output.push(args.join(" "));

    assert.equal(
      await runCli({
        argv: [
          "--scope",
          "spec",
          "--report",
          reportPath,
          "--ids",
          "implemented",
          "--review",
          reviewPath,
          "--json",
        ],
      }),
      0,
    );
    const result = JSON.parse(output.at(-1));
    assert.deepEqual(result.acceptanceEligibleIds, ["implemented"]);
    assert.equal(result.exitCode, 0);
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});

test("blocked impact CLI input returns exit 2 without changing the baseline", async () => {
  const root = await mkdtemp(join(tmpdir(), "grade10-annotation-impact-"));
  const output = [];
  const originalLog = console.log;
  const baselinePath = join(
    storeRoot,
    "scripts/design-sync/annotation-baseline.json",
  );
  const before = await readFile(baselinePath, "utf8");
  try {
    await writeJson(join(root, "report.json"), report());
    console.log = (...args) => output.push(args.join(" "));
    assert.equal(
      await runCli({
        argv: [
          "--scope",
          "spec",
          "--report",
          join(root, "report.json"),
          "--ids",
          "implemented",
          "--review",
          join(root, "missing-review.json"),
          "--json",
        ],
      }),
      2,
    );
    const result = JSON.parse(output.at(-1));
    assert.equal(result.status, "blocked");
    assert.equal(result.observationDigest, "sha256:observation");
    assert.match(result.blockers[0].reason, /report|review|required/i);
    assert.equal(await readFile(baselinePath, "utf8"), before);
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});

test("impact CLI returns exit 1 for a validated planning gap", async () => {
  const root = await mkdtemp(join(tmpdir(), "grade10-annotation-impact-"));
  const output = [];
  const originalLog = console.log;
  try {
    const gapReview = review();
    const finding = gapReview.findings[0];
    finding.outcome = "gap";
    finding.implementationEvidence = null;
    finding.testEvidence = null;
    finding.runtimeEvidence = null;
    delete finding.association;
    finding.missingBehavior = "The selected behavior is not implemented yet.";
    gapReview.planningGroups = [
      {
        findingIds: ["implemented"],
        capabilityPath: "shared/design-sync/annotation-verification",
        proposedChangeName: "implement-missing-annotation-behavior",
        planningLane: "grade10-planning",
        affectedRepositories: ["grade10-spec"],
        nonGoals: ["Do not accept the gap in this run."],
      },
    ];
    await writeJson(join(root, "report.json"), report());
    await writeJson(join(root, "impact.json"), gapReview);
    console.log = (...args) => output.push(args.join(" "));

    assert.equal(
      await runCli({
        argv: [
          "--scope",
          "spec",
          "--report",
          join(root, "report.json"),
          "--ids",
          "implemented",
          "--review",
          join(root, "impact.json"),
          "--json",
        ],
      }),
      1,
    );
    const result = JSON.parse(output.at(-1));
    assert.equal(result.status, "planning");
    assert.deepEqual(result.acceptanceEligibleIds, []);
    assert.deepEqual(result.planningGroups[0].findingIds, ["implemented"]);
    assert.equal(result.exitCode, 1);
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});
