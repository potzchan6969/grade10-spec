import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  acceptanceCommand,
  buildReconciliationPlan,
  buildReconciliationReport,
  buildReport,
  findExactAssociations,
  loadActiveChanges,
  renderReport,
  scopedCommitPlan,
  selectFindings,
  validateDecisionCollection,
  verifyReconciliation,
} from "./annotation-report.mjs";
import { runCli as runReportCli } from "./annotation-report-cli.mjs";

test("reconciliation report preserves the scanner scope and digests", () => {
  const report = buildReconciliationReport({
    scanner: {
      schemaVersion: 2,
      scope: "spec",
      status: "clean",
      blockers: [],
      findings: [],
      observationDigest: "sha256:observation",
      baselineDigest: "sha256:baseline",
      observationSchemaVersion: 2,
    },
    currentHandle: "kinisworking",
  });

  assert.equal(report.scope, "spec");
  assert.equal(report.observationDigest, "sha256:observation");
  assert.equal(report.baselineDigest, "sha256:baseline");
  assert.equal(report.observationSchemaVersion, 2);
});

const fileKey = "ABCDEFGHIJKLMNOPQRSTUV";
const finding = {
  id: "1234567890abcdef",
  fileKey,
  nodeId: "2:1",
  nodeLink: `https://www.figma.com/design/${fileKey}/Grade10-DS-2026?node-id=2-1`,
  nodeName: "Button / default",
  kind: "changed",
  previousText: "Old annotation",
  currentText: "New annotation",
  registeredSources: [
    {
      kind: "code-connect",
      path: "packages/design-system/src/components/forms/button.figma.ts",
      component: "Button",
      fileKey,
      nodeId: "1:1",
    },
  ],
  associations: null,
  associationEvidence: [],
  classification: "untracked",
};

const scanner = {
  schemaVersion: 2,
  status: "drift",
  scannedSources: [],
  blockers: [],
  findings: [finding],
};

function change({
  id,
  author = "@someone",
  nodeIds = ["2:1"],
  owner = null,
} = {}) {
  return {
    id,
    proposalAuthor: author,
    artifacts: [
      {
        path: "specs/shared/design-sync/annotation-monitoring/spec.md",
        references: nodeIds.map((nodeId) => ({ fileKey, nodeId })),
      },
    ],
    taskGroups: [{ number: "1", title: "Monitor annotations", owner }],
  };
}

test("Matching task group belongs to the current user", () => {
  const report = buildReport({
    scanner,
    currentHandle: "@Kin",
    changes: [change({ id: "change-a", owner: "@kin" })],
    findingAssociations: {
      [finding.id]: [
        { changeId: "change-a", taskGroup: "1", evidence: "reviewed baseline" },
      ],
    },
  });

  assert.equal(report.groups["My assigned work"].length, 1);
  assert.equal(report.groups["Owned by others"].count, 0);
  assert.equal(
    report.groups["My assigned work"][0].ownershipGroup,
    "My assigned work",
  );
});

test("Proposal authorship does not override another owner", () => {
  const report = buildReport({
    scanner,
    currentHandle: "@kin",
    changes: [change({ id: "change-a", author: "@kin", owner: "@other" })],
    findingAssociations: {
      [finding.id]: [
        {
          changeId: "change-a",
          taskGroup: "1",
          evidence: "active node reference",
        },
      ],
    },
  });

  assert.equal(report.groups["My assigned work"].length, 0);
  assert.equal(report.groups["Owned by others"].count, 1);
  assert.deepEqual(report.groups["Owned by others"].owners, ["other"]);
});

test("groups an authored change when no matching task group is claimed", () => {
  const report = buildReport({
    scanner,
    currentHandle: "@kin",
    changes: [change({ id: "change-a", author: "@kin", owner: null })],
    findingAssociations: {
      [finding.id]: [
        { changeId: "change-a", taskGroup: "1", evidence: "reviewed baseline" },
      ],
    },
  });

  assert.equal(report.groups["Authored by me"].length, 1);
  assert.equal(report.groups["Unassigned or untracked"].length, 0);
});

test("Current identity is unavailable", () => {
  const report = buildReport({
    scanner,
    currentHandle: null,
    changes: [change({ id: "change-a", owner: "@other" })],
    findingAssociations: {
      [finding.id]: [
        {
          changeId: "change-a",
          taskGroup: "1",
          evidence: "active node reference",
        },
      ],
    },
  });

  assert.equal(report.identity.resolved, false);
  assert.equal(report.groups["Unassigned or untracked"].length, 1);
  assert.match(report.identity.note, /could not be determined/i);
});

test("marks multiple exact change matches ambiguous", () => {
  const report = buildReport({
    scanner,
    currentHandle: "@kin",
    changes: [
      change({ id: "change-a", owner: "@kin" }),
      change({ id: "change-b", owner: "@other" }),
    ],
    findingAssociations: {
      [finding.id]: [
        {
          changeId: "change-a",
          taskGroup: "1",
          evidence: "active node reference",
        },
        {
          changeId: "change-b",
          taskGroup: "1",
          evidence: "active node reference",
        },
      ],
    },
  });

  assert.equal(report.groups["Unassigned or untracked"].length, 1);
  assert.equal(
    report.groups["Unassigned or untracked"][0].association.status,
    "ambiguous",
  );
  assert.deepEqual(
    report.groups["Unassigned or untracked"][0].association.changeIds,
    ["change-a", "change-b"],
  );
});

test("keeps independent occurrences on one node in their own ownership groups", () => {
  const findings = [
    {
      ...finding,
      id: "occurrence-a",
      annotationKey: "annotation-a",
      previousCategoryId: "interaction",
      currentCategoryId: "interaction",
      previousPinnedProperties: ["width"],
      currentPinnedProperties: ["width"],
      associations: {
        change: "change-a",
        taskGroup: "1",
      },
    },
    {
      ...finding,
      id: "occurrence-b",
      annotationKey: "annotation-b",
      previousText: "Old visual note",
      currentText: "New visual note",
      previousCategoryId: "visual",
      currentCategoryId: "visual",
      previousPinnedProperties: ["fills"],
      currentPinnedProperties: ["fills"],
      associations: {
        change: "change-b",
        taskGroup: "1",
      },
    },
  ];
  const report = buildReport({
    scanner: { ...scanner, findings },
    currentHandle: "@kin",
    changes: [
      change({ id: "change-a", nodeIds: [], owner: "@kin" }),
      change({ id: "change-b", nodeIds: [], owner: "@other" }),
    ],
  });

  assert.equal(report.summary.findings, 2);
  assert.equal(report.groups["My assigned work"].length, 1);
  assert.equal(report.groups["Owned by others"].count, 1);
  assert.equal(
    report.groups["My assigned work"][0].annotationKey,
    "annotation-a",
  );
  assert.equal(
    report.groups["Owned by others"].findings[0].annotationKey,
    "annotation-b",
  );
});

test("keeps unpairable occurrence ownership ambiguous even with candidate associations", () => {
  const report = buildReport({
    scanner: {
      ...scanner,
      findings: [
        {
          ...finding,
          id: "ambiguous-occurrence",
          annotationKey: null,
          ambiguity: {
            kind: "duplicate-count-decrease",
            reason: "the removed duplicate cannot be identified",
          },
          candidateAnnotationKeys: ["annotation-a", "annotation-b"],
          associationCandidates: [
            {
              annotationKey: "annotation-a",
              associations: { change: "change-a", taskGroup: "1" },
            },
            {
              annotationKey: "annotation-b",
              associations: { change: "change-b", taskGroup: "1" },
            },
          ],
          associations: null,
        },
      ],
    },
    currentHandle: "@kin",
    changes: [
      change({ id: "change-a", nodeIds: [], owner: "@kin" }),
      change({ id: "change-b", nodeIds: [], owner: "@other" }),
    ],
  });

  const item = report.groups["Unassigned or untracked"][0];
  assert.equal(item.association.status, "ambiguous");
  assert.deepEqual(item.association.changeIds, ["change-a", "change-b"]);
  assert.deepEqual(item.candidateAnnotationKeys, [
    "annotation-a",
    "annotation-b",
  ]);
});

test("Similar prose is the only lead", () => {
  const report = buildReport({
    scanner,
    currentHandle: "@kin",
    changes: [change({ id: "change-a", owner: "@kin" })],
    findingAssociations: { [finding.id]: [] },
  });

  assert.equal(report.groups["Unassigned or untracked"].length, 1);
  assert.equal(
    report.groups["Unassigned or untracked"][0].association.status,
    "none",
  );
  assert.equal(
    report.groups["Unassigned or untracked"][0].association.changeIds.length,
    0,
  );
});

test("keeps registered component evidence exact without inventing an OpenSpec owner", () => {
  const report = buildReport({ scanner, currentHandle: "@kin", changes: [] });

  assert.equal(report.groups["Unassigned or untracked"].length, 1);
  assert.equal(
    report.groups["Unassigned or untracked"][0].association.status,
    "exact",
  );
  assert.equal(
    report.groups["Unassigned or untracked"][0].association.matches[0].kind,
    "registered-component",
  );
});

test("retains a reviewed baseline capability without inventing an active change", () => {
  const report = buildReport({
    scanner: {
      ...scanner,
      findings: [
        {
          ...finding,
          registeredSources: [],
          associations: {
            capability: "shared-ui/design-sync",
            taskGroup: "1",
          },
        },
      ],
    },
    currentHandle: "@kin",
    changes: [],
  });

  const item = report.groups["Unassigned or untracked"][0];
  assert.equal(item.association.status, "exact");
  assert.equal(item.association.matches[0].kind, "reviewed-baseline");
  assert.match(item.association.evidence[0], /shared-ui\/design-sync/);
});

test("Exact active change reference is found", async () => {
  const root = await mkdtemp(join(tmpdir(), "figma-annotation-monitor-"));
  try {
    const changeRoot = join(root, "openspec", "changes", "change-a");
    await mkdir(join(changeRoot, "specs"), { recursive: true });
    await writeFile(
      join(changeRoot, "proposal.md"),
      "**Author:** @kin\n\n# Change\n",
    );
    await writeFile(
      join(changeRoot, "tasks.md"),
      "## 1. Review annotation (owner: @other)\n\n- [ ] 1.1 Review\n",
    );
    await writeFile(
      join(changeRoot, "specs", "design.md"),
      `See https://www.figma.com/design/${fileKey}/Grade10-DS?node-id=2-1.\nAlso see https://www.figma.com/design/BASEKEY/branch/BRANCHKEY/Grade10-DS?node-id=3-4.\n`,
    );

    const changes = await loadActiveChanges(root);
    const designArtifact = changes[0].artifacts.find((artifact) =>
      artifact.path.endsWith("specs/design.md"),
    );
    assert.deepEqual(designArtifact.references, [
      { fileKey, nodeId: "2:1" },
      { fileKey: "BRANCHKEY", nodeId: "3:4" },
    ]);
    const matches = findExactAssociations(finding, changes);

    assert.deepEqual(matches, [
      {
        changeId: null,
        taskGroup: null,
        artifact: "packages/design-system/src/components/forms/button.figma.ts",
        node: { fileKey, nodeId: "1:1" },
        kind: "registered-component",
        evidence:
          "registered component Button covers exact Figma node ABCDEFGHIJKLMNOPQRSTUV:2:1",
      },
      {
        changeId: "change-a",
        taskGroup: null,
        artifact: "openspec/changes/change-a/specs/design.md",
        node: { fileKey, nodeId: "2:1" },
        kind: "openspec-artifact",
        evidence:
          "openspec/changes/change-a/specs/design.md references exact Figma node ABCDEFGHIJKLMNOPQRSTUV:2:1",
      },
    ]);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("No tracked annotations changed", () => {
  assert.equal(
    renderReport({
      status: "clean",
      summary: { findings: 0, blockers: 0 },
    }),
    "✓ No tracked annotations changed.",
  );
});

test("Skipped registered roots are reported at the end", () => {
  const report = buildReport({
    scanner: {
      ...scanner,
      status: "clean",
      findings: [],
      skippedRoots: [
        {
          fileKey,
          nodeId: "9:9",
          name: "FilterChip",
          source: {
            kind: "code-connect",
            path: "packages/design-system/src/components/forms/filter-chip.figma.ts",
            component: "FilterChip",
          },
          reason: "registered root could not be resolved",
        },
      ],
    },
    currentHandle: "@kin",
    changes: [],
  });
  const summary = renderReport(report);
  assert.match(summary, /No tracked annotations changed/);
  assert.match(summary, /## Skipped registered roots/);
  assert.match(summary, /FilterChip — ABCDEFGHIJKLMNOPQRSTUV:9:9/);
  assert.match(
    summary,
    /packages\/design-system\/src\/components\/forms\/filter-chip\.figma\.ts/,
  );
  assert.match(summary, /registered root could not be resolved/);
  const skippedIndex = summary.indexOf("## Skipped registered roots");
  const assignedIndex = summary.indexOf("## My assigned work");
  assert.ok(skippedIndex > assignedIndex);
});

test("Actionable findings are reported", () => {
  const report = buildReport({
    scanner,
    currentHandle: "@kin",
    changes: [change({ id: "change-a", owner: "@other" })],
    findingAssociations: {
      [finding.id]: [
        { changeId: "change-a", taskGroup: "1", evidence: "exact node" },
      ],
    },
  });

  const summary = renderReport(report);
  assert.match(summary, /Owned by others/);
  assert.match(summary, /@other/);
  assert.match(summary, /change change-a/);
  assert.match(summary, /1234567890abcdef/);
  assert.match(summary, /\*\*Category:\*\*/);
  assert.match(summary, /Registered roots/);
  assert.match(summary, /Ancestors/);
  assert.match(summary, /\*\*Previous annotation\*\*/);
  assert.match(summary, /\*\*Current annotation\*\*/);
  assert.match(summary, /Pinned properties/);
  assert.match(summary, /exact node/);
  assert.match(summary, /\*\*Next:\*\*/);
});

test("Human report includes complete annotation bodies", () => {
  const currentText = [
    "**Close-on-select**",
    "Configurable per item type:",
    "1. Regular action items → menu closes on click",
    '2. Nested items keep the quoted phrase "stay open"',
  ].join("\n");
  const report = buildReport({
    scanner: {
      ...scanner,
      findings: [
        {
          ...finding,
          kind: "added",
          nodeName: "Dropdown Menu",
          previousText: null,
          currentText,
          previousCategoryId: null,
          previousCategoryLabel: null,
          currentCategoryId: "86:1",
          currentCategoryLabel: "Interaction",
        },
      ],
    },
    currentHandle: "@kin",
    changes: [],
  });

  const summary = renderReport(report);
  assert.equal(summary.includes("### Dropdown Menu"), true);
  assert.equal(
    summary.includes("**Category:** Uncategorized (none) → Interaction (86:1)"),
    true,
  );
  assert.equal(summary.includes("**Previous annotation**"), true);
  assert.equal(summary.includes("_(none)_"), true);
  assert.equal(summary.includes("**Current annotation**"), true);
  assert.equal(
    summary.includes(
      [
        "```text",
        "**Close-on-select**",
        "Configurable per item type:",
        "1. Regular action items → menu closes on click",
        '2. Nested items keep the quoted phrase "stay open"',
        "```",
      ].join("\n"),
    ),
    true,
  );
  assert.equal(summary.includes("\\nConfigurable per item type:"), false);
});

test("Human report is structured for reading", () => {
  const report = buildReport({
    scanner: {
      ...scanner,
      findings: [
        {
          ...finding,
          id: "finding-one",
          nodeName: "Primary Button",
          previousText: "Old note",
          currentText: "Note with ``` fences inside",
        },
        {
          ...finding,
          id: "finding-two",
          nodeName: "Secondary Button",
          previousText: null,
          currentText: "New note",
        },
      ],
    },
    currentHandle: "@kin",
    changes: [],
  });

  const summary = renderReport(report);
  assert.equal(summary.includes("### Primary Button"), true);
  assert.equal(summary.includes("### Secondary Button"), true);
  assert.equal(summary.includes("`finding-one` · changed"), true);
  assert.equal(summary.includes("[Open in Figma]("), true);
  const firstFence = summary.indexOf(
    "````text\nNote with ``` fences inside\n````",
  );
  assert.equal(firstFence !== -1, true);
  assert.equal(summary.trimStart().startsWith("```"), false);
  const firstHeading = summary.indexOf("### Primary Button");
  const secondHeading = summary.indexOf("### Secondary Button");
  assert.equal(firstHeading !== -1 && secondHeading > firstHeading, true);
});

test("selection and decision preview retain the report scope", () => {
  const report = buildReconciliationReport({
    scope: "spec",
    scanner: {
      ...scanner,
      scope: "spec",
      observationDigest: "sha256:observation",
      baselineDigest: "sha256:baseline",
    },
    currentHandle: "kinisworking",
    changes: [],
  });

  assert.deepEqual(
    selectFindings(report, [finding.id]).map((item) => item.id),
    [finding.id],
  );
  const decisions = {
    observationDigest: "sha256:observation",
    decisions: [
      {
        findingId: finding.id,
        noImpactReason: "Keep this reviewed annotation as traceability.",
      },
    ],
  };
  const preview = buildReconciliationPlan({
    report,
    selectedIds: [finding.id],
    decisions,
    relatedFiles: ["openspec/changes/change-a/proposal.md"],
  });

  assert.equal(preview.scope, "spec");
  assert.equal(
    validateDecisionCollection(report, [finding.id], decisions).length,
    1,
  );
});

test("verification and acceptance command preserve scoped safety", () => {
  assert.deepEqual(
    verifyReconciliation({
      before: { status: "drift", findings: [{ id: finding.id }], blockers: [] },
      after: { status: "clean", findings: [], blockers: [] },
      acceptedIds: [finding.id],
    }),
    { status: "clean", remainingIds: [], blockers: [] },
  );

  assert.deepEqual(
    acceptanceCommand({
      storeRoot: "/tmp/grade10-spec",
      snapshotPath: "/tmp/annotation.json",
      scope: "spec",
      ids: [finding.id],
      decisionsPath: "/tmp/decisions.json",
    }).args,
    [
      "figma:annotations:accept",
      "--scope",
      "spec",
      "--snapshot",
      "/tmp/annotation.json",
      "--ids",
      finding.id,
      "--decisions",
      "/tmp/decisions.json",
    ],
  );
  assert.equal(
    scopedCommitPlan({ confirmed: false }).status,
    "confirmation-required",
  );
});

test("report CLI requires scope and accepts optional identity evidence", async () => {
  const root = await mkdtemp(join(tmpdir(), "grade10-annotation-report-"));
  const scannerPath = join(root, "scanner.json");
  const minePath = join(root, "mine.txt");
  const output = [];
  const originalLog = console.log;
  try {
    await mkdir(join(root, "openspec", "changes"), { recursive: true });
    await writeFile(
      scannerPath,
      `${JSON.stringify(
        {
          schemaVersion: 2,
          scope: "spec",
          status: "clean",
          blockers: [],
          findings: [],
          observationDigest: "sha256:observation",
          baselineDigest: "sha256:baseline",
          observationSchemaVersion: 2,
        },
        null,
        2,
      )}\n`,
    );
    await writeFile(minePath, "@kinisworking\n");
    console.log = (...args) => output.push(args.join(" "));

    assert.equal(
      await runReportCli({
        argv: [
          "--scope",
          "spec",
          "--scanner",
          scannerPath,
          "--store",
          root,
          "--mine",
          minePath,
          "--json",
        ],
      }),
      0,
    );
    const report = JSON.parse(output.at(-1));
    assert.equal(report.scope, "spec");
    assert.equal(report.identity.handle, "kinisworking");

    assert.equal(
      await runReportCli({
        argv: ["--scanner", scannerPath, "--store", root, "--json"],
      }),
      2,
    );
    assert.match(JSON.parse(output.at(-1)).blockers[0].reason, /scope/i);
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});
