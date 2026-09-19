import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import YAML from "yaml";
import { rootsOf } from "../src/store/roots.mts";
import {
  type Reply,
  type StoreRequest,
  storeEndpoints,
} from "../src/store/vite-plugin.mts";
import { writeStore } from "./tmp-store";

/**
 * Assign's write path: `POST /api/hands`, driven the way `store-propose.test.ts`
 * drives `/api/propose` — straight against the endpoint, no dev server, so
 * every refusal here is the confinement's own.
 */

const DIR = "openspec/changes/expire-loyalty-points";

/** Every handle a test below assigns: the endpoint refuses what the store's
 * own `hands` rule refuses, so a handle it writes has to be one the team map
 * carries. */
const TEAM = [
  "handles:",
  "  robin:",
  "    roles: [pm]",
  "  kim:",
  "    roles: [pm]",
  "  dana:",
  "    roles: [design]",
  "  sam:",
  "    roles: [dev]",
  "",
].join("\n");

function store(manifest = "schema: grade10-planning\ncreated: 2026-08-30\n") {
  const root = writeStore({
    [`${DIR}/.openspec.yaml`]: manifest,
    [`${DIR}/proposal.md`]: "# Loyalty points should expire\n",
    "docs/prds/team.yaml": TEAM,
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

const assign = (fields: Record<string, unknown>) => post("/api/hands", fields);

function manifestOf(root: string): Record<string, unknown> {
  return YAML.parse(readFileSync(join(root, DIR, ".openspec.yaml"), "utf8"));
}

describe("what the hands endpoint writes", () => {
  it("shared-planning-change-stages-SC-68 - writes hands: on a change that carries none yet", async () => {
    const { root, api } = store();

    const answer = await api(
      assign({ change: "expire-loyalty-points", role: "pm", handle: "robin" }),
    );

    expect(answer).toEqual({
      status: 200,
      body: { role: "pm", handle: "robin" },
    });
    expect(manifestOf(root).hands).toEqual({ pm: "robin" });
  });

  it("merges into hands: already there, leaving every other role as it was", async () => {
    const { root, api } = store(
      "schema: grade10-planning\ncreated: 2026-08-30\nhands:\n  pm: robin\n",
    );

    await api(
      assign({
        change: "expire-loyalty-points",
        role: "design",
        handle: "dana",
      }),
    );

    expect(manifestOf(root).hands).toEqual({ pm: "robin", design: "dana" });
  });

  it("replaces a role's own handle rather than adding a second", async () => {
    const { root, api } = store(
      "schema: grade10-planning\ncreated: 2026-08-30\nhands:\n  pm: robin\n",
    );

    await api(
      assign({ change: "expire-loyalty-points", role: "pm", handle: "kim" }),
    );

    expect(manifestOf(root).hands).toEqual({ pm: "kim" });
  });

  it("normalizes the handle the way every reader in the store spells one", async () => {
    const { root, api } = store();

    await api(
      assign({ change: "expire-loyalty-points", role: "dev", handle: "@Sam" }),
    );

    expect(manifestOf(root).hands).toEqual({ dev: "sam" });
  });

  it("leaves the manifest's other fields as they were", async () => {
    const { root, api } = store();

    await api(
      assign({ change: "expire-loyalty-points", role: "pm", handle: "robin" }),
    );

    const written = manifestOf(root);
    expect(written.schema).toBe("grade10-planning");
    expect(written.created).toBe("2026-08-30");
  });
});

describe("what the hands endpoint refuses", () => {
  it("refuses a role outside the six", async () => {
    const { root, api } = store();

    const answer = await api(
      assign({ change: "expire-loyalty-points", role: "ops", handle: "robin" }),
    );

    expect(answer.status).toBe(400);
    expect(String(answer.body.error)).toContain("role");
    expect(manifestOf(root).hands).toBeUndefined();
  });

  it("refuses an empty or missing handle", async () => {
    const { api } = store();

    for (const handle of ["", "   ", undefined]) {
      const answer = await api(
        assign({ change: "expire-loyalty-points", role: "pm", handle }),
      );
      expect(answer.status).toBe(400);
    }
  });

  it("shared-planning-change-stages-SC-14 - refuses a handle the team map does not know, before the write", async () => {
    const { root, api } = store();

    const answer = await api(
      assign({ change: "expire-loyalty-points", role: "pm", handle: "ghost" }),
    );

    expect(answer.status).toBe(400);
    expect(String(answer.body.error)).toContain("ghost");
    expect(String(answer.body.error)).toContain("team.yaml");
    expect(manifestOf(root).hands).toBeUndefined();
  });

  it("shared-planning-change-stages-SC-14 - refuses a handle shaped like more than one, before the write", async () => {
    const { root, api } = store();

    const answer = await api(
      assign({
        change: "expire-loyalty-points",
        role: "pm",
        handle: "robin smith",
      }),
    );

    expect(answer.status).toBe(400);
    expect(String(answer.body.error)).toContain("one handle");
    expect(manifestOf(root).hands).toBeUndefined();
  });

  it("says so for a change nothing has proposed", async () => {
    const { api } = store();

    const answer = await api(
      assign({ change: "never-proposed", role: "pm", handle: "robin" }),
    );

    expect(answer.status).toBe(404);
  });

  it("refuses the archive, and a slug shaped wrong", async () => {
    const { api } = store();

    for (const change of ["archive", "Not-A-Slug", "../escape"]) {
      const answer = await api(assign({ change, role: "pm", handle: "robin" }));
      expect(answer.status).toBe(400);
    }
  });

  it("names the yaml package's own error for a record it cannot parse", async () => {
    const { api } = store("schema: grade10-planning\nhands: [\n");

    const answer = await api(
      assign({ change: "expire-loyalty-points", role: "pm", handle: "robin" }),
    );

    expect(answer.status).toBe(400);
    expect(String(answer.body.error)).toContain(".openspec.yaml");
  });

  it("refuses a request another origin made", async () => {
    const { root, api } = store();

    const answer = await api({
      ...assign({
        change: "expire-loyalty-points",
        role: "pm",
        handle: "robin",
      }),
      headers: { "sec-fetch-site": "cross-site" },
    });

    expect(answer.status).toBe(403);
    expect(manifestOf(root).hands).toBeUndefined();
  });
});
