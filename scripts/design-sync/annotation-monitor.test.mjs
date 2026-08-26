import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ANNOTATION_SCHEMA_VERSION,
  discoverSources,
  exitCodeFor,
  inventoryAnnotations,
  renderHuman,
  scanAnnotations,
} from "./annotation-monitor.mjs";

const fileKey = "ABCDEFGHIJKLMNOPQRSTUV";
const fileUrl = `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`;
const changedFixture = JSON.parse(
  readFileSync(new URL("./fixtures/annotations/changed.json", import.meta.url)),
);
const multipleFixture = JSON.parse(
  readFileSync(
    new URL("./fixtures/annotations/multiple.json", import.meta.url),
  ),
);

const source = {
  fileKey,
  nodeId: "1:1",
  fileUrl,
  kind: "code-connect",
  path: "packages/design-system/src/components/forms/button.figma.ts",
  component: "Button",
};

const baseline = {
  schemaVersion: 1,
  roots: [source],
  entries: {
    [`${fileKey}:2:1`]: {
      fileKey,
      nodeId: "2:1",
      sourceRoot: "1:1",
      text: "Use the reviewed button contract.",
      associations: {
        capability: "shared-ui/design-sync",
        change: "track-figma-annotation-changes",
        taskGroup: "1",
      },
    },
  },
};

const document = {
  id: "0:0",
  type: "DOCUMENT",
  name: "Document",
  children: [
    {
      id: "1:1",
      type: "COMPONENT_SET",
      name: "Button",
      children: [
        {
          id: "2:1",
          type: "COMPONENT",
          name: "Button / default",
          annotations: [
            { labelMarkdown: "Review the updated button contract." },
          ],
        },
      ],
    },
  ],
};

function documentWithAnnotation(annotation, nodeId = "2:1") {
  return documentWithAnnotations(
    annotation === undefined ? undefined : [annotation],
    nodeId,
  );
}

function documentWithAnnotations(annotations, nodeId = "2:1") {
  return {
    ...document,
    children: [
      {
        ...document.children[0],
        children: [
          {
            ...document.children[0].children[0],
            id: nodeId,
            annotations,
          },
        ],
      },
    ],
  };
}

function baselineWithEntries(entries, roots = [source]) {
  return { schemaVersion: 1, roots, entries };
}

function occurrenceBaseline(annotations, nodeId = "2:1") {
  return {
    schemaVersion: ANNOTATION_SCHEMA_VERSION,
    roots: [source],
    entries: {
      [`${fileKey}:${nodeId}`]: {
        fileKey,
        nodeId,
        sourceRoot: "1:1",
        annotations,
      },
    },
  };
}

test("reports changed annotation text with previous and current text", () => {
  const result = scanAnnotations({
    baseline,
    sources: [source],
    documents: { [fileKey]: changedFixture },
  });

  assert.equal(result.status, "drift");
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].kind, "changed");
  assert.equal(
    result.findings[0].previousText,
    "Use the reviewed button contract.",
  );
  assert.equal(
    result.findings[0].currentText,
    "Review the updated button contract.",
  );
  assert.equal(result.findings[0].nodeId, "2:1");
  assert.match(result.findings[0].nodeLink, /node-id=2-1/);
  assert.match(result.findings[0].id, /^[0-9a-f]{16}$/);
  assert.deepEqual(
    result.findings[0].associations,
    baseline.entries[`${fileKey}:2:1`].associations,
  );
});

test("reports an annotation added below a tracked root without changing the baseline", () => {
  const result = scanAnnotations({
    baseline: baselineWithEntries({}),
    sources: [source],
    documents: {
      [fileKey]: { document: documentWithAnnotation({ label: "New note" }) },
    },
  });

  assert.equal(result.status, "drift");
  assert.equal(result.findings[0].kind, "added");
  assert.equal(result.findings[0].currentText, "New note");
  assert.equal(result.findings[0].classification, "associated");
  assert.deepEqual(baselineWithEntries({}).entries, {});
});

test("reports an annotation removed from a resolvable baseline node", () => {
  const result = scanAnnotations({
    baseline,
    sources: [source],
    documents: { [fileKey]: { document: documentWithAnnotation(undefined) } },
  });

  assert.equal(result.status, "drift");
  assert.equal(result.findings[0].kind, "removed");
  assert.equal(
    result.findings[0].previousText,
    "Use the reviewed button contract.",
  );
  assert.equal(result.findings[0].currentText, null);
});

test("ignores carriage-return line-ending representation changes", () => {
  const lineBaseline = baselineWithEntries({
    [`${fileKey}:2:1`]: {
      fileKey,
      nodeId: "2:1",
      sourceRoot: "1:1",
      text: "line one\nline two",
    },
  });
  const result = scanAnnotations({
    baseline: lineBaseline,
    sources: [source],
    documents: {
      [fileKey]: {
        document: documentWithAnnotation({ label: "line one\r\nline two" }),
      },
    },
  });

  assert.equal(result.status, "clean");
  assert.deepEqual(result.findings, []);
});

test("migrates a schema-version-1 annotation entry to one stable occurrence", () => {
  const result = scanAnnotations({
    baseline,
    sources: [source],
    documents: { [fileKey]: changedFixture },
  });

  assert.equal(result.schemaVersion, 2);
  assert.equal(result.findings[0].annotationKey, "legacy-1");
  assert.equal(result.findings[0].previousCategoryId, null);
  assert.deepEqual(result.findings[0].previousPinnedProperties, []);
});

test("matches multiple annotations independently of array order", () => {
  const result = scanAnnotations({
    baseline: occurrenceBaseline([
      {
        annotationKey: "interaction-note",
        text: "Use the reviewed button contract.",
        categoryId: "interaction",
        pinnedProperties: ["width"],
      },
      {
        annotationKey: "a11y-note",
        text: "Keep this note",
        categoryId: "a11y",
        pinnedProperties: ["fills"],
      },
    ]),
    sources: [source],
    documents: { [fileKey]: { document: multipleFixture.document } },
  });

  assert.equal(result.status, "drift");
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].kind, "changed");
  assert.equal(result.findings[0].annotationKey, "interaction-note");
  assert.equal(
    result.findings[0].previousText,
    "Use the reviewed button contract.",
  );
  assert.equal(
    result.findings[0].currentText,
    "Review the updated button contract.",
  );
  assert.equal(result.findings[0].currentCategoryId, "interaction");
  assert.deepEqual(result.findings[0].currentPinnedProperties, ["width"]);
});

test("does not report a reordered multi-annotation baseline as drift", () => {
  const result = scanAnnotations({
    baseline: occurrenceBaseline([
      {
        annotationKey: "a11y-note",
        text: "Keep this note",
        categoryId: "a11y",
        pinnedProperties: ["fills"],
      },
      {
        annotationKey: "interaction-note",
        text: "Review the updated button contract.",
        categoryId: "interaction",
        pinnedProperties: ["width"],
      },
    ]),
    sources: [source],
    documents: { [fileKey]: { document: multipleFixture.document } },
  });

  assert.equal(result.status, "clean");
  assert.deepEqual(result.findings, []);
});

test("tracks property-only annotations by category and pinned properties", () => {
  const result = scanAnnotations({
    baseline: occurrenceBaseline([
      {
        annotationKey: "layout-note",
        text: "",
        categoryId: "visual",
        pinnedProperties: ["padding", "width"],
      },
    ]),
    sources: [source],
    documents: {
      [fileKey]: {
        document: documentWithAnnotations([
          {
            categoryId: "visual",
            properties: [{ type: "width" }, { type: "padding" }],
          },
        ]),
      },
    },
  });

  assert.equal(result.status, "clean");
  assert.deepEqual(result.findings, []);
});

test("reports only the newly added occurrence when siblings already match", () => {
  const result = scanAnnotations({
    baseline: occurrenceBaseline([
      {
        annotationKey: "a11y-note",
        text: "Keep this note",
        categoryId: "a11y",
        pinnedProperties: ["fills"],
      },
    ]),
    sources: [source],
    documents: { [fileKey]: { document: multipleFixture.document } },
  });

  assert.equal(result.status, "drift");
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].kind, "added");
  assert.equal(result.findings[0].previousText, null);
  assert.equal(
    result.findings[0].currentText,
    "Review the updated button contract.",
  );
  assert.match(result.findings[0].annotationKey, /^current:/);
});

test("reports only the absent occurrence when another baseline sibling remains", () => {
  const result = scanAnnotations({
    baseline: occurrenceBaseline([
      {
        annotationKey: "interaction-note",
        text: "Review the updated button contract.",
        categoryId: "interaction",
        pinnedProperties: ["width"],
      },
      {
        annotationKey: "a11y-note",
        text: "Keep this note",
        categoryId: "a11y",
        pinnedProperties: ["fills"],
      },
    ]),
    sources: [source],
    documents: {
      [fileKey]: {
        document: documentWithAnnotations([
          {
            label: "Keep this note",
            categoryId: "a11y",
            properties: [{ type: "fills" }],
          },
        ]),
      },
    },
  });

  assert.equal(result.status, "drift");
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].kind, "removed");
  assert.equal(result.findings[0].annotationKey, "interaction-note");
});

test("reports a unique text change for one remaining structural signature", () => {
  const result = scanAnnotations({
    baseline: occurrenceBaseline([
      {
        annotationKey: "interaction-note",
        text: "Old behavior",
        categoryId: "interaction",
        pinnedProperties: ["width"],
      },
      {
        annotationKey: "a11y-note",
        text: "Keep this note",
        categoryId: "a11y",
        pinnedProperties: ["fills"],
      },
    ]),
    sources: [source],
    documents: {
      [fileKey]: {
        document: documentWithAnnotations([
          {
            label: "Keep this note",
            categoryId: "a11y",
            properties: [{ type: "fills" }],
          },
          {
            label: "New behavior",
            categoryId: "interaction",
            properties: [{ type: "width" }],
          },
        ]),
      },
    },
  });

  assert.equal(result.status, "drift");
  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].kind, "changed");
  assert.equal(result.findings[0].annotationKey, "interaction-note");
});

test("reports a structure change as removed plus added without pairing by text", () => {
  const result = scanAnnotations({
    baseline: occurrenceBaseline([
      {
        annotationKey: "note",
        text: "Same note",
        categoryId: "interaction",
        pinnedProperties: ["width"],
      },
    ]),
    sources: [source],
    documents: {
      [fileKey]: {
        document: documentWithAnnotations([
          {
            label: "Same note",
            categoryId: "a11y",
            properties: [{ type: "width" }],
          },
        ]),
      },
    },
  });

  assert.equal(result.status, "drift");
  assert.deepEqual(result.findings.map((finding) => finding.kind).sort(), [
    "added",
    "removed",
  ]);
  assert.ok(
    result.findings.every(
      (finding) => finding.ambiguity?.kind === "structure-changed",
    ),
  );
});

test("preserves duplicate multiplicity when one identical occurrence disappears", () => {
  const result = scanAnnotations({
    baseline: occurrenceBaseline([
      {
        annotationKey: "note-a",
        text: "Same note",
        categoryId: "interaction",
        pinnedProperties: ["width"],
      },
      {
        annotationKey: "note-b",
        text: "Same note",
        categoryId: "interaction",
        pinnedProperties: ["width"],
      },
    ]),
    sources: [source],
    documents: {
      [fileKey]: {
        document: documentWithAnnotations([
          {
            label: "Same note",
            categoryId: "interaction",
            properties: [{ type: "width" }],
          },
        ]),
      },
    },
  });

  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].kind, "removed");
  assert.equal(result.findings[0].annotationKey, "note-b");
  assert.equal(result.findings[0].ambiguity, null);
});

test("marks a duplicate removal ambiguous when baseline associations differ", () => {
  const result = scanAnnotations({
    baseline: occurrenceBaseline([
      {
        annotationKey: "note-a",
        text: "Same note",
        categoryId: "interaction",
        pinnedProperties: ["width"],
        associations: { change: "change-a", taskGroup: "1" },
      },
      {
        annotationKey: "note-b",
        text: "Same note",
        categoryId: "interaction",
        pinnedProperties: ["width"],
        associations: { change: "change-b", taskGroup: "1" },
      },
    ]),
    sources: [source],
    documents: {
      [fileKey]: {
        document: documentWithAnnotations([
          {
            label: "Same note",
            categoryId: "interaction",
            properties: [{ type: "width" }],
          },
        ]),
      },
    },
  });

  assert.equal(result.findings.length, 1);
  assert.equal(result.findings[0].annotationKey, null);
  assert.equal(result.findings[0].ambiguity?.kind, "duplicate-count-decrease");
  assert.deepEqual(result.findings[0].candidateAnnotationKeys, [
    "note-a",
    "note-b",
  ]);
  assert.equal(result.findings[0].classification, "ambiguous");
});

test("marks several unmatched siblings ambiguous instead of pairing them", () => {
  const result = scanAnnotations({
    baseline: occurrenceBaseline([
      {
        annotationKey: "old-a",
        text: "Old A",
        categoryId: "interaction",
        pinnedProperties: ["width"],
      },
      {
        annotationKey: "old-b",
        text: "Old B",
        categoryId: "interaction",
        pinnedProperties: ["width"],
      },
    ]),
    sources: [source],
    documents: {
      [fileKey]: {
        document: documentWithAnnotations([
          {
            label: "New A",
            categoryId: "interaction",
            properties: [{ type: "width" }],
          },
          {
            label: "New B",
            categoryId: "interaction",
            properties: [{ type: "width" }],
          },
        ]),
      },
    },
  });

  assert.equal(result.findings.length, 4);
  assert.deepEqual(result.findings.map((finding) => finding.kind).sort(), [
    "added",
    "added",
    "removed",
    "removed",
  ]);
  assert.ok(
    result.findings.every(
      (finding) => finding.ambiguity?.kind === "multiple-unmatched",
    ),
  );
});

test("blocks an unreadable Figma file without reporting baseline annotations as removed", () => {
  const result = scanAnnotations({
    baseline,
    sources: [source],
    documents: {
      [fileKey]: { kind: "figma-request-failed", error: "403 Forbidden" },
    },
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.findings.length, 0);
  assert.equal(result.blockers[0].kind, "figma-request-failed");
  assert.equal(exitCodeFor(result), 2);
});

test("blocks an unresolved baseline node instead of classifying it as removed", () => {
  const result = scanAnnotations({
    baseline,
    sources: [source],
    documents: {
      [fileKey]: {
        document: {
          ...document,
          children: [{ ...document.children[0], children: [] }],
        },
      },
    },
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.findings.length, 0);
  assert.equal(result.blockers[0].kind, "orphaned-baseline-node");
});

test("keeps an annotation with no exact association visible as untracked", () => {
  const untrackedSource = { ...source, component: null };
  const result = scanAnnotations({
    baseline: baselineWithEntries({}, [untrackedSource]),
    sources: [untrackedSource],
    documents: {
      [fileKey]: {
        document: documentWithAnnotation({ label: "Needs triage" }),
      },
    },
  });

  assert.equal(result.status, "drift");
  assert.equal(result.findings[0].classification, "untracked");
  assert.deepEqual(result.findings[0].associationEvidence, []);
  assert.equal(exitCodeFor(result), 1);
});

test("blocks malformed annotation structure", () => {
  const malformed = documentWithAnnotations([
    { label: "First", properties: [{ type: "" }] },
  ]);
  const result = scanAnnotations({
    baseline: baselineWithEntries({}),
    sources: [source],
    documents: { [fileKey]: { document: malformed } },
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.findings.length, 0);
  assert.equal(result.blockers[0].kind, "malformed-response");
});

test("blocks a partly migrated schema-version-2 baseline", () => {
  const result = scanAnnotations({
    baseline: {
      schemaVersion: 2,
      roots: [source],
      entries: {
        [`${fileKey}:2:1`]: {
          fileKey,
          nodeId: "2:1",
          text: "old shape",
          annotations: [],
        },
      },
    },
    sources: [source],
    documents: { [fileKey]: { document: documentWithAnnotation(undefined) } },
  });

  assert.equal(result.status, "blocked");
  assert.equal(result.blockers[0].kind, "partly-migrated-baseline");
});

test("inventories current annotations without producing a baseline", () => {
  const result = inventoryAnnotations({
    sources: [source],
    documents: {
      [fileKey]: {
        document: documentWithAnnotation({ labelMarkdown: "Inventory me" }),
      },
    },
  });

  assert.equal(result.status, "inventory");
  assert.equal(result.blockers.length, 0);
  assert.deepEqual(result.annotations, [
    {
      fileKey,
      nodeId: "2:1",
      nodeName: "Button / default",
      annotationKey: "current:a7227475ce778873:1",
      text: "Inventory me",
      categoryId: null,
      pinnedProperties: [],
      nodeLink: `${fileUrl}?node-id=2-1`,
      registeredSources: [
        {
          kind: "code-connect",
          path: source.path,
          label: null,
          component: "Button",
          covers: null,
          fileKey,
          nodeId: "1:1",
        },
      ],
    },
  ]);
});

test("whole-file inventory includes annotations outside registered roots", () => {
  const wholeFileDocument = {
    ...documentWithAnnotation({ label: "Inside root" }),
    children: [
      ...documentWithAnnotation({ label: "Inside root" }).children,
      {
        id: "4:1",
        type: "FRAME",
        name: "Exploration",
        annotations: [{ label: "Outside root" }],
      },
    ],
  };
  const result = inventoryAnnotations({
    sources: [source],
    fileKeys: [fileKey],
    wholeFile: true,
    documents: { [fileKey]: { document: wholeFileDocument } },
  });

  assert.equal(result.status, "inventory");
  assert.equal(result.annotations.length, 2);
  assert.deepEqual(
    result.annotations.find((annotation) => annotation.nodeId === "4:1")
      .registeredSources,
    [],
  );
});

test("renders blocked inventory results without requiring scan findings", () => {
  const result = inventoryAnnotations({
    sources: [source],
    documents: {
      [fileKey]: {
        kind: "missing-credential",
        error: "FIGMA_TOKEN is not set",
      },
    },
  });

  assert.equal(result.status, "blocked");
  assert.doesNotThrow(() => renderHuman(result));
  assert.match(renderHuman(result), /Annotation scan blocked/);
});

test("discovers Code Connect and audit roots from the repository sources", async () => {
  const result = await discoverSources();

  assert.ok(
    result.sources.some(
      (candidate) =>
        candidate.kind === "code-connect" &&
        candidate.path.endsWith(
          "packages/design-system/src/components/forms/button.figma.ts",
        ) &&
        candidate.nodeId === "86:3459",
    ),
  );
  assert.ok(
    result.sources.some(
      (candidate) =>
        candidate.kind === "audit" &&
        candidate.path.endsWith(
          "packages/ui/src/blocks/store-home/audit.json",
        ) &&
        candidate.nodeId === "4171:9051",
    ),
  );
  assert.equal(result.fileUrls[fileKey], undefined);
  assert.ok(Object.keys(result.fileUrls).length > 0);
});
