import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { runCli as runAcceptCli } from "./annotation-accept.mjs";
import { baselineDigestFor } from "./annotation-core.mjs";
import { runCli as runDiffCli } from "./annotation-diff.mjs";
import { buildInventory } from "./annotation-inventory.mjs";
import { runCli as runInventoryCli } from "./annotation-inventory-cli.mjs";
import {
  acceptSnapshot as acceptSnapshotImplementation,
  renderHuman,
  scanSnapshot,
} from "./annotation-reconciliation.mjs";
import {
  ANNOTATION_SCOPES,
  buildScopeIndex,
  normalizeScope,
  projectBaseline,
  scopeForEntry,
  scopeForRoot,
} from "./annotation-scope.mjs";
import {
  ANNOTATION_OBSERVATION_SCHEMA_VERSION,
  normalizeObservation,
} from "./annotation-snapshot.mjs";
import {
  applyAcceptanceTransaction,
  contentDigest,
} from "./annotation-store.mjs";

const fileKey = "ABCDEFGHIJKLMNOPQRSTUV";
const fileUrl = `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`;
const categorizedFixture = JSON.parse(
  readFileSync(
    new URL(
      "./fixtures/annotations/snapshot-categorized.json",
      import.meta.url,
    ),
  ),
);

function acceptSnapshot(input) {
  return acceptSnapshotImplementation({
    ...input,
    decisions: {
      ...input.decisions,
      baselineDigest:
        input.decisions?.baselineDigest ?? baselineDigestFor(input.baseline),
    },
  });
}

function observation(overrides = {}) {
  return {
    schemaVersion: ANNOTATION_OBSERVATION_SCHEMA_VERSION,
    files: [
      {
        fileKey,
        fileUrl,
        roots: [
          {
            nodeId: "1:1",
            name: "Button",
            type: "COMPONENT_SET",
            ancestors: [{ nodeId: "0:0", name: "Document", type: "DOCUMENT" }],
            sources: [
              {
                kind: "code-connect",
                path: "packages/design-system/src/components/forms/button.figma.ts",
                component: "Button",
              },
            ],
          },
        ],
        categoryCatalog: [
          {
            id: "content",
            label: "Content",
            color: "#3366FF",
            isPreset: true,
          },
          {
            id: "interaction",
            label: "Interaction",
            color: "#FF6633",
            isPreset: false,
          },
        ],
        nodes: [
          {
            nodeId: "2:1",
            name: "Button / default",
            type: "COMPONENT",
            rootIds: ["1:1"],
            ancestors: [
              { nodeId: "1:1", name: "Button", type: "COMPONENT_SET" },
              { nodeId: "0:0", name: "Document", type: "DOCUMENT" },
            ],
            annotations: [
              {
                labelMarkdown: "Keep the content contract.",
                categoryId: "content",
                properties: [{ type: "width" }],
              },
              {
                label: "Review interaction states.",
                categoryId: "interaction",
                properties: [{ type: "fills" }],
              },
            ],
          },
        ],
      },
    ],
    ...overrides,
  };
}

function snapshotWithAnnotations(annotations) {
  const input = observation();
  input.files[0].nodes[0].annotations = annotations;
  return normalizeObservation(input);
}

function baselineWithAnnotations(annotations) {
  return {
    schemaVersion: 2,
    roots: [{ fileKey, nodeId: "1:1", fileUrl, scope: "spec" }],
    entries: {
      [`${fileKey}:2:1`]: {
        fileKey,
        nodeId: "2:1",
        sourceRoot: "1:1",
        annotations,
      },
    },
  };
}

test("annotation scope vocabulary is fixed", () => {
  assert.deepEqual(ANNOTATION_SCOPES, ["product", "spec"]);
  assert.equal(normalizeScope("spec"), "spec");
  assert.equal(normalizeScope("product"), "product");
  assert.throws(
    () => normalizeScope("shared"),
    /scope must be spec or product/i,
  );
});

function scopedBaseline() {
  return {
    schemaVersion: 2,
    roots: [
      {
        fileKey,
        nodeId: "1:1",
        fileUrl,
        kind: "code-connect",
        path: "packages/design-system/src/components/forms/button.figma.ts",
        component: "Button",
        scope: "spec",
      },
      {
        fileKey,
        nodeId: "2:1",
        fileUrl,
        kind: "layout",
        label: "Pages/Checkout/root",
        scope: "product",
      },
    ],
    entries: {
      [`${fileKey}:3:1`]: {
        fileKey,
        nodeId: "3:1",
        sourceRoot: "1:1",
        annotations: [
          {
            annotationKey: "spec-note",
            text: "Spec-owned note.",
            categoryId: null,
            pinnedProperties: [],
          },
        ],
      },
      [`${fileKey}:4:1`]: {
        fileKey,
        nodeId: "4:1",
        sourceRoot: "2:1",
        annotations: [
          {
            annotationKey: "product-note",
            text: "Product-owned note.",
            categoryId: null,
            pinnedProperties: [],
          },
        ],
      },
    },
  };
}

function scopedSnapshot(rootId, nodeId) {
  const input = observation();
  input.files[0].roots[0].nodeId = rootId;
  input.files[0].nodes[0].nodeId = nodeId;
  input.files[0].nodes[0].rootIds = [rootId];
  return normalizeObservation(input);
}

test("scope index resolves entries through their registered root and projects one owner", () => {
  const baseline = scopedBaseline();
  const index = buildScopeIndex(baseline);

  assert.equal(scopeForRoot(index, fileKey, "1-1"), "spec");
  assert.equal(
    scopeForEntry(index, baseline.entries[`${fileKey}:3:1`]),
    "spec",
  );

  const projected = projectBaseline(baseline, "spec");

  assert.deepEqual(
    projected.roots.map((root) => root.nodeId),
    ["1:1"],
  );
  assert.deepEqual(Object.keys(projected.entries), [`${fileKey}:3:1`]);
  assert.equal(projected.schemaVersion, baseline.schemaVersion);
});

test("same registered root cannot claim two repository scopes", () => {
  const baseline = scopedBaseline();
  baseline.roots.push({
    ...baseline.roots[0],
    nodeId: "1-1",
    scope: "product",
  });

  assert.throws(() => buildScopeIndex(baseline), /conflicting scopes/i);
});

test("same registered root cannot repeat identical source evidence", () => {
  const baseline = scopedBaseline();
  baseline.roots.push({ ...baseline.roots[0] });

  assert.throws(() => buildScopeIndex(baseline), /duplicate source/i);
});

test("scope projection rejects missing and unknown ownership evidence", () => {
  const missing = scopedBaseline();
  delete missing.roots[0].scope;
  assert.throws(
    () => buildScopeIndex(missing),
    /scope must be spec or product/i,
  );

  const unknown = scopedBaseline();
  unknown.roots[0].scope = "shared";
  assert.throws(
    () => buildScopeIndex(unknown),
    /scope must be spec or product/i,
  );

  const index = buildScopeIndex(scopedBaseline());
  assert.throws(
    () => scopeForEntry(index, { fileKey, sourceRoot: "9:9" }),
    /has no scope/i,
  );
});

test("an owning scope may have an empty baseline projection", () => {
  const baseline = scopedBaseline();
  baseline.roots = baseline.roots.filter((root) => root.scope === "spec");
  baseline.entries = {
    [`${fileKey}:3:1`]: baseline.entries[`${fileKey}:3:1`],
  };

  const projected = projectBaseline(baseline, "product");

  assert.deepEqual(projected.roots, []);
  assert.deepEqual(projected.entries, {});
});

test("scoped diff ignores another repository's entries instead of orphaning them", () => {
  const baseline = scopedBaseline();
  const result = scanSnapshot({
    baseline,
    snapshot: scopedSnapshot("1:1", "3:1"),
    scope: "spec",
  });

  assert.notEqual(result.status, "blocked");
  assert.ok(result.findings.every((finding) => finding.nodeId !== "4:1"));
});

test("product-scoped diff ignores spec-owned entries instead of orphaning them", () => {
  const baseline = scopedBaseline();
  const result = scanSnapshot({
    baseline,
    snapshot: scopedSnapshot("2:1", "4:1"),
    scope: "product",
  });

  assert.notEqual(result.status, "blocked");
  assert.ok(result.findings.every((finding) => finding.nodeId !== "3:1"));
});

test("scoped diff blocks a root owned by another repository", () => {
  const result = scanSnapshot({
    baseline: scopedBaseline(),
    snapshot: scopedSnapshot("2:1", "4:1"),
    scope: "spec",
  });

  assert.equal(result.status, "blocked");
  assert.ok(
    result.blockers.some((blocker) => /out of scope/i.test(blocker.reason)),
  );
});

test("mixed-scope snapshots are blocked before comparison", () => {
  const input = scopedSnapshot("1:1", "3:1");
  input.files[0].roots.push({
    ...input.files[0].roots[0],
    nodeId: "2:1",
    sources: [
      {
        kind: "layout",
        label: "Pages/Checkout/root",
      },
    ],
  });
  delete input.digest;
  const mixed = normalizeObservation(input);

  const result = scanSnapshot({
    baseline: scopedBaseline(),
    snapshot: mixed,
    scope: "spec",
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.findings.length, 0);
});

test("scoped acceptance refuses a finding from another repository before writing", () => {
  const baseline = scopedBaseline();
  const before = JSON.stringify(baseline);
  const crossScopeSnapshot = scopedSnapshot("2:1", "4:1");
  const crossScopeFinding = scanSnapshot({
    baseline,
    snapshot: crossScopeSnapshot,
  }).findings.find((finding) => finding.nodeId === "3:1");
  assert.ok(crossScopeFinding, "fixture must contain a spec-owned finding");

  assert.throws(
    () =>
      acceptSnapshot({
        baseline,
        snapshot: crossScopeSnapshot,
        scope: "product",
        ids: [crossScopeFinding.id],
        decisions: {
          observationDigest: crossScopeSnapshot.digest,
          decisions: [
            {
              findingId: crossScopeFinding.id,
              action: "remove",
              noImpactReason: "Cross-scope acceptance must be refused.",
            },
          ],
        },
      }),
    /unknown finding|blocked|scope/i,
  );
  assert.equal(JSON.stringify(baseline), before);
});

test("cross-scope CLI acceptance leaves related OpenSpec targets byte-identical", async () => {
  const baseline = scopedBaseline();
  const crossScopeSnapshot = scopedSnapshot("2:1", "4:1");
  const crossScopeFinding = scanSnapshot({
    baseline,
    snapshot: crossScopeSnapshot,
  }).findings.find((finding) => finding.nodeId === "3:1");
  assert.ok(crossScopeFinding, "fixture must contain a spec-owned finding");

  const directory = await mkdtemp(
    join(tmpdir(), "grade10-annotation-cross-scope-"),
  );
  const baselinePath = join(directory, "baseline.json");
  const snapshotPath = join(directory, "snapshot.json");
  const decisionsPath = join(directory, "decisions.json");
  const relatedPath = "openspec/changes/cross-scope/proposal.md";
  const relatedAbsolutePath = join(directory, relatedPath);
  const relatedContent = "# Cross-scope acceptance fixture\n";
  try {
    await mkdir(join(directory, "openspec/changes/cross-scope"), {
      recursive: true,
    });
    await writeFile(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
    await writeFile(
      snapshotPath,
      `${JSON.stringify(crossScopeSnapshot, null, 2)}\n`,
    );
    await writeFile(relatedAbsolutePath, relatedContent);
    await writeFile(
      decisionsPath,
      `${JSON.stringify(
        {
          observationDigest: crossScopeSnapshot.digest,
          baselineDigest: baselineDigestFor(baseline),
          relatedFiles: [
            {
              path: relatedPath,
              content: "# Should never be written\n",
              beforeDigest: contentDigest(relatedContent),
            },
          ],
          decisions: [
            {
              findingId: crossScopeFinding.id,
              action: "remove",
              noImpactReason: "Cross-scope acceptance must be refused.",
            },
          ],
        },
        null,
        2,
      )}\n`,
    );

    const baselineBefore = await readFile(baselinePath, "utf8");
    const relatedBefore = await readFile(relatedAbsolutePath, "utf8");
    const originalLog = console.log;
    console.log = () => {};
    let exitCode;
    try {
      exitCode = await runAcceptCli({
        storeRoot: directory,
        argv: [
          "--scope",
          "product",
          "--baseline",
          baselinePath,
          "--snapshot",
          snapshotPath,
          "--ids",
          crossScopeFinding.id,
          "--decisions",
          decisionsPath,
          "--json",
        ],
      });
    } finally {
      console.log = originalLog;
    }
    assert.equal(exitCode, 2);
    assert.equal(await readFile(baselinePath, "utf8"), baselineBefore);
    assert.equal(await readFile(relatedAbsolutePath, "utf8"), relatedBefore);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("diff and acceptance CLIs require an explicit scope", async () => {
  const originalLog = console.log;
  const outputs = [];
  console.log = (...args) => outputs.push(args.join(" "));
  try {
    assert.equal(await runDiffCli({ argv: ["--json"] }), 2);
    assert.equal(await runAcceptCli({ argv: ["--json"] }), 2);
    assert.ok(
      outputs.every((output) =>
        /scope/i.test(JSON.parse(output).blockers[0].reason),
      ),
    );
  } finally {
    console.log = originalLog;
  }
});

test("registered baseline assigns every surface to its owning repository", () => {
  const baseline = JSON.parse(
    readFileSync(new URL("./annotation-baseline.json", import.meta.url)),
  );

  assert.equal(baseline.schemaVersion, 2);
  assert.equal(baseline.roots.length, 85);
  assert.ok(
    baseline.roots.every((root) => ["spec", "product"].includes(root.scope)),
  );
  assert.ok(
    baseline.roots
      .filter((root) => root.path?.startsWith("packages/design-system/"))
      .every((root) => root.scope === "spec"),
  );
  assert.ok(
    baseline.roots
      .filter((root) => root.path?.startsWith("packages/ui/"))
      .every((root) => root.scope === "spec"),
  );
  assert.ok(
    baseline.roots
      .filter((root) => root.kind === "layout")
      .every((root) => root.scope === "product"),
  );
});

test("inventory returns deterministic scoped registrations and tracked nodes", () => {
  const baseline = scopedBaseline();
  baseline.roots.push({
    ...baseline.roots[0],
    kind: "audit",
    path: "packages/design-system/src/components/forms/audit.json",
    label: "button/root",
    component: null,
  });

  const result = buildInventory({ baseline, scope: "spec" });

  assert.deepEqual(result, {
    schemaVersion: 1,
    scope: "spec",
    files: [
      {
        fileKey,
        fileUrl: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
        registrations: [
          {
            nodeId: "1:1",
            kind: "audit",
            path: "packages/design-system/src/components/forms/audit.json",
            label: "button/root",
            component: null,
            covers: null,
          },
          {
            nodeId: "1:1",
            kind: "code-connect",
            path: "packages/design-system/src/components/forms/button.figma.ts",
            label: null,
            component: "Button",
            covers: null,
          },
        ],
        trackedNodeIds: ["3:1"],
      },
    ],
  });
});

test("inventory CLI requires an explicit scope", async () => {
  const originalLog = console.log;
  let output = "";
  console.log = (...args) => {
    output = args.join(" ");
  };
  try {
    const exitCode = await runInventoryCli({ argv: ["--json"] });
    assert.equal(exitCode, 2);
    assert.match(JSON.parse(output).blockers[0].reason, /scope/i);
  } finally {
    console.log = originalLog;
  }
});

test("One category catalog resolves many annotations", () => {
  const result = normalizeObservation(categorizedFixture);

  assert.equal(result.schemaVersion, ANNOTATION_OBSERVATION_SCHEMA_VERSION);
  assert.match(result.digest, /^sha256:[0-9a-f]{64}$/);
  assert.equal(result.files[0].categoryCatalog.length, 2);
  assert.deepEqual(
    result.files[0].nodes[0].annotations.map((annotation) => ({
      categoryId: annotation.categoryId,
      categoryLabel: annotation.categoryLabel,
      categoryColor: annotation.categoryColor,
      categoryIsPreset: annotation.categoryIsPreset,
    })),
    [
      {
        categoryId: "content",
        categoryLabel: "Content",
        categoryColor: "#3366FF",
        categoryIsPreset: true,
      },
      {
        categoryId: "interaction",
        categoryLabel: "Interaction",
        categoryColor: "#FF6633",
        categoryIsPreset: false,
      },
    ],
  );
  assert.deepEqual(result.files[0].nodes[0].annotations[0].pinnedProperties, [
    "width",
  ]);
});

test("Schema-version-2 roots preserve every source in canonical order", () => {
  const input = observation();
  input.files[0].roots[0].sources = [
    {
      kind: "code-connect",
      path: "packages/design-system/src/components/forms/button.figma.ts",
      component: "Button",
    },
    {
      kind: "audit",
      path: "packages/design-system/src/components/forms/audit.json",
      label: "button/root",
    },
  ].reverse();

  const result = normalizeObservation(input);

  assert.deepEqual(
    result.files[0].roots[0].sources.map(
      ({ kind, path, label, component }) => ({ kind, path, label, component }),
    ),
    [
      {
        kind: "audit",
        path: "packages/design-system/src/components/forms/audit.json",
        label: "button/root",
        component: null,
      },
      {
        kind: "code-connect",
        path: "packages/design-system/src/components/forms/button.figma.ts",
        label: null,
        component: "Button",
      },
    ],
  );
});

test("Duplicate source registrations are malformed observation evidence", () => {
  const input = observation();
  input.files[0].roots[0].sources.push(input.files[0].roots[0].sources[0]);

  assert.throws(() => normalizeObservation(input), /duplicate root source/i);
});

test("Findings expand one observed root to every registered source", () => {
  const input = observation();
  input.files[0].roots[0].sources = [
    {
      kind: "audit",
      path: "packages/design-system/src/components/forms/audit.json",
      label: "button/root",
    },
    {
      kind: "code-connect",
      path: "packages/design-system/src/components/forms/button.figma.ts",
      component: "Button",
    },
  ];

  const result = scanSnapshot({
    baseline: { schemaVersion: 2, roots: [], entries: {} },
    snapshot: input,
  });

  assert.equal(result.findings.length, 2);
  assert.deepEqual(
    result.findings[0].registeredSources.map(
      ({ kind, path, label, component }) => ({ kind, path, label, component }),
    ),
    [
      {
        kind: "audit",
        path: "packages/design-system/src/components/forms/audit.json",
        label: "button/root",
        component: null,
      },
      {
        kind: "code-connect",
        path: "packages/design-system/src/components/forms/button.figma.ts",
        label: null,
        component: "Button",
      },
    ],
  );
  assert.deepEqual(
    result.findings[0].associationEvidence.map((evidence) => evidence.kind),
    ["registered-component"],
  );
  assert.equal(result.scannedSources.length, 2);
});

test("Orphan findings retain every source for their registered root", () => {
  const input = observation();
  input.files[0].roots[0].sources = [
    {
      kind: "audit",
      path: "packages/design-system/src/components/forms/audit.json",
      label: "button/root",
    },
    {
      kind: "code-connect",
      path: "packages/design-system/src/components/forms/button.figma.ts",
      component: "Button",
    },
  ];
  const baseline = baselineWithAnnotations([
    {
      annotationKey: "orphan-note",
      text: "The old node note.",
      categoryId: null,
      pinnedProperties: [],
    },
  ]);
  baseline.entries[`${fileKey}:2:1`].nodeId = "8:8";
  baseline.entries[`${fileKey}:8:8`] = baseline.entries[`${fileKey}:2:1`];
  delete baseline.entries[`${fileKey}:2:1`];
  input.files[0].nodes = [];

  const orphan = scanSnapshot({ baseline, snapshot: input }).findings[0];

  assert.equal(orphan.kind, "orphaned");
  assert.equal(orphan.registeredSources.length, 2);
  assert.deepEqual(
    orphan.registeredSources.map((source) => source.kind),
    ["audit", "code-connect"],
  );
});

test("Ancestor evidence keeps nearest-parent-first order and rejects duplicates", () => {
  const input = observation();
  input.files[0].nodes[0].ancestors = [
    { nodeId: "1:1", name: "Button", type: "COMPONENT_SET" },
    { nodeId: "0:0", name: "Document", type: "DOCUMENT" },
  ];
  const result = normalizeObservation(input);
  assert.deepEqual(
    result.files[0].nodes[0].ancestors,
    input.files[0].nodes[0].ancestors,
  );

  input.files[0].nodes[0].ancestors.push({ nodeId: "1-1" });
  assert.throws(
    () => normalizeObservation(input),
    /duplicate ancestor nodeId/i,
  );
});

test("Store digest changes when the ordered ancestor chain changes", () => {
  const first = normalizeObservation(observation());
  const reordered = observation();
  reordered.files[0].nodes[0].ancestors.reverse();

  const second = normalizeObservation(reordered);

  assert.notEqual(first.digest, second.digest);
});

test("Content and Interaction labels are reported", () => {
  const result = normalizeObservation(categorizedFixture);
  assert.deepEqual(
    result.files[0].nodes[0].annotations.map((annotation) => [
      annotation.categoryId,
      annotation.categoryLabel,
    ]),
    [
      ["content", "Content"],
      ["interaction", "Interaction"],
    ],
  );
});

test("Annotation has no category", () => {
  const uncategorized = observation();
  uncategorized.files[0].nodes[0].annotations = [
    { label: "No category", categoryId: null },
  ];
  const valid = normalizeObservation(uncategorized);
  assert.equal(valid.files[0].nodes[0].annotations[0].categoryId, null);
  assert.equal(
    valid.files[0].nodes[0].annotations[0].categoryLabel,
    "Uncategorized",
  );
});

test("Category evidence is incomplete", () => {
  const incomplete = observation();
  incomplete.files[0].nodes[0].annotations[0].categoryId = "missing";
  assert.throws(
    () => normalizeObservation(incomplete),
    /category ID missing is absent from the file catalog/,
  );
  const blocked = scanSnapshot({
    baseline: { schemaVersion: 2, roots: [], entries: {} },
    snapshot: incomplete,
  });
  assert.equal(blocked.status, "blocked");
  assert.equal(blocked.blockers[0].fileKey, fileKey);
  assert.equal(blocked.blockers[0].categoryId, "missing");
});

test("Annotation is outside registered surfaces", () => {
  const input = observation();
  input.files[0].nodes.push({
    nodeId: "9:9",
    name: "Exploratory note",
    type: "FRAME",
    rootIds: [],
    ancestors: [],
    annotations: [{ label: "Do not report me" }],
  });

  const result = normalizeObservation(input);

  assert.deepEqual(
    result.files[0].nodes.map((node) => node.nodeId),
    ["2:1"],
  );
});

test("Unresolved registered root is skipped when another root resolves", () => {
  const input = observation();
  input.files[0].nodes[0].annotations = [];
  input.files[0].skippedRoots = [
    {
      nodeId: "9:9",
      name: "FilterChip",
      sources: [
        {
          kind: "code-connect",
          path: "packages/design-system/src/components/forms/filter-chip.figma.ts",
          component: "FilterChip",
        },
      ],
      reason: "registered root could not be resolved",
    },
  ];
  const snapshot = normalizeObservation(input);
  assert.deepEqual(
    snapshot.files[0].skippedRoots.map((root) => root.nodeId),
    ["9:9"],
  );

  const result = scanSnapshot({
    baseline: { schemaVersion: 2, roots: [], entries: {} },
    snapshot,
  });
  assert.equal(result.status, "clean");
  assert.equal(result.blockers.length, 0);
  assert.deepEqual(
    result.skippedRoots.map((root) => ({
      nodeId: root.nodeId,
      reason: root.reason,
    })),
    [
      {
        nodeId: "9:9",
        reason: "registered root could not be resolved",
      },
    ],
  );
  assert.match(renderHuman(result), /SKIPPED/);
  assert.match(renderHuman(result), /FilterChip/);
});

test("Skipped roots render every registered source", () => {
  const input = observation();
  input.files[0].skippedRoots = [
    {
      nodeId: "9:9",
      name: "FilterChip",
      sources: [
        {
          kind: "audit",
          path: "packages/design-system/src/components/forms/audit.json",
          label: "filter-chip/root",
        },
        {
          kind: "code-connect",
          path: "packages/design-system/src/components/forms/filter-chip.figma.ts",
          component: "FilterChip",
        },
      ],
      reason: "registered root could not be resolved",
    },
  ];
  const result = scanSnapshot({
    baseline: { schemaVersion: 2, roots: [], entries: {} },
    snapshot: input,
  });
  const report = renderHuman(result);

  assert.match(report, /filter-chip\/root/);
  assert.match(report, /filter-chip\.figma\.ts/);
  assert.match(report, /FilterChip/);
});

test("a supplied digest must pin the normalized observation", () => {
  const result = normalizeObservation(observation());
  assert.deepEqual(
    normalizeObservation({ ...observation(), digest: result.digest }),
    result,
  );
  assert.throws(
    () => normalizeObservation({ ...observation(), digest: "sha256:stale" }),
    /observation digest does not match normalized payload/,
  );
});

test("snapshot diff migrates a schema-version-1 entry to one stable occurrence", () => {
  const input = observation();
  input.files[0].nodes[0].annotations = [{ label: "New legacy text" }];
  const result = scanSnapshot({
    baseline: {
      schemaVersion: 1,
      roots: [{ fileKey, nodeId: "1:1", fileUrl }],
      entries: {
        [`${fileKey}:2:1`]: {
          fileKey,
          nodeId: "2:1",
          sourceRoot: "1:1",
          text: "Old legacy text",
        },
      },
    },
    snapshot: input,
  });

  assert.equal(result.status, "drift");
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].kind, "changed");
  assert.equal(result.findings[0].annotationKey, "legacy-1");
  assert.equal(result.findings[0].previousCategoryId, null);
  assert.deepEqual(result.findings[0].previousPinnedProperties, []);
});

test("snapshot diff reports a removal from a resolvable node", () => {
  const baseline = baselineWithAnnotations([
    {
      annotationKey: "content-note",
      text: "Keep the content contract.",
      categoryId: "content",
      pinnedProperties: ["width"],
    },
    {
      annotationKey: "interaction-note",
      text: "Review interaction states.",
      categoryId: "interaction",
      pinnedProperties: ["fills"],
    },
  ]);
  const snapshot = snapshotWithAnnotations([
    {
      label: "Review interaction states.",
      categoryId: "interaction",
      properties: [{ type: "fills" }],
    },
  ]);
  const result = scanSnapshot({ baseline, snapshot });

  assert.equal(result.status, "drift");
  assert.deepEqual(
    result.findings.map((finding) => finding.kind),
    ["removed"],
  );
  assert.equal(result.findings[0].annotationKey, "content-note");
});

test("Final annotation removal remains removal when node resolves", () => {
  const baseline = baselineWithAnnotations([
    {
      annotationKey: "content-note",
      text: "Keep the content contract.",
      categoryId: "content",
      pinnedProperties: ["width"],
    },
  ]);
  const snapshot = snapshotWithAnnotations([]);
  const result = scanSnapshot({ baseline, snapshot });

  assert.equal(result.status, "drift");
  assert.equal(result.blockers.length, 0);
  assert.deepEqual(
    result.findings.map((finding) => finding.kind),
    ["removed"],
  );
});

test("snapshot diff keeps an exact-surface addition untracked without an association", () => {
  const input = observation();
  input.files[0].roots[0].sources[0].component = null;
  const result = scanSnapshot({
    baseline: { schemaVersion: 2, roots: [], entries: {} },
    snapshot: input,
  });

  assert.equal(result.status, "drift");
  assert.equal(result.findings.length, 2);
  assert.ok(
    result.findings.every((finding) => finding.classification === "untracked"),
  );
  assert.ok(
    result.findings.every(
      (finding) => finding.associationEvidence.length === 0,
    ),
  );
});

test("snapshot diff blocks malformed baseline and observation evidence", () => {
  const partlyMigrated = scanSnapshot({
    baseline: {
      schemaVersion: 2,
      roots: [],
      entries: {
        [`${fileKey}:2:1`]: {
          fileKey,
          nodeId: "2:1",
          text: "old shape",
          annotations: [],
        },
      },
    },
    snapshot: observation(),
  });
  assert.equal(partlyMigrated.status, "blocked");
  assert.equal(partlyMigrated.blockers[0].kind, "partly-migrated-baseline");

  const malformedObservation = observation();
  malformedObservation.files[0].nodes[0].annotations = [
    { label: "Malformed", properties: [{ type: "" }] },
  ];
  const blocked = scanSnapshot({
    baseline: { schemaVersion: 2, roots: [], entries: {} },
    snapshot: malformedObservation,
  });
  assert.equal(blocked.status, "blocked");
  assert.equal(blocked.blockers[0].kind, "malformed-observation");
  assert.equal(blocked.findings.length, 0);
});

test("One of several annotations changes text", () => {
  const baseline = {
    schemaVersion: 2,
    roots: [
      {
        fileKey,
        nodeId: "1:1",
        fileUrl,
        kind: "code-connect",
        path: "packages/design-system/src/components/forms/button.figma.ts",
        component: "Button",
      },
    ],
    entries: {
      [`${fileKey}:2:1`]: {
        fileKey,
        nodeId: "2:1",
        sourceRoot: "1:1",
        annotations: [
          {
            annotationKey: "content-note",
            text: "Review the old content contract.",
            categoryId: "content",
            pinnedProperties: ["width"],
            associations: { change: "track-figma-annotation-changes" },
          },
          {
            annotationKey: "interaction-note",
            text: "Review interaction states.",
            categoryId: "interaction",
            pinnedProperties: ["fills"],
            noImpactReason: "The existing decision remains reviewed.",
          },
        ],
      },
    },
  };

  const result = scanSnapshot({
    baseline,
    snapshot: observation(),
  });

  assert.equal(result.status, "drift");
  assert.equal(result.observationDigest.startsWith("sha256:"), true);
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].kind, "changed");
  assert.equal(result.findings[0].annotationKey, "content-note");
  assert.equal(result.findings[0].currentCategoryLabel, "Content");
  assert.equal(result.findings[0].currentCategoryColor, "#3366FF");
  assert.equal(result.findings[0].currentCategoryIsPreset, true);
  assert.deepEqual(result.findings[0].currentPinnedProperties, ["width"]);
  assert.deepEqual(result.findings[0].ancestorEvidence, [
    { nodeId: "1:1", name: "Button", type: "COMPONENT_SET" },
    { nodeId: "0:0", name: "Document", type: "DOCUMENT" },
  ]);
});

test("Annotation array order changes", () => {
  const baseline = baselineWithAnnotations([
    {
      annotationKey: "content-note",
      text: "Keep the content contract.",
      categoryId: "content",
      pinnedProperties: ["width"],
    },
    {
      annotationKey: "interaction-note",
      text: "Review interaction states.",
      categoryId: "interaction",
      pinnedProperties: ["fills"],
      noImpactReason: "The existing decision remains reviewed.",
    },
  ]);
  const snapshot = snapshotWithAnnotations([
    {
      label: "Review interaction states.",
      categoryId: "interaction",
      properties: [{ type: "fills" }],
    },
    {
      labelMarkdown: "Keep the content contract.",
      categoryId: "content",
      properties: [{ type: "width" }],
    },
  ]);

  const result = scanSnapshot({ baseline, snapshot });

  assert.equal(result.status, "clean");
  assert.deepEqual(result.findings, []);
});

test("Duplicate multiplicity decreases", () => {
  const baseline = baselineWithAnnotations([
    {
      annotationKey: "duplicate-a",
      text: "Same note",
      categoryId: "interaction",
      pinnedProperties: ["fills"],
    },
    {
      annotationKey: "duplicate-b",
      text: "Same note",
      categoryId: "interaction",
      pinnedProperties: ["fills"],
    },
  ]);
  const snapshot = snapshotWithAnnotations([
    {
      label: "Same note",
      categoryId: "interaction",
      properties: [{ type: "fills" }],
    },
  ]);

  const result = scanSnapshot({ baseline, snapshot });

  assert.equal(result.status, "drift");
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].kind, "removed");
  assert.equal(result.findings[0].annotationKey, "duplicate-b");
});

test("Several unmatched siblings are ambiguous", () => {
  const baseline = baselineWithAnnotations([
    {
      annotationKey: "note-a",
      text: "Old note A",
      categoryId: "interaction",
      pinnedProperties: ["fills"],
    },
    {
      annotationKey: "note-b",
      text: "Old note B",
      categoryId: "interaction",
      pinnedProperties: ["fills"],
    },
  ]);
  const snapshot = snapshotWithAnnotations([
    {
      label: "Current note A",
      categoryId: "interaction",
      properties: [{ type: "fills" }],
    },
    {
      label: "Current note B",
      categoryId: "interaction",
      properties: [{ type: "fills" }],
    },
  ]);
  const result = scanSnapshot({ baseline, snapshot });
  assert.equal(result.findings.length, 4);
  assert.ok(result.findings.every((finding) => finding.ambiguity));
  assert.deepEqual(
    result.findings.map((finding) => finding.kind),
    ["removed", "removed", "added", "added"],
  );
});

test("Annotation structure changes", () => {
  const baseline = baselineWithAnnotations([
    {
      annotationKey: "content-note",
      text: "Same words",
      categoryId: "content",
      pinnedProperties: ["width"],
    },
  ]);
  const snapshot = snapshotWithAnnotations([
    {
      label: "Same words",
      categoryId: "interaction",
      properties: [{ type: "width" }],
    },
  ]);

  const result = scanSnapshot({ baseline, snapshot });

  assert.equal(result.findings.length, 2);
  assert.deepEqual(
    result.findings.map((finding) => [finding.kind, finding.ambiguity?.kind]),
    [
      ["removed", "structure-changed"],
      ["added", "structure-changed"],
    ],
  );
});

test("Only line-ending representation differs", () => {
  const baseline = baselineWithAnnotations([
    {
      annotationKey: "line-note",
      text: "line one\nline two",
      categoryId: null,
      pinnedProperties: [],
    },
  ]);
  const snapshot = snapshotWithAnnotations([
    { label: "line one\r\nline two", categoryId: null },
  ]);

  const result = scanSnapshot({ baseline, snapshot });

  assert.equal(result.status, "clean");
});

test("Existing text edit is accepted", () => {
  const baseline = {
    schemaVersion: 2,
    roots: [
      {
        fileKey,
        nodeId: "1:1",
        fileUrl,
        kind: "code-connect",
        path: "packages/design-system/src/components/forms/button.figma.ts",
        component: "Button",
      },
    ],
    entries: {
      [`${fileKey}:2:1`]: {
        fileKey,
        nodeId: "2:1",
        sourceRoot: "1:1",
        annotations: [
          {
            annotationKey: "content-note",
            text: "Review the old content contract.",
            categoryId: "content",
            pinnedProperties: ["width"],
            associations: { change: "track-figma-annotation-changes" },
          },
          {
            annotationKey: "interaction-note",
            text: "Review interaction states.",
            categoryId: "interaction",
            pinnedProperties: ["fills"],
            noImpactReason: "The existing decision remains reviewed.",
          },
        ],
      },
    },
  };
  const snapshot = normalizeObservation(observation());
  const diff = scanSnapshot({ baseline, snapshot });
  const selected = diff.findings[0];

  const result = acceptSnapshot({
    baseline,
    snapshot,
    ids: [selected.id],
    decisions: {
      observationDigest: snapshot.digest,
      decisions: [
        {
          findingId: selected.id,
          associations: { change: "track-figma-annotation-changes" },
        },
      ],
    },
  });

  assert.equal(result.status, "accepted");
  assert.equal(result.baseline.schemaVersion, 2);
  const annotations = result.baseline.entries[`${fileKey}:2:1`].annotations;
  assert.deepEqual(annotations, [
    {
      annotationKey: "content-note",
      text: "Keep the content contract.",
      categoryId: "content",
      pinnedProperties: ["width"],
      associations: { change: "track-figma-annotation-changes" },
    },
    {
      annotationKey: "interaction-note",
      text: "Review interaction states.",
      categoryId: "interaction",
      pinnedProperties: ["fills"],
      noImpactReason: "The existing decision remains reviewed.",
    },
  ]);
  assert.equal(
    scanSnapshot({ baseline: result.baseline, snapshot }).status,
    "clean",
  );
});

test("Only selected findings are accepted", () => {
  const baseline = {
    schemaVersion: 2,
    roots: [{ fileKey, nodeId: "1:1", fileUrl, component: "Button" }],
    entries: {
      [`${fileKey}:2:1`]: {
        fileKey,
        nodeId: "2:1",
        sourceRoot: "1:1",
        annotations: [
          {
            annotationKey: "content-note",
            text: "Old content contract.",
            categoryId: "content",
            pinnedProperties: ["width"],
          },
        ],
      },
    },
  };
  const snapshot = normalizeObservation(observation());
  const diff = scanSnapshot({ baseline, snapshot });
  const addition = diff.findings.find((finding) => finding.kind === "added");
  assert.ok(addition, "fixture must contain an added occurrence");

  const result = acceptSnapshot({
    baseline,
    snapshot,
    ids: [addition.id],
    decisions: {
      observationDigest: snapshot.digest,
      decisions: [
        {
          findingId: addition.id,
          noImpactReason: "Documented interaction note; no code change.",
        },
      ],
    },
  });

  const accepted = result.baseline.entries[`${fileKey}:2:1`].annotations;
  assert.equal(accepted.length, 2);
  assert.equal(accepted[1].annotationKey.startsWith("accepted:"), true);
  assert.notEqual(accepted[1].annotationKey, addition.currentAnnotationKey);
  assert.equal(
    accepted[1].noImpactReason,
    "Documented interaction note; no code change.",
  );
  assert.equal(result.remaining.status, "drift");
  assert.equal(result.remaining.findings.length, 1);
  assert.equal(result.remaining.findings[0].kind, "changed");
});

test("Addition is confirmed", () => {
  const baseline = { schemaVersion: 2, roots: [], entries: {} };
  const snapshot = normalizeObservation(observation());
  const addition = scanSnapshot({ baseline, snapshot }).findings[0];
  const result = acceptSnapshot({
    baseline,
    snapshot,
    ids: [addition.id],
    decisions: {
      observationDigest: snapshot.digest,
      decisions: [
        {
          findingId: addition.id,
          noImpactReason:
            "The annotation is documented and has no code impact.",
        },
      ],
    },
  });
  assert.equal(result.status, "accepted");
  assert.equal(
    result.baseline.entries[
      `${fileKey}:2:1`
    ].annotations[0].annotationKey.startsWith("accepted:"),
    true,
  );
});

test("Association decision is missing", () => {
  const baseline = {
    schemaVersion: 2,
    roots: [{ fileKey, nodeId: "1:1", fileUrl, scope: "spec" }],
    entries: {},
  };
  const snapshot = normalizeObservation(observation());
  const finding = scanSnapshot({ baseline, snapshot }).findings[0];

  assert.throws(
    () =>
      acceptSnapshot({
        baseline,
        snapshot,
        ids: [finding.id],
        decisions: { observationDigest: snapshot.digest, decisions: [] },
      }),
    /missing decision/,
  );
  assert.throws(
    () =>
      acceptSnapshot({
        baseline,
        snapshot,
        ids: [finding.id],
        decisions: {
          observationDigest: "sha256:stale",
          decisions: [
            { findingId: finding.id, noImpactReason: "Not a product change." },
          ],
        },
      }),
    /decision observation digest does not match/,
  );
  assert.deepEqual(baseline.entries, {});
});

test("Ambiguous duplicate is selected", () => {
  const baseline = {
    schemaVersion: 2,
    roots: [{ fileKey, nodeId: "1:1", fileUrl }],
    entries: {
      [`${fileKey}:2:1`]: {
        fileKey,
        nodeId: "2:1",
        sourceRoot: "1:1",
        annotations: [
          {
            annotationKey: "note-a",
            text: "Same note",
            categoryId: "interaction",
            pinnedProperties: ["fills"],
            associations: { change: "change-a" },
          },
          {
            annotationKey: "note-b",
            text: "Same note",
            categoryId: "interaction",
            pinnedProperties: ["fills"],
            associations: { change: "change-b" },
          },
        ],
      },
    },
  };
  const input = observation();
  input.files[0].nodes[0].annotations = [
    {
      label: "Same note",
      categoryId: "interaction",
      properties: [{ type: "fills" }],
    },
  ];
  const snapshot = normalizeObservation(input);
  const finding = scanSnapshot({ baseline, snapshot }).findings[0];

  assert.equal(finding.ambiguity.kind, "duplicate-count-decrease");
  assert.throws(
    () =>
      acceptSnapshot({
        baseline,
        snapshot,
        ids: [finding.id],
        decisions: {
          observationDigest: snapshot.digest,
          decisions: [{ findingId: finding.id, noImpactReason: "No impact." }],
        },
      }),
    /needs one candidate annotationKey/,
  );
  const accepted = acceptSnapshot({
    baseline,
    snapshot,
    ids: [finding.id],
    decisions: {
      observationDigest: snapshot.digest,
      decisions: [
        {
          findingId: finding.id,
          annotationKey: "note-a",
          noImpactReason: "Removed duplicate was redundant.",
        },
      ],
    },
  });
  assert.deepEqual(
    accepted.baseline.entries[`${fileKey}:2:1`].annotations.map(
      (annotation) => annotation.annotationKey,
    ),
    ["note-b"],
  );
  assert.equal(accepted.remaining.status, "clean");
});

test("Accepted node no longer resolves", () => {
  const baseline = {
    schemaVersion: 2,
    roots: [{ fileKey, nodeId: "1:1", fileUrl }],
    entries: {
      [`${fileKey}:8:8`]: {
        fileKey,
        nodeId: "8:8",
        sourceRoot: "1:1",
        annotations: [
          {
            annotationKey: "orphan-note",
            text: "The replaced node note.",
            categoryId: null,
            pinnedProperties: [],
            noImpactReason:
              "Legacy node is no longer in the engineering surface.",
          },
        ],
      },
    },
  };
  const snapshot = normalizeObservation(observation());
  const diff = scanSnapshot({ baseline, snapshot });
  const orphan = diff.findings.find((finding) => finding.kind === "orphaned");
  assert.ok(orphan, "fixture must contain an orphaned baseline finding");
  assert.equal(diff.status, "drift");
  assert.equal(diff.blockers.length, 0);

  assert.throws(
    () =>
      acceptSnapshot({
        baseline,
        snapshot,
        ids: [orphan.id],
        decisions: {
          observationDigest: snapshot.digest,
          decisions: [
            {
              findingId: orphan.id,
              noImpactReason: "The old node was replaced.",
            },
          ],
        },
      }),
    /orphaned finding .* requires action=remove/,
  );
  const accepted = acceptSnapshot({
    baseline,
    snapshot,
    ids: [orphan.id],
    decisions: {
      observationDigest: snapshot.digest,
      decisions: [
        {
          findingId: orphan.id,
          action: "remove",
          noImpactReason: "The old node was replaced.",
        },
      ],
    },
  });
  assert.equal(accepted.baseline.entries[`${fileKey}:8:8`], undefined);
  assert.equal(accepted.remaining.status, "drift");
  assert.equal(accepted.remaining.blockers.length, 0);
});

test("Replacement node requires explicit old-to-new decision", () => {
  const baseline = baselineWithAnnotations([
    {
      annotationKey: "old-node-note",
      text: "Replacement note",
      categoryId: null,
      pinnedProperties: [],
    },
  ]);
  baseline.entries[`${fileKey}:2:1`].nodeId = "8:8";
  baseline.entries[`${fileKey}:8:8`] = baseline.entries[`${fileKey}:2:1`];
  delete baseline.entries[`${fileKey}:2:1`];
  const input = observation();
  input.files[0].nodes[0].annotations = [{ label: "Replacement note" }];
  const snapshot = normalizeObservation(input);
  const diff = scanSnapshot({ baseline, snapshot });
  const orphan = diff.findings.find((finding) => finding.kind === "orphaned");
  const added = diff.findings.find((finding) => finding.kind === "added");
  assert.ok(orphan);
  assert.ok(added);

  const accepted = acceptSnapshot({
    baseline,
    snapshot,
    ids: [orphan.id, added.id],
    decisions: {
      observationDigest: snapshot.digest,
      decisions: [
        {
          findingId: orphan.id,
          action: "replace",
          replacementFindingId: added.id,
          noImpactReason: "Figma replaced the node without a product change.",
        },
        {
          findingId: added.id,
          noImpactReason: "Figma replaced the node without a product change.",
        },
      ],
    },
  });

  assert.equal(accepted.baseline.entries[`${fileKey}:8:8`], undefined);
  assert.equal(
    accepted.baseline.entries[`${fileKey}:2:1`].annotations.length,
    1,
  );
  assert.equal(accepted.remaining.status, "clean");
});

test("CLI acceptance writes one atomic baseline transaction", async () => {
  const baseline = {
    schemaVersion: 2,
    roots: [{ fileKey, nodeId: "1:1", fileUrl, scope: "spec" }],
    entries: {
      [`${fileKey}:2:1`]: {
        fileKey,
        nodeId: "2:1",
        sourceRoot: "1:1",
        annotations: [
          {
            annotationKey: "content-note",
            text: "Old content contract.",
            categoryId: "content",
            pinnedProperties: ["width"],
          },
        ],
      },
    },
  };
  const snapshot = normalizeObservation(observation());
  const finding = scanSnapshot({ baseline, snapshot }).findings[0];
  const directory = await mkdtemp(join(tmpdir(), "grade10-annotation-"));
  const baselinePath = join(directory, "baseline.json");
  const snapshotPath = join(directory, "snapshot.json");
  const decisionsPath = join(directory, "decisions.json");
  try {
    await writeFile(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
    await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
    await writeFile(
      decisionsPath,
      `${JSON.stringify(
        {
          observationDigest: snapshot.digest,
          baselineDigest: baselineDigestFor(baseline),
          decisions: [
            {
              findingId: finding.id,
              noImpactReason:
                "The wording change has no implementation impact.",
            },
          ],
        },
        null,
        2,
      )}\n`,
    );

    const originalLog = console.log;
    console.log = () => {};
    let exitCode;
    try {
      exitCode = await runAcceptCli({
        storeRoot: directory,
        argv: [
          "--scope",
          "spec",
          "--baseline",
          baselinePath,
          "--snapshot",
          snapshotPath,
          "--ids",
          finding.id,
          "--decisions",
          decisionsPath,
          "--json",
        ],
      });
    } finally {
      console.log = originalLog;
    }

    assert.equal(exitCode, 0);
    const accepted = JSON.parse(await readFile(baselinePath, "utf8"));
    assert.equal(
      accepted.entries[`${fileKey}:2:1`].annotations[0].noImpactReason,
      "The wording change has no implementation impact.",
    );
    assert.deepEqual((await readdir(directory)).sort(), [
      "baseline.json",
      "decisions.json",
      "snapshot.json",
    ]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("diff CLI is read-only and returns clean exit status for matching evidence", async () => {
  const snapshot = normalizeObservation(observation());
  const baseline = baselineWithAnnotations([
    {
      annotationKey: "content-note",
      text: "Keep the content contract.",
      categoryId: "content",
      pinnedProperties: ["width"],
    },
    {
      annotationKey: "interaction-note",
      text: "Review interaction states.",
      categoryId: "interaction",
      pinnedProperties: ["fills"],
    },
  ]);
  const directory = await mkdtemp(join(tmpdir(), "grade10-annotation-diff-"));
  const baselinePath = join(directory, "baseline.json");
  const snapshotPath = join(directory, "snapshot.json");
  try {
    const before = `${JSON.stringify(baseline, null, 2)}\n`;
    await writeFile(baselinePath, before);
    await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`);
    let output = "";
    const originalLog = console.log;
    console.log = (...args) => {
      output = args.join(" ");
    };
    let exitCode;
    try {
      exitCode = await runDiffCli({
        argv: [
          "--scope",
          "spec",
          "--baseline",
          baselinePath,
          "--snapshot",
          snapshotPath,
          "--json",
        ],
      });
    } finally {
      console.log = originalLog;
    }
    assert.equal(exitCode, 0);
    assert.equal(JSON.parse(output).status, "clean");
    assert.equal(await readFile(baselinePath, "utf8"), before);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Unknown association keys are rejected", () => {
  const baseline = { schemaVersion: 2, roots: [], entries: {} };
  const snapshot = normalizeObservation(observation());
  const finding = scanSnapshot({ baseline, snapshot }).findings[0];

  assert.throws(
    () =>
      acceptSnapshot({
        baseline,
        snapshot,
        ids: [finding.id],
        decisions: {
          observationDigest: snapshot.digest,
          decisions: [{ findingId: finding.id, associations: { foo: "bar" } }],
        },
      }),
    /unknown association key|exact capability|change|task.group/i,
  );
  assert.throws(
    () =>
      acceptSnapshot({
        baseline,
        snapshot,
        ids: [finding.id],
        decisions: {
          observationDigest: snapshot.digest,
          decisions: [
            {
              findingId: finding.id,
              associations: { change: "does-not-exist" },
            },
          ],
        },
      }),
    /does not exist in the registered store/i,
  );
});

test("Observation changed before acceptance", () => {
  const baseline = { schemaVersion: 2, roots: [], entries: {} };
  const snapshot = normalizeObservation(observation());
  const finding = scanSnapshot({ baseline, snapshot }).findings[0];

  assert.throws(
    () =>
      acceptSnapshot({
        baseline,
        snapshot,
        ids: [finding.id],
        decisions: {
          observationDigest: snapshot.digest,
          baselineDigest: "sha256:stale-baseline",
          decisions: [
            { findingId: finding.id, noImpactReason: "Not a product change." },
          ],
        },
      }),
    /baseline digest/i,
  );
});

test("Acceptance refuses a baseline outside the registered store", async () => {
  const storeRoot = await mkdtemp(join(tmpdir(), "grade10-annotation-store-"));
  const outsideRoot = await mkdtemp(
    join(tmpdir(), "grade10-annotation-outside-"),
  );
  const baselinePath = join(outsideRoot, "annotation-baseline.json");
  const baseline = { schemaVersion: 2, roots: [], entries: {} };
  try {
    await writeFile(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);

    assert.throws(
      () =>
        applyAcceptanceTransaction({
          storeRoot,
          baselinePath,
          baseline,
          decisions: { baselineDigest: baselineDigestFor(baseline) },
        }),
      /outside the store/i,
    );
    assert.deepEqual(
      JSON.parse(await readFile(baselinePath, "utf8")),
      baseline,
    );
  } finally {
    await rm(storeRoot, { recursive: true, force: true });
    await rm(outsideRoot, { recursive: true, force: true });
  }
});

test("Atomic related OpenSpec patch validates before writing", async () => {
  const directory = await mkdtemp(
    join(tmpdir(), "grade10-annotation-transaction-"),
  );
  const baselinePath = join(
    directory,
    "scripts",
    "design-sync",
    "annotation-baseline.json",
  );
  const relatedPath = join(
    directory,
    "openspec",
    "changes",
    "change-a",
    "spec.md",
  );
  const oldBaseline = { schemaVersion: 2, roots: [], entries: {} };
  const nextBaseline = {
    schemaVersion: 2,
    roots: [],
    entries: {
      [`${fileKey}:2:1`]: {
        fileKey,
        nodeId: "2:1",
        sourceRoot: null,
        annotations: [],
      },
    },
  };
  const oldSpec = "# Existing requirement\n";
  try {
    await mkdir(join(directory, "scripts", "design-sync"), { recursive: true });
    await mkdir(join(directory, "openspec", "changes", "change-a"), {
      recursive: true,
    });
    await writeFile(baselinePath, `${JSON.stringify(oldBaseline, null, 2)}\n`);
    await writeFile(relatedPath, oldSpec);

    const result = applyAcceptanceTransaction({
      storeRoot: directory,
      baselinePath,
      baseline: nextBaseline,
      decisions: {
        baselineDigest: baselineDigestFor(oldBaseline),
        relatedFiles: [
          {
            path: "openspec/changes/change-a/spec.md",
            beforeDigest: contentDigest(oldSpec),
            content: "# Updated requirement\n",
          },
        ],
      },
    });

    assert.equal(result.status, "accepted");
    assert.deepEqual(
      JSON.parse(await readFile(baselinePath, "utf8")),
      nextBaseline,
    );
    assert.equal(
      await readFile(relatedPath, "utf8"),
      "# Updated requirement\n",
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Invalid related OpenSpec content leaves every target unchanged", async () => {
  const directory = await mkdtemp(join(tmpdir(), "grade10-annotation-atomic-"));
  const baselinePath = join(directory, "baseline.json");
  const relatedPath = join(
    directory,
    "openspec",
    "changes",
    "change-a",
    "spec.md",
  );
  const baseline = { schemaVersion: 2, roots: [], entries: {} };
  try {
    await mkdir(join(directory, "openspec", "changes", "change-a"), {
      recursive: true,
    });
    await writeFile(baselinePath, `${JSON.stringify(baseline, null, 2)}\n`);
    await writeFile(relatedPath, "# Existing requirement\n");
    const beforeBaseline = await readFile(baselinePath, "utf8");
    assert.throws(
      () =>
        applyAcceptanceTransaction({
          storeRoot: directory,
          baselinePath,
          baseline: { schemaVersion: 2, roots: [], entries: { invalid: true } },
          decisions: {
            baselineDigest: baselineDigestFor(baseline),
            relatedFiles: [
              {
                path: "openspec/changes/change-a/spec.md",
                beforeDigest: contentDigest("# Existing requirement\n"),
                content: "<<<<<<< unresolved\n",
              },
            ],
          },
        }),
      /invalid|unresolved|patch content/i,
    );
    assert.equal(await readFile(baselinePath, "utf8"), beforeBaseline);
    assert.equal(
      await readFile(relatedPath, "utf8"),
      "# Existing requirement\n",
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("Design-sync workflow still checks registered components", () => {
  const workflow = readFileSync(
    new URL("../../.github/workflows/design-sync.yml", import.meta.url),
    "utf8",
  );
  assert.match(workflow, /pnpm run design-sync:check/);
  assert.match(workflow, /pnpm run design-sync:audit --all-blocks/);
  assert.doesNotMatch(workflow, /annotation-monitor|figma:annotations/);
});
