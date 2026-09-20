import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { CheckoutStanding } from "../src/api/types";
import { git as runGit, type GitRun } from "../src/store/git.mts";
import { liveBodies, originMain, relayOf } from "../src/store/main-moved.mts";
import { rootsOf } from "../src/store/roots.mts";
import type { Store } from "../src/store/snapshot.mts";
import {
  type Reply,
  type StoreRequest,
  storeEndpoints,
} from "../src/store/vite-plugin.mts";
import { gitStore, MANIFEST } from "./git-store";

/**
 * The four endpoints the live line adds to the dev server, driven without a
 * dev server: what the checkout stands at against `main`, and the pull that
 * catches it up. `/api/pull` writes to a working tree, so every refusal here
 * is the only thing standing between one click and a clobbered checkout.
 */

const HEAD = "9f1c2b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b";
const MINUTE = 60_000;
const IDENTITY = ["-c", "user.email=manual@test", "-c", "user.name=manual"];

/** The store the head endpoint answers from. Reading a real one would read a
 * whole store to prove one field. */
const artifacts = async () =>
  ({ snapshot: { storeHead: HEAD } }) as unknown as Store;

function body(answer: Reply) {
  if (answer.kind !== "json") {
    throw new Error(`expected a JSON answer, got ${answer.kind}`);
  }
  return {
    body: answer.body as Record<string, unknown>,
    status: answer.status,
  };
}

/** A clone whose `main` can be moved from somewhere else, which is the only
 * way a fetch has anything to find. `at` is the clock the fetch is throttled
 * on, and `calls` is every git call the reading made with what it was given —
 * both in the test's hand. */
function checkout() {
  const remote = mkdtempSync(join(tmpdir(), "manual-origin-"));
  execFileSync("git", [
    "init",
    "--quiet",
    "--bare",
    "--initial-branch=main",
    remote,
  ]);

  const { root, git, write, commit } = gitStore("manual-upstream-");
  git(["symbolic-ref", "HEAD", "refs/heads/main"]);
  write("openspec/changes/add-gift-cards/.openspec.yaml", MANIFEST);
  commit("chore(openspec): open the change");
  git(["remote", "add", "origin", remote]);
  git(["push", "--quiet", "origin", "main"]);

  let at = Date.now();
  const calls: { args: string[]; run?: GitRun }[] = [];
  const endpoints = storeEndpoints(
    rootsOf(root),
    artifacts,
    originMain(root, () => at, (where, args, run) => {
      calls.push({ args, run });
      return runGit(where, args, run);
    }),
  );
  return {
    api: async (request: StoreRequest) => body(await endpoints(request)),
    calls,
    commit,
    git,
    remote,
    root,
    /** Wait the throttle out. */
    waitAMinute: () => {
      at += MINUTE + 1;
    },
    write,
  };
}

/** One commit on the remote's `main`, made from a clone of it. */
function moveMain(remote: string, subject: string) {
  const dir = mkdtempSync(join(tmpdir(), "manual-mover-"));
  execFileSync("git", ["clone", "--quiet", remote, dir]);
  writeFileSync(join(dir, `${subject.replace(/\W+/g, "-")}.md`), subject);
  for (const args of [
    ["add", "-A"],
    ["commit", "--quiet", "-m", subject],
    ["push", "--quiet", "origin", "main"],
  ]) {
    execFileSync("git", [...IDENTITY, ...args], { cwd: dir, stdio: "ignore" });
  }
}

const upstreamOf = async (
  api: (request: StoreRequest) => Promise<{ body: Record<string, unknown> }>,
) => (await api({ path: "/api/upstream" })).body as unknown as CheckoutStanding;

describe("what the checkout stands at", () => {
  it("counts the commits `main` is ahead by", async () => {
    const store = checkout();
    moveMain(store.remote, "one");
    moveMain(store.remote, "two");

    const read = await upstreamOf(store.api);

    expect(read).toMatchObject({ ahead: 0, behind: 2, dirty: false });
    expect(Date.parse(String(read.fetchedAt))).not.toBeNaN();
  });

  it("counts what the checkout has and `main` does not", async () => {
    const store = checkout();
    store.write(
      "openspec/changes/add-gift-cards/proposal.md",
      "# Gift cards\n",
    );
    store.commit("docs(openspec): draft the proposal");

    expect(await upstreamOf(store.api)).toMatchObject({ ahead: 1, behind: 0 });
  });

  it("says a working tree with anything in it is dirty", async () => {
    const store = checkout();
    store.write("openspec/changes/add-gift-cards/tasks.md", "## 1. Work\n");

    expect(await upstreamOf(store.api)).toMatchObject({ dirty: true });
  });

  it("reads `origin` at most once a minute", async () => {
    const store = checkout();
    expect(await upstreamOf(store.api)).toMatchObject({ behind: 0 });

    moveMain(store.remote, "one");
    expect(await upstreamOf(store.api)).toMatchObject({ behind: 0 });

    store.waitAMinute();
    expect(await upstreamOf(store.api)).toMatchObject({ behind: 1 });
  });

  it("reads nothing where the checkout has no `origin`", async () => {
    const { root } = gitStore("manual-lonely-");
    const endpoints = storeEndpoints(
      rootsOf(root),
      artifacts,
      originMain(root),
    );

    const read = body(await endpoints({ path: "/api/upstream" }));

    expect(read.status).toBe(200);
    expect(read.body).toEqual({ ahead: 0, behind: 0, dirty: false });
  });

  it("counts the minute from the attempt, not from a read that worked", async () => {
    // A remote that is unreachable is the one a page would ask about per tab
    // per minute. The next reader is answered from the refs the clone has.
    const store = checkout();
    store.git(["remote", "set-url", "origin", join(tmpdir(), "manual-gone")]);

    const first = await upstreamOf(store.api);
    const again = await upstreamOf(store.api);

    expect(store.calls.filter((one) => one.args[0] === "fetch")).toHaveLength(1);
    expect(first.fetchedAt).toBeUndefined();
    expect(again.fetchedAt).toBeUndefined();
  });
});

describe("the pull", () => {
  const pull = (store: ReturnType<typeof checkout>) =>
    store.api({ method: "POST", path: "/api/pull" });

  it("fast-forwards the checkout onto `main`", async () => {
    const store = checkout();
    moveMain(store.remote, "one");

    const answer = await pull(store);

    expect(answer.status).toBe(200);
    expect(answer.body.pulled).toBe(true);
    expect(String(answer.body.head)).toMatch(/^[0-9a-f]{40}$/);
    store.waitAMinute();
    expect(await upstreamOf(store.api)).toMatchObject({ ahead: 0, behind: 0 });
  });

  it("refuses a checkout with uncommitted changes, and moves nothing", async () => {
    const store = checkout();
    moveMain(store.remote, "one");
    store.write("openspec/changes/add-gift-cards/tasks.md", "## 1. Work\n");

    const answer = await pull(store);

    expect(answer.status).toBe(409);
    expect(String(answer.body.error)).toContain("uncommitted");
    store.waitAMinute();
    expect(await upstreamOf(store.api)).toMatchObject({ behind: 1 });
  });

  it("refuses a checkout that is ahead", async () => {
    const store = checkout();
    moveMain(store.remote, "one");
    store.write(
      "openspec/changes/add-gift-cards/proposal.md",
      "# Gift cards\n",
    );
    store.commit("docs(openspec): draft the proposal");

    const answer = await pull(store);

    expect(answer.status).toBe(409);
    expect(String(answer.body.error)).toContain("1 commit ahead");
  });

  it("carries back the fast-forward git itself refused", async () => {
    // The third refusal: the tree is clean and nothing is ahead, and git still
    // says no. What it said is the line the reader is shown.
    const store = checkout();
    execFileSync("git", [
      "--git-dir",
      store.remote,
      "update-ref",
      "-d",
      "refs/heads/main",
    ]);

    const answer = await pull(store);

    expect(answer.status).toBe(409);
    expect(String(answer.body.error)).toContain("main");
    expect(String(answer.body.error).split("\n")).toHaveLength(1);
  });

  it("runs one pull at a time, and says so to the second", async () => {
    // Two tabs, or one reader pressing twice: two fast-forwards over one
    // working tree race each other through git's own index lock.
    const store = checkout();
    moveMain(store.remote, "one");

    const [first, second] = await Promise.all([pull(store), pull(store)]);

    expect(first.status).toBe(200);
    expect(second.status).toBe(409);
    expect(second.body.error).toBe("A pull is already running.");
  });

  it("gives every leg that reaches the network a deadline and no prompt", async () => {
    // Nobody is at the dev server's terminal to type a password, and a remote
    // that never answers would hold the endpoint open until the tab closed.
    const store = checkout();
    moveMain(store.remote, "one");
    await pull(store);

    const legs = store.calls.filter((one) =>
      ["fetch", "pull"].includes(one.args[0]),
    );
    expect(legs.map((one) => one.args[0])).toEqual(["fetch", "pull"]);
    for (const leg of legs) {
      expect(leg.run?.timeout).toBe(30_000);
      expect(leg.run?.env?.GIT_TERMINAL_PROMPT).toBe("0");
    }
  });

  it("refuses a checkout with no `origin`", async () => {
    const { root } = gitStore("manual-lonely-");
    const endpoints = storeEndpoints(
      rootsOf(root),
      artifacts,
      originMain(root),
    );

    const answer = body(await endpoints({ method: "POST", path: "/api/pull" }));

    expect(answer.status).toBe(409);
    expect(String(answer.body.error)).toContain("origin");
  });
});

describe("what the browser is told about the relay", () => {
  it("names the relay the build was given", () => {
    expect(relayOf({ RELAY_URL: "https://relay.test" })).toEqual({
      url: "https://relay.test",
    });
  });

  it.each([
    ["nothing is set", {}],
    ["the variable is empty", { RELAY_URL: "" }],
  ])("names none where %s", (_what, env) => {
    expect(relayOf(env)).toEqual({});
  });

  it("writes the relay and the deployed head from one reading", () => {
    // The build writes these two as files and the dev server answers them per
    // request. One reading, so a page reads the same keys on either.
    expect(liveBodies(HEAD, { RELAY_URL: "https://relay.test" })).toEqual({
      head: { storeHead: HEAD },
      relay: { url: "https://relay.test" },
    });
    expect(liveBodies(HEAD, {})).toEqual({
      head: { storeHead: HEAD },
      relay: {},
    });
  });

  it("answers the relay and the deployed head over the endpoints", async () => {
    const { root } = gitStore("manual-live-");
    const endpoints = storeEndpoints(
      rootsOf(root),
      artifacts,
      originMain(root),
    );
    const set = process.env.RELAY_URL;
    process.env.RELAY_URL = "https://relay.test";

    try {
      expect(body(await endpoints({ path: "/api/relay" })).body).toEqual({
        url: "https://relay.test",
      });
      expect(body(await endpoints({ path: "/api/head" })).body).toEqual({
        storeHead: HEAD,
      });
    } finally {
      if (set === undefined) delete process.env.RELAY_URL;
      else process.env.RELAY_URL = set;
    }
  });
});
