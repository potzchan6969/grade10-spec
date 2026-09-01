import { describe, expect, it } from "vitest";
import { LocalStore, probeLocalStore } from "../src/editor/local-store";
import { StoreError } from "../src/editor/store";

/** The dev transport against a mocked `/api`. The conflict path is the one
 * that matters: two editors must end in a rendered choice, never a silent
 * overwrite. */

type Call = { url: string; method: string; body: unknown };

function mockFetch(
  answers: (call: Call) => { status: number; body: unknown } | Response,
) {
  const calls: Call[] = [];
  const http = (async (input: string | URL | Request, init?: RequestInit) => {
    const call: Call = {
      url: String(input),
      method: init?.method ?? "GET",
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    };
    calls.push(call);
    const answer = answers(call);
    if (answer instanceof Response) return answer;
    return new Response(JSON.stringify(answer.body), {
      status: answer.status,
      headers: { "content-type": "application/json" },
    });
  }) as typeof fetch;
  return { http, calls };
}

const PATH = "manual/products/demo/alpha.md";
const MINE = "---\ntitle: Mine\n---\n\nMy paragraph.\n";
const THEIRS = "---\ntitle: Theirs\n---\n\nTheir paragraph.\n";

describe("LocalStore", () => {
  it("reads a page and the version to write it back against", async () => {
    const { http, calls } = mockFetch(() => ({
      status: 200,
      body: { source: MINE, version: "abc" },
    }));

    const file = await new LocalStore(http).read(PATH);

    expect(file).toEqual({ source: MINE, version: "abc" });
    expect(calls[0].url).toBe(`/api/page?path=${encodeURIComponent(PATH)}`);
  });

  it("writes with the base version it was given", async () => {
    const { http, calls } = mockFetch(() => ({
      status: 200,
      body: { version: "new" },
    }));

    const outcome = await new LocalStore(http).write(PATH, MINE, "abc");

    expect(outcome).toEqual({ status: "ok", version: "new" });
    expect(calls[0]).toMatchObject({
      url: "/api/page",
      method: "POST",
      body: { path: PATH, source: MINE, baseVersion: "abc" },
    });
  });

  it("hands back the other side when the file moved underneath", async () => {
    const { http } = mockFetch(() => ({
      status: 409,
      body: {
        error: "file changed since it was read",
        current: { source: THEIRS, version: "theirs" },
      },
    }));

    const outcome = await new LocalStore(http).write(PATH, MINE, "abc");

    expect(outcome).toEqual({
      status: "conflict",
      current: { source: THEIRS, version: "theirs" },
    });
  });

  it("takes the write once it is aimed at the version on disk", async () => {
    const store = new LocalStore(
      mockFetch((call) => {
        const base = (call.body as { baseVersion: string }).baseVersion;
        return base === "theirs"
          ? { status: 200, body: { version: "merged" } }
          : {
              status: 409,
              body: { current: { source: THEIRS, version: "theirs" } },
            };
      }).http,
    );

    const first = await store.write(PATH, MINE, "abc");
    expect(first.status).toBe("conflict");
    if (first.status !== "conflict") return;

    const retry = await store.write(PATH, MINE, first.current?.version ?? null);
    expect(retry).toEqual({ status: "ok", version: "merged" });
  });

  it("reports a page that vanished as a conflict with nothing to show", async () => {
    const { http } = mockFetch(() => ({
      status: 409,
      body: { error: "file no longer exists", current: null },
    }));

    expect(await new LocalStore(http).write(PATH, MINE, "abc")).toEqual({
      status: "conflict",
      current: null,
    });
  });

  it("throws rather than swallowing a refusal", async () => {
    const { http } = mockFetch(() => ({
      status: 400,
      body: { error: "page is not canonical; serialize it before saving" },
    }));

    await expect(new LocalStore(http).write(PATH, MINE, null)).rejects.toThrow(
      /not canonical/,
    );
  });

  it("creates an asset with no base version and reads back its version", async () => {
    const { http, calls } = mockFetch(() => ({
      status: 200,
      body: { version: "asset" },
    }));

    const outcome = await new LocalStore(http).writeBinary(
      "manual/assets/x.png",
      new Uint8Array([1, 2, 3]),
      null,
    );

    expect(outcome).toEqual({ status: "ok", version: "asset" });
    expect(calls[0]).toMatchObject({
      url: "/api/asset",
      body: { path: "manual/assets/x.png", base64: "AQID", baseVersion: null },
    });
  });

  it("deletes only the version it read", async () => {
    const { http, calls } = mockFetch(() => ({
      status: 200,
      body: { deleted: true },
    }));

    await new LocalStore(http).deletePage(PATH, "abc");

    expect(calls[0]).toMatchObject({
      url: "/api/page",
      method: "DELETE",
      body: { path: PATH, baseVersion: "abc" },
    });
  });

  it.each([
    "openspec/specs/demo/spec.md",
    "manual/../openspec/specs/demo/spec.md",
    "/etc/hosts",
    "manual/",
  ])("refuses to ask the dev server for %s at all", async (path) => {
    const { http, calls } = mockFetch(() => ({ status: 200, body: {} }));
    const store = new LocalStore(http);

    await expect(store.write(path, MINE, null)).rejects.toThrow(/manual\//);
    await expect(
      store.writeBinary(path, new Uint8Array([1]), null),
    ).rejects.toThrow(/manual\//);
    await expect(store.deletePage(path, "abc")).rejects.toThrow(/manual\//);
    expect(calls).toHaveLength(0);
  });

  it("refuses an HTML answer, because the dev server serves index.html", async () => {
    const { http } = mockFetch(
      () =>
        new Response("<!doctype html>", {
          headers: { "content-type": "text/html" },
        }),
    );

    await expect(new LocalStore(http).read(PATH)).rejects.toBeInstanceOf(
      StoreError,
    );
    expect(await probeLocalStore(http)).toBe(false);
  });

  it("is available when /api/dirty answers JSON", async () => {
    const { http } = mockFetch(() => ({
      status: 200,
      body: { dirty: true, files: ["manual/index.md"] },
    }));

    expect(await probeLocalStore(http)).toBe(true);
    expect(await new LocalStore(http).dirty()).toEqual({
      dirty: true,
      files: ["manual/index.md"],
    });
  });
});
