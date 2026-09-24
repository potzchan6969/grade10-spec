import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const cli = resolve(here, "trace.mjs");
const validStoreFixture = resolve(here, "fixtures/store");
const validAppFixture = resolve(here, "fixtures/app");
const invalidStoreFixture = resolve(here, "fixtures/invalid/store");
const invalidAppFixture = resolve(here, "fixtures/invalid/app");
const sourceFile = resolve(
  validStoreFixture,
  "openspec/specs/demo/spec.md",
);
const appTestFile = resolve(
  validAppFixture,
  "apps/site/src/sign-in.test.ts",
);

function runCli(args) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
  });
}

function copyFixtures() {
  const root = mkdtempSync(resolve(tmpdir(), "traceability-test-"));
  const storeRoot = resolve(root, "store");
  const appRoot = resolve(root, "app");
  cpSync(validStoreFixture, storeRoot, { recursive: true });
  cpSync(validAppFixture, appRoot, { recursive: true });
  return { root, storeRoot, appRoot };
}

test("validate and report build a graph from fixtures without a registry", () => {
  const validate = runCli([
    "validate",
    "--store-root",
    validStoreFixture,
    "--app-root",
    validAppFixture,
  ]);
  assert.equal(validate.status, 0, validate.stderr || validate.stdout);
  assert.match(validate.stdout, /Trace validation: PASS/);
  assert.match(validate.stdout, /Scenarios: 4/);
  assert.match(validate.stdout, /Cases: 2/);
  assert.match(validate.stdout, /Test markers: 2/);
  assert.match(validate.stdout, /Unlinked scenarios: 2/);
  assert.match(validate.stdout, /Unlinked cases: 1/);
  assert.doesNotMatch(validate.stdout, /duplicate-id/);

  const report = runCli([
    "report",
    "--store-root",
    validStoreFixture,
    "--app-root",
    validAppFixture,
  ]);
  assert.equal(report.status, 0, report.stderr || report.stdout);
  assert.match(report.stdout, /Trace report/);
  assert.match(report.stdout, /tcase_demo_acceptance/);
  assert.match(report.stdout, /scn_active_change/);
  assert.match(report.stdout, /Unlinked records:/);

  const json = runCli([
    "report",
    "--store-root",
    validStoreFixture,
    "--app-root",
    validAppFixture,
    "--json",
  ]);
  assert.equal(json.status, 0, json.stderr || json.stdout);
  const parsed = JSON.parse(json.stdout);
  assert.equal(parsed.counts.scenarios, 4);
  assert.equal(parsed.counts.cases, 2);
  assert.equal(parsed.counts.tests, 2);
  assert.equal(parsed.status, "valid");
});

test("validate reports duplicate ids, bad revisions, positional keys, unresolved refs, and stale links", () => {
  const result = runCli([
    "validate",
    "--store-root",
    invalidStoreFixture,
    "--app-root",
    invalidAppFixture,
  ]);
  assert.equal(result.status, 1, result.stderr || result.stdout);
  for (const code of [
    "duplicate-id",
    "invalid-revision",
    "positional-key",
    "unresolved-reference",
    "stale-acceptance",
  ]) {
    assert.match(result.stdout, new RegExp(`\\[${code}\\]`));
  }
});

test("init and link dry runs preserve files and real runs add only adjacent markers", () => {
  const { root, storeRoot, appRoot } = copyFixtures();
  try {
    const targetFile = resolve(storeRoot, "openspec/specs/demo/spec.md");
    const targetScenario = "#### Scenario: A visitor checks account preferences";
    const targetCase = "### demo-US1-TC3-1: The visitor updates settings";
    const targetTest = '  test("the visitor updates settings", () => {});';
    const targetSupportTest = '  test("supporting settings detail", () => {});';
    const appFile = resolve(appRoot, "apps/site/src/sign-in.test.ts");
    const originalSpec = readFileSync(targetFile, "utf8");
    const originalTests = readFileSync(appFile, "utf8");

    const scenarioDryRun = runCli([
      "init",
      "scenario",
      "--file",
      targetFile,
      "--target",
      targetScenario,
      "--key",
      "visitor-checks-settings",
      "--store-root",
      storeRoot,
      "--dry-run",
    ]);
    assert.equal(scenarioDryRun.status, 0, scenarioDryRun.stderr);
    assert.match(scenarioDryRun.stdout, /DRY RUN/);
    assert.match(scenarioDryRun.stdout, /trace:scenario id=scn_/);
    assert.equal(readFileSync(targetFile, "utf8"), originalSpec);

    const scenarioInit = runCli([
      "init",
      "scenario",
      "--file",
      targetFile,
      "--target",
      targetScenario,
      "--key",
      "visitor-checks-settings",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(scenarioInit.status, 0, scenarioInit.stderr);
    const scenarioMarker = /<!-- trace:scenario id=(scn_[a-z0-9_-]+) key=visitor-checks-settings rev=1 -->/.exec(readFileSync(targetFile, "utf8"));
    assert.ok(scenarioMarker);
    const scenarioId = scenarioMarker[1];
    assert.equal(
      readFileSync(targetFile, "utf8"),
      originalSpec.replace(targetScenario, `${scenarioMarker[0]}\n${targetScenario}`),
    );

    const beforeCaseDryRun = readFileSync(targetFile, "utf8");
    const caseDryRun = runCli([
      "init",
      "case",
      "--file",
      targetFile,
      "--target",
      targetCase,
      "--covers",
      scenarioId,
      "--store-root",
      storeRoot,
      "--dry-run",
    ]);
    assert.equal(caseDryRun.status, 0, caseDryRun.stderr);
    assert.match(caseDryRun.stdout, /trace:case id=tcase_/);
    assert.equal(readFileSync(targetFile, "utf8"), beforeCaseDryRun);

    const caseInit = runCli([
      "init",
      "case",
      "--file",
      targetFile,
      "--target",
      targetCase,
      "--covers",
      scenarioId,
      "--store-root",
      storeRoot,
    ]);
    assert.equal(caseInit.status, 0, caseInit.stderr);
    const caseMarker = /<!-- trace:case id=(tcase_[a-z0-9_-]+) rev=1 covers=/.exec(readFileSync(targetFile, "utf8"));
    assert.ok(caseMarker);
    const caseId = caseMarker[1];

    const acceptanceDryRun = runCli([
      "link",
      "--file",
      appFile,
      "--target",
      targetTest,
      "--acceptance",
      `${caseId}@1`,
      "--store-root",
      storeRoot,
      "--dry-run",
    ]);
    assert.equal(acceptanceDryRun.status, 0, acceptanceDryRun.stderr);
    assert.equal(readFileSync(appFile, "utf8"), originalTests);

    const acceptanceLink = runCli([
      "link",
      "--file",
      appFile,
      "--target",
      targetTest,
      "--acceptance",
      `${caseId}@1`,
      "--store-root",
      storeRoot,
    ]);
    assert.equal(acceptanceLink.status, 0, acceptanceLink.stderr);
    assert.match(readFileSync(appFile, "utf8"), new RegExp(`trace:acceptance=${caseId}@1\\n  test\\("the visitor updates settings"`));

    const supportLink = runCli([
      "link",
      "--file",
      appFile,
      "--target",
      targetSupportTest,
      "--supports",
      scenarioId,
      "--store-root",
      storeRoot,
    ]);
    assert.equal(supportLink.status, 0, supportLink.stderr);
    assert.match(readFileSync(appFile, "utf8"), new RegExp(`trace:supports=${scenarioId}\\n  test\\("supporting settings detail"`));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("mutations refuse ambiguous targets and require exact file selectors", () => {
  const { root, storeRoot } = copyFixtures();
  try {
    const appFile = resolve(root, "ambiguous.test.ts");
    const repeatedTarget = 'test("same title", () => {});';
    writeFileSync(appFile, `${repeatedTarget}\n${repeatedTarget}\n`);
    const result = runCli([
      "link",
      "--file",
      appFile,
      "--target",
      repeatedTarget,
      "--supports",
      "scn_demo_signin",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /ambiguous/);
    assert.equal(readFileSync(appFile, "utf8"), `${repeatedTarget}\n${repeatedTarget}\n`);

    const missingFileAndTarget = runCli(["init", "scenario", "--key", "visitor-signs-in"]);
    assert.equal(missingFileAndTarget.status, 2);
    assert.match(missingFileAndTarget.stderr, /--file is required/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
