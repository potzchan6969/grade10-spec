/*
 * The sent keys, read once: the file that makes a push send nothing twice.
 *
 * `readSentKeys` is the file's only reader, and both senders — the push
 * workflow's `changed-changes.mjs --stages` and `digest.mjs` — hold every key
 * against what it answers. So the two answers it may give are asserted here:
 * a file that is not there yet is nothing sent, which is what the first run of
 * a push reads, and a path it cannot open stops the run and names the file,
 * because reading that as nothing sent would post every message again.
 */
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { deliver, readSentKeys } from "./lib/notify.mjs";

test("shared-planning-change-stages-SC-77 - a sent-keys path that cannot be read stops the run", () => {
  const dir = mkdtempSync(join(tmpdir(), "sent-keys-"));

  assert.throws(
    () => readSentKeys(dir),
    (error) => {
      assert.match(error.message, /cannot be read/);
      assert.ok(
        error.message.includes(dir),
        `the refusal names the path it could not read: ${error.message}`,
      );
      return true;
    },
  );
});

test("a sent-keys file that is not there yet is nothing sent", () => {
  const dir = mkdtempSync(join(tmpdir(), "sent-keys-"));

  assert.deepEqual(readSentKeys(join(dir, "notify-sent.txt")), new Set());
});

test("shared-planning-change-stages-SC-77 - a sender that cannot read its sent keys sends nothing", async () => {
  // The refusal reaches the sender before anything goes out: a message due
  // for the push, the keys unreadable, and the send is never made.
  const dir = mkdtempSync(join(tmpdir(), "sent-keys-"));
  let posted = 0;
  const due = [
    { to: "member", channel: "U1", key: "probe:planned:dev", text: "Yours" },
  ];

  await assert.rejects(
    deliver(due, {
      file: dir,
      send: true,
      token: "xoxb-test",
      fetch: async () => {
        posted += 1;
        throw new Error("the send was made");
      },
    }),
    (error) => {
      assert.match(error.message, /cannot be read/);
      assert.ok(error.message.includes(dir));
      return true;
    },
  );
  assert.equal(posted, 0);
});
