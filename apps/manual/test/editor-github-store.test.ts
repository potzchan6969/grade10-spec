import { describe, expect, it } from "vitest";
import { REPO, STORAGE } from "../src/editor/config";
import { GithubStore, type KeyStore } from "../src/editor/github-store";
import type { PushFile } from "../src/editor/store";
import { fingerprintOf } from "../src/editor/verify";

/** The hosted transport against a mocked GitHub. Nothing here touches the
 * network; what is pinned is the one exchange there is — every read and write
 * on the base branch — and that a push is one commit that either lands whole
 * or writes nothing at all. */

const REPO_API = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}`;
const DIR = "manual/products/demo";
const PATH = `${DIR}/alpha.md`;
const BETA = `${DIR}/beta.md`;
const NEW = `${DIR}/gamma.md`;
const MINE = "---\ntitle: Mine\n---\n";
const THEIRS = "---\ntitle: Theirs\n---\n";
const MAIN_HEAD = "mainhead";
const COMMIT = "newcommit";

/** What the directory holds on the ref, as the contents listing answers it. */
const LISTING = [
  { name: "alpha.md", path: PATH, sha: "theirsha", type: "file" },
  { name: "beta.md", path: BETA, sha: "betasha", type: "file" },
];

type Call = { url: string; method: string; body: Record<string, unknown> };
type Answer = { status: number; body?: unknown };

/** A token GitHub has already answered for: the login rides on the verdict,
 * so nothing here has to ask again who this is. */
function verified(login = "echo", token = "pat"): Record<string, string> {
  return {
    [STORAGE.verified]: JSON.stringify({
      fingerprint: fingerprintOf(token),
      login,
      expires: null,
    }),
  };
}

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

/** A repo GitHub answers for. It remembers what it is told: a moved ref
 * answers for its new head afterwards. */
function repo(overrides: (call: Call) => Answer | null = () => null) {
  let blobs = 0;

  return router((call) => {
    const override = overrides(call);
    if (override) return override;

    if (call.url.endsWith("/user"))
      return { status: 200, body: { login: "echo" } };

    if (call.url === `${REPO_API}/git/ref/heads/main`) {
      return { status: 200, body: { object: { sha: MAIN_HEAD } } };
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

function storeOn(
  http: typeof fetch,
  token: string | null = "pat",
  storage: KeyStore = memoryStore(),
) {
  return new GithubStore({ token, http, storage });
}

describe("GithubStore", () => {
  it("turns the staged set into one commit on the default branch", async () => {
    const { http, seen } = repo();
    const store = storeOn(http);

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
    expect(store.label).toContain("main");
  });

  it("pushes a page the ref does not carry yet", async () => {
    const { http, seen } = repo();

    const outcome = await storeOn(http).push([file(NEW, null)], "New page");

    expect(outcome).toEqual({ status: "ok", head: COMMIT });
    expect(seen("POST", `${REPO_API}/git/trees`)[0].body).toMatchObject({
      tree: [{ path: NEW, mode: "100644", type: "blob", sha: "blob1" }],
    });
  });

  it("cuts no branch, opens no pull request, and asks nobody who it is", async () => {
    const { http, calls, seen } = repo();

    await storeOn(http).push([file(PATH, "theirsha")], "m");

    expect(seen("POST", `${REPO_API}/git/refs`)).toHaveLength(0);
    expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(0);
    expect(calls.filter((call) => call.url.endsWith("/user"))).toHaveLength(0);
  });

  it("asks one listing per directory rather than one read per page", async () => {
    const { http, seen } = repo();

    const at = await storeOn(http).versionsAt([PATH, BETA, NEW]);

    expect(at.get(PATH)).toBe("theirsha");
    expect(at.get(BETA)).toBe("betasha");
    expect(at.get(NEW)).toBeNull();
    expect(seen("GET", `${REPO_API}/contents/${DIR}?`)).toHaveLength(1);
  });

  it("hands back the pages that moved, with the other side, and writes nothing", async () => {
    const { http, seen } = repo();

    const outcome = await storeOn(http).push(
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
    const { http } = repo((call) =>
      call.url.startsWith(`${REPO_API}/contents/${PATH}`)
        ? { status: 404 }
        : null,
    );

    expect(await storeOn(http).push([file(PATH, "readat")], "m")).toEqual({
      status: "conflicts",
      conflicts: [{ path: PATH, current: null }],
    });
  });

  it("checks a staged draft against the base branch, moving nothing", async () => {
    const storage = memoryStore(verified());
    const { http, seen } = repo();

    const moved = await storeOn(http, "pat", storage).movedSince([
      { path: PATH, baseVersion: "readat" },
      { path: BETA, baseVersion: "betasha" },
    ]);

    expect(moved).toEqual([PATH]);
    expect(seen("GET", `${REPO_API}/contents/${DIR}?ref=main`)).toHaveLength(1);
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/main`)).toHaveLength(0);
  });

  it("does not call a page the ref has not got yet a page that moved", async () => {
    const { http } = repo((call) =>
      call.url.startsWith(`${REPO_API}/contents/${DIR}?`)
        ? { status: 200, body: [] }
        : null,
    );

    expect(
      await storeOn(http).movedSince([{ path: NEW, baseVersion: null }]),
    ).toEqual([]);
  });

  it("calls a page main no longer carries a page that moved", async () => {
    const { http } = repo((call) =>
      call.url.startsWith(`${REPO_API}/contents/${DIR}?`)
        ? { status: 200, body: [] }
        : null,
    );

    expect(
      await storeOn(http).movedSince([{ path: PATH, baseVersion: "readat" }]),
    ).toEqual([PATH]);
  });

  it("reads main, never a personal branch left standing from the PAT era", async () => {
    const { http, calls } = repo();

    const read = await storeOn(http).read(PATH);

    expect(read).toEqual({ source: THEIRS, version: "theirsha" });
    expect(calls.map((call) => call.url)).toEqual([
      `${REPO_API}/contents/${PATH}?ref=main`,
    ]);
  });

  it("reads the head again and retries once when the ref moved mid-push", async () => {
    let refused = false;
    const { http, seen } = repo((call) => {
      if (call.method !== "PATCH" || refused) return null;
      refused = true;
      return { status: 422, body: { message: "Update is not a fast forward" } };
    });

    const outcome = await storeOn(http).push([file(PATH, "theirsha")], "m");

    expect(outcome).toEqual({ status: "ok", head: COMMIT });
    expect(seen("GET", `${REPO_API}/git/ref/heads/main`)).toHaveLength(2);
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/main`)).toHaveLength(2);
  });

  it("re-checks every draft against the head it reads for the retry", async () => {
    let refused = false;
    const { http, seen } = repo((call) => {
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

    const outcome = await storeOn(http).push([file(PATH, "theirsha")], "m");

    expect(outcome).toMatchObject({ status: "conflicts" });
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/main`)).toHaveLength(1);
  });

  it("gives up after the second refusal, having moved nothing", async () => {
    const { http, seen } = repo((call) =>
      call.method === "PATCH"
        ? { status: 422, body: { message: "Update is not a fast forward" } }
        : null,
    );

    await expect(
      storeOn(http).push([file(PATH, "theirsha")], "m"),
    ).rejects.toThrow(/main is moving/);
    expect(seen("PATCH", `${REPO_API}/git/refs/heads/main`)).toHaveLength(2);
  });

  it.each([
    [403, "resource not accessible by personal access token"],
    [422, "main is a protected branch"],
  ])(
    "surfaces a %i push refusal as a rule to lift, never a fallback",
    async (status, message) => {
      const { http, seen } = repo((call) =>
        call.method === "PATCH" ? { status, body: { message } } : null,
      );

      await expect(
        storeOn(http).push([file(PATH, "theirsha")], "m"),
      ).rejects.toThrow(/protection rule/);
      expect(seen("POST", `${REPO_API}/git/refs`)).toHaveLength(0);
      expect(seen("POST", `${REPO_API}/pulls`)).toHaveLength(0);
    },
  );

  it.each([
    "openspec/specs/demo/spec.md",
    "manual/../openspec/specs/demo/spec.md",
    "/etc/hosts",
    "manual/",
  ])("refuses to send %s anywhere near the API", async (path) => {
    const { http, calls } = repo();
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
    const { http, calls } = repo();

    const outcome = await storeOn(http).writeBinary(
      "manual/assets/shot.png",
      new Uint8Array([1, 2]),
      null,
    );

    expect(outcome).toEqual({ status: "ok", version: "blob2" });
    const put = calls.find((call) => call.method === "PUT");
    expect(put?.url).toBe(`${REPO_API}/contents/manual/assets/shot.png`);
    expect(put?.body).toMatchObject({ branch: "main" });
  });

  it("is read-only without a token, and asks nothing", async () => {
    const { http, calls } = repo();
    const store = storeOn(http, null);

    expect(store.readOnly).toMatch(/token/);
    expect(store.readOnly).toMatch(/contents:write/);
    await expect(store.push([file(PATH, null)], "m")).rejects.toThrow(/token/);
    await expect(
      store.movedSince([{ path: PATH, baseVersion: null }]),
    ).rejects.toThrow(/token/);
    await expect(store.read(PATH)).rejects.toThrow(/token/);
    expect(calls).toHaveLength(0);
  });

  it("fails loudly when the token names nobody", async () => {
    const { http } = repo((call) =>
      call.url.endsWith("/user")
        ? { status: 401, body: { message: "Bad credentials" } }
        : null,
    );

    await expect(storeOn(http).identity()).rejects.toThrow(/Bad credentials/);
  });
});

describe("GithubStore, what a token has to have proved", () => {
  it("is read-only until the token has been verified", () => {
    const { http } = repo();

    expect(storeOn(http, "pat", memoryStore()).readOnly).toMatch(
      /has not been checked/,
    );
    expect(storeOn(http, "pat", memoryStore(verified())).readOnly).toBeNull();
  });

  it("takes the verdict's login instead of asking GitHub again", async () => {
    const { http, seen } = repo();
    const store = storeOn(http, "pat", memoryStore(verified("echo")));

    expect(store.author).toBe("echo");
    expect(await store.identity()).toBe("echo");
    expect(seen("GET", "https://api.github.com/user")).toHaveLength(0);
  });

  it("refuses a verdict issued for another token", () => {
    const { http } = repo();
    const storage = memoryStore(verified("echo", "an older pat"));

    expect(storeOn(http, "pat", storage).readOnly).toMatch(
      /has not been checked/,
    );
  });

  it("tears the verdict up the first time GitHub answers 401", async () => {
    const storage = memoryStore(verified());
    let changed = 0;
    const { http } = repo((call) =>
      call.url.startsWith(`${REPO_API}/contents/`)
        ? { status: 401, body: { message: "Bad credentials" } }
        : null,
    );
    const store = new GithubStore({
      token: "pat",
      http,
      storage,
      onChange: () => {
        changed += 1;
      },
    });
    expect(store.readOnly).toBeNull();

    await expect(store.read(PATH)).rejects.toThrow(/Bad credentials/);

    expect(store.readOnly).toMatch(/has not been checked/);
    expect(storage.get(STORAGE.verified)).toBeNull();
    expect(changed).toBe(1);
  });
});
