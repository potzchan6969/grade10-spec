import { describe, expect, it } from "vitest";
import { REPO } from "../src/editor/config";
import { GithubStore, type KeyStore } from "../src/editor/github-store";
import { draftProposal, type ProposalDraft } from "../src/editor/propose";

/** Proposing against a mocked GitHub. What is pinned is the exchange: the
 * directory is looked up before anything is built, the two files land as one
 * commit through the Git Data API, and the ref moves last — so a proposal
 * either lands whole or leaves the branch as it was. */

const API = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}`;
const SLUG = "expire-loyalty-points";
const DIR = `openspec/changes/${SLUG}`;

const DRAFT: ProposalDraft = {
  slug: SLUG,
  title: "Loyalty points should expire",
  why: "Collectors hoard points they never spend.",
  author: "echo",
  cites: ["grade10-store/loyalty"],
  date: "2026-08-30",
};

const FILES = draftProposal(DRAFT);

type Call = { url: string; method: string; body: Record<string, unknown> };
type Answer = { status: number; body?: unknown };

function memoryStore(): KeyStore {
  const held = new Map<string, string>();
  return {
    get: (key) => held.get(key) ?? null,
    set: (key, value) => {
      held.set(key, value);
    },
    remove: (key) => {
      held.delete(key);
    },
  };
}

function proposalText(author = "echo"): string {
  return `# Loyalty points should expire\n\n**Author:** @${author} - 2026-08-30\n\n## Why\n\nBecause.\n`;
}

function contentsOf(source: string, sha: string) {
  return { content: btoa(source), encoding: "base64", sha };
}

/**
 * A repo that answers the Git Data API. `holds` is what the change directory
 * carries — null meaning it is not there at all.
 */
function repo(
  holds: string[] | null = null,
  overrides: (call: Call) => Answer | null = () => null,
) {
  const calls: Call[] = [];
  let blobs = 0;

  const http = (async (input: string | URL | Request, init?: RequestInit) => {
    const call: Call = {
      url: String(input),
      method: init?.method ?? "GET",
      body: init?.body
        ? (JSON.parse(String(init.body)) as Record<string, unknown>)
        : {},
    };
    calls.push(call);
    const answer = route(call);
    return new Response(
      answer.body === undefined ? "" : JSON.stringify(answer.body),
      { status: answer.status },
    );
  }) as typeof fetch;

  const route = (call: Call): Answer => {
    const override = overrides(call);
    if (override) return override;

    if (call.url.endsWith("/user"))
      return { status: 200, body: { login: "echo" } };
    if (call.url.startsWith(`${API}/contents/${DIR}?`)) {
      if (holds === null) return { status: 404 };
      return {
        status: 200,
        body: holds.map((name) => ({ name, type: "file" })),
      };
    }
    if (call.url.startsWith(`${API}/contents/${DIR}/proposal.md`)) {
      return { status: 200, body: contentsOf(proposalText(), "proposalsha") };
    }
    if (call.url === `${API}/git/ref/heads/main`)
      return { status: 200, body: { object: { sha: "mainhead" } } };
    if (call.url.startsWith(`${API}/git/commits/`) && call.method === "GET")
      return { status: 200, body: { tree: { sha: "basetree" } } };
    if (call.url === `${API}/git/blobs` && call.method === "POST") {
      blobs += 1;
      return { status: 201, body: { sha: `blob${blobs}` } };
    }
    if (call.url === `${API}/git/trees` && call.method === "POST")
      return { status: 201, body: { sha: "newtree" } };
    if (call.url === `${API}/git/commits` && call.method === "POST")
      return { status: 201, body: { sha: "newcommit" } };
    if (call.method === "PATCH") return { status: 200, body: {} };
    return {
      status: 500,
      body: { message: `unrouted ${call.method} ${call.url}` },
    };
  };

  const seen = (method: string, url: string) =>
    calls.filter((call) => call.method === method && call.url.startsWith(url));
  return { http, calls, seen };
}

function storeOn(http: typeof fetch, token = "pat") {
  return new GithubStore({ token, http, storage: memoryStore() });
}

describe("proposing", () => {
  it("lands both files as one commit on main, and moves the ref last", async () => {
    const { http, calls, seen } = repo();

    expect(await storeOn(http).propose(FILES)).toEqual({ id: SLUG });

    const trees = seen("POST", `${API}/git/trees`);
    expect(seen("POST", `${API}/git/blobs`)).toHaveLength(2);
    expect(trees).toHaveLength(1);
    expect(trees[0].body).toEqual({
      base_tree: "basetree",
      tree: [
        {
          path: `${DIR}/.openspec.yaml`,
          mode: "100644",
          type: "blob",
          sha: "blob1",
        },
        {
          path: `${DIR}/proposal.md`,
          mode: "100644",
          type: "blob",
          sha: "blob2",
        },
      ],
    });

    const commit = seen("POST", `${API}/git/commits`)[0];
    expect(commit.body).toEqual({
      message: `manual: propose ${SLUG}`,
      tree: "newtree",
      parents: ["mainhead"],
    });

    const moved = seen("PATCH", `${API}/git/refs/heads/main`);
    expect(moved[0].body).toEqual({ sha: "newcommit" });
    // The ref moves after everything it points at exists.
    expect(calls.indexOf(moved[0])).toBe(calls.length - 1);
  });

  it("sends the file bytes it was handed", async () => {
    const { http, seen } = repo();

    await storeOn(http).propose(FILES);

    const sent = seen("POST", `${API}/git/blobs`).map((call) =>
      atob(String(call.body.content)),
    );
    expect(sent).toEqual(FILES.map((file) => file.content));
  });

  it("refuses a slug the store already has, before it builds anything", async () => {
    const { http, seen } = repo(["proposal.md"]);

    await expect(storeOn(http).propose(FILES)).rejects.toThrow(
      /already exists on main/,
    );
    expect(seen("POST", `${API}/git/blobs`)).toHaveLength(0);
    expect(seen("PATCH", `${API}/git/refs/heads/main`)).toHaveLength(0);
  });

  it("proposes nothing at all when GitHub cannot say what is there", async () => {
    const { http, seen } = repo(null, (call) =>
      call.url.startsWith(`${API}/contents/${DIR}?`)
        ? { status: 500, body: { message: "upstream is unwell" } }
        : null,
    );

    await expect(storeOn(http).propose(FILES)).rejects.toThrow(/unwell/);
    expect(seen("POST", `${API}/git/blobs`)).toHaveLength(0);
  });

  it("cuts no branch and opens no pull request", async () => {
    const { http, seen } = repo();

    await storeOn(http).propose(FILES);

    expect(seen("POST", `${API}/git/refs`)).toHaveLength(0);
    expect(seen("POST", `${API}/pulls`)).toHaveLength(0);
  });

  it("surfaces a protection refusal instead of falling back", async () => {
    const { http } = repo(null, (call) =>
      call.method === "PATCH"
        ? { status: 403, body: { message: "main is protected" } }
        : null,
    );

    await expect(storeOn(http).propose(FILES)).rejects.toThrow(
      /protection rule/,
    );
  });

  it.each([
    ["a durable spec", "openspec/specs/demo/spec.md"],
    ["a task list", `${DIR}/tasks.md`],
    ["a page", "manual/index.md"],
  ])("sends %s nowhere near GitHub", async (_what, path) => {
    const { http, calls } = repo();

    await expect(
      storeOn(http).propose([{ path, content: "x" }]),
    ).rejects.toThrow(/proposal|change/);
    expect(calls).toHaveLength(0);
  });

  it("writes nothing without a token", async () => {
    const { http, calls } = repo();

    await expect(storeOn(http, "").propose(FILES)).rejects.toThrow(/signed in/);
    expect(calls).toHaveLength(0);
  });
});

describe("who the token belongs to", () => {
  it("is nobody until something asks, and is asked once", async () => {
    const { http, seen } = repo();
    const store = storeOn(http);
    expect(store.author).toBeNull();

    const asked = await Promise.all([store.identity(), store.identity()]);

    expect(asked).toEqual(["echo", "echo"]);
    expect(seen("GET", "https://api.github.com/user")).toHaveLength(1);
    expect(store.author).toBe("echo");
  });
});

describe("withdrawing", () => {
  const holds = [".openspec.yaml", "proposal.md"];

  it("removes exactly the two files, as one commit", async () => {
    const { http, seen } = repo(holds);

    await storeOn(http).withdraw(SLUG);

    expect(seen("POST", `${API}/git/blobs`)).toHaveLength(0);
    expect(seen("POST", `${API}/git/trees`)[0].body).toEqual({
      base_tree: "basetree",
      tree: [
        {
          path: `${DIR}/.openspec.yaml`,
          mode: "100644",
          type: "blob",
          sha: null,
        },
        {
          path: `${DIR}/proposal.md`,
          mode: "100644",
          type: "blob",
          sha: null,
        },
      ],
    });
    expect(seen("POST", `${API}/git/commits`)[0].body).toMatchObject({
      message: `manual: withdraw ${SLUG}`,
    });
  });

  it("refuses, naming the file that makes it more than a proposal", async () => {
    const { http, seen } = repo([...holds, "tasks.md"]);

    await expect(storeOn(http).withdraw(SLUG)).rejects.toThrow(/`tasks.md`/);
    expect(seen("POST", `${API}/git/trees`)).toHaveLength(0);
  });

  it("refuses to withdraw somebody else's proposal", async () => {
    const { http, seen } = repo(holds, (call) =>
      call.url.startsWith(`${API}/contents/${DIR}/proposal.md`)
        ? { status: 200, body: contentsOf(proposalText("someone"), "sha") }
        : null,
    );

    await expect(storeOn(http).withdraw(SLUG)).rejects.toThrow(
      /proposed by @someone/,
    );
    expect(seen("POST", `${API}/git/trees`)).toHaveLength(0);
  });

  it("says so when there is no such change", async () => {
    const { http } = repo(null);

    await expect(storeOn(http).withdraw(SLUG)).rejects.toThrow(
      /no change `expire-loyalty-points`/,
    );
  });
});
