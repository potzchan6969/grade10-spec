import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const cli = resolve(here, "trace.mjs");
const validStoreFixture = resolve(here, "fixtures/store");
const validAppFixture = resolve(here, "fixtures/app");
const invalidStoreFixture = resolve(here, "fixtures/invalid/store");
const invalidAppFixture = resolve(here, "fixtures/invalid/app");
const foldStoreFixture = resolve(here, "fixtures/fold/valid");

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

function createSuiteFixture({
  marker = true,
  revision = 1,
  headingRevision = 1,
} = {}) {
  const root = mkdtempSync(resolve(tmpdir(), "trace-suite-test-"));
  const storeRoot = resolve(root, "store");
  const capability = resolve(
    storeRoot,
    "openspec/specs/grade10-site/store/product-listing",
  );
  mkdirSync(capability, { recursive: true });
  writeFileSync(
    resolve(capability, "spec.md"),
    [
      "## Requirements",
      "",
      "<!-- trace:scenario id=g10.store-product-listing.SC-001 rev=1 -->",
      "#### Scenario: A collector opens a listing",
      "**Serves:** grade10-site-store-product-listing-US-01 - Collector opens a listing",
      "",
    ].join("\n"),
  );
  const markerLine = marker
    ? `<!-- trace:case id=g10.store-product-listing.TC-001 rev=${revision} covers=g10.store-product-listing.SC-001 -->\n`
    : "";
  writeFileSync(
    resolve(capability, "feature-tcs.md"),
    [
      "# Store Product Listing Test Cases",
      "",
      `${markerLine}### grade10-site-store-product-listing-US1-TC1-${headingRevision}: Listing opens`,
      "",
      "* **Trace:** grade10-site-store-product-listing-US-01",
      "",
    ].join("\n"),
  );
  return { root, storeRoot, caseFile: resolve(capability, "feature-tcs.md") };
}

test("case initialization copies the heading version into the marker revision", () => {
  const { root, storeRoot, caseFile } = createSuiteFixture({
    marker: false,
    headingRevision: 4,
  });
  try {
    const target =
      "### grade10-site-store-product-listing-US1-TC1-4: Listing opens";
    const result = runCli([
      "init",
      "case",
      "--file",
      caseFile,
      "--target",
      target,
      "--app",
      "g10",
      "--product",
      "store",
      "--capability",
      "product-listing",
      "--covers",
      "g10.store-product-listing.SC-001",
      "--store-root",
      storeRoot,
      "--dry-run",
    ]);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /trace:case id=.* rev=4 covers=/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("batch initialization allocates stable ids for mirrored cases and planned scenarios", () => {
  const root = mkdtempSync(resolve(tmpdir(), "trace-batch-test-"));
  const storeRoot = resolve(root, "store");
  const durable = resolve(
    storeRoot,
    "openspec/specs/grade10-site/store/product-listing",
  );
  const active = resolve(
    storeRoot,
    "openspec/changes/refresh-listing/specs/grade10-site/store/product-listing",
  );
  mkdirSync(durable, { recursive: true });
  mkdirSync(active, { recursive: true });
  const spec = resolve(durable, "spec.md");
  const durableSuite = resolve(durable, "feature-tcs.md");
  const activeSpec = resolve(active, "spec.md");
  const activeSuite = resolve(active, "feature-tcs.md");
  const scenarioHeading = "#### Scenario: Collector sees a listing";
  const caseHeading = "### listing-US1-TC1-1: Listing shows the current price";
  writeFileSync(
    spec,
    `${scenarioHeading}\n**Serves:** listing-US-01 - Listing opens\n`,
  );
  writeFileSync(
    activeSpec,
    `${scenarioHeading}\n**Serves:** listing-US-01 - Listing opens\n`,
  );
  writeFileSync(durableSuite, `${caseHeading}\n`);
  writeFileSync(activeSuite, `${caseHeading}\n`);
  const manifestPath = resolve(root, "plan.json");
  writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        records: [
          {
            key: "listing-scenario",
            kind: "scenario",
            file: "openspec/specs/grade10-site/store/product-listing/spec.md",
            target: scenarioHeading,
            app: "g10",
            product: "store",
            capability: "product-listing",
            mirrorKey: "listing-scenario-mirror",
          },
          {
            key: "durable-case",
            kind: "case",
            file: "openspec/specs/grade10-site/store/product-listing/feature-tcs.md",
            target: caseHeading,
            app: "g10",
            product: "store",
            capability: "product-listing",
            mirrorKey: "listing-case-mirror",
            covers: ["listing-scenario"],
          },
          {
            key: "active-case",
            kind: "case",
            file: "openspec/changes/refresh-listing/specs/grade10-site/store/product-listing/feature-tcs.md",
            target: caseHeading,
            app: "g10",
            product: "store",
            capability: "product-listing",
            mirrorKey: "listing-case-mirror",
            covers: ["listing-scenario"],
          },
        ],
      },
      null,
      2,
    ),
  );
  try {
    const dryRun = runCli([
      "init",
      "batch",
      "--manifest",
      manifestPath,
      "--store-root",
      storeRoot,
      "--dry-run",
    ]);
    assert.equal(dryRun.status, 0, dryRun.stderr || dryRun.stdout);
    assert.doesNotMatch(readFileSync(spec, "utf8"), /trace:scenario/);

    const result = runCli([
      "init",
      "batch",
      "--manifest",
      manifestPath,
      "--store-root",
      storeRoot,
    ]);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const scenarioId = /trace:scenario id=([^\s]+)/.exec(
      readFileSync(spec, "utf8"),
    )?.[1];
    const durableMarker = /trace:case id=([^\s]+) rev=1 covers=([^\s]+)/.exec(
      readFileSync(durableSuite, "utf8"),
    );
    const activeMarker = /trace:case id=([^\s]+) rev=1 covers=([^\s]+)/.exec(
      readFileSync(activeSuite, "utf8"),
    );
    assert.ok(scenarioId);
    assert.equal(durableMarker?.[1], activeMarker?.[1]);
    assert.equal(durableMarker?.[2], scenarioId);
    assert.equal(activeMarker?.[2], scenarioId);

    const revisedScenarioHeading =
      "#### Scenario: Price includes the current bid";
    writeFileSync(
      spec,
      `${readFileSync(spec, "utf8").trimEnd()}\n${revisedScenarioHeading}\n**Serves:** listing-US-01 - Listing opens\n`,
    );
    const updateManifestPath = resolve(root, "update-plan.json");
    writeFileSync(
      updateManifestPath,
      JSON.stringify(
        {
          records: [
            {
              key: "revised-listing-scenario",
              kind: "scenario",
              file: "openspec/specs/grade10-site/store/product-listing/spec.md",
              target: revisedScenarioHeading,
              app: "g10",
              product: "store",
              capability: "product-listing",
            },
            ...[
              [
                "durable-case",
                "openspec/specs/grade10-site/store/product-listing/feature-tcs.md",
              ],
              [
                "active-case",
                "openspec/changes/refresh-listing/specs/grade10-site/store/product-listing/feature-tcs.md",
              ],
            ].map(([key, file]) => ({
              key: `${key}-update`,
              kind: "case",
              file,
              target: caseHeading,
              app: "g10",
              product: "store",
              capability: "product-listing",
              mirrorKey: "listing-case-update",
              existingId: durableMarker?.[1],
              replaceCovers: true,
              covers: ["revised-listing-scenario"],
            })),
          ],
        },
        null,
        2,
      ),
    );
    const update = runCli([
      "init",
      "batch",
      "--manifest",
      updateManifestPath,
      "--store-root",
      storeRoot,
    ]);
    assert.equal(update.status, 0, update.stderr || update.stdout);
    const revisedScenarioIds = [
      ...readFileSync(spec, "utf8").matchAll(/trace:scenario id=([^\s]+)/g),
    ];
    const revisedScenarioId = revisedScenarioIds.at(-1)?.[1];
    const revisedDurable = /trace:case id=([^\s]+) rev=1 covers=([^\s]+)/.exec(
      readFileSync(durableSuite, "utf8"),
    );
    const revisedActive = /trace:case id=([^\s]+) rev=1 covers=([^\s]+)/.exec(
      readFileSync(activeSuite, "utf8"),
    );
    assert.equal(revisedDurable?.[1], durableMarker?.[1]);
    assert.equal(revisedActive?.[1], activeMarker?.[1]);
    assert.equal(revisedDurable?.[2], revisedScenarioId);
    assert.equal(revisedActive?.[2], revisedScenarioId);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("batch rejects two records targeting the same heading before writing", () => {
  const { root, storeRoot } = createSuiteFixture();
  const spec = resolve(
    storeRoot,
    "openspec/specs/grade10-site/store/product-listing/spec.md",
  );
  const target = "#### Scenario: A second listing scenario";
  const original = `${readFileSync(spec, "utf8")}${target}\n`;
  writeFileSync(spec, original);
  const manifestPath = resolve(root, "duplicate-targets.json");
  writeFileSync(
    manifestPath,
    JSON.stringify({
      records: ["first", "second"].map((key) => ({
        key,
        kind: "scenario",
        file: "openspec/specs/grade10-site/store/product-listing/spec.md",
        target,
        app: "g10",
        product: "store",
        capability: "product-listing",
      })),
    }),
  );
  try {
    const result = runCli([
      "init",
      "batch",
      "--manifest",
      manifestPath,
      "--store-root",
      storeRoot,
    ]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /same heading/);
    assert.equal(readFileSync(spec, "utf8"), original);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("batch rejects an existing id claimed by separate mirror groups", () => {
  const { root, storeRoot } = createSuiteFixture();
  const target = "#### Scenario: A collector opens a listing";
  const id = "g10.store-product-listing.SC-001";
  const copies = ["first-copy", "second-copy"].map((name) => {
    const file = `openspec/changes/${name}/specs/grade10-site/store/product-listing/spec.md`;
    const path = resolve(storeRoot, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${target}\n`);
    return { file, path };
  });
  const manifestPath = resolve(root, "reused-id.json");
  writeFileSync(
    manifestPath,
    JSON.stringify({
      records: copies.map(({ file }, index) => ({
        key: `copy-${index}`,
        kind: "scenario",
        file,
        target,
        app: "g10",
        product: "store",
        capability: "product-listing",
        existingId: id,
      })),
    }),
  );
  try {
    const result = runCli([
      "init",
      "batch",
      "--manifest",
      manifestPath,
      "--store-root",
      storeRoot,
    ]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /same existing id/);
    for (const copy of copies)
      assert.equal(readFileSync(copy.path, "utf8"), `${target}\n`);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("batch verifies an existing id supplied by any mirror record", () => {
  const { root, storeRoot } = createSuiteFixture();
  const target = "#### Scenario: A collector opens a listing";
  const files = ["first-copy", "second-copy"].map((name) => {
    const file = `openspec/changes/${name}/specs/grade10-site/store/product-listing/spec.md`;
    const path = resolve(storeRoot, file);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${target}\n`);
    return file;
  });
  const manifestPath = resolve(root, "unknown-existing-id.json");
  writeFileSync(
    manifestPath,
    JSON.stringify({
      records: files.map((file, index) => ({
        key: `copy-${index}`,
        mirrorKey: "shared-scenario",
        kind: "scenario",
        file,
        target,
        app: "g10",
        product: "store",
        capability: "product-listing",
        ...(index === 1
          ? { existingId: "g10.store-product-listing.SC-abc" }
          : {}),
      })),
    }),
  );
  try {
    const result = runCli([
      "init",
      "batch",
      "--manifest",
      manifestPath,
      "--store-root",
      storeRoot,
    ]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /id not already in the store/);
    for (const file of files)
      assert.equal(
        readFileSync(resolve(storeRoot, file), "utf8"),
        `${target}\n`,
      );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("batch can clear coverage only on a deprecated existing case", () => {
  const { root, storeRoot, caseFile } = createSuiteFixture();
  try {
    const contents = readFileSync(caseFile, "utf8").replace(
      "* **Trace:** grade10-site-store-product-listing-US-01",
      "* **Trace:** grade10-site-store-product-listing-US-01\n* **Status:** deprecated",
    );
    writeFileSync(caseFile, contents);
    const target =
      "### grade10-site-store-product-listing-US1-TC1-1: Listing opens";
    const manifestPath = resolve(root, "retire-coverage.json");
    writeFileSync(
      manifestPath,
      JSON.stringify({
        records: [
          {
            key: "retired-case",
            kind: "case",
            file: "openspec/specs/grade10-site/store/product-listing/feature-tcs.md",
            target,
            app: "g10",
            product: "store",
            capability: "product-listing",
            replaceCovers: true,
            covers: [],
          },
        ],
      }),
    );
    const result = runCli([
      "init",
      "batch",
      "--manifest",
      manifestPath,
      "--store-root",
      storeRoot,
    ]);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(readFileSync(caseFile, "utf8"), /covers=none/);
    const validation = runCli(["validate", "--store-root", storeRoot]);
    assert.equal(validation.status, 0, validation.stderr || validation.stdout);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("validate rejects covers=none on a non-deprecated case", () => {
  const { root, storeRoot, caseFile } = createSuiteFixture();
  try {
    writeFileSync(
      caseFile,
      readFileSync(caseFile, "utf8").replace(
        "covers=g10.store-product-listing.SC-001",
        "covers=none",
      ),
    );
    const result = runCli(["validate", "--store-root", storeRoot]);
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(
      result.stdout,
      /covers=none is allowed only for a deprecated case/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("validate requires a marker on every suite case and reports the inventory", () => {
  const { root, storeRoot } = createSuiteFixture({ marker: false });
  try {
    const result = runCli(["validate", "--store-root", storeRoot]);
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stdout, /Suite cases checked: 1 \(unmarked: 1\)/);
    assert.match(result.stdout, /\[missing-case-marker\]/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("validate applies the universal marker rule to every suite level", () => {
  const { root, storeRoot, caseFile } = createSuiteFixture({ marker: false });
  try {
    const contents = readFileSync(caseFile, "utf8");
    const suites = [
      resolve(storeRoot, "openspec/specs/grade10-site/store/domain-tcs.md"),
      resolve(storeRoot, "openspec/specs/grade10-site/product-tcs.md"),
      resolve(storeRoot, "openspec/specs/platform-tcs.md"),
    ];
    for (const suite of suites) {
      mkdirSync(dirname(suite), { recursive: true });
      writeFileSync(suite, contents);
    }

    const result = runCli(["validate", "--store-root", storeRoot]);
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stdout, /Suite cases checked: 4 \(unmarked: 4\)/);
    assert.equal(
      (result.stdout.match(/\[missing-case-marker\]/g) ?? []).length,
      4,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("validate requires the case marker revision to match the heading version", () => {
  const { root, storeRoot } = createSuiteFixture({
    revision: 2,
    headingRevision: 1,
  });
  try {
    const result = runCli(["validate", "--store-root", storeRoot]);
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stdout, /\[case-revision-mismatch\]/);
    assert.match(
      result.stdout,
      /marker revision 2 must match heading revision 1/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

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
  assert.match(validate.stdout, /Test markers: 3/);
  assert.match(validate.stdout, /Unlinked scenarios: 1/);
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
  assert.match(report.stdout, /g10\.demo-sign-in\.TC-003/);
  assert.match(report.stdout, /g10\.demo-active-change\.SC-001/);
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
  assert.equal(parsed.counts.tests, 3);
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
    const marker =
      "<!-- trace:case id=g10.auction-listing-media.TC-003 rev=2 covers=g10.auction-listing-media.SC-001,g10.auction-listing-media.SC-002,g10.e-kyc-identity-record.SC-005 -->\n";
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
    assert.match(result.stdout, /g10\.auction-listing-media\.TC-003/);
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
      "id=g10.auction-listing-media.TC-003 rev=2 covers=",
      "id=g10.auction-listing-media.TC-003 rev=3 covers=",
    );
    assert.notEqual(changedRevision, text);
    const changedCovers = changedRevision.replace(
      "covers=g10.auction-listing-media.SC-001,g10.auction-listing-media.SC-002,g10.e-kyc-identity-record.SC-005",
      "covers=g10.auction-listing-media.SC-002,g10.auction-listing-media.SC-001,g10.e-kyc-identity-record.SC-005",
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
    const missingScenario = "g10.auction-listing-media.SC-999";
    for (const file of [activeCases, durableCases]) {
      const text = readFileSync(file, "utf8");
      const updated = text.replaceAll(
        "g10.auction-listing-media.SC-002",
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
    assert.match(
      unresolved.stdout,
      new RegExp(missingScenario.replaceAll("/", "\\/")),
    );

    const duplicateRoot = mkdtempSync(
      resolve(tmpdir(), "trace-fold-duplicate-"),
    );
    try {
      const duplicateStore = resolve(duplicateRoot, "store");
      cpSync(foldStoreFixture, duplicateStore, { recursive: true });
      const target = resolve(
        duplicateStore,
        "openspec/specs/shared/auth/sign-in/feature-tcs.md",
      );
      const targetText = readFileSync(target, "utf8");
      const marker =
        "<!-- trace:case id=g10.shared-sign-in.TC-008 rev=3 covers=g10.shared-sign-in.SC-007 -->";
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
      assert.match(duplicate.stdout, /g10\.shared-sign-in\.TC-008/);
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
    "invalid-app",
    "invalid-revision",
    "invalid-id",
    "noncanonical-id",
    "unresolved-reference",
    "stale-acceptance",
  ]) {
    assert.match(result.stdout, new RegExp(`\\[${code}\\]`));
  }
  assert.match(result.stdout, /invalid scenario id: g10\.demo-sign-in\.SC-01/);
  assert.match(
    result.stdout,
    /invalid scenario id: g10\.demo-sign-in\.SC-1234/,
  );
  assert.match(result.stdout, /invalid scenario id: g10\.demo-sign-in\.SC-0!1/);
  assert.match(result.stdout, /unknown app nope/);
  assert.match(result.stdout, /noncanonical-id/);
  assert.doesNotMatch(
    result.stdout,
    /case g10\.demo-sign-in\.TC-010 covers unknown scenario g10\.demo-sign-in\.SC-001/,
  );
});

test("validate requires one app and capability scope for each Markdown marker file", () => {
  const { root, storeRoot } = copyFixtures();
  try {
    const targetFile = resolve(storeRoot, "openspec/specs/demo/spec.md");
    const text = readFileSync(targetFile, "utf8");
    writeFileSync(
      targetFile,
      `${text}\n<!-- trace:scenario id=g10.demo-settings.SC-010 rev=1 -->\n#### Scenario: A mixed-scope marker\n`,
    );

    const result = runCli(["validate", "--store-root", storeRoot]);
    assert.equal(result.status, 1, result.stderr || result.stdout);
    assert.match(result.stdout, /\[scope-mismatch\]/);
    assert.match(result.stdout, /one <app>\.<product>-<capability> prefix/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("init and link dry runs preserve files and real runs add only adjacent markers", () => {
  const { root, storeRoot, appRoot } = copyFixtures();
  try {
    const targetFile = resolve(storeRoot, "openspec/specs/demo/spec.md");
    const targetScenario =
      "#### Scenario: A visitor checks account preferences";
    const targetCase = "### The visitor updates settings";
    const targetTest = 'test("the visitor updates settings", () => {});';
    const targetSupportTest = 'test("supporting settings detail", () => {});';
    const appFile = resolve(appRoot, "apps/site/src/sign-in.test.ts");
    const otherAppMarker = resolve(
      storeRoot,
      "openspec/specs/demo/other-app.md",
    );
    writeFileSync(
      otherAppMarker,
      "<!-- trace:scenario id=zzz.demo-sign-in.SC-011 rev=1 -->\n#### Scenario: A separate app sequence\n",
    );
    const originalSpec = readFileSync(targetFile, "utf8");
    const originalTests = readFileSync(appFile, "utf8");

    const scenarioDryRun = runCli([
      "init",
      "scenario",
      "--file",
      targetFile,
      "--target",
      targetScenario,
      "--app",
      "G10",
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
    const dryRunScenarioId =
      /trace:scenario id=(g10\.demo-sign-in\.SC-(?!\d{3})[0-9a-z]{3}) rev=1/.exec(
        scenarioDryRun.stdout,
      )?.[1];
    assert.ok(dryRunScenarioId);
    assert.equal(readFileSync(targetFile, "utf8"), originalSpec);

    const scenarioInit = runCli([
      "init",
      "scenario",
      "--file",
      targetFile,
      "--target",
      targetScenario,
      "--app",
      "G10",
      "--product",
      "DEMO",
      "--capability",
      "SIGN-IN",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(scenarioInit.status, 0, scenarioInit.stderr);
    const scenarioMarker =
      /<!-- trace:scenario id=(g10\.demo-sign-in\.SC-(?!\d{3})[0-9a-z]{3}) rev=1 -->/.exec(
        readFileSync(targetFile, "utf8"),
      );
    assert.ok(scenarioMarker);
    assert.equal(scenarioMarker[1], dryRunScenarioId);
    assert.equal(
      readFileSync(targetFile, "utf8"),
      originalSpec.replace(
        targetScenario,
        `${scenarioMarker[0]}\n${targetScenario}`,
      ),
    );

    const beforeCaseDryRun = readFileSync(targetFile, "utf8");
    const caseDryRun = runCli([
      "init",
      "case",
      "--file",
      targetFile,
      "--target",
      targetCase,
      "--app",
      "G10",
      "--product",
      "DEMO",
      "--capability",
      "SIGN-IN",
      "--covers",
      "G10.DEMO-SIGN-IN.sc-001",
      "--store-root",
      storeRoot,
      "--dry-run",
    ]);
    assert.equal(caseDryRun.status, 0, caseDryRun.stderr);
    const dryRunCaseId =
      /trace:case id=(g10\.demo-sign-in\.TC-(?!\d{3})[0-9a-z]{3}) rev=1 covers=g10\.demo-sign-in\.SC-001/.exec(
        caseDryRun.stdout,
      )?.[1];
    assert.ok(dryRunCaseId);
    assert.equal(readFileSync(targetFile, "utf8"), beforeCaseDryRun);

    const caseInit = runCli([
      "init",
      "case",
      "--file",
      targetFile,
      "--target",
      targetCase,
      "--app",
      "G10",
      "--product",
      "DEMO",
      "--capability",
      "SIGN-IN",
      "--covers",
      "G10.DEMO-SIGN-IN.sc-001",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(caseInit.status, 0, caseInit.stderr);
    const caseMarker =
      /<!-- trace:case id=(g10\.demo-sign-in\.TC-(?!\d{3})[0-9a-z]{3}) rev=1 covers=g10\.demo-sign-in\.SC-001 -->/.exec(
        readFileSync(targetFile, "utf8"),
      );
    assert.ok(caseMarker);
    assert.equal(caseMarker[1], dryRunCaseId);

    const acceptanceDryRun = runCli([
      "link",
      "--file",
      appFile,
      "--target",
      targetTest,
      "--acceptance",
      `${caseMarker[1]}@1`,
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
      `${caseMarker[1]}@1`,
      "--store-root",
      storeRoot,
    ]);
    assert.equal(acceptanceLink.status, 0, acceptanceLink.stderr);
    assert.ok(
      readFileSync(appFile, "utf8").includes(
        `trace:acceptance=${caseMarker[1]}@1\ntest("the visitor updates settings"`,
      ),
    );

    const supportLink = runCli([
      "link",
      "--file",
      appFile,
      "--target",
      targetSupportTest,
      "--supports",
      "G10.DEMO-SIGN-IN.sc-001",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(supportLink.status, 0, supportLink.stderr);
    assert.match(
      readFileSync(appFile, "utf8"),
      /trace:supports=g10\.demo-sign-in\.SC-001\ntest\("supporting settings detail"/,
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
      "G10.DEMO-SIGN-IN.sc-001",
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

    const missingApp = runCli([
      "init",
      "scenario",
      "--file",
      resolve(storeRoot, "openspec/specs/demo/spec.md"),
      "--target",
      "#### Scenario: A visitor checks account preferences",
      "--product",
      "demo",
      "--capability",
      "sign-in",
      "--store-root",
      storeRoot,
    ]);
    assert.equal(missingApp.status, 2);
    assert.match(missingApp.stderr, /--app is required/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
