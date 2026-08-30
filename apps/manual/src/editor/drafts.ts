import { useSyncExternalStore } from "react";
import type { PageEntry, Snapshot } from "../api/types";
import { STORAGE } from "./config";
import { describeCause, type StagedRef, type Version } from "./store";

/**
 * The staged set. A hosted save never leaves the browser: it lands here, keyed
 * by page path, and stays until Push all turns the whole set into one commit.
 * localStorage is where it lives, so a reload keeps it and a second tab sees
 * it — and when storage cannot answer, the pending bar says so rather than
 * quietly forgetting what was typed.
 */

export type Staged = {
  path: string;
  source: string;
  /** The blob this draft was read at — what a push compares against the head. */
  baseVersion: Version | null;
  stagedAt: string;
  /** The page moved on the ref after this draft was staged. */
  moved?: boolean;
};

export type Drafts = {
  /** By path, so the bar and the overlay read the same order every time. */
  staged: Staged[];
  byPath: Map<string, Staged>;
  /** Null while storage is answering; what it said instead, otherwise. */
  failure: string | null;
};

export type DraftStorage = {
  read(): string | null;
  /** Throws when the draft cannot be kept — losing one silently is the one
   * thing this store may never do. */
  write(text: string): void;
};

export type DraftStore = {
  read(): Drafts;
  subscribe(listener: () => void): () => void;
  stage(path: string, source: string, baseVersion: Version | null): void;
  discard(paths: string[]): void;
  discardAll(): void;
  /** The ref moved: these paths no longer match the draft's base version. */
  markMoved(paths: string[]): void;
};

function settle(staged: Staged[], failure: string | null): Drafts {
  const ordered = [...staged].sort((a, b) => a.path.localeCompare(b.path));
  return {
    staged: ordered,
    byPath: new Map(ordered.map((draft) => [draft.path, draft])),
    failure,
  };
}

/** One malformed entry is not a reason to drop the rest, and never a reason to
 * drop it quietly. */
function draftsOf(raw: string | null): Staged[] {
  if (raw === null || raw.trim() === "") return [];
  const held: unknown = JSON.parse(raw);
  if (held === null || typeof held !== "object" || Array.isArray(held)) {
    throw new Error("the staged set is not an object of paths");
  }

  const staged: Staged[] = [];
  for (const [path, value] of Object.entries(held as Record<string, unknown>)) {
    const entry = (value ?? {}) as Record<string, unknown>;
    if (typeof entry.source !== "string") {
      console.error(`manual: the staged draft of ${path} holds no source`);
      continue;
    }
    staged.push({
      path,
      source: entry.source,
      baseVersion:
        typeof entry.baseVersion === "string" ? entry.baseVersion : null,
      stagedAt: typeof entry.stagedAt === "string" ? entry.stagedAt : "",
      ...(entry.moved === true ? { moved: true } : {}),
    });
  }
  return staged;
}

function serialize(staged: Staged[]): string {
  if (staged.length === 0) return "";
  const held: Record<string, Omit<Staged, "path">> = {};
  for (const { path, ...rest } of staged) held[path] = rest;
  return JSON.stringify(held);
}

export function createDraftStore(
  storage: DraftStorage,
  watch: (heard: () => void) => () => void = () => () => {},
): DraftStore {
  let held: Drafts | null = null;
  let unwatch: (() => void) | null = null;
  const listeners = new Set<() => void>();

  const publish = () => {
    for (const listener of listeners) listener();
  };

  const load = (): Drafts => {
    try {
      return settle(draftsOf(storage.read()), null);
    } catch (cause) {
      console.error("manual: cannot read the staged drafts", cause);
      return settle(
        [],
        `this browser's storage did not give the staged drafts back: ${describeCause(cause)}`,
      );
    }
  };

  const read = (): Drafts => {
    held ??= load();
    return held;
  };

  const keep = (staged: Staged[]): void => {
    let failure: string | null = null;
    try {
      storage.write(serialize(staged));
    } catch (cause) {
      console.error("manual: cannot keep the staged drafts", cause);
      failure = `these drafts live in this tab alone — storage refused to keep them: ${describeCause(cause)}`;
    }
    held = settle(staged, failure);
    publish();
  };

  const without = (paths: string[]): Staged[] => {
    const gone = new Set(paths);
    return read().staged.filter((draft) => !gone.has(draft.path));
  };

  return {
    read,

    subscribe(listener) {
      listeners.add(listener);
      unwatch ??= watch(() => {
        held = null;
        publish();
      });
      return () => {
        listeners.delete(listener);
        if (listeners.size > 0 || !unwatch) return;
        unwatch();
        unwatch = null;
      };
    },

    stage(path, source, baseVersion) {
      keep([
        ...without([path]),
        { path, source, baseVersion, stagedAt: new Date().toISOString() },
      ]);
    },

    discard(paths) {
      const staged = read().byPath;
      if (!paths.some((path) => staged.has(path))) return;
      keep(without(paths));
    },

    discardAll() {
      if (read().staged.length === 0) return;
      keep([]);
    },

    markMoved(paths) {
      const moved = new Set(paths);
      const staged = read().staged;
      const same = staged.every(
        (draft) => moved.has(draft.path) === (draft.moved === true),
      );
      if (same) return;
      keep(
        staged.map((draft) => ({
          path: draft.path,
          source: draft.source,
          baseVersion: draft.baseVersion,
          stagedAt: draft.stagedAt,
          ...(moved.has(draft.path) ? { moved: true as const } : {}),
        })),
      );
    },
  };
}

export const browserDraftStorage: DraftStorage = {
  read: () => localStorage.getItem(STORAGE.drafts),
  write: (text) => {
    if (text === "") localStorage.removeItem(STORAGE.drafts);
    else localStorage.setItem(STORAGE.drafts, text);
  },
};

/** Another tab staged, discarded, or pushed. A `null` key is the whole store
 * being cleared, which is this key too. */
export function browserDraftWatch(heard: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const listen = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE.drafts) heard();
  };
  window.addEventListener("storage", listen);
  return () => window.removeEventListener("storage", listen);
}

let theStore: DraftStore | null = null;

/** The app's one staged set. Built on first use so importing this module never
 * touches a browser that is not there. */
export function draftStore(): DraftStore {
  theStore ??= createDraftStore(browserDraftStorage, browserDraftWatch);
  return theStore;
}

export function useDrafts(): Drafts {
  const store = draftStore();
  return useSyncExternalStore(store.subscribe, store.read, store.read);
}

export function stageDraft(
  path: string,
  source: string,
  baseVersion: Version | null,
): void {
  draftStore().stage(path, source, baseVersion);
}

export function discardDraft(path: string): void {
  draftStore().discard([path]);
}

/** What a push landed, and only that: another tab may have staged a page in
 * the time the push took. */
export function discardDrafts(paths: string[]): void {
  draftStore().discard(paths);
}

export function discardAllDrafts(): void {
  draftStore().discardAll();
}

/**
 * The ref moved. Ask the store which staged pages changed under their drafts —
 * it is the one that knows what a push will compare against — and mark them,
 * so the pending bar says it before a push turns it into a conflict. A page
 * that matches again loses its mark: the question is asked afresh every time.
 */
export async function checkDraftsMoved(
  ask: (files: StagedRef[]) => Promise<string[]>,
  store: DraftStore = draftStore(),
): Promise<void> {
  const staged = store.read().staged;
  if (staged.length === 0) return;

  store.markMoved(
    await ask(staged.map(({ path, baseVersion }) => ({ path, baseVersion }))),
  );
}

/** One overlay per snapshot, replaced as the staged set changes: the index is
 * cached against the snapshot object, so this has to hand back the same one
 * for the same set. */
const overlaid = new WeakMap<Snapshot, { key: string; value: Snapshot }>();

/**
 * The snapshot as the staged set would leave it: a page with a draft reads,
 * searches and validates as its draft, and a page staged but never committed
 * is simply a page. That is what makes the last-reference rule a question
 * about the whole batch rather than about one file.
 */
export function snapshotWithDrafts(
  snapshot: Snapshot,
  drafts: Drafts,
): Snapshot {
  if (drafts.staged.length === 0) return snapshot;

  const key = drafts.staged
    .map((draft) => `${draft.path}@${draft.stagedAt}#${draft.source.length}`)
    .join("|");
  const cached = overlaid.get(snapshot);
  if (cached?.key === key) return cached.value;

  const pages: PageEntry[] = snapshot.pages.map((page) => {
    const draft = drafts.byPath.get(page.path);
    return draft ? { ...page, source: draft.source } : page;
  });
  const known = new Set(snapshot.pages.map((page) => page.path));
  for (const draft of drafts.staged) {
    if (!known.has(draft.path)) {
      pages.push({ path: draft.path, source: draft.source });
    }
  }

  const value: Snapshot = { ...snapshot, pages };
  overlaid.set(snapshot, { key, value });
  return value;
}
