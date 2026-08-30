import { describe, expect, it } from "vitest";
import { REPO, STORAGE, type WriteMode } from "../src/editor/config";
import { GithubStore, type KeyStore } from "../src/editor/github-store";
import type { PushFile } from "../src/editor/store";

/** The hosted transport against a mocked GitHub. Nothing here touches the
 * network; what is pinned is the shape of each mode's exchange — branch mode
 * cuts a branch and keeps a pull request, main mode does neither — and that a
 * push is one commit that either lands whole or writes nothing at all. */

const REPO_API = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}`;
const BRANCH = "manual/echo";
const DIR = "manual/products/demo";
const PATH = `${DIR}/alpha.md`;
const BETA = `${DIR}/beta.md`;
const NEW = `${DIR}/gamma.md`;
const MINE = "---\ntitle: Mine\n---\n";
const THEIRS = "---\ntitle: Theirs\n---\n";
const PR = "https://github.com/9gag/grade10-spec/pull/7";
const MAIN_HEAD = "mainhead";
const COMMIT = "newcommit";

/** What the directory holds on the ref, as the contents listing answers it. */
const LISTING = [
  { name: "alpha.md", path: PATH, sha: "theirsha", type: "file" },
  { name: "beta.md", path: BETA, sha: "betasha", type: "file" },
];

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

function file(path: string, baseVersion: string | null): PushFile {
  return { path, source: MINE, baseVersion };
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
 * standing — the two states a session opens in. It remembers what it is told:
 * a branch that was just cut answers for its own head afterwards. */
function repo(
  branch: "missing" | "standing",
  overrides: (call: Call) => Answer | null = () => null,
) {
  let open: unknown[] = [];
  let branchHead: string | null = branch === "standing" ? "branchhead" : null;
  let blobs = 0;

  return router((call) => {
    const override = overrides(call);
    if (override) return override;

    if (call.url.endsWith("/user"))
      return { status: 200, body: { login: "echo" } };

    if (call.url === `${REPO_API}/git/ref/heads/${BRANCH}`) {
      return branchHead === null
        ? { status: 404 }
        : { status: 200, body: { object: { sha: branchHead } } };
    }
    if (call.url === `${REPO_API}/git/ref/heads/main`) {
      return { status: 200, body: { object: { sha: MAIN_HEAD } } };
    }
    if (call.url === `${REPO_API}/git/refs` && call.method === "POST") {
      branchHead = String(call.body.sha);
      return { status: 201, body: {} };
    }
    if (
      call.url === `${REPO_API}/git/refs/heads/${BRANCH}` &&
      call.method === "PATCH"
    ) {
      branchHead = String(call.body.sha);
      return { status: 200, body: { object: { sha: branchHead } } };
    }
    if (
      call.url === `${REPO_API}/git/refs/heads/main` &&
      call.method === "PATCH"
    ) {
      return { status: 200, body: { object: { sha: String(call.body.sha) } } };
    }

    if (call.url === `${REPO_API}/git/blobs` && call.method === "POST") {
      blobs += 1;
      return { status: 201, body: { sha: `blob${blobs}` } };
    }
    if (call.url === `${REPO_API}/git/trees` && call.method === "POST") {
      return { status: 201, body: { sha: "newtree" } };
    }
    if (call.url === `${REPO_API}/git/commits` && call.method === "POST") {
      return { status: 201, body: { sha: COMMIT } };
    }
    if (call.url.startsWith(`${REPO_API}/git/commits/`)) {
      return { status: 200, body: { tree: { sha: "basetree" } } };
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

    if (call.url.startsWith(`${REPO_API}/contents/${DIR}?`)) {
      return { status: 200, body: LISTING };
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

/** Branch mode is the one with machinery, so it is the one these name. */
function storeOn(
  http: typeof fetch,
  token: string | null = "pat",
  storage: KeyStore = memoryStore(),
  mode: WriteMode = "branch",
) {
  return new GithubStore({ token, http, storage, mode });
}

function mainStoreOn(http: typeof fetch, token: string | null = "pat") {
  return new GithubStore({ token, http, storage: memoryStore(), mode: "main" });
}

describe("GithubStore, branch + PR mode", () => {
  it("cuts the author's branch from main, pushes onto it, and opens the PR", async () => {
    const { http, seen } = freshRepo();
    const store = storeOn(http);

    const outcome = await store.push([file(PATH, "theirsha")], "Update 1 page");

    expect(outcome).toEqual({ status: "ok", head: COMMIT });
    expect(seen("POST", `${REPO_API}/git/refs`)[0].body).toEqual({
      ref: `refs/heads/${BRANCH}`,
      sha: MAIN_HEAD,
    });
    expect(seen("POST", `${REPO_API}/git/commits`)[0].body).toEqual({
      message: "Update 1 page",
      tree: "newtree",
      parents: [MAIN_HEAD],
    });
    expect(
      seen("PATCH", `${REPO_API}/git/refs/heads/${BRANCH}`).at(-1)?.body,
    ).toEqual({ sha: COMMIT });

    expect(seen("POST", `${REPO_API}/pulls`)[0].body).toMatchObject({
      base: "main",
      head: BRANCH,
    });
    expect(store.reviewUrl).toBe(PR);
    expect(store.label).toContain(BRANCH);
  });

  it("pushes a page the ref does not carry yet", async () => {
    const { http, seen } = freshRepo();

    const outcome = await storeOn(http).push([file(NEW, null)], "New page");

    expect(outcome).toEqual({ status: "ok", head: COMMIT });
    expect(seen("POST", `${REPO_API}/git/trees`)[0].body).toMatchObject({
      tree: [{ path: NEW, mode: "100644", type: "blob", sha: "blob1" }],
    });
  });

  it("adds a page the branch has not got, rather than calling it a conflict", async () => {
    // The reader falls back to main for a page the branch does not carry, so
    // the draft holds main's blob sha for a file this ref has never had.
    const { http, seen } = repo("standing", (call) =>
      call.url.startsWith(`${REPO_API}/contents/${DIR}?`)
        ? { status: 200, body: [] }
        : null,
    );

    const outcome = await storeOn(http).push([file(PATH, "theirsha")], "one");

    expect(outcome).toEqual({ status: "ok", head: COMMIT });
    expect(seen("POST", `${REPO_API}/git/trees`)[0].body).toMatchObject({
      tree: [{ path: PATH, sha: "blob1" }],
    });
  });

  it("reuses the branch and the PR on the next push", async () => {
    const { http, seen } = freshRepo();
    const store = storeOn(http);

    await store.push([file(NEW, null)], "one");
    await store.push([file(NEW, null)], "two");

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

    await store.push([file(NEW, null)], "one");

    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(0);
    expect(store.reviewUrl).toBe(PR);
  });

  it("starts the branch again from main once its PR has merged", async () => {
    const { http, calls, seen } = repo("standing");
    const store = storeOn(http);

    await store.push([file(NEW, null)], "one");

    const moves = seen("PATCH", `${REPO_API}/git/refs/heads/${BRANCH}`);
    const reset = moves.filter((call) => call.body.force === true);
    expect(reset).toHaveLength(1);
    expect(reset[0].body).toEqual({ sha: MAIN_HEAD, force: true });
    expect(seen("POST", `${REPO_API}/git/refs`)).toHaveLength(0);
    // The branch is main again before anything is built on it.
    expect(calls.indexOf(reset[0])).toBeLessThan(
      calls.findIndex((call) => call.url === `${REPO_API}/git/trees`),
    );
    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(1);
    expect(store.reviewUrl).toBe(PR);
  });

  it("prepares the branch once, and opens one PR, when two pushes race", async () => {
    const { http, seen } = repo("standing");
    const store = storeOn(http);

    await Promise.all([
      store.push([file(NEW, null)], "one"),
      store.push([file(BETA, "betasha")], "two"),
    ]);

    const reset = seen("PATCH", `${REPO_API}/git/refs/heads/${BRANCH}`).filter(
      (call) => call.body.force === true,
    );
    expect(reset).toHaveLength(1);
    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(1);
  });

  it("opens a new PR when the one it was pushing to merged mid-session", async () => {
    const merged = "https://github.com/9gag/grade10-spec/pull/6";
    let open: unknown[] = [{ html_url: merged }];
    const { http, seen } = repo("standing", (call) =>
      call.url.startsWith(`${REPO_API}/pulls?`)
        ? { status: 200, body: open }
        : null,
    );
    const store = storeOn(http);

    await store.push([file(NEW, null)], "one");
    expect(store.reviewUrl).toBe(merged);

    open = [];
    await store.push([file(NEW, null)], "two");

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

    await store.push([file(NEW, null)], "one");

    expect(seen("GET", `${REPO_API}/pulls?`).length).toBeGreaterThan(0);
    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(1);
    expect(store.reviewUrl).toBe(PR);
    expect(storage.get(STORAGE.pr)).toBe(PR);
  });

  it("pushes onto the author's own branch, never main", async () => {
    const { http, seen } = repo("standing");

    await storeOn(http).push([file(NEW, null)], "one");

    expect(seen("PATCH", `${REPO_API}/git/refs/heads/main`)).toHaveLength(0);
    expect(
      seen("PATCH", `${REPO_API}/git/refs/heads/${BRANCH}`).length,
    ).toBeGreaterThan(0);
  });

  it("checks a staged draft against the branch without cutting one", async () => {
    const storage = memoryStore({ [STORAGE.login]: "echo" });
    const { http, seen } = repo("standing");

    const moved = await storeOn(http, "pat", storage).movedSince([
      { path: PATH, baseVersion: "readat" },
      { path: BETA, baseVersion: "betasha" },
    ]);

    expect(moved).toEqual([PATH]);
    expect(
      seen("GET", `${REPO_API}/contents/${DIR}?ref=manual%2Fecho`),
    ).toHaveLength(1);
    expect(seen("POST", `${REPO_API}/git/refs`)).toHaveLength(0);
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/${BRANCH}`)).toHaveLength(
      0,
    );
  });

  it("does not call a page the branch has not got yet a page that moved", async () => {
    const storage = memoryStore({ [STORAGE.login]: "echo" });
    const { http } = repo("standing");

    expect(
      await storeOn(http, "pat", storage).movedSince([
        { path: NEW, baseVersion: "fromMain" },
      ]),
    ).toEqual([]);
  });

  it.each([
    "openspec/specs/demo/spec.md",
    "manual/../openspec/specs/demo/spec.md",
    "/etc/hosts",
    "manual/",
  ])("refuses to send %s anywhere near the API", async (path) => {
    const { http, calls } = freshRepo();
    const store = storeOn(http);

    await expect(store.push([file(path, null)], "m")).rejects.toThrow(
      /manual\//,
    );
    await expect(
      store.writeBinary(path, new Uint8Array([1]), null),
    ).rejects.toThrow(/manual\//);
    expect(calls).toHaveLength(0);
  });

  it("uploads an asset straight away — a binary has no draft to stage", async () => {
    const { http, calls } = freshRepo();

    const outcome = await storeOn(http).writeBinary(
      "manual/assets/shot.png",
      new Uint8Array([1, 2]),
      null,
    );

    expect(outcome).toEqual({ status: "ok", version: "blob2" });
    const put = calls.find((call) => call.method === "PUT");
    expect(put?.url).toBe(`${REPO_API}/contents/manual/assets/shot.png`);
    expect(put?.body).toMatchObject({ branch: BRANCH });
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

  it("is read-only without a token, and asks nothing", async () => {
    const { http, calls } = freshRepo();
    const store = storeOn(http, null);

    expect(store.readOnly).toMatch(/token/);
    await expect(store.push([file(PATH, null)], "m")).rejects.toThrow(/token/);
    await expect(
      store.movedSince([{ path: PATH, baseVersion: null }]),
    ).rejects.toThrow(/token/);
    await expect(store.read(PATH)).rejects.toThrow(/token/);
    expect(calls).toHaveLength(0);
  });

  it("fails loudly when the token names nobody", async () => {
    const { http } = freshRepo((call) =>
      call.url.endsWith("/user")
        ? { status: 401, body: { message: "Bad credentials" } }
        : null,
    );

    await expect(storeOn(http).push([file(PATH, null)], "m")).rejects.toThrow(
      /Bad credentials/,
    );
  });
});

describe("GithubStore, main mode", () => {
  it("turns the staged set into one commit on the default branch", async () => {
    const { http, seen } = freshRepo();
    const store = mainStoreOn(http);

    const outcome = await store.push(
      [file(PATH, "theirsha"), file(BETA, "betasha")],
      "Update 2 pages",
    );

    expect(outcome).toEqual({ status: "ok", head: COMMIT });
    expect(seen("POST", `${REPO_API}/git/blobs`)).toHaveLength(2);
    expect(seen("POST", `${REPO_API}/git/trees`)[0].body).toEqual({
      base_tree: "basetree",
      tree: [
        { path: PATH, mode: "100644", type: "blob", sha: "blob1" },
        { path: BETA, mode: "100644", type: "blob", sha: "blob2" },
      ],
    });
    expect(seen("POST", `${REPO_API}/git/commits`)[0].body).toEqual({
      message: "Update 2 pages",
      tree: "newtree",
      parents: [MAIN_HEAD],
    });
    // Not forced: a commit that landed between the check and the move is
    // never what this push writes over.
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/main`)[0].body).toEqual({
      sha: COMMIT,
    });
  });

  it("cuts nothing and proposes nothing", async () => {
    const { http, calls, seen } = freshRepo();
    const store = mainStoreOn(http);

    await store.push([file(PATH, "theirsha")], "m");

    expect(seen("POST", `${REPO_API}/git/refs`)).toHaveLength(0);
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/${BRANCH}`)).toHaveLength(
      0,
    );
    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(0);
    expect(calls.filter((call) => call.url.endsWith("/user"))).toHaveLength(0);
    expect(store.reviewUrl).toBeNull();
    expect(store.label).toContain("main");
  });

  it("asks one listing per directory rather than one read per page", async () => {
    const { http, seen } = freshRepo();

    const at = await mainStoreOn(http).versionsAt([PATH, BETA, NEW]);

    expect(at.get(PATH)).toBe("theirsha");
    expect(at.get(BETA)).toBe("betasha");
    expect(at.get(NEW)).toBeNull();
    expect(seen("GET", `${REPO_API}/contents/${DIR}?`)).toHaveLength(1);
  });

  it("hands back the pages that moved, with the other side, and writes nothing", async () => {
    const { http, seen } = freshRepo();

    const outcome = await mainStoreOn(http).push(
      [file(PATH, "readat"), file(BETA, "betasha")],
      "m",
    );

    expect(outcome).toEqual({
      status: "conflicts",
      conflicts: [
        { path: PATH, current: { source: THEIRS, version: "theirsha" } },
      ],
    });
    expect(seen("POST", `${REPO_API}/git/blobs`)).toHaveLength(0);
    expect(seen("POST", `${REPO_API}/git/trees`)).toHaveLength(0);
    expect(seen("POST", `${REPO_API}/git/commits`)).toHaveLength(0);
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/main`)).toHaveLength(0);
  });

  it("says the page is gone when the conflict has no other side", async () => {
    const { http } = freshRepo((call) =>
      call.url.startsWith(`${REPO_API}/contents/${PATH}`)
        ? { status: 404 }
        : null,
    );

    expect(await mainStoreOn(http).push([file(PATH, "readat")], "m")).toEqual({
      status: "conflicts",
      conflicts: [{ path: PATH, current: null }],
    });
  });

  it("reads main, never a personal branch left standing from the other mode", async () => {
    const { http, calls } = repo("standing", (call) =>
      call.url === `${REPO_API}/contents/${PATH}?ref=manual%2Fecho`
        ? { status: 200, body: contentsOf(MINE, "branchsha") }
        : null,
    );

    const file = await mainStoreOn(http).read(PATH);

    expect(file).toEqual({ source: THEIRS, version: "theirsha" });
    expect(calls.map((call) => call.url)).toEqual([
      `${REPO_API}/contents/${PATH}?ref=main`,
    ]);
  });

  it("reads the head again and retries once when the ref moved mid-push", async () => {
    let refused = false;
    const { http, seen } = freshRepo((call) => {
      if (call.method !== "PATCH" || refused) return null;
      refused = true;
      return { status: 422, body: { message: "Update is not a fast forward" } };
    });

    const outcome = await mainStoreOn(http).push([file(PATH, "theirsha")], "m");

    expect(outcome).toEqual({ status: "ok", head: COMMIT });
    expect(seen("GET", `${REPO_API}/git/ref/heads/main`)).toHaveLength(2);
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/main`)).toHaveLength(2);
  });

  it("re-checks every draft against the head it reads for the retry", async () => {
    let refused = false;
    const { http, seen } = freshRepo((call) => {
      if (call.method === "PATCH" && !refused) {
        refused = true;
        return {
          status: 422,
          body: { message: "Update is not a fast forward" },
        };
      }
      if (refused && call.url.startsWith(`${REPO_API}/contents/${DIR}?`)) {
        return { status: 200, body: [{ path: PATH, sha: "movedsha" }] };
      }
      return null;
    });

    const outcome = await mainStoreOn(http).push([file(PATH, "theirsha")], "m");

    expect(outcome).toMatchObject({ status: "conflicts" });
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/main`)).toHaveLength(1);
  });

  it("gives up after the second refusal, having moved nothing", async () => {
    const { http, seen } = freshRepo((call) =>
      call.method === "PATCH"
        ? { status: 422, body: { message: "Update is not a fast forward" } }
        : null,
    );

    await expect(
      mainStoreOn(http).push([file(PATH, "theirsha")], "m"),
    ).rejects.toThrow(/main is moving/);
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/main`)).toHaveLength(2);
  });

  it.each([
    [403, "resource not accessible by personal access token"],
    [422, "main is a protected branch"],
  ])(
    "answers a %i push refusal by naming PR mode, never by falling back",
    async (status, message) => {
      const { http, seen } = freshRepo((call) =>
        call.method === "PATCH" ? { status, body: { message } } : null,
      );

      await expect(
        mainStoreOn(http).push([file(PATH, "theirsha")], "m"),
      ).rejects.toThrow(/branch \+ PR mode/);
      expect(seen("POST", `${REPO_API}/git/refs`)).toHaveLength(0);
      expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(0);
    },
  );

  it("asks nothing without a token", async () => {
    const { http, calls } = freshRepo();
    const store = mainStoreOn(http, null);

    expect(store.readOnly).toMatch(/contents:write/);
    expect(store.readOnly).not.toMatch(/pull_requests/);
    await expect(store.push([file(PATH, null)], "m")).rejects.toThrow(/token/);
    await expect(store.read(PATH)).rejects.toThrow(/token/);
    expect(calls).toHaveLength(0);
  });
});
