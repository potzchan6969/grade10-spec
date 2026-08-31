import assert from "node:assert/strict";
import test from "node:test";
import {
  FigmaObservationUnavailableError,
  observeRegisteredFile,
} from "./annotation-observation.mjs";

const fileKey = "ABCDEFGHIJKLMNOPQRSTUV";

function fakeFigma() {
  let categoryReads = 0;
  let nodeReads = 0;
  let traversalReads = 0;
  const leaf = {
    id: "2:1",
    name: "Button / default",
    type: "COMPONENT",
    parent: null,
    annotations: [
      {
        label: "Content note",
        categoryId: "content",
        properties: [{ type: "width" }],
      },
      {
        label: "Interaction note",
        categoryId: "interaction",
        properties: [{ type: "fills" }],
      },
    ],
    findAll: () => {
      traversalReads += 1;
      return [];
    },
  };
  const root = {
    id: "1:1",
    name: "Button",
    type: "COMPONENT_SET",
    parent: null,
    annotations: [],
    findAll: () => {
      traversalReads += 1;
      return [leaf];
    },
  };
  leaf.parent = root;
  return {
    api: {
      fileKey,
      annotations: {
        async getAnnotationCategoriesAsync() {
          categoryReads += 1;
          return [
            { id: "content", label: "Content", color: "blue", isPreset: true },
            {
              id: "interaction",
              label: "Interaction",
              color: "orange",
              isPreset: false,
            },
          ];
        },
      },
      async getNodeByIdAsync(id) {
        nodeReads += 1;
        return id === root.id ? root : id === leaf.id ? leaf : null;
      },
    },
    get categoryReads() {
      return categoryReads;
    },
    get nodeReads() {
      return nodeReads;
    },
    get traversalReads() {
      return traversalReads;
    },
    root,
    leaf,
  };
}

test("one category catalog resolves many annotations from scoped inventory", async () => {
  const fake = fakeFigma();
  const observation = await observeRegisteredFile({
    figma: fake.api,
    file: {
      fileKey,
      fileUrl: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
      registrations: [
        {
          nodeId: "1:1",
          kind: "code-connect",
          path: "packages/design-system/src/components/forms/button.figma.ts",
          component: "Button",
        },
      ],
      trackedNodeIds: [],
    },
  });

  assert.equal(fake.categoryReads, 1);
  assert.equal(observation.schemaVersion, 2);
  assert.equal("digest" in observation, false);
  assert.deepEqual(
    observation.files[0].nodes[0].annotations.map((annotation) => ({
      categoryId: annotation.categoryId,
      categoryLabel: annotation.categoryLabel,
    })),
    [
      { categoryId: "content", categoryLabel: "Content" },
      { categoryId: "interaction", categoryLabel: "Interaction" },
    ],
  );
  assert.deepEqual(observation.files[0].nodes[0].rootIds, ["1:1"]);
  assert.deepEqual(observation.files[0].roots[0].sources, [
    {
      kind: "code-connect",
      path: "packages/design-system/src/components/forms/button.figma.ts",
      label: null,
      component: "Button",
      covers: null,
    },
  ]);
});

test("Figma Plugin API access is unavailable", async () => {
  await assert.rejects(
    observeRegisteredFile({
      figma: null,
      file: {
        fileKey,
        fileUrl: "https://www.figma.com/design/example",
        registrations: [],
        trackedNodeIds: [],
      },
    }),
    (error) => {
      assert.ok(error instanceof FigmaObservationUnavailableError);
      assert.match(error.message, /Figma Plugin API/i);
      return true;
    },
  );
});

test("overlapping registrations are resolved and traversed once", async () => {
  const fake = fakeFigma();
  const observation = await observeRegisteredFile({
    figma: fake.api,
    file: {
      fileKey,
      fileUrl: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
      registrations: [
        {
          nodeId: "1:1",
          kind: "audit",
          path: "packages/design-system/src/components/forms/audit.json",
          label: "button/root",
        },
        {
          nodeId: "2:1",
          kind: "code-connect",
          path: "packages/design-system/src/components/forms/button.figma.ts",
          component: "Button",
        },
      ],
      trackedNodeIds: [],
    },
  });

  assert.equal(fake.nodeReads, 2);
  assert.equal(fake.traversalReads, 2);
  assert.equal(observation.files[0].nodes.length, 1);
  assert.deepEqual(observation.files[0].nodes[0].rootIds, ["1:1", "2:1"]);
  assert.equal(observation.files[0].nodes[0].annotations.length, 2);
});

test("tracked zero-annotation nodes remain observable for final removal", async () => {
  const fake = fakeFigma();
  fake.leaf.annotations = [];

  const observation = await observeRegisteredFile({
    figma: fake.api,
    file: {
      fileKey,
      fileUrl: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
      registrations: [{ nodeId: "1:1", kind: "audit", path: "audit.json" }],
      trackedNodeIds: ["2-1"],
    },
  });

  assert.deepEqual(
    observation.files[0].nodes.map((node) => ({
      nodeId: node.nodeId,
      annotations: node.annotations,
    })),
    [{ nodeId: "2:1", annotations: [] }],
  );
});

test("repeated registrations preserve sources and resolve once", async () => {
  const fake = fakeFigma();
  const observation = await observeRegisteredFile({
    figma: fake.api,
    file: {
      fileKey,
      fileUrl: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
      registrations: [
        { nodeId: "1:1", kind: "audit", path: "audit.json" },
        {
          nodeId: "1-1",
          kind: "code-connect",
          path: "button.figma.ts",
          component: "Button",
        },
      ],
      trackedNodeIds: [],
    },
  });

  assert.equal(fake.nodeReads, 1);
  assert.equal(fake.traversalReads, 1);
  assert.equal(observation.files[0].roots.length, 1);
  assert.equal(observation.files[0].roots[0].sources.length, 2);
});

test("inconsistent repeated node evidence blocks the observation", async () => {
  const fake = fakeFigma();
  const conflictingLeaf = {
    ...fake.leaf,
    name: "Button / conflicting",
    parent: fake.root,
    findAll: () => [],
  };
  const conflictingRoot = {
    ...fake.root,
    id: "3:1",
    findAll: () => [conflictingLeaf],
  };
  fake.api.getNodeByIdAsync = async (id) => {
    if (id === "1:1") return fake.root;
    if (id === "3:1") return conflictingRoot;
    if (id === "2:1") return fake.leaf;
    return null;
  };

  await assert.rejects(
    observeRegisteredFile({
      figma: fake.api,
      file: {
        fileKey,
        fileUrl: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
        registrations: [{ nodeId: "1:1" }, { nodeId: "3:1" }],
        trackedNodeIds: [],
      },
    }),
    (error) => {
      assert.ok(error instanceof FigmaObservationUnavailableError);
      assert.equal(error.blockers[0].kind, "inconsistent-node-observation");
      assert.equal(error.blockers[0].nodeId, "2:1");
      return true;
    },
  );
});

test("unresolved registered roots are skipped when another root resolves", async () => {
  const fake = fakeFigma();
  const observation = await observeRegisteredFile({
    figma: fake.api,
    file: {
      fileKey,
      fileUrl: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
      registrations: [
        { nodeId: "1:1", label: "Button / root" },
        { nodeId: "9:9", component: "FilterChip" },
      ],
      trackedNodeIds: [],
    },
  });

  assert.deepEqual(
    observation.files[0].roots.map((root) => root.nodeId),
    ["1:1"],
  );
  assert.deepEqual(
    observation.files[0].skippedRoots.map((root) => ({
      nodeId: root.nodeId,
      reason: root.reason,
    })),
    [{ nodeId: "9:9", reason: "registered root could not be resolved" }],
  );
  assert.equal(observation.blockers.length, 0);
});

test("every registered root unresolved blocks the observation", async () => {
  const fake = fakeFigma();
  fake.api.getNodeByIdAsync = async () => null;

  await assert.rejects(
    observeRegisteredFile({
      figma: fake.api,
      file: {
        fileKey,
        fileUrl: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
        registrations: [{ nodeId: "9:9" }],
        trackedNodeIds: [],
      },
    }),
    (error) => {
      assert.ok(error instanceof FigmaObservationUnavailableError);
      assert.deepEqual(error.blockers, [
        { kind: "unresolved-registered-root", fileKey, nodeId: "9:9" },
      ]);
      return true;
    },
  );
});

test("duplicate source registrations are rejected before Figma reads", async () => {
  const fake = fakeFigma();

  await assert.rejects(
    observeRegisteredFile({
      figma: fake.api,
      file: {
        fileKey,
        fileUrl: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
        registrations: [
          { nodeId: "1:1", kind: "audit", path: "audit.json" },
          { nodeId: "1-1", kind: "audit", path: "audit.json" },
        ],
        trackedNodeIds: [],
      },
    }),
    /duplicate source evidence/i,
  );
  assert.equal(fake.nodeReads, 0);
});

test("traversal failure is reported as blocked evidence", async () => {
  const fake = fakeFigma();
  fake.root.findAll = () => {
    throw new Error("unsupported traversal operation");
  };

  await assert.rejects(
    observeRegisteredFile({
      figma: fake.api,
      file: {
        fileKey,
        fileUrl: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
        registrations: [{ nodeId: "1:1" }],
        trackedNodeIds: [],
      },
    }),
    (error) => {
      assert.ok(error instanceof FigmaObservationUnavailableError);
      assert.equal(error.blockers[0].kind, "registered-root-unreadable");
      assert.match(error.blockers[0].reason, /unsupported traversal operation/);
      return true;
    },
  );
});

test("category catalog transport failure is blocked", async () => {
  const fake = fakeFigma();
  fake.api.annotations.getAnnotationCategoriesAsync = async () => {
    throw new Error("Plugin bridge disconnected");
  };

  await assert.rejects(
    observeRegisteredFile({
      figma: fake.api,
      file: {
        fileKey,
        fileUrl: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026`,
        registrations: [{ nodeId: "1:1", kind: "audit", path: "audit.json" }],
        trackedNodeIds: [],
      },
    }),
    (error) => {
      assert.ok(error instanceof FigmaObservationUnavailableError);
      assert.equal(error.blockers[0].kind, "category-catalog-unreadable");
      assert.match(error.blockers[0].reason, /Plugin bridge disconnected/);
      return true;
    },
  );
});
