import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { sandbox } from "./fixtures/accept-sandbox.mjs";
import { changeClusters, formatClusters } from "./lib/clusters.mjs";
import { foldChecks } from "./lib/fold-checks.mjs";
import { formatPreflight, preflightChange } from "./lib/preflight.mjs";

const CHANGE = "build-alpha";
const ok = { status: 0, stdout: "", stderr: "" };
const passing = () => ok;
const write = (root, path, content) => {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
};
const rules = (found) => found.map((one) => one.rule);

test("preflight fails on the check:manual overlap that spec:accept would refuse", () => {
  const { root } = sandbox();
  const seen = [];
  const result = preflightChange(root, CHANGE, (args) => {
    seen.push(args.join(" "));
    return args[1] === "check:manual"
      ? {
          status: 1,
          stdout:
            "manual check\n\nFAIL  Requirements two in-flight changes both fold\n      openspec/specs/site/search/spec.md — Search results is folded by build-alpha and build-beta\n\nFAIL  Permanent ids issued twice\n      site-search-US1 — issued by two changes\n\n1 failure\n",
        }
      : ok;
  });
  assert.deepEqual(rules(result.failures), [
    "check:manual/overlap",
    "check:manual/issued",
  ]);
  assert.match(result.failures[0].detail, /build-beta/);
  assert.ok(seen.some((one) => /^run check:manual \S+folded-store-/.test(one)));
  assert.match(formatPreflight([result]), /\[check:manual\/overlap\]/);
});

test("preflight passes a change that every gate accepts", () => {
  const { root } = sandbox();
  const result = preflightChange(root, CHANGE, passing);
  assert.deepEqual(result.failures, []);
  assert.match(formatPreflight([result]), /build-alpha is ready to fold/);
});

function foldedWith(root, outputs) {
  return { root, changeId: CHANGE, outputs: new Map(Object.entries(outputs)) };
}
const suite = (...cases) => `# Suite\n\n## US1\n\n${cases.join("\n\n")}\n`;
const caseOf = (number, title, marker) =>
  `${marker ? `<!-- trace:case id=g.${marker} rev=1 covers=g.SC-1 -->\n` : ""}### site-search-US1-TC${number}-1: ${title}\n\nBody.`;

test("a durable case lost from a folded suite is a failure, a rev bump is not", () => {
  const { root } = sandbox();
  const path = "openspec/specs/site/search/feature-tcs.md";
  write(root, path, suite(caseOf(1, "One", "TC-a"), caseOf(2, "Two", "TC-b")));
  const rev = suite(caseOf(1, "One", "TC-a").replace("TC1-1", "TC1-2"));
  const found = foldChecks(foldedWith(root, { [path]: rev }));
  assert.deepEqual(rules(found), ["fold:lost-case"]);
  assert.match(found[0].detail, /site-search-US1-TC2/);
  const bumped = suite(
    caseOf(1, "One", "TC-a").replace("TC1-1", "TC1-2"),
    caseOf(2, "Two", "TC-b"),
  );
  assert.deepEqual(foldChecks(foldedWith(root, { [path]: bumped })), []);
});

test("a durable case retitled without its trace marker is a failure", () => {
  const { root } = sandbox();
  const path = "openspec/specs/site/search/feature-tcs.md";
  write(root, path, suite(caseOf(1, "One", "TC-a")));
  const found = foldChecks(
    foldedWith(root, { [path]: suite(caseOf(1, "Another", "TC-new")) }),
  );
  assert.deepEqual(rules(found), ["fold:retitled-case"]);
  const carried = suite(caseOf(1, "Another", "TC-a"));
  assert.deepEqual(foldChecks(foldedWith(root, { [path]: carried })), []);
});

test("a durable case with no trace marker retitled is a warning to read", () => {
  const { root } = sandbox();
  const path = "openspec/specs/site/search/feature-tcs.md";
  write(root, path, suite(caseOf(1, "One")));
  const found = foldChecks(
    foldedWith(root, { [path]: suite(caseOf(1, "Another")) }),
  );
  assert.deepEqual(
    found.map((one) => [one.rule, one.level]),
    [["fold:retitled-case", "warn"]],
  );
  assert.deepEqual(
    foldChecks(foldedWith(root, { [path]: suite(caseOf(1, "One")) })),
    [],
  );
});

test("a delta Purpose that replaces the durable Purpose fails; one that extends it warns", () => {
  const { root } = sandbox();
  write(
    root,
    "openspec/specs/site/search/spec.md",
    "# Search\n\n## Purpose\n\nReaders search the catalogue.\n\n## Requirements\n\n### Requirement: Existing\n\nThe system SHALL exist.\n",
  );
  const replaced = preflightChange(root, CHANGE, passing);
  assert.deepEqual(rules(replaced.failures), ["fold:purpose"]);
  assert.match(replaced.failures[0].detail, /replaces the durable Purpose/);

  const delta = join(
    root,
    "openspec/changes/build-alpha/specs/site/search/spec.md",
  );
  writeFileSync(
    delta,
    readFileSync(delta, "utf8").replace(
      "Readers find items.",
      "Readers search the catalogue. They also save searches.",
    ),
  );
  const extended = preflightChange(root, CHANGE, passing);
  assert.deepEqual(extended.failures, []);
  assert.deepEqual(rules(extended.warnings), ["fold:purpose"]);
});

test("several changes print one summary row each and keep their own details", () => {
  const { root } = sandbox();
  const results = [
    preflightChange(root, CHANGE, passing),
    preflightChange(root, "missing-change", passing),
  ];
  const text = formatPreflight(results);
  assert.match(text, /\| build-alpha \| ready \| 0 \| 0 \|/);
  assert.match(text, /\| missing-change \| refused \| 1 \| 0 \|/);
  assert.match(
    text,
    /missing-change would be refused by spec:accept:\n- \[fold\]/,
  );
});

test("clusters group changes that fold one requirement or depend on each other", () => {
  const { root } = sandbox();
  const add = (id, manifest, delta) => {
    write(root, `openspec/changes/${id}/.openspec.yaml`, manifest);
    if (delta)
      write(root, `openspec/changes/${id}/specs/site/search/spec.md`, delta);
  };
  const delta = (kind) =>
    `# Search\n\n## ${kind} Requirements\n\n### Requirement: Search results\n\nThe system SHALL return items.\n\n#### Scenario: site-search-SC-01 - Results\n\n- **WHEN** a reader searches\n- **THEN** items appear\n`;
  add("build-beta", "schema: grade10-planning\n", delta("MODIFIED"));
  add(
    "build-gamma",
    "schema: grade10-planning\ndepends_on:\n  - build-delta\n",
  );
  add("build-delta", "schema: grade10-planning\n");
  add("build-alone", "schema: grade10-planning\n");
  const clusters = changeClusters(root);
  assert.deepEqual(
    clusters.map((one) => one.changes),
    [
      ["build-alpha", "build-beta"],
      ["build-delta", "build-gamma"],
    ],
  );
  assert.deepEqual(
    clusters[0].shared.map((one) => one.requirement),
    ["Search results"],
  );
  assert.deepEqual(clusters[1].dependsOn, [
    { change: "build-gamma", on: ["build-delta"] },
  ]);
  assert.match(
    formatClusters(clusters),
    /Cluster 1: build-alpha -> build-beta\n {2}shared: site\/search \/ Search results \(build-alpha ADDED, build-beta MODIFIED\)/,
  );
});

test("a depends_on cycle is reported beside the cluster's order", () => {
  const { root } = sandbox();
  for (const [id, on] of [
    ["build-one", "build-two"],
    ["build-two", "build-one"],
  ])
    write(
      root,
      `openspec/changes/${id}/.openspec.yaml`,
      `schema: grade10-planning\ndepends_on:\n  - ${on}\n`,
    );
  const [cluster] = changeClusters(root).filter((one) =>
    one.changes.includes("build-one"),
  );
  assert.deepEqual(cluster.changes, ["build-two", "build-one"]);
  assert.deepEqual(cluster.cycles, [["build-one", "build-two", "build-one"]]);
  assert.match(
    formatClusters([cluster]),
    /cycle: build-one -> build-two -> build-one; this order is arbitrary/,
  );
});
