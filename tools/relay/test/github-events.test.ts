import { describe, expect, it } from "vitest";
import {
  parseGithubEvent,
  signGithubEvent,
  verifyGithubSignature,
} from "../src/github-events.ts";

/** The code host's side: the signature over the body as it arrived, the push
 * read down to one move, and the deliveries that tell nobody. */

const REPO = "9gag/grade10-spec";
const SHA = "d6fde92930d4715a2b49857d24b940956b26d2d3";

// The code host's own published vector: HMAC-SHA256 of the body below under the
// secret below, computed away from this code.
const SECRET = "It's a Secret to Everybody";
const BODY = "Hello, World!";
const SIGNATURE =
  "sha256=757107ea0eb2509fc211221cce984b8a37570b6d7586c22c46f4379c8b043e17";

/** A push of `main`, with whatever this test changes of it. */
function push(over: Record<string, unknown> = {}): unknown {
  return {
    ref: "refs/heads/main",
    after: SHA,
    repository: { full_name: REPO },
    head_commit: {
      id: SHA,
      timestamp: "2026-09-20T14:02:11+08:00",
      message: "docs(planning): the live line\n\nThe body a page never shows.",
    },
    ...over,
  };
}

describe("the signature", () => {
  it("accepts the code host's own vector", async () => {
    expect(
      await verifyGithubSignature(SECRET, {
        signature: SIGNATURE,
        body: BODY,
      }),
    ).toBe(true);
  });

  it("signs what it verifies", async () => {
    expect(await signGithubEvent(SECRET, BODY)).toBe(SIGNATURE);
  });

  it("refuses a body that changed under the signature", async () => {
    expect(
      await verifyGithubSignature(SECRET, {
        signature: SIGNATURE,
        body: `${BODY} `,
      }),
    ).toBe(false);
  });

  it("refuses another secret's signature", async () => {
    expect(
      await verifyGithubSignature("another-secret", {
        signature: SIGNATURE,
        body: BODY,
      }),
    ).toBe(false);
  });

  it("refuses a delivery that carries no signature, and one of another kind", async () => {
    for (const signature of [
      null,
      "",
      SIGNATURE.slice("sha256=".length),
      `sha1=${SIGNATURE.slice("sha256=".length)}`,
      "sha256=not-hex-at-all",
    ]) {
      expect(
        await verifyGithubSignature(SECRET, { signature, body: BODY }),
      ).toBe(false);
    }
  });
});

describe("the delivery", () => {
  it("answers the ping the code host sends when the webhook is saved", () => {
    expect(
      parseGithubEvent("ping", { zen: "Keep it logically awesome." }, REPO),
    ).toEqual({ kind: "ping" });
  });

  it("ignores an event the webhook did not ask for", () => {
    expect(parseGithubEvent("issues", {}, REPO)).toEqual({
      kind: "ignored",
      why: "not-a-push",
    });
    expect(parseGithubEvent(null, push(), REPO)).toEqual({
      kind: "ignored",
      why: "not-a-push",
    });
  });

  it("reads a push of `main` as the commit, its time and its subject", () => {
    expect(parseGithubEvent("push", push(), REPO)).toEqual({
      kind: "moved",
      head: {
        main: SHA,
        at: "2026-09-20T14:02:11+08:00",
        subject: "docs(planning): the live line",
      },
    });
  });

  it("ignores a push of another branch", () => {
    for (const ref of [
      "refs/heads/claude/tell-open-pages-main-moved",
      "refs/tags/v1",
      "",
    ]) {
      expect(parseGithubEvent("push", push({ ref }), REPO)).toEqual({
        kind: "ignored",
        why: "another-branch",
      });
    }
  });

  it("ignores a push from another repository", () => {
    expect(
      parseGithubEvent(
        "push",
        push({ repository: { full_name: "9gag/grade10" } }),
        REPO,
      ),
    ).toEqual({ kind: "ignored", why: "another-repository" });
    expect(parseGithubEvent("push", push({ repository: {} }), REPO)).toEqual({
      kind: "ignored",
      why: "another-repository",
    });
  });

  it("reads the store's name whatever case either side is written in", () => {
    // The code host's names are case-insensitive and `REPO` is typed into
    // `wrangler.jsonc` by hand, so a fold on one side alone drops every push.
    expect(
      parseGithubEvent(
        "push",
        push({ repository: { full_name: "9GAG/Grade10-Spec" } }),
        REPO,
      ).kind,
    ).toBe("moved");
    expect(parseGithubEvent("push", push(), "9GAG/Grade10-Spec").kind).toBe(
      "moved",
    );
  });

  it("ignores a push whose commit names no time", () => {
    // A page says how long ago the commit landed, and a commit with no
    // timestamp answers that with nothing: it is the same refusal as a push
    // with no commit at all.
    for (const timestamp of [undefined, "", "   "]) {
      expect(
        parseGithubEvent(
          "push",
          push({
            head_commit: { timestamp, message: "docs(planning): a line" },
          }),
          REPO,
        ),
      ).toEqual({ kind: "ignored", why: "no-commit" });
    }
  });

  it("reads a commit with no message as its short sha", () => {
    // A commit written with no message still moved `main`, so the page shows
    // the sha it can read back to the commit rather than an empty line.
    expect(
      parseGithubEvent(
        "push",
        push({
          head_commit: { timestamp: "2026-09-20T14:02:11+08:00", message: "" },
        }),
        REPO,
      ),
    ).toEqual({
      kind: "moved",
      head: {
        main: SHA,
        at: "2026-09-20T14:02:11+08:00",
        subject: SHA.slice(0, 7),
      },
    });
  });

  it("ignores a push that names no commit", () => {
    // A branch deleted carries no head commit, and a sha that is not one is a
    // head no page could compare its snapshot with.
    expect(parseGithubEvent("push", push({ head_commit: null }), REPO)).toEqual(
      {
        kind: "ignored",
        why: "no-commit",
      },
    );
    for (const after of ["", "0000000000000000000000000000000000000000z"]) {
      expect(parseGithubEvent("push", push({ after }), REPO)).toEqual({
        kind: "ignored",
        why: "no-commit",
      });
    }
  });
});
