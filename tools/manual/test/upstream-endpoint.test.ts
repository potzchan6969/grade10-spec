import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { CheckoutStanding } from "../src/api/types";
import { originMain, relayOf } from "../src/store/main-moved.mts";
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
 * on, in the test's hand. */
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
  const endpoints = storeEndpoints(
    rootsOf(root),
    artifacts,
    originMain(root, () => at),
  );
  return {
    api: async (request: StoreRequest) => body(await endpoints(request)),
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

    expect(read).toMatchObject({
      ahead: 0,
      behind: 2,
      dirty: false,
      fetched: true,
    });
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
    expect(read.body).toEqual({
      ahead: 0,
      behind: 0,
      dirty: false,
      fetched: false,
    });
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
    expect(String(answer.body.reason)).toContain("uncommitted");
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
    expect(String(answer.body.reason)).toContain("1 commit ahead");
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
    expect(String(answer.body.reason)).toContain("origin");
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
