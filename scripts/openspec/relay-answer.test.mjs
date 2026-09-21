import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { answerOf } from "./lib/relay.mjs";

/**
 * `answerOf`, as the hand who said the word reads it in the run's log
 * (`shared-planning-agent-rounds-SC-73`). The relay answers a refused
 * landing with the check that refused — `not-the-hand`, `word-not-said` —
 * and a token tells nobody what to do about it.
 *
 * `/land` also answers with statuses that are no check refusing: a wake the
 * room stopped running, a room with no change bound, and a code host that
 * could not be reached or would not move `main`. Those take their own
 * opening, because a hand told the landing was refused goes looking for the
 * rule it broke.
 *
 * The last test holds the sentences to the checks the relay actually issues:
 * a check added to `land.ts` with no sentence here would otherwise reach the
 * log as its own token, and nobody would notice until it did.
 */

const HERE = import.meta.dirname;
const OF = { artifact: "ui-design", change: "demo-change" };

test("names the check in words, with the artifact the word was for", () => {
  assert.equal(
    answerOf("not-the-hand", OF),
    "the relay refused the landing: the word was not the hand's — `ui-design` waits on its hand's word",
  );
  assert.equal(
    answerOf("word-not-said", OF),
    "the relay refused the landing: nobody said land in the thread",
  );
  assert.match(
    answerOf("file-outside-change", OF),
    /outside `demo-change`'s own directory/,
  );
  assert.match(
    answerOf("unknown-artifact", OF),
    /no artifact called `ui-design`/,
  );
});

test("says the plain word where the call names no artifact or change", () => {
  assert.match(
    answerOf("not-the-hand"),
    /the artifact waits on its hand's word/,
  );
  assert.match(
    answerOf("file-outside-change"),
    /outside the change's own directory/,
  );
});

test("prints a token it does not know as it came, and says when there is none", () => {
  assert.equal(
    answerOf("a-check-nobody-wrote-yet", OF),
    "the relay refused the landing: a-check-nobody-wrote-yet",
  );
  assert.equal(
    answerOf(undefined, OF),
    "the relay refused the landing: no reason given",
  );
});

test("says the relay would not take the landing where no check refused it", () => {
  assert.equal(
    answerOf("stale-wake", OF),
    "the relay would not take the landing: the room is running another wake now",
  );
  assert.equal(
    answerOf("no-change-bound", OF),
    "the relay would not take the landing: no change is bound to the room yet",
  );
  assert.equal(
    answerOf("host-unavailable", OF),
    "the relay would not take the landing: the code host could not be reached",
  );
  assert.equal(
    answerOf("host-refused", OF),
    "the relay would not take the landing: the code host would not move `main`",
  );
  // None of the four is a check, so none of them says refused: a hand told
  // that would go looking for the rule it broke.
  for (const reason of [
    "stale-wake",
    "no-change-bound",
    "host-unavailable",
    "host-refused",
  ]) {
    assert.doesNotMatch(answerOf(reason, OF), /the relay refused the landing/);
  }
});

test("appends the host's own words where the answer carries them", () => {
  assert.equal(
    answerOf("host-unavailable", {
      ...OF,
      message: "compare: 502 bad gateway",
    }),
    "the relay would not take the landing: the code host could not be reached — compare: 502 bad gateway",
  );
  assert.equal(
    answerOf("host-refused", {
      ...OF,
      message: "Reference cannot be updated",
    }),
    "the relay would not take the landing: the code host would not move `main` — Reference cannot be updated",
  );
  // An answer carrying no message says the sentence and stops, with no
  // dangling dash where the host said nothing.
  assert.equal(
    answerOf("host-refused", OF),
    "the relay would not take the landing: the code host would not move `main`",
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
  for (const check of [
    ...checks,
    "host-refused",
    "stale-wake",
    "no-change-bound",
    "host-unavailable",
  ]) {
    assert.doesNotMatch(
      answerOf(check, OF),
      new RegExp(`: ${check}$`),
      `\`${check}\` has no sentence of its own`,
    );
  }
});
