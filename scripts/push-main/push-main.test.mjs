import assert from "node:assert/strict";
import { test } from "node:test";
import { review } from "./hook.mjs";
import { changesOf, classify } from "./paths.mjs";

const ids = (paths) =>
  classify(paths).checks.map((check) => check.change ?? check.id);

test("planning text lands on main and owes the planning checks", () => {
  const paths = [
    "openspec/changes/add-x/proposal.md",
    "docs/prds/products/grade10/x.md",
  ];
  assert.equal(classify(paths).route, "main");
  assert.deepEqual(ids(paths), ["biome", "changes", "test-cases", "manual"]);
});

test("a status-only push validates just the changes it moved", () => {
  const paths = [
    "openspec/changes/add-x/tasks.md",
    "openspec/changes/add-y/rounds.md",
    "openspec/changes/add-y/implementation.json",
  ];
  assert.deepEqual(ids(paths), ["biome", "add-x", "add-y"]);
});

test("an archived change's status file is not a status-only push", () => {
  assert.deepEqual(
    ids(["openspec/changes/archive/2026-10-01-add-x/tasks.md"]),
    ["biome", "changes", "test-cases", "manual"],
  );
});

test("a shared surface goes through a pull request and names itself", () => {
  const paths = [
    "openspec/changes/add-x/proposal.md",
    "packages/ui/src/blocks/a.tsx",
    "AGENTS.md",
  ];
  const { route, shared } = classify(paths);
  assert.equal(route, "pr");
  assert.deepEqual(shared, ["packages/ui/src/blocks/a.tsx", "AGENTS.md"]);
  assert.ok(ids(paths).includes("parity"));
});

test("a durable spec and a schema land differently", () => {
  assert.equal(classify(["openspec/specs/grade10/a/b/spec.md"]).route, "main");
  assert.equal(
    classify(["openspec/schemas/grade10-planning/schema.yaml"]).route,
    "pr",
  );
  assert.equal(classify(["openspec/config.yaml"]).route, "pr");
});

test("anything outside planning text is shared, a new path included", () => {
  for (const path of [
    "README.md",
    "PRODUCT.md",
    ".vscode/settings.json",
    ".gitmodules",
  ]) {
    assert.equal(classify([path]).route, "pr", path);
  }
});

test("every page, reference and governance doc lands on main and owes the planning checks", () => {
  const paths = ["docs/references/a.md", "docs/governance/b.md"];
  assert.equal(classify(paths).route, "main");
  assert.deepEqual(ids(paths), ["biome", "changes", "test-cases", "manual"]);
});

test("changesOf names each active change once", () => {
  assert.deepEqual(
    changesOf([
      "openspec/changes/add-x/tasks.md",
      "openspec/changes/add-x/proposal.md",
      "openspec/changes/archive/2026-10-01-old/tasks.md",
      "docs/a.md",
    ]),
    ["add-x"],
  );
});

const A = "a".repeat(40);
const B = "b".repeat(40);
const ZERO = "0".repeat(40);
const line = (remoteRef, local = B, remote = A) =>
  `refs/heads/x ${local} ${remoteRef} ${remote}`;
const context = (sent, overrides = {}) => ({
  gated: undefined,
  allowShared: false,
  head: B,
  clean: true,
  pathsOf: () => sent,
  ...overrides,
});

test("the hook gates a clean HEAD pushed to main", () => {
  const sent = ["openspec/changes/add-x/proposal.md"];
  assert.deepEqual(review([line("refs/heads/main")], context(sent)), {
    refusals: [],
    paths: sent,
  });
});

test("the hook leaves every other ref alone", () => {
  const result = review(
    [line("refs/heads/feature")],
    context(["packages/ui/a.ts"]),
  );
  assert.deepEqual(result, { refusals: [], paths: [] });
});

test("the hook passes a commit a gated tool already checked", () => {
  const result = review(
    [line("refs/heads/main")],
    context(["packages/ui/a.ts"], { gated: B }),
  );
  assert.deepEqual(result, { refusals: [], paths: [] });
});

test("the hook refuses a shared surface on main unless asked", () => {
  const sent = ["scripts/a.mjs"];
  const refused = review([line("refs/heads/main")], context(sent));
  assert.equal(refused.refusals.length, 1);
  assert.match(refused.refusals[0], /scripts\/a\.mjs/);
  const allowed = review(
    [line("refs/heads/main")],
    context(sent, { allowShared: true }),
  );
  assert.deepEqual(allowed, { refusals: [], paths: sent });
});

test("the hook refuses what the working tree cannot stand for", () => {
  const sent = ["docs/a.md"];
  assert.equal(
    review([line("refs/heads/main")], context(sent, { head: A })).refusals
      .length,
    1,
  );
  assert.equal(
    review([line("refs/heads/main")], context(sent, { clean: false })).refusals
      .length,
    1,
  );
});

test("the hook leaves a deletion, a new main and an unknown tip to the remote", () => {
  const sent = ["docs/a.md"];
  const none = { refusals: [], paths: [] };
  assert.deepEqual(
    review([line("refs/heads/main", ZERO)], context(sent)),
    none,
  );
  assert.deepEqual(
    review([line("refs/heads/main", B, ZERO)], context(sent)),
    none,
  );
  assert.deepEqual(review([line("refs/heads/main")], context(null)), none);
});
