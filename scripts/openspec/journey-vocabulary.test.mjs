/*
 * One word, pinned.
 *
 * This store calls the things in `user-journeys.md` **journeys**. They are
 * written in the user-story shape — `**As a** / **I want** / **so that**` —
 * and that shape is what pulls the other word back in: a rewrite reaches for
 * "story", the next one copies it, and within a few passes the schema says
 * `## ADDED User stories` while all 208 files on disk say journeys. The drift
 * costs nothing to make and everything to find, because both words are right
 * in their own sentence and nothing breaks until a section heading no reader
 * matches quietly stops being read.
 *
 * So the vocabulary is a test rather than a habit.
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const SELF = "scripts/openspec/journey-vocabulary.test.mjs";

/** Split so this file does not fail itself. */
const BANNED = new RegExp(`user\\s+stor(?:y|ies)`, "i");

const TEXT = /\.(md|mts|ts|tsx|mjs|js|yaml|yml|json)$/;

const tracked = () =>
  execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" })
    .split("\n")
    .filter((path) => path !== "" && path !== SELF && TEXT.test(path));

test("nothing in this store calls a journey a user story", () => {
  const found = [];
  for (const path of tracked()) {
    const text = readFileSync(join(ROOT, path), "utf8");
    for (const [at, line] of text.split("\n").entries()) {
      if (BANNED.test(line)) found.push(`${path}:${at + 1}: ${line.trim()}`);
    }
  }
  assert.deepEqual(
    found,
    [],
    `the word is "journey" — these say otherwise:\n${found.join("\n")}`,
  );
});

/** The headings the delta and durable files may carry. A heading outside this
 * set is not a style question: `## Context user journeys` is read by name, and
 * a file that renames it keeps every check quiet while the copy it was meant
 * to hold goes unchecked. */
const HEADINGS = new Set([
  "User journeys",
  "Context user journeys",
  "ADDED User journeys",
  "MODIFIED User journeys",
  "REMOVED User journeys",
  "Retired",
]);

test("every journeys file on disk carries only the headings the checks read", () => {
  const wrong = [];
  for (const path of tracked()) {
    if (!path.endsWith("user-journeys.md")) continue;
    if (path.includes("/archive/")) continue;
    const text = readFileSync(join(ROOT, path), "utf8");
    for (const [at, line] of text.split("\n").entries()) {
      const heading = /^##\s+(.+?)\s*$/.exec(line);
      if (heading && !HEADINGS.has(heading[1])) {
        wrong.push(`${path}:${at + 1}: ## ${heading[1]}`);
      }
    }
  }
  assert.deepEqual(
    wrong,
    [],
    `only ${[...HEADINGS].join(", ")} are read:\n${wrong.join("\n")}`,
  );
});
