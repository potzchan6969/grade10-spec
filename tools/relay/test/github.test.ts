import { afterEach, describe, expect, it, vi } from "vitest";
import {
  advanceMain,
  COMPARE_MAX,
  compareFiles,
  HostError,
  readFileAt,
} from "../src/github.ts";

/** The three calls on the code host. Every one of them is mocked here: a test
 * in this package reaches no network. Each call is asserted on its method, its
 * headers and its body, because the host refuses a request that is missing any
 * of them and a test that only reads the answer would not notice. */

const REPO = {
  repo: "9gag/grade10-spec",
  token: "the-relay's-code-host-token",
};

const HEADERS = {
  authorization: `Bearer ${REPO.token}`,
  accept: "application/vnd.github+json",
  "x-github-api-version": "2022-11-28",
  "user-agent": "grade10-relay",
};

interface Call {
  url: string;
  init?: RequestInit;
}

function answer(calls: Call[], status: number, body: unknown) {
  // Every call is built with `new URL`, so what reaches `fetch` is a URL.
  vi.stubGlobal("fetch", async (url: string | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    return new Response(
      typeof body === "string" ? body : JSON.stringify(body),
      { status },
    );
  });
}

const headersOf = (call: Call) =>
  call.init?.headers as Record<string, string> | undefined;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("the compare", () => {
  it("answers the changed paths", async () => {
    const calls: Call[] = [];
    answer(calls, 200, {
      files: [
        { filename: "openspec/changes/c/proposal.md", patch: "@@ -1 +1 @@" },
        { filename: "docs/prds/products/shared/planning/agent-rounds.md" },
      ],
    });
    expect(await compareFiles(REPO, "main", "abc123")).toEqual({
      paths: [
        "openspec/changes/c/proposal.md",
        "docs/prds/products/shared/planning/agent-rounds.md",
      ],
    });
    expect(calls[0].url).toBe(
      "https://api.github.com/repos/9gag/grade10-spec/compare/main...abc123",
    );
    expect(calls[0].init?.method).toBe(undefined);
    expect(headersOf(calls[0])).toEqual(HEADERS);
    expect(calls[0].init?.body).toBe(undefined);
  });

  it("says so when the host listed only some of the files", async () => {
    const files = Array.from({ length: COMPARE_MAX }, (_one, index) => ({
      filename: `docs/prds/page-${index}.md`,
    }));
    answer([], 200, { files });
    expect(await compareFiles(REPO, "main", "abc123")).toEqual({
      truncated: true,
    });
  });

  it("stops on an answer the host refused", async () => {
    answer([], 404, { message: "Not Found" });
    await expect(compareFiles(REPO, "main", "abc123")).rejects.toThrow(
      HostError,
    );
    answer([], 500, "upstream failure");
    await expect(compareFiles(REPO, "main", "abc123")).rejects.toThrow(
      "compare: 500 upstream failure",
    );
  });

  it("carries the host's status and its own words on the error it throws", async () => {
    answer([], 502, { message: "Bad gateway" });
    await expect(compareFiles(REPO, "main", "abc123")).rejects.toMatchObject({
      status: 502,
      detail: "Bad gateway",
    });
  });

  it("escapes what a caller gave it, and nothing it wrote itself", async () => {
    const calls: Call[] = [];
    answer(calls, 200, { files: [] });
    await compareFiles(
      { repo: "9gag/grade10 spec", token: REPO.token },
      "main",
      "a b",
    );
    expect(calls[0].url).toBe(
      "https://api.github.com/repos/9gag/grade10%20spec/compare/main...a%20b",
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
    expect(headersOf(calls[0])).toEqual(HEADERS);
  });

  it("stops on content that is not base64", async () => {
    answer([], 200, { content: "not base64 at all ***" });
    await expect(
      readFileAt(REPO, "docs/prds/team.yaml", "abc123"),
    ).rejects.toThrow("not base64");
  });

  it("names the file it could not read", async () => {
    answer([], 404, { message: "Not Found" });
    await expect(
      readFileAt(REPO, "docs/prds/team.yaml", "abc123"),
    ).rejects.toThrow("contents docs/prds/team.yaml: 404 Not Found");
  });

  it("stops on an answer carrying no content at all", async () => {
    // Reading it as the empty string would send a landing through its checks
    // against a record nobody wrote.
    answer([], 200, { encoding: "base64" });
    await expect(
      readFileAt(REPO, "docs/prds/team.yaml", "abc123"),
    ).rejects.toThrow("contents docs/prds/team.yaml: 200 no content");
    answer([], 200, { content: "   " });
    await expect(
      readFileAt(REPO, "docs/prds/team.yaml", "abc123"),
    ).rejects.toThrow("no content");
  });

  it("escapes a path segment by segment, keeping the file's own slashes", async () => {
    const calls: Call[] = [];
    answer(calls, 200, { content: btoa("") || "" });
    await expect(
      readFileAt(REPO, "docs/prds/a page.md", "a b"),
    ).rejects.toThrow("no content");
    expect(calls[0].url).toBe(
      "https://api.github.com/repos/9gag/grade10-spec/contents/docs/prds/a%20page.md?ref=a%20b",
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
    expect(headersOf(calls[0])).toEqual({
      ...HEADERS,
      "content-type": "application/json",
    });
    expect(JSON.parse(String(calls[0].init?.body))).toEqual({
      sha: "abc123",
      force: false,
    });
  });

  it("reads a 422 that is a move that is not a fast-forward", async () => {
    answer([], 422, { message: "Update is not a fast forward" });
    expect(await advanceMain(REPO, "abc123")).toEqual({
      refused: "not-fast-forward",
    });
  });

  it("reads any other 422 as the host refusing, with its message", async () => {
    answer([], 422, { message: "Required status check is expected" });
    expect(await advanceMain(REPO, "abc123")).toEqual({
      refused: "host-refused",
      message: "Required status check is expected",
    });
  });

  it("stops on any other refusal", async () => {
    answer([], 403, { message: "Resource not accessible" });
    await expect(advanceMain(REPO, "abc123")).rejects.toThrow(
      "advance main: 403 Resource not accessible",
    );
  });
});
