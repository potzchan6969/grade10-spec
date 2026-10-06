/*
 * The readers check refuses two things, and nothing proved either.
 *
 * `scripts/agent-platform/check-agent-readers.mjs` is what `agent:check-parity`
 * runs over the schema's `perspectives:` blocks. It reads the schema through
 * `lib/perspectives.mjs`, so its cases live beside that module's and run with
 * `pnpm run test:openspec`.
 *
 * Both cases are a store of their own: the real schema resolves every reader
 * it names, which is exactly why neither refusal was ever taken. The model
 * each reader runs on is the third: `opus` where a task group's or the tech
 * design's round dispatches it, `sonnet` everywhere else.
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHECK = join(HERE, "..", "agent-platform", "check-agent-readers.mjs");
const SCHEMA = "openspec/schemas/grade10-planning/schema.yaml";

/** A store holding one schema and whatever reader files the case writes, each
 * running on the model the case names: `sonnet` unless it says otherwise. */
const fixture = (schema, readers = [], models = {}) => {
  const root = mkdtempSync(join(tmpdir(), "agent-readers-"));
  const write = (rel, text) => {
    const path = join(root, rel);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  };
  write(SCHEMA, schema);
  for (const reader of readers)
    write(
      reader,
      `---\nname: reader\nmodel: ${models[reader] ?? "sonnet"}\n---\n\n# a reader\n`,
    );
  return root;
};

const run = (root) => {
  try {
    return {
      code: 0,
      said: execFileSync(process.execPath, [CHECK, "--root", root], {
        encoding: "utf8",
        stdio: "pipe",
      }),
    };
  } catch (error) {
    return {
      code: error.status,
      said: `${error.stdout ?? ""}${error.stderr ?? ""}`,
    };
  }
};

const WITH_READER = [
  "name: grade10-planning",
  "artifacts:",
  "  - id: proposal",
  "    generates: proposal.md",
  "    perspectives:",
  "      - name: simpler",
  "        when: always",
  "        agent: .claude/agents/simpler.md",
  "",
].join("\n");

test("refuses a schema that declares no perspectives", () => {
  const root = fixture(
    ["name: grade10-planning", "artifacts: []", ""].join("\n"),
  );

  const { code, said } = run(root);

  assert.equal(code, 1);
  assert.match(said, /declares no perspectives/);
});

test("refuses an `agent` path that resolves to nothing", () => {
  const root = fixture(WITH_READER);

  const { code, said } = run(root);

  assert.equal(code, 1);
  assert.match(
    said,
    /\.claude\/agents\/simpler\.md, which resolves to nothing/,
  );
});

test("passes a schema whose every reader resolves", () => {
  const root = fixture(WITH_READER, [".claude/agents/simpler.md"]);

  const { code, said } = run(root);

  assert.equal(code, 0);
  assert.match(said, /\[PASS\].*\.claude\/agents\/simpler\.md resolves/);
});

/** A schema whose task groups' round dispatches the reader of words. */
const ON_A_GROUP = [
  "name: grade10-planning",
  "artifacts:",
  "  - id: proposal",
  "    generates: proposal.md",
  "    perspectives:",
  "      - name: product",
  "        when: [surface]",
  "        agent: .claude/agents/product.md",
  "apply:",
  "  perspectives:",
  "    - name: reader",
  "      when: [copy]",
  "      agent: .claude/agents/reader.md",
  "",
].join("\n");

test("refuses a reader a task group's round dispatches that runs on sonnet", () => {
  const root = fixture(ON_A_GROUP, [
    ".claude/agents/product.md",
    ".claude/agents/reader.md",
  ]);

  const { code, said } = run(root);

  assert.equal(code, 1);
  assert.match(said, /\.claude\/agents\/reader\.md runs on sonnet[^\n]*opus/);
});

test("refuses a reader no task group's or tech design's round dispatches that runs on opus", () => {
  const root = fixture(
    ON_A_GROUP,
    [".claude/agents/product.md", ".claude/agents/reader.md"],
    {
      ".claude/agents/product.md": "opus",
      ".claude/agents/reader.md": "opus",
    },
  );

  const { code, said } = run(root);

  assert.equal(code, 1);
  assert.match(said, /\.claude\/agents\/product\.md runs on opus[^\n]*sonnet/);
});

test("passes readers on the model their rounds call for", () => {
  const root = fixture(
    ON_A_GROUP,
    [".claude/agents/product.md", ".claude/agents/reader.md"],
    { ".claude/agents/reader.md": "opus" },
  );

  const { code, said } = run(root);

  assert.equal(code, 0, said);
  assert.match(said, /\[PASS\].*\.claude\/agents\/reader\.md runs on opus/);
});
