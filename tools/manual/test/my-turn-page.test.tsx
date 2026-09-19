import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { ChangeEntry, Snapshot } from "../src/api/types";
import { STORAGE } from "../src/editor/config";
import { findStoreRoot } from "../src/store/disk.mts";
import { schemaArtifacts } from "../src/store/read-schema.mts";
import { changeEntry, snapshotOf, specEntry } from "./manual-fixture";

/**
 * My turn, state by state: before a handle is chosen, for a handle the team
 * map does not know, with nothing on the reader, and the page's own order —
 * one case per `## States` bullet `ui-design.md` lists for My turn, named
 * after the bullet, asserting the words a reader would read.
 */

const storeRoot = findStoreRoot(fileURLToPath(new URL(".", import.meta.url)));
const ARTIFACTS = schemaArtifacts(storeRoot, "grade10-planning") ?? [];
const SPEC = "demo-product/alpha";

const held = vi.hoisted(() => ({
  index: undefined as unknown,
  // A real `KeyStore`, the same one `useHandle` reads: setting a key here is
  // what a browser remembering a handle looks like. A fresh `Map` per render
  // is a fresh browser — nothing carries over, which is another browser's
  // own case (SC-63).
  store: new Map<string, string>(),
}));

vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));
vi.mock("../src/editor/session", () => ({
  useEditorSession: () => ({ status: "ready", store: null }),
  browserKeyStore: {
    get: (key: string) => held.store.get(key) ?? null,
    set: (key: string, value: string) => {
      held.store.set(key, value);
    },
    remove: (key: string) => {
      held.store.delete(key);
    },
  },
}));

const { MyTurnPage } = await import("../src/pages/my-turn-page");

function snapshot(changes: ChangeEntry[]): Snapshot {
  return snapshotOf({
    config: {
      storybookBase: "",
      groups: [{ title: "Products", products: ["demo-product"] }],
      platform: [],
      guides: [],
    },
    taxonomy: { products: ["demo-product"], topics: [] },
    specs: [specEntry(SPEC, ["Points expire"])],
    schemas: { "grade10-planning": ARTIFACTS },
    changes,
    team: { handles: { robin: { roles: ["pm"] } }, channels: {} },
  });
}

function render(changes: ChangeEntry[], handle?: string): string {
  held.index = buildIndex(snapshot(changes));
  held.store.clear();
  if (handle !== undefined) held.store.set(STORAGE.handle, handle);
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={["/my-turn"]}>
      <MyTurnPage />
    </MemoryRouter>,
  );
}

describe("My turn before a handle is chosen", () => {
  it("asks for a handle and lists nothing", () => {
    const html = render([
      changeEntry("some-change", [], {
        stage: "specified",
        hands: { pm: "robin" },
      }),
    ]);

    expect(html).toContain("Choose a handle");
    expect(html).toContain("Your handle");
    expect(html).not.toContain("On you now");
    expect(html).not.toContain("Coming to you");
  });
});

describe("My turn for a handle the team map does not know", () => {
  it("says the handle is unknown and lists nothing", () => {
    const html = render(
      [
        changeEntry("some-change", [], {
          stage: "specified",
          hands: { pm: "ghost" },
        }),
      ],
      "ghost",
    );

    expect(html).toContain("not a handle this store knows");
    expect(html).toContain("docs/prds/team.yaml");
    expect(html).not.toContain("On you now");
    // It still offers a way to correct the mistake.
    expect(html).toContain("Choose a handle");
  });
});

describe("My turn with nothing on the reader", () => {
  it("says nothing is on the reader", () => {
    const html = render([], "robin");

    expect(html).toContain("Nothing on you");
  });
});

describe("the page's own order", () => {
  it("lists the open question first, with its change and its number, then now, then later", () => {
    const question = changeEntry("question-change", [], {
      title: "A change asking robin something",
      stage: "specified",
      hands: { pm: "dana" },
      questions: [
        {
          id: "Q1",
          artifact: "decisions",
          role: "pm",
          hand: "robin",
          text: "Which day does the shelf start on?",
        },
      ],
    });
    const now = changeEntry("now-change", [], {
      title: "On robin right now",
      stage: "specified",
      hands: { pm: "robin" },
    });
    const later = changeEntry("later-change", [], {
      title: "Coming to robin",
      stage: "specified",
      hands: { pm: "dana", dev: "robin" },
    });

    const html = render([question, later, now], "robin");

    const questionAt = html.indexOf("Which day does the shelf start on?");
    const idAt = html.indexOf("Q1");
    const questionChangeAt = html.indexOf("A change asking robin something");
    const nowHeadingAt = html.indexOf("On you now");
    const nowChangeAt = html.indexOf("On robin right now");
    const laterHeadingAt = html.indexOf("Coming to you");
    const laterChangeAt = html.indexOf("Coming to robin");

    for (const at of [
      questionAt,
      idAt,
      questionChangeAt,
      nowHeadingAt,
      nowChangeAt,
      laterHeadingAt,
      laterChangeAt,
    ]) {
      expect(at).toBeGreaterThan(-1);
    }
    expect(questionAt).toBeLessThan(nowHeadingAt);
    expect(idAt).toBeLessThan(nowHeadingAt);
    expect(nowHeadingAt).toBeLessThan(nowChangeAt);
    expect(nowChangeAt).toBeLessThan(laterHeadingAt);
    expect(laterHeadingAt).toBeLessThan(laterChangeAt);
    // The question-only change never doubles into either change list.
    const afterQuestions = html.slice(nowHeadingAt);
    expect(afterQuestions).not.toContain("A change asking robin something");
  });

  it("carries the thread link and the command on each card", () => {
    const now = changeEntry("now-change", [], {
      title: "On robin right now",
      stage: "planned",
      hands: { dev: "robin" },
      thread: "C0123ABC/1758170000.001200",
    });

    const html = render([now], "robin");

    expect(html).toContain("C0123ABC");
    expect(html).toContain("/tasks now-change");
  });
});
