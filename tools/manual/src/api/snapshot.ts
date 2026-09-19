import type {
  Archive,
  ChangeDocument,
  ReferenceDocument,
  Snapshot,
} from "./types";

const STORE_URL = "/api/snapshot";
const ARCHIVE_URL = "/api/archive";
const CHANGE_URL = "/api/change";
const REFERENCE_URL = "/api/reference";
const FIXTURE_URL = "/fixture-snapshot.json";
const FIXTURE_CHANGES_URL = "/fixture-changes.json";

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

export type ArtifactReaders = {
  archive: () => Promise<Archive>;
  change: (id: string) => Promise<ChangeDocument>;
  reference: (slug: string) => Promise<ReferenceDocument>;
};

/**
 * One reading of the artifacts that are fetched lazily. Each memoizes what it
 * has already answered, and a re-read of the store replaces the whole set —
 * so no page is left holding one artifact from before an edit and one from
 * after, and nothing outlives the reading it belongs to.
 *
 * `archive` is `/api/archive`: years of shipped changes, fetched once and only
 * by the views that show a timeline. There is no fixture fallback — an archive
 * nobody serves is a missing section, not a broken page.
 *
 * `change` and `reference` are one artifact per id, fetched the first time its
 * page opens. An id nothing was written for has no artifact, and the hosted
 * site answers such a path with the app shell, which the JSON check turns into
 * an error rather than a blank page.
 *
 * `?fixture` reads the changes out of the bundled reading instead, the same
 * way `loadSnapshot` reads the snapshot: one tree answers both, so a walk
 * opening a change page sees the files the fixture store holds rather than the
 * "unavailable" note a path nothing serves would leave. It is the forced
 * fixture alone, never the fallback a failed `/api/snapshot` takes — a hosted
 * page whose own change is missing says so rather than showing a demo
 * change's files.
 */
export function artifactReaders(
  search: string = currentSearch(),
): ArtifactReaders {
  return {
    archive: once(() => fetchJson<Archive>(ARCHIVE_URL)),
    change: fixtureForced(search)
      ? fromBundledChanges()
      : perId<ChangeDocument>(CHANGE_URL),
    reference: perId<ReferenceDocument>(REFERENCE_URL),
  };
}

/** The address's own query, where there is an address: a node test imports
 * this module with no window at all, and the readers it builds there fetch
 * nothing, so no query is the honest answer rather than a crash on import. */
function currentSearch(): string {
  return typeof window === "undefined" ? "" : window.location.search;
}

/** The bundled changes, fetched once and answered per id — an id the file
 * does not hold is an error, the same as a path nothing serves. */
function fromBundledChanges(): (id: string) => Promise<ChangeDocument> {
  const all = once(() =>
    fetchJson<Record<string, ChangeDocument>>(FIXTURE_CHANGES_URL),
  );
  return async (id) => {
    const documents = await all();
    const found = documents[id];
    if (!found) {
      throw new Error(`${FIXTURE_CHANGES_URL} holds no change "${id}"`);
    }
    return found;
  };
}

function once<T>(fetch: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | null = null;
  return () => (promise ??= fetch());
}

function perId<T>(base: string): (id: string) => Promise<T> {
  const promises = new Map<string, Promise<T>>();
  return (id) => {
    let promise = promises.get(id);
    if (!promise) {
      promise = fetchJson<T>(`${base}/${encodeURIComponent(id)}`);
      // A failed fetch is not cached: the next visit asks again.
      promise.catch(() => promises.delete(id));
      promises.set(id, promise);
    }
    return promise;
  };
}
