import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { draftProposal, type ProposalDraft } from "../src/editor/propose";
import {
  type Reply,
  type StoreRequest,
  storeEndpoints,
} from "../src/store/vite-plugin.mts";
import { writeStore } from "./tmp-store";

/** The dev propose endpoints, driven without a dev server. This transport
 * writes straight to the working tree, so every refusal here is the tree's
 * only guard — and the allowlist is the same one the browser holds. */

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

function store() {
  const root = writeStore({
    "manual/manual.yaml": "products:\n  - demo-product\n",
    "manual/index.md": "---\ntitle: Demo\n---\n\nOne paragraph.\n",
    "openspec/specs/demo-product/alpha/spec.md": "# alpha\n",
    "openspec/changes/archive/2026-01-01-old/proposal.md": "# Old\n",
  });
  const endpoints = storeEndpoints(root);
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

const propose = (files: unknown) => post("/api/propose", { files });

describe("what the propose endpoint writes", () => {
  it("writes the change directory, and answers with its id", async () => {
    const { root, api } = store();

    const answer = await api(propose(FILES));

    expect(answer).toEqual({ status: 200, body: { id: SLUG } });
    expect(readdirSync(join(root, DIR)).sort()).toEqual([
      ".openspec.yaml",
      "proposal.md",
    ]);
    expect(readFileSync(join(root, DIR, "proposal.md"), "utf8")).toBe(
      FILES[1].content,
    );
  });

  it("leaves no staging directory behind", async () => {
    const { root, api } = store();

    await api(propose(FILES));

    expect(readdirSync(join(root, "openspec/changes")).sort()).toEqual([
      "archive",
      SLUG,
    ]);
  });

  it("refuses a slug the store already has, and touches what is there", async () => {
    const { root, api } = store();
    await api(propose(FILES));
    const before = readFileSync(join(root, DIR, "proposal.md"), "utf8");

    const again = await api(
      propose(draftProposal({ ...DRAFT, title: "Something else entirely" })),
    );

    expect(again.status).toBe(409);
    expect(String(again.body.error)).toContain(SLUG);
    expect(readFileSync(join(root, DIR, "proposal.md"), "utf8")).toBe(before);
  });
});

describe("what the propose endpoint refuses", () => {
  it.each([
    ["a durable spec", "openspec/specs/demo-product/alpha/spec.md"],
    ["a delta", `${DIR}/specs/demo-product/alpha/spec.md`],
    ["a task list", `${DIR}/tasks.md`],
    ["a manual page", "manual/index.md"],
    ["a path that climbs out", "openspec/changes/../../escape.md"],
    ["the archive", "openspec/changes/archive/proposal.md"],
  ])("refuses %s, and writes nothing", async (_what, path) => {
    const { root, api } = store();

    const answer = await api(propose([{ path, content: "gone" }]));

    expect(answer.status).toBe(400);
    expect(existsSync(join(root, path))).toBe(
      path === "openspec/specs/demo-product/alpha/spec.md" ||
        path === "manual/index.md",
    );
    expect(readFileSync(join(root, "manual/index.md"), "utf8")).toContain(
      "One paragraph",
    );
  });

  it("refuses a body that is not a file set", async () => {
    const { api } = store();

    expect((await api(propose(undefined))).status).toBe(400);
    expect((await api(propose([{ path: `${DIR}/proposal.md` }]))).status).toBe(
      400,
    );
  });

  it("refuses a request another origin made", async () => {
    const { root, api } = store();

    const answer = await api({
      ...propose(FILES),
      headers: { "sec-fetch-site": "cross-site" },
    });

    expect(answer.status).toBe(403);
    expect(existsSync(join(root, DIR))).toBe(false);
  });
});

describe("withdrawing in dev", () => {
  it("takes the whole directory back", async () => {
    const { root, api } = store();
    await api(propose(FILES));

    const answer = await api(post("/api/withdraw", { id: SLUG }));

    expect(answer).toEqual({ status: 200, body: { withdrawn: true } });
    expect(existsSync(join(root, DIR))).toBe(false);
  });

  it("refuses, naming the file that makes it more than a proposal", async () => {
    const { root, api } = store();
    await api(propose(FILES));
    writeFileSync(join(root, DIR, "tasks.md"), "# Tasks\n");

    const answer = await api(post("/api/withdraw", { id: SLUG }));

    expect(answer.status).toBe(409);
    expect(String(answer.body.error)).toContain("`tasks.md`");
    expect(existsSync(join(root, DIR, "proposal.md"))).toBe(true);
  });

  it("refuses the archive, and every path that is not a change", async () => {
    const { root, api } = store();

    for (const id of ["archive", "../manual", "archive/2026-01-01-old"]) {
      expect((await api(post("/api/withdraw", { id }))).status).toBe(400);
    }
    expect(existsSync(join(root, "openspec/changes/archive"))).toBe(true);
    expect(existsSync(join(root, "manual"))).toBe(true);
  });

  it("says so when there is no such change", async () => {
    const { api } = store();

    const answer = await api(post("/api/withdraw", { id: "never-proposed" }));

    expect(answer.status).toBe(404);
  });
});
