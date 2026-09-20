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
import { basename, dirname, extname, join, sep } from "node:path";
import type { Plugin, ViteDevServer } from "vite";
import {
  openRecord,
  setEntry,
} from "../../../../scripts/openspec/lib/record.mjs";
import {
  handleOf,
  isHandle,
  memberOf,
  readTeamMap,
  TEAM_MAP,
} from "../../../../scripts/openspec/lib/team.mjs";
import { STORE_CHANGED } from "../api/live.ts";
import { ROLES, type Role } from "../api/types.ts";
import { GrammarError, parsePage, serializePage } from "../content/grammar.ts";
import {
  allowedProposal,
  MANIFEST,
  type ProposalFile,
  slugProblem,
  withdrawProblem,
} from "../editor/propose.ts";
import { changeFile, confine, storePath } from "./disk.mts";
import { git } from "./git.mts";
import { type OriginMain, originMain, relayOf } from "./main-moved.mts";
import { type Roots, resolveRoots } from "./roots.mts";
import {
  readHeads,
  readStore,
  type Store,
  storeDirs,
  storeStamp,
} from "./snapshot.mts";
import { viewerMount } from "./viewer-mount.mts";

/**
 * Dev transport for the store. Both GETs are computed from the resolved roots
 * per request — memoized on git heads plus the newest mtime, so an editor can
 * poll them — and every write is confined to the content root's manual,
 * except a proposal, which goes to the store's `openspec/changes/`.
 *
 * One reading of `origin/main` per server, so the tabs a teammate has open
 * share one fetch rather than one each.
 */
export function manualStorePlugin(): Plugin {
  const roots = resolveRoots();

  return {
    name: "manual-store",
    configureServer(server) {
      ensureAssetsDir(roots);
      watchStore(server, roots);
      // Before the manual's own handler and Vite's fallback, or `/openspec/`
      // would be the manual's not-found page. The built site has the viewer
      // as files at the same address, so a link works on both.
      server.middlewares.use("/openspec", viewerMount(roots));
      server.middlewares.use(
        middleware(roots, live(roots), originMain(roots.store)),
      );
    },
    configurePreviewServer(server) {
      const built = join(server.config.root, server.config.build.outDir);
      server.middlewares.use(
        middleware(roots, fromDist(built), originMain(roots.store)),
      );
    },
  };
}

/**
 * The store is outside the module graph, so editing a page moves nothing Vite
 * watches. Watch what the artifacts are read from and say so on the socket;
 * the app re-reads the artifacts rather than reloading, which keeps the reader
 * on the page and at the scroll position they were already at.
 */
export function watchStore(server: ViteDevServer, roots: Roots): void {
  const dirs = storeDirs(roots);
  server.watcher.add(dirs);

  let pending: NodeJS.Timeout | undefined;
  const announce = (file: string) => {
    if (!dirs.some((dir) => file.startsWith(`${dir}${sep}`))) return;
    // An editor saves as several events, and a git checkout as thousands.
    // One announcement per burst, after the burst.
    clearTimeout(pending);
    pending = setTimeout(() => server.hot.send(STORE_CHANGED), 80);
  };
  for (const event of ["add", "change", "unlink"] as const) {
    server.watcher.on(event, announce);
  }
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
    documents: readAll("change"),
    references: readAll("reference"),
  });
  function readAll(kind: string) {
    return existsSync(join(api, kind))
      ? readdirSync(join(api, kind)).map((id) => readJson(join(kind, id)))
      : [];
  }
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
  origin: OriginMain = originMain(roots.store),
): (request: StoreRequest) => Promise<Reply> {
  return (request) =>
    route(roots, artifacts, origin, {
      method: request.method ?? "GET",
      url: new URL(request.path, "http://manual.local"),
      header: (name) => request.headers?.[name],
      json: async () => request.body ?? {},
    });
}

function middleware(roots: Roots, artifacts: Artifacts, origin: OriginMain) {
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
    route(roots, artifacts, origin, incoming(req, url))
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
  origin: OriginMain,
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

  // Only the manual's `assets/` is ours under /assets/; the bundler owns the rest.
  if (path.startsWith("/assets/")) {
    if (method !== "GET" && method !== "HEAD") return notAllowed(method);
    return serveAsset(roots, decodeURIComponent(path.slice("/assets/".length)));
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
    if (path.startsWith("/api/reference/")) {
      const slug = decodeURIComponent(path.slice("/api/reference/".length));
      const found = (await artifacts()).references.find(
        (one) => one.slug === slug,
      );
      return found
        ? reply(200, found)
        : reply(404, { error: `no reference: ${slug}` });
    }
    if (path === "/api/dirty") return reply(200, await readDirty(roots));
    // The three the live line adds. `/api/relay` and `/api/head` are what the
    // build writes as files, answered here from the same two readings, so a
    // page listens the same way on both transports.
    if (path === "/api/relay") return reply(200, relayOf());
    if (path === "/api/head")
      return reply(200, { storeHead: (await artifacts()).snapshot.storeHead });
    if (path === "/api/upstream") return reply(200, await origin.standing());
    if (path === "/api/page")
      return readPage(roots, url.searchParams.get("path"));
    return reply(404, { error: `no such endpoint: ${path}` });
  }
  if (method === "DELETE") {
    if (path === "/api/page") return deletePage(roots, await req.json());
    return reply(404, { error: `no such endpoint: ${path}` });
  }
  if (method !== "POST") return notAllowed(method);

  if (path === "/api/pull") {
    const outcome = await origin.pull();
    return reply("pulled" in outcome ? 200 : 409, outcome);
  }

  const body = await req.json();
  if (path === "/api/page") return writePage(roots, body);
  if (path === "/api/asset") return writeAsset(roots, body);
  if (path === "/api/propose") return propose(roots.store, body);
  if (path === "/api/withdraw") return withdraw(roots.store, body);
  if (path === "/api/hands") return assignHand(roots.store, body);
  return reply(404, { error: `no such endpoint: ${path}` });
}

// --- reads ---------------------------------------------------------------

/** Cheap and side-effect free, so `probeLocalStore` uses it to tell whether a
 * dev store answers at all. */
async function readDirty(
  roots: Roots,
): Promise<{ dirty: boolean; files: string[] }> {
  const status = await git(roots.content, [
    "status",
    "--porcelain",
    "--untracked-files=all",
    "-z",
    "--",
    roots.manual,
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
function readPage(roots: Roots, path: string | null): Reply {
  if (path === null || path === "") {
    return reply(400, { error: "`path` is required" });
  }
  const file = confine(roots.content, roots.manual, path);
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

function serveAsset(roots: Roots, name: string): Reply {
  const file = confine(roots.content, `${roots.manual}/assets`, name);
  if (typeof file !== "string") return reply(400, file);
  if (!existsSync(file) || !statSync(file).isFile()) return PASS;
  return {
    kind: "bytes",
    type: MIME[extname(file)] ?? "application/octet-stream",
    bytes: readFileSync(file),
  };
}

// --- writes --------------------------------------------------------------

function writePage(roots: Roots, body: unknown): Reply {
  const fields = (body ?? {}) as Record<string, unknown>;
  const path = fields.path;
  const source = fields.source;
  if (typeof path !== "string" || typeof source !== "string") {
    return reply(400, { error: "`path` and `source` are required" });
  }
  if (!path.endsWith(".md")) {
    return reply(400, { error: "a page path ends in `.md`" });
  }
  const file = confine(roots.content, roots.manual, path);
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
function deletePage(roots: Roots, body: unknown): Reply {
  const fields = (body ?? {}) as Record<string, unknown>;
  const path = fields.path;
  if (typeof path !== "string" || !path.endsWith(".md")) {
    return reply(400, { error: "a page path ends in `.md`" });
  }
  const file = confine(roots.content, roots.manual, path);
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

function writeAsset(roots: Roots, body: unknown): Reply {
  const fields = (body ?? {}) as Record<string, unknown>;
  const path = fields.path;
  const base64 = fields.base64;
  if (typeof path !== "string" || typeof base64 !== "string") {
    return reply(400, { error: "`path` and `base64` are required" });
  }
  const file = confine(roots.content, `${roots.manual}/assets`, path);
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
 * The one write that leaves the manual, and it leaves it for exactly one new
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

/**
 * Assign, on the locally run manual only: `record.mjs`'s own reader, so a
 * change with no record and a record the `yaml` package cannot parse are the
 * same two problems the round already knows how to report, and `setEntry`
 * writes the mapping the way it would create one for `reviewed:`. One field
 * is touched — every other key the file carries, comments included, rides
 * through untouched — so the write is one atomic rename, the way `save`
 * below writes a page.
 *
 * Refuses before the write what `checkHands` would refuse on the push: a
 * handle that is not one token, or one `docs/prds/team.yaml` does not carry —
 * the same two conditions, in the rule's own words, so a mistake here is
 * never a commit the check then has to catch.
 */
function assignHand(root: string, body: unknown): Reply {
  const fields = (body ?? {}) as Record<string, unknown>;
  const { change, role, handle } = fields;
  if (typeof change !== "string" || change === "") {
    return reply(400, { error: "`change` is required" });
  }
  const shape = slugProblem(change);
  if (shape) return reply(400, { error: shape });
  if (
    typeof role !== "string" ||
    !(ROLES as readonly string[]).includes(role)
  ) {
    return reply(400, { error: `\`role\` is one of ${ROLES.join(", ")}` });
  }
  const written = typeof handle === "string" ? handleOf(handle) : "";
  if (written === "") return reply(400, { error: "`handle` is required" });
  if (!isHandle(written)) {
    return reply(400, {
      error: `\`hands.${role}: ${written}\` is not one handle`,
    });
  }
  if (!memberOf(readTeamMap(root), written)) {
    return reply(400, {
      error: `\`hands.${role}\` names \`${written}\`, which \`${TEAM_MAP}\` does not know`,
    });
  }

  const dir = changeFile(root, change);
  if (typeof dir !== "string") return reply(400, dir);
  if (!existsSync(join(dir, MANIFEST))) {
    return reply(404, { error: `no change \`${change}\`` });
  }

  let record: ReturnType<typeof openRecord>;
  try {
    record = openRecord(root, change);
  } catch (cause) {
    return reply(400, { error: describe(cause) });
  }
  setEntry(record.doc, "hands", role, written);
  writeAtomically(record.file, Buffer.from(record.doc.toString(), "utf8"));
  return reply(200, { role: role as Role, handle: written });
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

// --- plumbing ------------------------------------------------------------

function ensureAssetsDir(roots: Roots): void {
  const dir = join(roots.content, roots.manual, "assets");
  if (existsSync(dir)) return;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, ".gitkeep"), "");
  console.info(`manual-store: created ${storePath(roots.content, dir)}/`);
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
