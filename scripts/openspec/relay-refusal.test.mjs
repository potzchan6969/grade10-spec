import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { refusalOf } from "./lib/relay.mjs";

/**
 * The relay's refusal, as the hand who said the word reads it
 * (`shared-planning-agent-rounds-SC-73`). The relay answers with the check
 * that refused — `not-the-hand`, `word-not-said` — and a token in a thread
 * tells nobody what to do about it.
 *
 * The last test holds this to the checks the relay actually issues: a check
 * added to `land.ts` with no sentence here would otherwise reach a thread as
 * its own token, and nobody would notice until it did.
 */

const HERE = import.meta.dirname;
const OF = { artifact: "ui-design", change: "demo-change" };

test("names the check in words, with the artifact the word was for", () => {
  assert.equal(
    refusalOf("not-the-hand", OF),
    "the relay refused the landing: the word was not the hand's — `ui-design` waits on its hand's word",
  );
  assert.equal(
    refusalOf("word-not-said", OF),
    "the relay refused the landing: nobody said land in the thread",
  );
  assert.match(
    refusalOf("file-outside-change", OF),
    /outside `demo-change`'s own directory/,
  );
  assert.match(
    refusalOf("unknown-artifact", OF),
    /no artifact called `ui-design`/,
  );
});

test("says the plain word where the call names no artifact or change", () => {
  assert.match(
    refusalOf("not-the-hand"),
    /the artifact waits on its hand's word/,
  );
  assert.match(
    refusalOf("file-outside-change"),
    /outside the change's own directory/,
  );
});

test("prints a token it does not know as it came, and says when there is none", () => {
  assert.equal(
    refusalOf("a-check-nobody-wrote-yet", OF),
    "the relay refused the landing: a-check-nobody-wrote-yet",
  );
  assert.equal(
    refusalOf(undefined, OF),
    "the relay refused the landing: no reason given",
  );
});

test("carries a sentence for every check the relay issues", () => {
  const land = readFileSync(
    join(HERE, "..", "..", "tools", "relay", "src", "land.ts"),
    "utf8",
  );
  const declared = land.slice(
    land.indexOf("export type LandCheck"),
    land.indexOf(";", land.indexOf("export type LandCheck")),
  );
  const checks = [...declared.matchAll(/"([a-z-]+)"/g)].map((one) => one[1]);

  assert.ok(checks.length >= 11, `read only ${checks.length} checks`);
  for (const check of [...checks, "not-fast-forward", "host-refused"]) {
    assert.doesNotMatch(
      refusalOf(check, OF),
      new RegExp(`: ${check}$`),
      `\`${check}\` has no sentence of its own`,
    );
  }
});
