import { afterEach, describe, expect, it, vi } from "vitest";
import { advanceMain, compareFiles, readFileAt } from "../src/github.ts";

/** The three calls on the code host. Every one of them is mocked here: a test
 * in this package reaches no network. */

const REPO = {
  repo: "9gag/grade10-spec",
  token: "the-relay's-code-host-token",
};

interface Call {
  url: string;
  init?: RequestInit;
}

function answer(calls: Call[], status: number, body: unknown) {
  vi.stubGlobal("fetch", async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return new Response(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status,
      },
    );
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the compare", () => {
  it("answers the changed paths and their patches", async () => {
    const calls: Call[] = [];
    answer(calls, 200, {
      files: [
        { filename: "openspec/changes/c/proposal.md", patch: "@@ -1 +1 @@" },
        { filename: "docs/prds/products/shared/planning/agent-rounds.md" },
      ],
    });
    expect(await compareFiles(REPO, "main", "abc123")).toEqual([
      { path: "openspec/changes/c/proposal.md", patch: "@@ -1 +1 @@" },
      { path: "docs/prds/products/shared/planning/agent-rounds.md", patch: "" },
    ]);
    expect(calls[0].url).toBe(
      "https://api.github.com/repos/9gag/grade10-spec/compare/main...abc123",
    );
  });

  it("stops on an answer the host refused", async () => {
    answer([], 404, { message: "Not Found" });
    await expect(compareFiles(REPO, "main", "abc123")).rejects.toThrow(
      "compare: 404",
    );
  });
});

describe("one file at a sha", () => {
  it("decodes the base64 the contents API wraps in newlines", async () => {
    const calls: Call[] = [];
    const content = btoa("handles:\n  ecchochan:\n    slack: U0PM\n");
    answer(calls, 200, {
      content: `${content.slice(0, 20)}\n${content.slice(20)}\n`,
      encoding: "base64",
    });
    expect(await readFileAt(REPO, "docs/prds/team.yaml", "abc123")).toBe(
      "handles:\n  ecchochan:\n    slack: U0PM\n",
    );
    expect(calls[0].url).toBe(
      "https://api.github.com/repos/9gag/grade10-spec/contents/docs/prds/team.yaml?ref=abc123",
    );
  });
});

describe("the fast-forward", () => {
  it("moves main with force false", async () => {
    const calls: Call[] = [];
    answer(calls, 200, { object: { sha: "abc123" } });
    expect(await advanceMain(REPO, "abc123")).toEqual({ landed: "abc123" });
    expect(calls[0].url).toBe(
      "https://api.github.com/repos/9gag/grade10-spec/git/refs/heads/main",
    );
    expect(calls[0].init?.method).toBe("PATCH");
    expect(JSON.parse(String(calls[0].init?.body))).toEqual({
      sha: "abc123",
      force: false,
    });
  });

  it("reads a 422 as a move that is not a fast-forward", async () => {
    answer([], 422, { message: "Update is not a fast forward" });
    expect(await advanceMain(REPO, "abc123")).toEqual({
      reason: "not-fast-forward",
    });
  });

  it("stops on any other refusal", async () => {
    answer([], 403, { message: "Resource not accessible" });
    await expect(advanceMain(REPO, "abc123")).rejects.toThrow(
      "advance main: 403",
    );
  });
});
