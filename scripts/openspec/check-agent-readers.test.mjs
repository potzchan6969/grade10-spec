/*
 * The readers check refuses three things, and the real schema takes none.
 *
 * `scripts/agent-platform/check-agent-readers.mjs` is what `agent:check-parity`
 * runs over the schema's `bug:` block. It reads the schema through
 * `lib/perspectives.mjs`, so its cases live beside that module's and run with
 * `pnpm run test:openspec`. Each case is a store of its own: no readers, a
 * reader that resolves to nothing, and a reader that names no model.
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
 * running on the model the case names: `sonnet` unless it says otherwise, and
 * none where it says `null`. */
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
      models[reader] === null
        ? "---\nname: reader\n---\n\n# a reader\n"
        : `---\nname: reader\nmodel: ${models[reader] ?? "sonnet"}\n---\n\n# a reader\n`,
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
  "bug:",
  "  diagnosis:",
  "    perspectives:",
  "      - name: simpler",
  "        when: [always]",
  "        agent: .claude/agents/simpler.md",
  "  fix:",
  "    perspectives:",
  "      - name: simpler",
  "        when: [always]",
  "        agent: .claude/agents/simpler.md",
  "",
].join("\n");

test("refuses a schema that declares no bug readers", () => {
  const root = fixture(
    [
      "name: grade10-planning",
      "artifacts:",
      "  - id: proposal",
      "    generates: proposal.md",
      "",
    ].join("\n"),
  );

  const { code, said } = run(root);

  assert.equal(code, 1);
  assert.match(said, /declares no bug readers/);
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

test("refuses a reader that names no model", () => {
  const root = fixture(WITH_READER, [".claude/agents/simpler.md"], {
    ".claude/agents/simpler.md": null,
  });

  const { code, said } = run(root);

  assert.equal(code, 1);
  assert.match(said, /\.claude\/agents\/simpler\.md names no model/);
});

test("passes a schema whose every reader resolves and names its model", () => {
  const root = fixture(WITH_READER, [".claude/agents/simpler.md"], {
    ".claude/agents/simpler.md": "opus",
  });

  const { code, said } = run(root);

  assert.equal(code, 0, said);
  assert.match(said, /\[PASS\].*\.claude\/agents\/simpler\.md resolves/);
  assert.match(said, /\[PASS\].*\.claude\/agents\/simpler\.md runs on opus/);
});
