import type { ProposalFile } from "./propose";
import {
  assertManualPath,
  assertProposal,
  base64FromBytes,
  type ContentStore,
  type StoredFile,
  StoreError,
  type Version,
  type WriteOutcome,
} from "./store";

/** The dev transport: the Vite plugin's `/api` endpoints. Store paths go over
 * the wire as they are read — the plugin confines every one of them to the
 * manual's directory itself. */

type Json = Record<string, unknown>;

type Answer = { status: number; body: Json };

async function call(
  http: typeof fetch,
  path: string,
  init?: RequestInit,
): Promise<Answer> {
  const response = await http(path, init);
  const type = response.headers.get("content-type") ?? "";
  // The dev server serves index.html for a path it does not own, so a 200
  // alone does not mean the store answered.
  if (!type.includes("json")) {
    throw new StoreError(
      response.status,
      `${path} answered ${type || "no content type"}, not JSON`,
    );
  }
  return { status: response.status, body: (await response.json()) as Json };
}

function json(body: unknown): RequestInit {
  return {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

function errorOf(answer: Answer, fallback: string): string {
  const message = answer.body.error;
  return typeof message === "string" ? message : fallback;
}

function currentOf(answer: Answer): StoredFile | null {
  const current = answer.body.current as Json | null | undefined;
  if (!current) return null;
  const { source, version } = current;
  if (typeof version !== "string") return null;
  return { source: typeof source === "string" ? source : "", version };
}

function versionOf(answer: Answer): Version {
  const version = answer.body.version;
  if (typeof version !== "string") {
    throw new StoreError(answer.status, "the store answered without a version");
  }
  return version;
}

/** Is a dev store answering at all? `/api/dirty` exists nowhere else. */
export async function probeLocalStore(
  http: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const answer = await call(http, "/api/dirty");
    return answer.status === 200;
  } catch {
    return false;
  }
}

export class LocalStore implements ContentStore {
  readonly label = "Dev server — writes straight to the working tree";

  private readonly http: typeof fetch;
  /** The dev server confines every write to this directory; refusing a path
   * outside it here keeps the request from being made at all. */
  private readonly manualDir: string;

  constructor(manualDir: string, http: typeof fetch = fetch) {
    this.manualDir = manualDir;
    this.http = http;
  }

  async read(path: string): Promise<StoredFile> {
    const answer = await call(
      this.http,
      `/api/page?path=${encodeURIComponent(path)}`,
    );
    if (answer.status !== 200) {
      throw new StoreError(
        answer.status,
        errorOf(answer, `cannot read ${path}`),
      );
    }
    const { source, version } = answer.body;
    if (typeof source !== "string" || typeof version !== "string") {
      throw new StoreError(answer.status, `${path} came back malformed`);
    }
    return { source, version };
  }

  async write(
    path: string,
    source: string,
    baseVersion: Version | null,
  ): Promise<WriteOutcome> {
    assertManualPath(this.manualDir, path);
    return this.save("/api/page", { path, source, baseVersion });
  }

  async writeBinary(
    path: string,
    bytes: Uint8Array,
    baseVersion: Version | null,
  ): Promise<WriteOutcome> {
    assertManualPath(this.manualDir, path);
    return this.save("/api/asset", {
      path,
      base64: base64FromBytes(bytes),
      baseVersion,
    });
  }

  async propose(files: ProposalFile[]): Promise<{ id: string }> {
    const slug = assertProposal(files);
    const answer = await call(this.http, "/api/propose", json({ files }));
    if (answer.status !== 200) {
      throw new StoreError(answer.status, errorOf(answer, "proposal refused"));
    }
    const id = answer.body.id;
    if (id !== slug) {
      throw new StoreError(answer.status, "the store wrote another change");
    }
    return { id };
  }

  async withdraw(id: string): Promise<void> {
    const answer = await call(this.http, "/api/withdraw", json({ id }));
    if (answer.status !== 200) {
      throw new StoreError(answer.status, errorOf(answer, "withdraw refused"));
    }
  }

  private async save(endpoint: string, body: unknown): Promise<WriteOutcome> {
    const answer = await call(this.http, endpoint, json(body));
    if (answer.status === 200) {
      return { status: "ok", version: versionOf(answer) };
    }
    if (answer.status === 409) {
      return { status: "conflict", current: currentOf(answer) };
    }
    throw new StoreError(answer.status, errorOf(answer, "the store refused"));
  }

  async deletePage(path: string, baseVersion: Version): Promise<void> {
    assertManualPath(this.manualDir, path);
    const answer = await call(this.http, "/api/page", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path, baseVersion }),
    });
    if (answer.status !== 200) {
      throw new StoreError(answer.status, errorOf(answer, "delete refused"));
    }
  }
}
