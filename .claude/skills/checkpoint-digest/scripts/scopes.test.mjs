import assert from "node:assert/strict";
import { test } from "node:test";
import { fill, inOrder, scopeResolver } from "./scopes.mjs";

const scopes = [
  { id: "grade10-site/vault", group: "Grade10", title: "Vault" },
  { id: "shared/ui", group: "Platform", title: "Shared UI" },
  { id: "platform/shared/money-amounts", group: "Platform", title: "Money" },
  { id: "design-system", group: "Platform", title: "Design system" },
  { id: "work/guides", group: "How we work", title: "Guides" },
  { id: "work/tooling", group: "How we work", title: "Tooling" },
];

test("a path belongs to the manual scope it changes", () => {
  const r = scopeResolver(scopes, [
    "openspec/changes/add-vault/specs/grade10-site/vault/intake/spec.md",
    "openspec/changes/add-vault/proposal.md",
  ]);
  const of = (p) => r.path(p);
  assert.deepEqual(of("docs/prds/products/grade10-site/vault/intake.md"), [
    "grade10-site/vault",
  ]);
  assert.deepEqual(of("openspec/specs/shared/money-amounts/spec.md"), [
    "platform/shared/money-amounts",
  ]);
  assert.deepEqual(of("openspec/changes/add-vault/proposal.md"), [
    "grade10-site/vault",
  ]);
  assert.deepEqual(of("packages/ui/src/blocks/vault-case/index.tsx"), [
    "shared/ui",
  ]);
  assert.deepEqual(of("packages/design-system/tokens.json"), ["design-system"]);
  assert.deepEqual(of("docs/prds/guides/start-here.md"), ["work/guides"]);
  assert.deepEqual(of(".claude/skills/x/SKILL.md"), ["work/tooling"]);
  assert.deepEqual(of("apps/preview/src/x.tsx"), []);
  assert.deepEqual(r.change("add-vault"), ["grade10-site/vault"]);
});

test("fill writes the named scopes in manual order and names the unknown", () => {
  const out = fill(
    {
      changes: [{ scope: "work/tooling" }, { scope: "grade10-site/vault" }, {}],
      followups: [{ scope: "nowhere" }],
    },
    scopes,
  );
  assert.deepEqual(
    out.data.scopes.map((s) => s.id),
    ["grade10-site/vault", "work/tooling"],
  );
  assert.deepEqual(out.unknown, ["nowhere"]);
  assert.deepEqual(inOrder(scopes, ["work/guides", "shared/ui", "shared/ui"]), [
    "shared/ui",
    "work/guides",
  ]);
});

test("every scope of the manual wears an icon the page draws", async () => {
  const { manualScopes } = await import("./scopes.mjs");
  const { readFileSync } = await import("node:fs");
  const template = readFileSync(
    new URL("../../handoff-page/assets/template.html", import.meta.url),
    "utf8",
  );
  const drawn = new Set(
    [...template.matchAll(/^ {6}"([a-z-]+)": \["/gm)].map((m) => m[1]),
  );
  const root = new URL("../../../../", import.meta.url).pathname;
  const scopes = manualScopes(root);
  assert.ok(scopes.length > 20);
  for (const s of scopes)
    assert.ok(
      drawn.has(s.icon),
      `${s.id} wears "${s.icon}", which the page does not draw`,
    );
});

test("the page's icons are what scripts/icons.mjs draws", async () => {
  const { execFileSync } = await import("node:child_process");
  const script = new URL(
    "../../handoff-page/scripts/icons.mjs",
    import.meta.url,
  ).pathname;
  assert.match(
    execFileSync(process.execPath, [script, "--check"], { encoding: "utf8" }),
    /in step/,
  );
});
