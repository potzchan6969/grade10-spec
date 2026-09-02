import { createHash, randomUUID } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import { basename, dirname, extname, join } from "node:path";
import type { Plugin } from "vite";
import { GrammarError, parsePage, serializePage } from "../content/grammar.ts";
import {
  allowedProposal,
  type ProposalFile,
  slugProblem,
  withdrawProblem,
} from "../editor/propose.ts";
import { changeFile, confine, storePath } from "./disk.mts";
import { git } from "./git.mts";
import { type Roots, resolveRoots } from "./roots.mts";
import { readHeads, readStore, type Store, storeStamp } from "./snapshot.mts";

/**
 * Dev transport for the store. Both GETs are computed from the resolved roots
 * per request — memoized on git heads plus the newest mtime, so an editor can
 * poll them — and every write is confined to the content root's `manual/`,
 * except a proposal, which goes to the store's `openspec/changes/`.
 */
export function manualStorePlugin(): Plugin {
  const roots = resolveRoots();

  return {
    name: "manual-store",
    configureServer(server) {
      ensureAssetsDir(roots.content);
      server.middlewares.use(middleware(roots, live(roots)));
    },
    configurePreviewServer(server) {
      const built = join(server.config.root, server.config.build.outDir);
      server.middlewares.use(middleware(roots, fromDist(built)));
    },
  };
}

type Artifacts = () => Promise<Store>;

function live(roots: Roots): Artifacts {
  let cached: { stamp: string; store: Store } | undefined;
  return async () => {
    const stamp = storeStamp(roots, await readHeads(roots));
    if (cached?.stamp !== stamp) {
      cached = { stamp, store: await readStore(roots) };
    }
    return cached.store;
  };
}

/** Preview serves what the build wrote, so a broken artifact shows up there. */
function fromDist(outDir: string): Artifacts {
  const api = join(outDir, "api");
  const readJson = (name: string) =>
    JSON.parse(readFileSync(join(api, name), "utf8"));
  return async () => ({
    snapshot: readJson("snapshot"),
    archive: readJson("archive"),
    documents: existsSync(join(api, "change"))
      ? readdirSync(join(api, "change")).map((id) =>
          readJson(join("change", id)),
        )
      : [],
  });
}

export type Reply =
  | { kind: "json"; status: number; body: unknown }
  | { kind: "bytes"; type: string; bytes: Buffer }
  | { kind: "pass" };

const PASS: Reply = { kind: "pass" };

function reply(status: number, body: unknown): Reply {
  return { kind: "json", status, body };
}

/** A request, with nothing of the dev server left on it. */
type Incoming = {
  method: string;
  url: URL;
  header: (name: string) => string | undefined;
  json: () => Promise<unknown>;
};

/** What a test drives: the same endpoints, without a server around them. */
export type StoreRequest = {
  method?: string;
  path: string;
  headers?: Record<string, string>;
  body?: unknown;
};

export function storeEndpoints(
  roots: Roots,
  artifacts: Artifacts = live(roots),
): (request: StoreRequest) => Promise<Reply> {
  return (request) =>
    route(roots, artifacts, {
      method: request.method ?? "GET",
      url: new URL(request.path, "http://manual.local"),
      header: (name) => request.headers?.[name],
      json: async () => request.body ?? {},
    });
}

function middleware(roots: Roots, artifacts: Artifacts) {
  return (
    req: IncomingMessage,
    res: ServerResponse,
    next: (error?: unknown) => void,
  ): void => {
    const url = new URL(req.url ?? "/", "http://manual.local");
    const path = url.pathname;
    if (!path.startsWith("/api/") && !path.startsWith("/assets/")) {
      next();
      return;
    }
    route(roots, artifacts, incoming(req, url))
      .catch((cause) => {
        console.error(`manual-store: ${path} failed`, cause);
        return reply(500, { error: describe(cause) });
      })
      .then((answer) => send(res, answer, next));
  };
}

function incoming(req: IncomingMessage, url: URL): Incoming {
  return {
    method: req.method ?? "GET",
    url,
    header: (name) => {
      const value = req.headers[name];
      return Array.isArray(value) ? value[0] : value;
    },
    json: () => readJsonBody(req),
  };
}

async function route(
  roots: Roots,
  artifacts: Artifacts,
  req: Incoming,
): Promise<Reply> {
  const method = req.method;
  const url = req.url;
  const path = url.pathname;

  // These endpoints answer a plain POST, which needs no preflight to reach —
  // so the browser's own account of where the request came from is the only
  // thing standing between a page on another origin and this working tree.
  if (method !== "GET" && method !== "HEAD") {
    const site = req.header("sec-fetch-site");
    if (site !== undefined && site !== "same-origin" && site !== "none") {
      return reply(403, { error: `a ${site} request cannot write here` });
    }
  }

  // Only `manual/assets/` is ours under /assets/; the bundler owns the rest.
  if (path.startsWith("/assets/")) {
    if (method !== "GET" && method !== "HEAD") return notAllowed(method);
    return serveAsset(
      roots.content,
      decodeURIComponent(path.slice("/assets/".length)),
    );
  }

  if (method === "GET") {
    if (path === "/api/snapshot")
      return reply(200, (await artifacts()).snapshot);
    if (path === "/api/archive") return reply(200, (await artifacts()).archive);
    if (path.startsWith("/api/change/")) {
      const id = decodeURIComponent(path.slice("/api/change/".length));
      const found = (await artifacts()).documents.find((one) => one.id === id);
      return found
        ? reply(200, found)
        : reply(404, { error: `no change in flight: ${id}` });
    }
    if (path === "/api/dirty")
      return reply(200, await readDirty(roots.content));
    if (path === "/api/page")
      return readPage(roots.content, url.searchParams.get("path"));
    return reply(404, { error: `no such endpoint: ${path}` });
  }
  if (method === "DELETE") {
    if (path === "/api/page")
      return deletePage(roots.content, await req.json());
    return reply(404, { error: `no such endpoint: ${path}` });
  }
  if (method !== "POST") return notAllowed(method);

  const body = await req.json();
  if (path === "/api/page") return writePage(roots.content, body);
  if (path === "/api/asset") return writeAsset(roots.content, body);
  if (path === "/api/propose") return propose(roots.store, body);
  if (path === "/api/withdraw") return withdraw(roots.store, body);
  if (path === "/api/commit") return commit(roots.content, body);
  return reply(404, { error: `no such endpoint: ${path}` });
}

// --- reads ---------------------------------------------------------------

/** What the commit bar watches: the manual edits sitting in the working tree. */
async function readDirty(
  root: string,
): Promise<{ dirty: boolean; files: string[] }> {
  const status = await git(root, [
    "status",
    "--porcelain",
    "--untracked-files=all",
    "-z",
    "--",
    "manual",
  ]);
  const records = status.split("\0").filter((record) => record !== "");
  const files: string[] = [];
  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    files.push(record.slice(3));
    // A rename carries its source path as the next record.
    if (record.startsWith("R") || record.startsWith("C")) i += 1;
  }
  return { dirty: files.length > 0, files };
}

/** The page as it sits on disk, with the version a later write must match.
 * The snapshot carries the source too, but not the version — and it is the
 * version that makes a save safe. */
function readPage(root: string, path: string | null): Reply {
  if (path === null || path === "") {
    return reply(400, { error: "`path` is required" });
  }
  const file = confine(root, "manual", path);
  if (typeof file !== "string") return reply(400, file);
  if (!existsSync(file) || !statSync(file).isFile()) {
    return reply(404, { error: `no such page: ${path}` });
  }
  const bytes = readFileSync(file);
  return reply(200, { source: bytes.toString("utf8"), version: hash(bytes) });
}

const MIME: Record<string, string> = {
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function serveAsset(root: string, name: string): Reply {
  const file = confine(root, "manual/assets", name);
  if (typeof file !== "string") return reply(400, file);
  if (!existsSync(file) || !statSync(file).isFile()) return PASS;
  return {
    kind: "bytes",
    type: MIME[extname(file)] ?? "application/octet-stream",
    bytes: readFileSync(file),
  };
}

// --- writes --------------------------------------------------------------

function writePage(root: string, body: unknown): Reply {
  const fields = (body ?? {}) as Record<string, unknown>;
  const path = fields.path;
  const source = fields.source;
  if (typeof path !== "string" || typeof source !== "string") {
    return reply(400, { error: "`path` and `source` are required" });
  }
  if (!path.endsWith(".md")) {
    return reply(400, { error: "a page path ends in `.md`" });
  }
  const file = confine(root, "manual", path);
  if (typeof file !== "string") return reply(400, file);

  try {
    const canonical = serializePage(parsePage(source));
    if (canonical !== source) {
      return reply(400, {
        error: "page is not canonical; serialize it before saving",
        canonical,
      });
    }
  } catch (cause) {
    return reply(400, {
      error: describe(cause),
      line: cause instanceof GrammarError ? cause.line : undefined,
    });
  }

  return save(
    file,
    Buffer.from(source, "utf8"),
    fields.baseVersion ?? null,
    true,
  );
}

/** Dev only, and version-checked like every write here: the page nobody else
 * touched since it was read is the only page that goes. */
function deletePage(root: string, body: unknown): Reply {
  const fields = (body ?? {}) as Record<string, unknown>;
  const path = fields.path;
  if (typeof path !== "string" || !path.endsWith(".md")) {
    return reply(400, { error: "a page path ends in `.md`" });
  }
  const file = confine(root, "manual", path);
  if (typeof file !== "string") return reply(400, file);
  if (!existsSync(file)) return reply(404, { error: `no such page: ${path}` });

  const current = readFileSync(file);
  const version = hash(current);
  if (fields.baseVersion !== version) {
    return reply(409, {
      error: "page changed since it was read",
      current: { source: current.toString("utf8"), version },
    });
  }
  rmSync(file);
  return reply(200, { deleted: true });
}

function writeAsset(root: string, body: unknown): Reply {
  const fields = (body ?? {}) as Record<string, unknown>;
  const path = fields.path;
  const base64 = fields.base64;
  if (typeof path !== "string" || typeof base64 !== "string") {
    return reply(400, { error: "`path` and `base64` are required" });
  }
  const file = confine(root, "manual/assets", path);
  if (typeof file !== "string") return reply(400, file);

  // Node decodes base64 by skipping whatever is not base64, so a damaged
  // upload lands as a shorter file instead of a refusal. Re-encoding is the
  // only way to hear about it.
  const clean = base64.replace(/\s+/g, "");
  const bytes = Buffer.from(clean, "base64");
  if (bytes.toString("base64") !== clean) {
    return reply(400, { error: "`base64` is not valid base64" });
  }
  return save(file, bytes, fields.baseVersion ?? null, false);
}

/**
 * The one write that leaves `manual/`, and it leaves it for exactly one new
 * change directory: the same allowlist the browser holds, applied again here,
 * because this endpoint writes straight to the working tree.
 *
 * The directory is built beside the changes tree and moved into place in one
 * rename, so a reader — the snapshot walk, the checker, git — sees a change
 * with both its files or no change at all.
 */
function propose(root: string, body: unknown): Reply {
  const files = proposalFiles(body);
  if (!Array.isArray(files)) return reply(400, files);

  const allowed = allowedProposal(files);
  if ("error" in allowed) return reply(400, { error: allowed.error });
  const { slug } = allowed;

  const dir = changeFile(root, slug);
  if (typeof dir !== "string") return reply(400, dir);
  const targets: { name: string; content: string }[] = [];
  for (const file of files) {
    const name = file.path.split("/")[3];
    const target = changeFile(root, slug, name);
    if (typeof target !== "string") return reply(400, target);
    targets.push({ name, content: file.content });
  }
  if (existsSync(dir)) {
    return reply(409, { error: `a change \`${slug}\` already exists` });
  }

  mkdirSync(dirname(dir), { recursive: true });
  const staging = mkdtempSync(join(dirname(dir), `.${slug}.`));
  try {
    for (const target of targets) {
      writeFileSync(join(staging, target.name), target.content, "utf8");
    }
    renameSync(staging, dir);
  } catch (cause) {
    rmSync(staging, { recursive: true, force: true });
    throw cause;
  }
  return reply(200, { id: slug });
}

/** Dev only: a proposal goes back out whole, and only while it is still just a
 * proposal. Anything else in the directory means it has become a real change. */
function withdraw(root: string, body: unknown): Reply {
  const id = ((body ?? {}) as Record<string, unknown>).id;
  if (typeof id !== "string" || id === "") {
    return reply(400, { error: "`id` is required" });
  }
  const shape = slugProblem(id);
  if (shape) return reply(400, { error: shape });

  const dir = changeFile(root, id);
  if (typeof dir !== "string") return reply(400, dir);
  if (!existsSync(dir)) return reply(404, { error: `no change \`${id}\`` });

  const problem = withdrawProblem(id, readdirSync(dir));
  if (problem) return reply(409, { error: problem });

  rmSync(dir, { recursive: true });
  return reply(200, { withdrawn: true });
}

function proposalFiles(body: unknown): ProposalFile[] | { error: string } {
  const sent = ((body ?? {}) as Record<string, unknown>).files;
  if (!Array.isArray(sent)) return { error: "`files` is required" };
  const files: ProposalFile[] = [];
  for (const entry of sent) {
    const file = (entry ?? {}) as Record<string, unknown>;
    if (typeof file.path !== "string" || typeof file.content !== "string") {
      return { error: "every file is a `path` and its `content`" };
    }
    files.push({ path: file.path, content: file.content });
  }
  return files;
}

/** Optimistic concurrency: `version` is the content hash the editor read, so
 * two writers become a rendered conflict instead of a silent overwrite. A
 * null `baseVersion` means create-new. */
function save(
  file: string,
  bytes: Buffer,
  baseVersion: unknown,
  withSource: boolean,
): Reply {
  if (baseVersion !== null && typeof baseVersion !== "string") {
    return reply(400, { error: "`baseVersion` is a version string or null" });
  }

  if (existsSync(file)) {
    const current = readFileSync(file);
    const version = hash(current);
    const source = withSource ? current.toString("utf8") : undefined;
    if (baseVersion === null) {
      return reply(409, {
        error: "file already exists",
        current: { source, version },
      });
    }
    if (baseVersion !== version) {
      return reply(409, {
        error: "file changed since it was read",
        current: { source, version },
      });
    }
  } else if (baseVersion !== null) {
    return reply(409, { error: "file no longer exists", current: null });
  }

  mkdirSync(dirname(file), { recursive: true });
  writeAtomically(file, bytes);
  return reply(200, { version: hash(bytes) });
}

/** A rename within the directory is atomic, so a reader — the snapshot walk,
 * the checker, git — never sees half a page. */
function writeAtomically(file: string, bytes: Buffer): void {
  const temp = join(dirname(file), `.${basename(file)}.${randomUUID()}.tmp`);
  try {
    writeFileSync(temp, bytes);
    renameSync(temp, file);
  } catch (cause) {
    rmSync(temp, { force: true });
    throw cause;
  }
}

async function commit(root: string, body: unknown): Promise<Reply> {
  const message = ((body ?? {}) as Record<string, unknown>).message;
  if (typeof message !== "string" || message.trim() === "") {
    return reply(400, { error: "`message` is required" });
  }
  await git(root, ["add", "-A", "--", "manual"]);
  const staged = await git(root, [
    "diff",
    "--cached",
    "--name-only",
    "--",
    "manual",
  ]);
  if (staged.trim() === "") return reply(200, { committed: false });

  await git(root, ["commit", "-m", message, "--", "manual"]);
  const sha = (await git(root, ["rev-parse", "HEAD"])).trim();
  return reply(200, {
    committed: true,
    sha,
    files: staged.trim().split("\n"),
  });
}

// --- plumbing ------------------------------------------------------------

function ensureAssetsDir(root: string): void {
  const dir = join(root, "manual", "assets");
  if (existsSync(dir)) return;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, ".gitkeep"), "");
  console.info(`manual-store: created ${storePath(root, dir)}/`);
}

function send(
  res: ServerResponse,
  answer: Reply,
  next: (error?: unknown) => void,
): void {
  if (answer.kind === "pass") {
    next();
    return;
  }
  res.setHeader("cache-control", "no-store");
  if (answer.kind === "bytes") {
    res.statusCode = 200;
    res.setHeader("content-type", answer.type);
    res.setHeader("content-length", String(answer.bytes.byteLength));
    res.end(answer.bytes);
    return;
  }
  res.statusCode = answer.status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(answer.body));
}

function notAllowed(method: string): Reply {
  return reply(405, { error: `${method} is not allowed here` });
}

function hash(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).byteLength;
    if (size > 64 * 1024 * 1024) throw new Error("request body too large");
    chunks.push(chunk as Buffer);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (text.trim() === "") return {};
  try {
    return JSON.parse(text);
  } catch (cause) {
    throw new Error(`request body is not JSON: ${describe(cause)}`);
  }
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}
