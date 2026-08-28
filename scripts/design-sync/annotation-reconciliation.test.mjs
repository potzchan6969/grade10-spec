import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { runCli as runAcceptCli } from "./annotation-accept.mjs";
import { runCli as runDiffCli } from "./annotation-diff.mjs";
import { acceptSnapshot, scanSnapshot } from "./annotation-reconciliation.mjs";
import {
  ANNOTATION_OBSERVATION_SCHEMA_VERSION,
  normalizeObservation,
} from "./annotation-snapshot.mjs";

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
            source: {
              kind: "code-connect",
              path: "packages/design-system/src/components/forms/button.figma.ts",
              component: "Button",
            },
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
    roots: [{ fileKey, nodeId: "1:1", fileUrl }],
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

test("one category catalog resolves many annotations locally", () => {
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

test("an uncategorized annotation remains valid and a missing category blocks", () => {
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

test("nodes outside registered roots are excluded from the observation", () => {
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

test("snapshot diff keeps an exact-surface addition untracked without an association", () => {
  const input = observation();
  input.files[0].roots[0].source.component = null;
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

test("snapshot diff preserves schema-v2 keys and reports category metadata", () => {
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
    { nodeId: "0:0", name: "Document", type: "DOCUMENT" },
    { nodeId: "1:1", name: "Button", type: "COMPONENT_SET" },
  ]);
});

test("snapshot diff ignores annotation array reordering", () => {
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

test("snapshot diff reports one duplicate removal without collapsing multiplicity", () => {
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

test("snapshot diff reports a category change as an ambiguous removal and addition", () => {
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

test("snapshot diff ignores line-ending representation changes", () => {
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

test("accepts one selected text edit without replacing its annotation key", () => {
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

test("accepts only a selected addition and leaves another finding as drift", () => {
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

test("rejects a missing or stale decision before producing a baseline", () => {
  const baseline = {
    schemaVersion: 2,
    roots: [{ fileKey, nodeId: "1:1", fileUrl }],
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

test("requires an explicit baseline key before accepting an ambiguous duplicate", () => {
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

test("keeps orphaned baseline entries blocked until an explicit removal is accepted", () => {
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
  assert.equal(diff.status, "blocked");

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

test("requires an explicit old-to-new decision for a replacement node", () => {
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

test("accept CLI replaces the baseline through one atomic file write", async () => {
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
        argv: [
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
