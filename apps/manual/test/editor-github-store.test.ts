import { describe, expect, it } from "vitest";
import { REPO, STORAGE } from "../src/editor/config";
import { GithubStore, type KeyStore } from "../src/editor/github-store";

/** The hosted transport against a mocked GitHub. Nothing here touches the
 * network; what is pinned is the shape of the exchange — branch, then write,
 * then a pull request that already exists or comes into being. */

const REPO_API = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}`;
const BRANCH = "manual/echo";
const PATH = "manual/products/demo/alpha.md";
const MINE = "---\ntitle: Mine\n---\n";
const THEIRS = "---\ntitle: Theirs\n---\n";
const PR = "https://github.com/9gag/grade10-spec/pull/7";

type Call = { url: string; method: string; body: Record<string, unknown> };
type Answer = { status: number; body?: unknown };

function memoryStore(seed: Record<string, string> = {}): KeyStore {
  const held = new Map<string, string>(Object.entries(seed));
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

function contentsOf(source: string, sha: string) {
  return { content: btoa(source), encoding: "base64", sha };
}

function router(routes: (call: Call) => Answer) {
  const calls: Call[] = [];
  const http = (async (input: string | URL | Request, init?: RequestInit) => {
    const call: Call = {
      url: String(input),
      method: init?.method ?? "GET",
      body: init?.body
        ? (JSON.parse(String(init.body)) as Record<string, unknown>)
        : {},
    };
    calls.push(call);
    const answer = routes(call);
    return new Response(
      answer.body === undefined ? "" : JSON.stringify(answer.body),
      { status: answer.status },
    );
  }) as typeof fetch;

  const seen = (method: string, url: string) =>
    calls.filter((call) => call.method === method && call.url.startsWith(url));
  return { http, calls, seen };
}

/** A repo GitHub answers for, with the author's branch either gone or still
 * standing — the two states a session opens in. */
function repo(
  branch: "missing" | "standing",
  overrides: (call: Call) => Answer | null = () => null,
) {
  // A repo remembers the PR it opened, so asking again finds it.
  let open: unknown[] = [];
  return router((call) => {
    const override = overrides(call);
    if (override) return override;

    if (call.url.endsWith("/user"))
      return { status: 200, body: { login: "echo" } };
    if (call.url === `${REPO_API}/git/ref/heads/${BRANCH}`) {
      return branch === "missing"
        ? { status: 404 }
        : { status: 200, body: { object: { sha: "branchhead" } } };
    }
    if (call.url === `${REPO_API}/git/ref/heads/main`) {
      return { status: 200, body: { object: { sha: "mainhead" } } };
    }
    if (call.url === `${REPO_API}/git/refs` && call.method === "POST") {
      return { status: 201, body: {} };
    }
    if (
      call.url === `${REPO_API}/git/refs/heads/${BRANCH}` &&
      call.method === "PATCH"
    ) {
      return { status: 200, body: { object: { sha: "mainhead" } } };
    }
    if (call.method === "PUT") {
      return { status: 200, body: { content: { sha: "blob2" } } };
    }
    if (call.url.startsWith(`${REPO_API}/pulls?`))
      return { status: 200, body: open };
    if (call.url === `${REPO_API}/pulls` && call.method === "POST") {
      open = [{ html_url: PR }];
      return { status: 201, body: { html_url: PR } };
    }
    if (call.url.startsWith(`${REPO_API}/contents/`)) {
      return { status: 200, body: contentsOf(THEIRS, "theirsha") };
    }
    return {
      status: 500,
      body: { message: `unrouted ${call.method} ${call.url}` },
    };
  });
}

/** A repo where the author's branch does not exist yet. */
function freshRepo(overrides: (call: Call) => Answer | null = () => null) {
  return repo("missing", overrides);
}

function storeOn(
  http: typeof fetch,
  token: string | null = "pat",
  storage: KeyStore = memoryStore(),
) {
  return new GithubStore({ token, http, storage });
}

describe("GithubStore", () => {
  it("cuts the author's branch from main, writes, and opens the PR", async () => {
    const { http, calls, seen } = freshRepo();
    const store = storeOn(http);

    const outcome = await store.write(PATH, MINE, "oldblob");

    expect(outcome).toEqual({ status: "ok", version: "blob2" });
    expect(seen("POST", `${REPO_API}/git/refs`)[0].body).toEqual({
      ref: `refs/heads/${BRANCH}`,
      sha: "mainhead",
    });

    const put = calls.find((call) => call.method === "PUT");
    expect(put?.url).toBe(`${REPO_API}/contents/${PATH}`);
    expect(put?.body).toMatchObject({ branch: BRANCH, sha: "oldblob" });
    expect(atob(String(put?.body.content))).toBe(MINE);

    expect(seen("POST", `${REPO_API}/pulls`)[0].body).toMatchObject({
      base: "main",
      head: BRANCH,
    });
    expect(store.reviewUrl).toBe(PR);
    expect(store.label).toContain(BRANCH);
  });

  it("creates the page when there is no blob to write against", async () => {
    const { http, calls } = freshRepo();

    await storeOn(http).write(PATH, MINE, null);

    const put = calls.find((call) => call.method === "PUT");
    expect(put?.body).not.toHaveProperty("sha");
  });

  it("reuses the branch and the PR on the next write", async () => {
    const { http, seen } = freshRepo();
    const store = storeOn(http);

    await store.write(PATH, MINE, null);
    await store.write(PATH, `${MINE}\nmore\n`, "blob2");

    expect(seen("POST", `${REPO_API}/git/refs`)).toHaveLength(1);
    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(1);
  });

  it("adopts the open PR instead of opening a second one", async () => {
    const { http, seen } = freshRepo((call) =>
      call.url.startsWith(`${REPO_API}/pulls?`)
        ? { status: 200, body: [{ html_url: PR }] }
        : null,
    );
    const store = storeOn(http);

    await store.write(PATH, MINE, null);

    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(0);
    expect(store.reviewUrl).toBe(PR);
  });

  it("starts the branch again from main once its PR has merged", async () => {
    const { http, calls, seen } = repo("standing");
    const store = storeOn(http);

    await store.write(PATH, MINE, null);

    const reset = seen("PATCH", `${REPO_API}/git/refs/heads/${BRANCH}`);
    expect(reset).toHaveLength(1);
    expect(reset[0].body).toEqual({ sha: "mainhead", force: true });
    expect(seen("POST", `${REPO_API}/git/refs`)).toHaveLength(0);
    // The branch is main again before anything lands on it.
    expect(calls.indexOf(reset[0])).toBeLessThan(
      calls.findIndex((call) => call.method === "PUT"),
    );
    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(1);
    expect(store.reviewUrl).toBe(PR);
  });

  it("prepares the branch once, and opens one PR, when two saves race", async () => {
    const { http, seen } = repo("standing");
    const store = storeOn(http);

    await Promise.all([
      store.write(PATH, MINE, null),
      store.write("manual/products/demo/beta.md", MINE, null),
    ]);

    expect(seen("PATCH", `${REPO_API}/git/refs/heads/${BRANCH}`)).toHaveLength(
      1,
    );
    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(1);
  });

  it("opens a new PR when the one it was writing to merged mid-session", async () => {
    const merged = "https://github.com/9gag/grade10-spec/pull/6";
    let open: unknown[] = [{ html_url: merged }];
    const { http, seen } = repo("standing", (call) =>
      call.url.startsWith(`${REPO_API}/pulls?`)
        ? { status: 200, body: open }
        : null,
    );
    const store = storeOn(http);

    await store.write(PATH, MINE, null);
    expect(store.reviewUrl).toBe(merged);

    open = [];
    await store.write(PATH, `${MINE}\nmore\n`, "blob2");

    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(1);
    expect(store.reviewUrl).toBe(PR);
  });

  it("re-verifies a remembered PR instead of trusting it", async () => {
    const stale = "https://github.com/9gag/grade10-spec/pull/1";
    const storage = memoryStore({
      [STORAGE.login]: "echo",
      [STORAGE.pr]: stale,
    });
    const { http, seen } = repo("standing");
    const store = storeOn(http, "pat", storage);
    expect(store.reviewUrl).toBe(stale);

    await store.write(PATH, MINE, null);

    expect(seen("GET", `${REPO_API}/pulls?`).length).toBeGreaterThan(0);
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/${BRANCH}`)).toHaveLength(
      1,
    );
    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(1);
    expect(store.reviewUrl).toBe(PR);
    expect(storage.get(STORAGE.pr)).toBe(PR);
  });

  it("creates a file the reset branch never had, rather than writing against main's sha", async () => {
    const { http, calls } = repo("standing", (call) =>
      call.url === `${REPO_API}/contents/${PATH}?ref=manual%2Fecho`
        ? { status: 404 }
        : null,
    );
    const store = storeOn(http);

    const file = await store.read(PATH);
    await store.write(PATH, MINE, file.version);

    expect(file.version).toBe("theirsha");
    const put = calls.find((call) => call.method === "PUT");
    expect(put?.body).not.toHaveProperty("sha");
  });

  it("keeps the sha for a file the reset branch does carry", async () => {
    const { http, calls } = repo("standing");

    await storeOn(http).write(PATH, MINE, "theirsha");

    const put = calls.find((call) => call.method === "PUT");
    expect(put?.body).toMatchObject({ sha: "theirsha" });
  });

  it.each([
    "openspec/specs/demo/spec.md",
    "manual/../openspec/specs/demo/spec.md",
    "/etc/hosts",
    "manual/",
  ])("refuses to send %s anywhere near the contents API", async (path) => {
    const { http, calls } = freshRepo();
    const store = storeOn(http);

    await expect(store.write(path, MINE, null)).rejects.toThrow(/manual\//);
    await expect(
      store.writeBinary(path, new Uint8Array([1]), null),
    ).rejects.toThrow(/manual\//);
    expect(calls).toHaveLength(0);
  });

  it("turns a sha mismatch into a conflict carrying the other side", async () => {
    const { http } = freshRepo((call) =>
      call.method === "PUT"
        ? { status: 409, body: { message: "does not match" } }
        : null,
    );

    const outcome = await storeOn(http).write(PATH, MINE, "stale");

    expect(outcome).toEqual({
      status: "conflict",
      current: { source: THEIRS, version: "theirsha" },
    });
  });

  it("treats GitHub's 422 on a stale sha the same way", async () => {
    const { http } = freshRepo((call) =>
      call.method === "PUT"
        ? { status: 422, body: { message: "invalid sha" } }
        : null,
    );

    expect(await storeOn(http).write(PATH, MINE, "stale")).toMatchObject({
      status: "conflict",
    });
  });

  it("says the file is gone when the conflict has no other side", async () => {
    const { http } = freshRepo((call) => {
      if (call.method === "PUT") return { status: 409, body: {} };
      if (call.url.startsWith(`${REPO_API}/contents/`)) return { status: 404 };
      return null;
    });

    expect(await storeOn(http).write(PATH, MINE, "stale")).toEqual({
      status: "conflict",
      current: null,
    });
  });

  it("reads the branch first and falls back to main", async () => {
    const { http, calls } = freshRepo((call) =>
      call.url === `${REPO_API}/contents/${PATH}?ref=manual%2Fecho`
        ? { status: 404 }
        : null,
    );

    const file = await storeOn(http).read(PATH);

    expect(file).toEqual({ source: THEIRS, version: "theirsha" });
    expect(calls.map((call) => call.url)).toContain(
      `${REPO_API}/contents/${PATH}`,
    );
  });

  it("is read-only without a token, and writes nothing", async () => {
    const { http, calls } = freshRepo();
    const store = storeOn(http, null);

    expect(store.readOnly).toMatch(/token/);
    await expect(store.write(PATH, MINE, null)).rejects.toThrow(/token/);
    await expect(store.read(PATH)).rejects.toThrow(/token/);
    expect(calls).toHaveLength(0);
  });

  it("fails loudly when the token names nobody", async () => {
    const { http } = freshRepo((call) =>
      call.url.endsWith("/user")
        ? { status: 401, body: { message: "Bad credentials" } }
        : null,
    );

    await expect(storeOn(http).write(PATH, MINE, null)).rejects.toThrow(
      /Bad credentials/,
    );
  });
});
