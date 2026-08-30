import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildIndex } from "../src/api/derive";
import { snapshotWithDrafts } from "../src/editor/drafts";
import type { ContentStore } from "../src/editor/store";
import { pageEntry, snapshotOf } from "./manual-fixture";

/** The bar is the whole honesty of hosted editing: a save has gone no further
 * than this browser, and this is what says so. */

const PATH = "manual/products/demo/alpha.md";
const BETA = "manual/products/demo/beta.md";
const MINE = "---\ntitle: Alpha draft\n---\n\nProse.\n";

const held = vi.hoisted(() => ({
  store: undefined as unknown,
  drafts: {} as Record<string, unknown>,
}));

vi.mock("../src/editor/session", () => ({
  useEditorSession: () => ({
    status: "ready",
    store: held.store,
    kind: "github",
    token: "pat",
    mode: "main",
  }),
  noteWrite: () => {},
}));

const store = new Map<string, string>();
Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
    removeItem: (key: string) => store.delete(key),
  },
});

const { PendingBar } = await import("../src/editor/pending-bar");
const { draftStore } = await import("../src/editor/drafts");

vi.mock("../src/api/use-manual-index", async () => {
  const drafts = await import("../src/editor/drafts");
  const derive = await import("../src/api/derive");
  const fixture = await import("./manual-fixture");
  return {
    useManualIndex: () =>
      derive.buildIndex(
        drafts.snapshotWithDrafts(
          fixture.snapshotOf({
            pages: [fixture.pageEntry(PATH, { title: "Alpha" })],
          }),
          drafts.draftStore().read(),
        ),
      ),
  };
});

const hosted = {
  label: "GitHub — main",
  readOnly: null,
  push: async () => ({ status: "ok", head: "sha" }),
  movedSince: async () => [],
} as unknown as ContentStore;

function render(): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <PendingBar />
    </MemoryRouter>,
  );
}

describe("the pending bar", () => {
  beforeEach(() => {
    store.clear();
    draftStore().discardAll();
    held.store = hosted;
  });

  it("stays out of the way until something is staged", () => {
    expect(render()).toBe("");
  });

  it("never appears for a store that pushes nothing", () => {
    draftStore().stage(PATH, MINE, "theirsha");
    held.store = { label: "Dev server", write: async () => {} };

    expect(render()).toBe("");
  });

  it("counts the staged pages and offers to push them as one commit", () => {
    draftStore().stage(PATH, MINE, "theirsha");
    draftStore().stage(BETA, MINE, null);

    const html = render();

    expect(html).toContain("2 pages staged");
    expect(html).toContain("Push all");
    expect(html).toContain("Discard all");
    // The default message says what the commit will be, and stays right as
    // the set grows.
    expect(html).toContain('placeholder="Update 2 pages"');
  });

  it("names each page by its draft's own title, and links to it", () => {
    draftStore().stage(PATH, MINE, "theirsha");

    const html = render();

    expect(html).toContain("Alpha draft");
    expect(html).toContain('href="/p/demo/alpha"');
    expect(html).toContain(PATH);
    expect(html).toContain(`Discard the draft of ${PATH}`);
  });

  it("marks a page that changed under the draft before anybody pushes", () => {
    draftStore().stage(PATH, MINE, "theirsha");
    draftStore().markMoved([PATH]);

    const html = render();

    expect(html).toContain("1 changed underneath");
    expect(html).toContain("changed under your draft");
  });

  it("says when storage would not keep a draft, rather than losing it", () => {
    const said = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis.localStorage, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    draftStore().stage(PATH, MINE, null);

    expect(render()).toContain("storage refused to keep them");

    vi.restoreAllMocks();
    said.mockRestore();
  });
});

/** The index the bar reads is the overlaid one, so the row it draws is the
 * draft's own title rather than the committed page's. */
describe("what the page view reads", () => {
  it("parses the draft in place of the committed source", () => {
    store.clear();
    draftStore().discardAll();
    draftStore().stage(PATH, MINE, null);

    const index = buildIndex(
      snapshotWithDrafts(
        snapshotOf({ pages: [pageEntry(PATH, { title: "Alpha" })] }),
        draftStore().read(),
      ),
    );

    expect(index.pageByPath.get(PATH)?.ast?.frontmatter.title).toBe(
      "Alpha draft",
    );
  });
});
