#!/usr/bin/env bash
# Blocks an edit to a generated theme CSS file. Claude Code and Codex both send
# the tool call as JSON on stdin, so one script serves both. Exit 2 stops the
# call and returns the reason to the agent.
set -euo pipefail

exec node -e '
const fs = require("fs");
const path = require("path");

const protectedFiles = [
  "packages/design-system/src/theme.css",
  "packages/design-system/src/themes/grade10.css",
];

const input = JSON.parse(fs.readFileSync(0, "utf8"));
const cwd = input.cwd || process.cwd();
const toolInput = input.tool_input || {};

const targets = new Set();
for (const key of ["file_path", "path"]) {
  if (typeof toolInput[key] === "string") targets.add(toolInput[key]);
}
// apply_patch carries its files inside the patch text.
for (const value of Object.values(toolInput)) {
  if (typeof value !== "string") continue;
  for (const m of value.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$|^\*\*\* Move to: (.+)$/gm)) {
    targets.add((m[1] || m[2]).trim());
  }
}

for (const target of targets) {
  const relative = path.relative(cwd, path.resolve(cwd, target)).split(path.sep).join("/");
  if (!protectedFiles.includes(relative)) continue;

  const reason = `${relative} is generated and must not be edited by hand. Edit packages/design-system/tokens.json or tokens.config.json, then run pnpm run tokens:build.`;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  }));
  process.stderr.write(reason + "\n");
  process.exit(2);
}
'
