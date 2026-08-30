import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Snapshot } from "../src/api/types";
import {
  checkDraftsMoved,
  createDraftStore,
  type DraftStorage,
  type DraftStore,
  snapshotWithDrafts,
} from "../src/editor/drafts";
import { savePage } from "../src/editor/save";
import type {
  ContentStore,
  PushOutcome,
  WriteOutcome,
} from "../src/editor/store";
import { pageEntry, snapshotOf } from "./manual-fixture";

/** The staged set: what a hosted save lands in until somebody pushes. It is
 * the only place those edits exist, so the two things it may never do are lose
 * one quietly and answer for one it could not read. */

const PATH = "manual/products/demo/alpha.md";
const BETA = "manual/products/demo/beta.md";
const MINE = "---\ntitle: Mine\n---\n";
const THEIRS = "---\ntitle: Theirs\n---\n";

function memoryStorage(seed: string | null = null) {
  let text = seed;
  const storage: DraftStorage = {
    read: () => text,
    write: (next) => {
      text = next === "" ? null : next;
    },
  };
  return { storage, peek: () => text };
}

function refusingStorage(seed: string | null = null): DraftStorage {
  return {
    read: () => seed,
    write: () => {
      throw new DOMException("QuotaExceededError");
    },
  };
}

/** Quiet, and asserted on where it matters — a dropped draft is reported. */
function hush(channel: "error" | "warn" = "error") {
  return vi.spyOn(console, channel).mockImplementation(() => {});
}

describe("the staged set", () => {
  it("keeps a save by its path, with the version it was read at", () => {
    const { storage, peek } = memoryStorage();
    const store = createDraftStore(storage);

    store.stage(PATH, MINE, "theirsha");

    const draft = store.read().byPath.get(PATH);
    expect(draft).toMatchObject({
      path: PATH,
      source: MINE,
      baseVersion: "theirsha",
    });
    expect(Date.parse(draft?.stagedAt ?? "")).not.toBeNaN();
    expect(JSON.parse(peek() ?? "{}")).toEqual({
      [PATH]: {
        source: MINE,
        baseVersion: "theirsha",
        stagedAt: draft?.stagedAt,
      },
    });
  });

  it("survives a reload, and orders the set the same way every time", () => {
    const { storage } = memoryStorage();
    const first = createDraftStore(storage);
    first.stage(BETA, THEIRS, null);
    first.stage(PATH, MINE, "theirsha");

    const reopened = createDraftStore(storage);

    expect(reopened.read().staged.map((draft) => draft.path)).toEqual([
      PATH,
      BETA,
    ]);
    expect(reopened.read().staged[1].baseVersion).toBeNull();
  });

  it("says so, loudly, when this browser refuses to keep a draft", () => {
    const said = hush();
    const store = createDraftStore(refusingStorage());

    store.stage(PATH, MINE, null);

    // Staged in this tab all the same — the edit is not thrown away, it is
    // reported as living nowhere else.
    expect(store.read().byPath.get(PATH)?.source).toBe(MINE);
    expect(store.read().failure).toMatch(/storage refused/);
    expect(said).toHaveBeenCalled();
    said.mockRestore();
  });

  it("reports a staged set it cannot read rather than answering nothing", () => {
    const said = hush();
    const store = createDraftStore({
      read: () => "{not json",
      write: () => {},
    });

    expect(store.read().staged).toEqual([]);
    expect(store.read().failure).toMatch(/did not give the staged drafts back/);
    expect(said).toHaveBeenCalled();
    said.mockRestore();
  });

  it("drops an entry with no source, names it, and keeps the rest", () => {
    const said = hush();
    const store = createDraftStore({
      read: () =>
        JSON.stringify({
          [PATH]: { baseVersion: "x" },
          [BETA]: { source: MINE, baseVersion: null, stagedAt: "2026-01-01" },
        }),
      write: () => {},
    });

    expect(store.read().staged.map((draft) => draft.path)).toEqual([BETA]);
    expect(said).toHaveBeenCalledWith(expect.stringContaining(PATH));
    said.mockRestore();
  });

  it("re-reads when another tab changes the staged set", () => {
    const { storage } = memoryStorage();
    let heard: (() => void) | null = null;
    let watching = true;
    const store = createDraftStore(storage, (on) => {
      heard = on;
      return () => {
        watching = false;
      };
    });

    const stopListening = store.subscribe(() => {});
    expect(store.read().staged).toHaveLength(0);

    createDraftStore(storage).stage(PATH, MINE, null);
    // Nothing has told this tab yet, so it still answers what it read.
    expect(store.read().staged).toHaveLength(0);

    heard?.();

    expect(store.read().byPath.get(PATH)?.source).toBe(MINE);
    stopListening();
    expect(watching).toBe(false);
  });

  it("discards one draft, and all of them", () => {
    const { storage, peek } = memoryStorage();
    const store = createDraftStore(storage);
    store.stage(PATH, MINE, null);
    store.stage(BETA, THEIRS, null);

    store.discard([PATH]);
    expect(store.read().staged.map((draft) => draft.path)).toEqual([BETA]);

    store.discardAll();
    expect(store.read().staged).toEqual([]);
    expect(peek()).toBeNull();
  });
});

describe("drafts against a moved head", () => {
  function stagedStore(): DraftStore {
    const store = createDraftStore(memoryStorage().storage);
    store.stage(PATH, MINE, "theirsha");
    store.stage(BETA, THEIRS, "betasha");
    return store;
  }

  it("asks about every staged page, with the version it was read at", async () => {
    const asked = vi.fn(async () => []);

    await checkDraftsMoved(asked, stagedStore());

    expect(asked).toHaveBeenCalledWith([
      { path: PATH, baseVersion: "theirsha" },
      { path: BETA, baseVersion: "betasha" },
    ]);
  });

  it("marks only the pages the store named", async () => {
    const store = stagedStore();

    await checkDraftsMoved(async () => [PATH], store);

    expect(store.read().byPath.get(PATH)?.moved).toBe(true);
    expect(store.read().byPath.get(BETA)?.moved).toBeUndefined();
  });

  it("takes the mark off again when the page comes back to the draft's base", async () => {
    const store = stagedStore();
    await checkDraftsMoved(async () => [PATH], store);
    expect(store.read().byPath.get(PATH)?.moved).toBe(true);

    await checkDraftsMoved(async () => [], store);

    expect(store.read().byPath.get(PATH)?.moved).toBeUndefined();
  });

  it("asks nothing when nothing is staged", async () => {
    const asked = vi.fn();
    await checkDraftsMoved(asked, createDraftStore(memoryStorage().storage));
    expect(asked).not.toHaveBeenCalled();
  });
});

describe("the snapshot a staged set leaves", () => {
  const snapshot: Snapshot = snapshotOf({
    pages: [pageEntry(PATH, { title: "Committed" })],
  });

  function overlay(...staged: [string, string][]): Snapshot {
    const store = createDraftStore(memoryStorage().storage);
    for (const [path, source] of staged) store.stage(path, source, null);
    return snapshotWithDrafts(snapshot, store.read());
  }

  it("hands the snapshot straight back when nothing is staged", () => {
    const store = createDraftStore(memoryStorage().storage);
    expect(snapshotWithDrafts(snapshot, store.read())).toBe(snapshot);
  });

  it("reads a page with a draft as its draft", () => {
    const pages = overlay([PATH, MINE]).pages;

    expect(pages).toHaveLength(1);
    expect(pages[0].source).toBe(MINE);
  });

  it("carries a page staged but never committed", () => {
    const pages = overlay([BETA, THEIRS]).pages;

    expect(pages.map((page) => page.path)).toEqual([PATH, BETA]);
    expect(pages[1].source).toBe(THEIRS);
  });

  it("hands back the same snapshot for the same staged set", () => {
    const store = createDraftStore(memoryStorage().storage);
    store.stage(PATH, MINE, null);

    const first = snapshotWithDrafts(snapshot, store.read());
    expect(snapshotWithDrafts(snapshot, store.read())).toBe(first);
  });
});

describe("where a save lands", () => {
  const hosted = {
    label: "GitHub",
    push: async (): Promise<PushOutcome> => ({ status: "ok", head: "sha" }),
  } as unknown as ContentStore;

  beforeEach(() => {
    // The default store is the one `savePage` stages into; a node run has no
    // localStorage, and the store reports that rather than hiding it.
    hush();
  });

  it("stages a hosted save instead of writing it", async () => {
    expect(await savePage(hosted, PATH, MINE, "theirsha")).toEqual({
      status: "staged",
    });
  });

  it("writes the working tree when that is the stage", async () => {
    const wrote: string[] = [];
    const dev = {
      label: "Dev server",
      write: async (path: string): Promise<WriteOutcome> => {
        wrote.push(path);
        return { status: "ok", version: "hash" };
      },
    } as unknown as ContentStore;

    expect(await savePage(dev, PATH, MINE, null)).toEqual({
      status: "ok",
      version: "hash",
    });
    expect(wrote).toEqual([PATH]);
  });

  it("refuses a path outside manual/ before either of them hears about it", async () => {
    await expect(
      savePage(hosted, "openspec/specs/demo/spec.md", MINE, null),
    ).rejects.toThrow(/manual\//);
  });
});
