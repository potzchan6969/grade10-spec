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
const foldStoreFixture = resolve(here, "fixtures/fold/valid");
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

function copyFoldFixture() {
  const root = mkdtempSync(resolve(tmpdir(), "trace-fold-test-"));
  const storeRoot = resolve(root, "store");
  cpSync(foldStoreFixture, storeRoot, { recursive: true });
  return { root, storeRoot };
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
  assert.match(report.stdout, /demo\/TC\/sign-in-003/);
  assert.match(report.stdout, /demo\/SC\/active-change-001/);
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

test("fold validates exact case handover across change capabilities while validate stays strict", () => {
  const fold = runCli([
    "fold",
    "--change",
    "trace-fold-demo",
    "--store-root",
    foldStoreFixture,
  ]);
  assert.equal(fold.status, 0, fold.stderr || fold.stdout);
  assert.match(fold.stdout, /Trace fold validation: PASS/);
  assert.match(fold.stdout, /Capabilities checked: 2/);
  assert.match(fold.stdout, /Case markers checked: 2/);

  const validate = runCli(["validate", "--store-root", foldStoreFixture]);
  assert.equal(validate.status, 1, validate.stderr || validate.stdout);
  assert.match(validate.stdout, /\[duplicate-id\]/);
});

test("fold reports a missing durable case marker", () => {
  const { root, storeRoot } = copyFoldFixture();
  try {
    const durableCases = resolve(
      storeRoot,
      "openspec/specs/auction/store/listing-media/feature-tcs.md",
    );
    const text = readFileSync(durableCases, "utf8");
    const marker = "<!-- trace:case id=auction/TC/listing-media-003 rev=2 covers=auction/SC/listing-media-001,auction/SC/listing-media-002 -->\n";
    assert.ok(text.includes(marker));
    writeFileSync(durableCases, text.replace(marker, ""));

    const result = runCli([
      "fold",
      "--change",
      "trace-fold-demo",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stdout, /\[missing-case\]/);
    assert.match(result.stdout, /auction\/TC\/listing-media-003/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fold reports changed revisions and reordered covers in durable case markers", () => {
  const { root, storeRoot } = copyFoldFixture();
  try {
    const durableCases = resolve(
      storeRoot,
      "openspec/specs/auction/store/listing-media/feature-tcs.md",
    );
    const text = readFileSync(durableCases, "utf8");
    const changedRevision = text.replace(
      "id=auction/TC/listing-media-003 rev=2 covers=",
      "id=auction/TC/listing-media-003 rev=3 covers=",
    );
    assert.notEqual(changedRevision, text);
    const changedCovers = changedRevision.replace(
      "covers=auction/SC/listing-media-001,auction/SC/listing-media-002",
      "covers=auction/SC/listing-media-002,auction/SC/listing-media-001",
    );
    assert.notEqual(changedCovers, changedRevision);
    writeFileSync(durableCases, changedCovers);

    const result = runCli([
      "fold",
      "--change",
      "trace-fold-demo",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stdout, /\[case-mismatch\]/);
    assert.match(result.stdout, /field rev/);
    assert.match(result.stdout, /field covers/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("fold rejects unresolved active covers and duplicate durable target markers", () => {
  const { root, storeRoot } = copyFoldFixture();
  try {
    const activeCases = resolve(
      storeRoot,
      "openspec/changes/trace-fold-demo/specs/auction/store/listing-media/feature-tcs.md",
    );
    const durableCases = resolve(
      storeRoot,
      "openspec/specs/auction/store/listing-media/feature-tcs.md",
    );
    const missingScenario = "auction/SC/listing-media-999";
    for (const file of [activeCases, durableCases]) {
      const text = readFileSync(file, "utf8");
      const updated = text.replaceAll(
        "auction/SC/listing-media-002",
        missingScenario,
      );
      assert.notEqual(updated, text);
      writeFileSync(file, updated);
    }

    const unresolved = runCli([
      "fold",
      "--change",
      "trace-fold-demo",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(unresolved.status, 1, unresolved.stderr || unresolved.stdout);
    assert.match(unresolved.stdout, /\[unresolved-reference\]/);
    assert.match(unresolved.stdout, new RegExp(missingScenario.replaceAll("/", "\\/")));

    const duplicateRoot = mkdtempSync(resolve(tmpdir(), "trace-fold-duplicate-"));
    try {
      const duplicateStore = resolve(duplicateRoot, "store");
      cpSync(foldStoreFixture, duplicateStore, { recursive: true });
      const target = resolve(
        duplicateStore,
        "openspec/specs/shared/auth/sign-in/feature-tcs.md",
      );
      const targetText = readFileSync(target, "utf8");
      const marker = "<!-- trace:case id=shared/TC/sign-in-008 rev=3 covers=shared/SC/sign-in-007 -->";
      const heading = "### The visitor is refused invalid details";
      assert.ok(targetText.includes(`${marker}\n${heading}`));
      writeFileSync(
        target,
        targetText.replace(
          `${marker}\n${heading}`,
          `${marker}\n${heading}\n\n${marker}\n### The visitor is refused invalid details again`,
        ),
      );

      const duplicate = runCli([
        "fold",
        "--change",
        "trace-fold-demo",
        "--store-root",
        duplicateStore,
      ]);
      assert.equal(duplicate.status, 1, duplicate.stderr || duplicate.stdout);
      assert.match(duplicate.stdout, /\[duplicate-target-marker\]/);
      assert.match(duplicate.stdout, /shared\/TC\/sign-in-008/);
    } finally {
      rmSync(duplicateRoot, { recursive: true, force: true });
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("validate reports duplicate ids, invalid Base36 ids, noncanonical casing, unresolved refs, and stale links", () => {
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
    "invalid-id",
    "noncanonical-id",
    "unresolved-reference",
    "stale-acceptance",
  ]) {
    assert.match(result.stdout, new RegExp(`\\[${code}\\]`));
  }
  assert.match(result.stdout, /invalid scenario id: demo\/SC\/sign-in-01/);
  assert.match(result.stdout, /invalid scenario id: demo\/SC\/sign-in-1234/);
  assert.match(result.stdout, /invalid scenario id: demo\/SC\/sign-in-0!1/);
  assert.doesNotMatch(
    result.stdout,
    /case demo\/TC\/sign-in-010 covers unknown scenario demo\/SC\/sign-in-001/,
  );
});

test("init and link dry runs preserve files and real runs add only adjacent markers", () => {
  const { root, storeRoot, appRoot } = copyFixtures();
  try {
    const targetFile = resolve(storeRoot, "openspec/specs/demo/spec.md");
    const targetScenario = "#### Scenario: A visitor checks account preferences";
    const targetCase = "### The visitor updates settings";
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
      "--product",
      "DEMO",
      "--capability",
      "SIGN-IN",
      "--store-root",
      storeRoot,
      "--dry-run",
    ]);
    assert.equal(scenarioDryRun.status, 0, scenarioDryRun.stderr);
    assert.match(scenarioDryRun.stdout, /DRY RUN/);
    assert.match(
      scenarioDryRun.stdout,
      /trace:scenario id=demo\/SC\/sign-in-006 rev=1/,
    );
    assert.equal(readFileSync(targetFile, "utf8"), originalSpec);

    const scenarioInit = runCli([
      "init",
      "scenario",
      "--file",
      targetFile,
      "--target",
      targetScenario,
      "--product",
      "DEMO",
      "--capability",
      "SIGN-IN",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(scenarioInit.status, 0, scenarioInit.stderr);
    const scenarioMarker =
      /<!-- trace:scenario id=(demo\/SC\/sign-in-006) rev=1 -->/.exec(
        readFileSync(targetFile, "utf8"),
      );
    assert.ok(scenarioMarker);
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
      "--product",
      "DEMO",
      "--capability",
      "SIGN-IN",
      "--covers",
      "DEMO/sc/SIGN-IN-001",
      "--store-root",
      storeRoot,
      "--dry-run",
    ]);
    assert.equal(caseDryRun.status, 0, caseDryRun.stderr);
    assert.match(
      caseDryRun.stdout,
      /trace:case id=demo\/TC\/sign-in-007 rev=1 covers=demo\/SC\/sign-in-001/,
    );
    assert.equal(readFileSync(targetFile, "utf8"), beforeCaseDryRun);

    const caseInit = runCli([
      "init",
      "case",
      "--file",
      targetFile,
      "--target",
      targetCase,
      "--product",
      "DEMO",
      "--capability",
      "SIGN-IN",
      "--covers",
      "DEMO/sc/SIGN-IN-001",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(caseInit.status, 0, caseInit.stderr);
    const caseMarker =
      /<!-- trace:case id=(demo\/TC\/sign-in-007) rev=1 covers=demo\/SC\/sign-in-001 -->/.exec(
        readFileSync(targetFile, "utf8"),
      );
    assert.ok(caseMarker);

    const acceptanceDryRun = runCli([
      "link",
      "--file",
      appFile,
      "--target",
      targetTest,
      "--acceptance",
      "DEMO/tc/SIGN-IN-007@1",
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
      "DEMO/tc/SIGN-IN-007@1",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(acceptanceLink.status, 0, acceptanceLink.stderr);
    assert.match(
      readFileSync(appFile, "utf8"),
      /trace:acceptance=demo\/TC\/sign-in-007@1\n  test\("the visitor updates settings"/,
    );

    const supportLink = runCli([
      "link",
      "--file",
      appFile,
      "--target",
      targetSupportTest,
      "--supports",
      "DEMO/sc/SIGN-IN-001",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(supportLink.status, 0, supportLink.stderr);
    assert.match(
      readFileSync(appFile, "utf8"),
      /trace:supports=demo\/SC\/sign-in-001\n  test\("supporting settings detail"/,
    );
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
      "DEMO/sc/SIGN-IN-001",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /ambiguous/);
    assert.equal(
      readFileSync(appFile, "utf8"),
      `${repeatedTarget}\n${repeatedTarget}\n`,
    );

    const missingFileAndTarget = runCli([
      "init",
      "scenario",
      "--product",
      "demo",
      "--capability",
      "sign-in",
    ]);
    assert.equal(missingFileAndTarget.status, 2);
    assert.match(missingFileAndTarget.stderr, /--file is required/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
