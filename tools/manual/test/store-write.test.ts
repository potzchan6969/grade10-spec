import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { rootsOf } from "../src/store/roots.mts";
import {
  type Reply,
  type StoreRequest,
  storeEndpoints,
} from "../src/store/vite-plugin.mts";
import { writeStore } from "./tmp-store";

/** The dev write endpoints, driven without a dev server. Every refusal here
 * is the working tree's only guard: this transport writes straight to disk. */

const PAGE = "---\ntitle: Demo\n---\n\nOne paragraph.\n";
const EDITED = "---\ntitle: Demo\n---\n\nTwo paragraphs.\n";
const PNG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function store() {
  const root = writeStore({
    "manual/manual.yaml": "products:\n  - demo-product\n",
    "manual/index.md": PAGE,
  });
  const endpoints = storeEndpoints(rootsOf(root));
  const api = async (request: StoreRequest) => body(await endpoints(request));
  return { root, api };
}

function body(answer: Reply): {
  status: number;
  body: Record<string, unknown>;
} {
  if (answer.kind !== "json") {
    throw new Error(`expected a JSON answer, got ${answer.kind}`);
  }
  return {
    status: answer.status,
    body: answer.body as Record<string, unknown>,
  };
}

const post = (path: string, fields: Record<string, unknown>): StoreRequest => ({
  method: "POST",
  path,
  body: fields,
});

async function versionOf(
  api: (request: StoreRequest) => Promise<{ body: Record<string, unknown> }>,
  path: string,
): Promise<string> {
  const read = await api({
    path: `/api/page?path=${encodeURIComponent(path)}`,
  });
  return String(read.body.version);
}

describe("what the page endpoint refuses", () => {
  it.each([
    ["a path that climbs out", "manual/../escape.md"],
    ["an absolute path", "/etc/hosts.md"],
    ["a path under another store directory", "../openspec/specs/x.md"],
  ])("refuses %s", async (_what, path) => {
    const { root, api } = store();

    const answer = await api(post("/api/page", { path, source: PAGE }));

    expect(answer.status).toBe(400);
    expect(String(answer.body.error)).toContain("outside manual/");
    expect(existsSync(join(root, "..", "escape.md"))).toBe(false);
  });

  it("refuses a page that is not a `.md` file", async () => {
    const { api } = store();

    const answer = await api(
      post("/api/page", { path: "manual/index.txt", source: PAGE }),
    );

    expect(answer).toEqual({
      status: 400,
      body: { error: "a page path ends in `.md`" },
    });
  });

  it("refuses text the grammar cannot read, and names the line", async () => {
    const { api } = store();

    const answer = await api(
      post("/api/page", {
        path: "manual/index.md",
        source: '---\ntitle: Demo\n---\n\n::nonsense{id="a"}\n',
      }),
    );

    expect(answer.status).toBe(400);
    expect(String(answer.body.error)).toContain("unknown directive");
    expect(answer.body.line).toBe(5);
  });

  it("refuses text that is not canonical, and hands back what is", async () => {
    const { api } = store();
    const loose = "---\ntitle: Demo\n---\n\n\nOne paragraph.\n";

    const answer = await api(
      post("/api/page", { path: "manual/index.md", source: loose }),
    );

    expect(answer.status).toBe(400);
    expect(answer.body.error).toBe(
      "page is not canonical; serialize it before saving",
    );
    expect(answer.body.canonical).toBe(PAGE);
  });
});

describe("what the page endpoint takes", () => {
  it("refuses to create over a page that is already there", async () => {
    const { api } = store();

    const answer = await api(
      post("/api/page", {
        path: "manual/index.md",
        source: EDITED,
        baseVersion: null,
      }),
    );

    expect(answer.status).toBe(409);
    expect(answer.body.error).toBe("file already exists");
    expect(answer.body.current).toMatchObject({ source: PAGE });
  });

  it("refuses a version that is not the one on disk, and shows the one that is", async () => {
    const { api } = store();

    const answer = await api(
      post("/api/page", {
        path: "manual/index.md",
        source: EDITED,
        baseVersion: "stale",
      }),
    );

    expect(answer.status).toBe(409);
    expect(answer.body.error).toBe("file changed since it was read");
    expect(answer.body.current).toEqual({
      source: PAGE,
      version: await versionOf(api, "manual/index.md"),
    });
  });

  it("writes the page aimed at the version on disk, and leaves no debris", async () => {
    const { root, api } = store();
    const version = await versionOf(api, "manual/index.md");

    const answer = await api(
      post("/api/page", {
        path: "manual/index.md",
        source: EDITED,
        baseVersion: version,
      }),
    );

    expect(answer.status).toBe(200);
    expect(answer.body.version).toBe(await versionOf(api, "manual/index.md"));
    expect(readFileSync(join(root, "manual/index.md"), "utf8")).toBe(EDITED);
    // Written through a temp file, so nothing half-written is left behind.
    expect(readdirSync(join(root, "manual")).sort()).toEqual([
      "index.md",
      "manual.yaml",
    ]);
  });

  it("deletes only the version it was shown", async () => {
    const { root, api } = store();
    const page = join(root, "manual/index.md");

    const stale = await api({
      method: "DELETE",
      path: "/api/page",
      body: { path: "manual/index.md", baseVersion: "stale" },
    });
    expect(stale.status).toBe(409);
    expect(existsSync(page)).toBe(true);

    const gone = await api({
      method: "DELETE",
      path: "/api/page",
      body: {
        path: "manual/index.md",
        baseVersion: await versionOf(api, "manual/index.md"),
      },
    });
    expect(gone).toEqual({ status: 200, body: { deleted: true } });
    expect(existsSync(page)).toBe(false);
  });
});

describe("the asset endpoint", () => {
  it("writes the bytes it was handed", async () => {
    const { root, api } = store();

    const answer = await api(
      post("/api/asset", {
        path: "manual/assets/shot.png",
        base64: PNG.toString("base64"),
        baseVersion: null,
      }),
    );

    expect(answer.status).toBe(200);
    expect(readFileSync(join(root, "manual/assets/shot.png"))).toEqual(PNG);
  });

  it("refuses base64 that is not the encoding of any bytes", async () => {
    const { root, api } = store();

    const answer = await api(
      post("/api/asset", {
        path: "manual/assets/shot.png",
        base64: "not base64 at all!!",
        baseVersion: null,
      }),
    );

    expect(answer.status).toBe(400);
    expect(String(answer.body.error)).toContain("base64");
    expect(existsSync(join(root, "manual/assets/shot.png"))).toBe(false);
  });

  it("confines an asset to `manual/assets/` too", async () => {
    const { api } = store();

    const answer = await api(
      post("/api/asset", {
        path: "../../escape.png",
        base64: PNG.toString("base64"),
        baseVersion: null,
      }),
    );

    expect(answer.status).toBe(400);
    expect(String(answer.body.error)).toContain("outside manual/assets/");
  });
});

describe("where a write is allowed to come from", () => {
  const write = (headers: Record<string, string>): StoreRequest => ({
    ...post("/api/page", {
      path: "manual/index.md",
      source: EDITED,
      baseVersion: null,
    }),
    headers,
  });

  it("refuses a request another origin made", async () => {
    const { root, api } = store();

    const answer = await api(write({ "sec-fetch-site": "cross-site" }));

    expect(answer.status).toBe(403);
    expect(String(answer.body.error)).toContain("cross-site");
    expect(readFileSync(join(root, "manual/index.md"), "utf8")).toBe(PAGE);
  });

  it.each(["same-origin", "none"])(
    "lets a %s request through",
    async (site) => {
      const { api } = store();

      // 409 is the store answering — the request was routed, not turned away.
      expect((await api(write({ "sec-fetch-site": site }))).status).toBe(409);
    },
  );

  it("still answers a GET from anywhere, since it changes nothing", async () => {
    const { api } = store();

    const answer = await api({
      path: "/api/page?path=manual/index.md",
      headers: { "sec-fetch-site": "cross-site" },
    });

    expect(answer.status).toBe(200);
    expect(answer.body.source).toBe(PAGE);
  });
});
