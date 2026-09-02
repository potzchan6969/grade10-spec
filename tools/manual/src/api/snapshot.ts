import type { Archive, ChangeDocument, Snapshot } from "./types";

const STORE_URL = "/api/snapshot";
const ARCHIVE_URL = "/api/archive";
const CHANGE_URL = "/api/change";
const FIXTURE_URL = "/fixture-snapshot.json";

/** Where the snapshot in hand came from. The shell says so when it is not the store. */
export type SnapshotSource = "store" | "fixture";

export type LoadedSnapshot = {
  snapshot: Snapshot;
  source: SnapshotSource;
  /** Why the store was not used, when it was not. */
  reason?: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `${url} answered ${response.status} ${response.statusText}`,
    );
  }
  // The dev server falls back to index.html for a path it does not serve, so a
  // 200 alone does not mean the store answered.
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("json")) {
    throw new Error(`${url} answered ${type || "no content type"}, not JSON`);
  }
  return (await response.json()) as T;
}

const fetchSnapshot = (url: string) => fetchJson<Snapshot>(url);

function fixtureForced(search: string): boolean {
  return new URLSearchParams(search).has("fixture");
}

function describe(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

/**
 * One client path for both transports: the dev plugin and the static build
 * both answer `/api/snapshot`. The bundled fixture is the fallback, so the
 * shell still renders while the store readers do not exist yet.
 */
export async function loadSnapshot(
  search: string = window.location.search,
): Promise<LoadedSnapshot> {
  if (fixtureForced(search)) {
    return { snapshot: await fetchSnapshot(FIXTURE_URL), source: "fixture" };
  }

  try {
    return { snapshot: await fetchSnapshot(STORE_URL), source: "store" };
  } catch (cause) {
    return {
      snapshot: await fetchSnapshot(FIXTURE_URL),
      source: "fixture",
      reason: describe(cause),
    };
  }
}

let archivePromise: Promise<Archive> | null = null;

/**
 * `/api/archive` — years of shipped changes, so it is fetched once, only by the
 * views that show a timeline. There is no fixture fallback: an archive nobody
 * serves is a missing section, not a broken page.
 */
export function loadArchive(): Promise<Archive> {
  archivePromise ??= fetchJson<Archive>(ARCHIVE_URL);
  return archivePromise;
}

const documentPromises = new Map<string, Promise<ChangeDocument>>();

/**
 * `/api/change/<id>` — one change's files, fetched the first time its page
 * opens and kept after. A change that is not in flight has no document, and
 * the hosted site answers such a path with the app shell, which the JSON check
 * turns into an error rather than a blank page.
 */
export function loadChangeDocument(id: string): Promise<ChangeDocument> {
  let promise = documentPromises.get(id);
  if (!promise) {
    promise = fetchJson<ChangeDocument>(
      `${CHANGE_URL}/${encodeURIComponent(id)}`,
    );
    // A failed fetch is not cached: the next visit asks again.
    promise.catch(() => documentPromises.delete(id));
    documentPromises.set(id, promise);
  }
  return promise;
}
