import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { cli, main, waitingOnSpecs } from "./validate-changes.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Which changes the CLI is not asked about: the ones that have said what
 * they are waiting for, and nothing else. */

function change(files) {
  const dir = mkdtempSync(join(tmpdir(), "validate-changes-"));
  for (const [name, content] of Object.entries(files)) {
    const file = join(dir, name);
    mkdirSync(join(file, ".."), { recursive: true });
    writeFileSync(file, content);
  }
  return dir;
}

const manifest = (body) =>
  `schema: grade10-planning\ncreated: 2026-09-15\n${body}`;

test("a change waiting on an input is excused, in its author's words", () => {
  const dir = change({
    ".openspec.yaml": manifest(
      "awaiting:\n  specs: the window nobody decided\n",
    ),
  });
  assert.equal(waitingOnSpecs(dir), "the window nobody decided");
});

test("a change that has started its deltas is past the wait", () => {
  const dir = change({
    ".openspec.yaml": manifest(
      "awaiting:\n  specs: the window nobody decided\n",
    ),
    "specs/demo/alpha/spec.md": "## ADDED Requirements\n",
  });
  assert.equal(waitingOnSpecs(dir), undefined);
});

test("a wait on another artifact does not excuse the requirements", () => {
  const dir = change({
    ".openspec.yaml": manifest("awaiting:\n  ui-design: nothing draws it\n"),
  });
  assert.equal(waitingOnSpecs(dir), undefined);
});

test("a wait with no reason is not a wait", () => {
  const dir = change({
    ".openspec.yaml": manifest("awaiting:\n  specs: ''\n"),
  });
  assert.equal(waitingOnSpecs(dir), undefined);
});

test("a change with no manifest, and one the reader refuses, excuse nothing", () => {
  assert.equal(waitingOnSpecs(change({ "proposal.md": "# x\n" })), undefined);
  assert.equal(
    waitingOnSpecs(change({ ".openspec.yaml": "awaiting: [\n" })),
    undefined,
  );
});

/** A store of its own, holding the schemas and one change, so the CLI is run
 * against something this test wrote rather than against the live store. */
function store(changes) {
  const root = mkdtempSync(join(tmpdir(), "validate-store-"));
  cpSync(
    join(ROOT, "openspec", "config.yaml"),
    join(root, "openspec", "config.yaml"),
  );
  cpSync(join(ROOT, "openspec", "schemas"), join(root, "openspec", "schemas"), {
    recursive: true,
  });
  cpSync(join(ROOT, "package.json"), join(root, "package.json"));
  for (const [id, files] of Object.entries(changes)) {
    for (const [name, content] of Object.entries(files)) {
      const file = join(root, "openspec", "changes", id, name);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, content);
    }
  }
  return root;
}

const PROPOSAL =
  "# A change\n\n## Why\n\nBecause.\n\n## What Changes\n\n- one\n";

/** `main` reports through the process's exit code and the console, so a run
 * is one call with both captured and put back. */
function validate(root) {
  const said = [];
  const { log, error } = console;
  const before = process.exitCode;
  console.log = (line) => said.push(String(line));
  console.error = (line) => said.push(String(line));
  process.exitCode = 0;
  try {
    main(root, true);
    return { status: process.exitCode, said: said.join("\n") };
  } finally {
    Object.assign(console, { log, error });
    process.exitCode = before;
  }
}

test("the pinned CLI still opens the no-delta error the script matches on", () => {
  const root = store({
    nothing: {
      "proposal.md": PROPOSAL,
      ".openspec.yaml": "schema: grade10-planning\n",
    },
  });
  const [command, ...lead] = cli(ROOT);
  const run = spawnSync(command, [...lead, "validate", "--changes", "--json"], {
    cwd: root,
    encoding: "utf8",
  });
  const out = run.stdout ?? "";
  const report = JSON.parse(
    out.slice(out.indexOf("{"), out.lastIndexOf("}") + 1),
  );
  const [issue] = report.items[0].issues;
  assert.equal(issue.level, "ERROR");
  assert.ok(
    issue.message.startsWith("Change must have at least one delta."),
    `the CLI reworded the error the excuse matches on: ${issue.message}`,
  );
});

test("a declared wait excuses the missing delta and nothing else", () => {
  const waiting = {
    "proposal.md": PROPOSAL,
    ".openspec.yaml":
      "schema: grade10-planning\nawaiting:\n  specs: nobody has answered\n",
  };
  assert.equal(validate(store({ waiting })).status, 0);

  const alsoBroken = {
    ...waiting,
    ".openspec.yaml":
      "schema: no-such-schema\nskip_specs: true\nawaiting:\n  specs: nobody has answered\n",
  };
  const run = validate(store({ waiting: alsoBroken }));
  assert.equal(run.status, 1, run.said);
  assert.match(run.said, /skip_specs is set but/);
});

test("a change that said nothing is still refused its missing delta", () => {
  const run = validate(
    store({
      silent: {
        "proposal.md": PROPOSAL,
        ".openspec.yaml": "schema: grade10-planning\n",
      },
    }),
  );
  assert.equal(run.status, 1);
  assert.match(run.said, /at least one delta/);
});
