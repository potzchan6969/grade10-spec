import { describe, expect, it } from "vitest";
import { buildIndex, type ManualIndex } from "../src/api/derive";
import type {
  ChangeEntry,
  PageEntry,
  Snapshot,
  SpecEntry,
} from "../src/api/types";
import { draftFromSource } from "../src/editor/draft";
import { createDraftStore, snapshotWithDrafts } from "../src/editor/drafts";
import { checkReferences, REFERENCE_ID } from "../src/editor/validate";
import { snapshotOf } from "./manual-fixture";

/** What the browser refuses before GitHub ever hears about it. Everything
 * here is proven by the snapshot alone — which is why `::story` ids are
 * absent: the browser cannot see the Storybook index. */

const PAGE = "manual/products/demo/alpha.md";
const OTHER = "manual/products/demo/beta.md";

const ALPHA: SpecEntry = {
  id: "demo/alpha",
  title: "Alpha",
  purpose: "",
  requirements: [
    {
      name: "Points are earned",
      text: "",
      scenarios: [{ id: "alpha-SC-01", name: "earning", text: "" }],
    },
  ],
  journeys: [
    { id: "alpha-US-01", title: "Earn points", text: "", acceptedBy: [] },
  ],
};

const CHANGING: ChangeEntry = {
  id: "add-gamma",
  schema: "pm-planning",
  status: "in-flight",
  owners: [],
  created: "2026-01-01",
  title: "Add gamma",
  why: "",
  taskGroups: [],
  deltas: [{ spec: "demo/gamma", kinds: ["ADDED"], requirements: [] }],
};

function page(path: string, body: string, spec?: string): PageEntry {
  const head = spec ? `title: Page\nspec: ${spec}\n` : "title: Page\n";
  return { path, source: `---\n${head}---\n\n${body}\n` };
}

function indexOf(parts: Partial<Snapshot> = {}): ManualIndex {
  return buildIndex(
    snapshotOf({ specs: [ALPHA], changes: [CHANGING], ...parts }),
  );
}

function problemsFor(
  index: ManualIndex,
  body: string,
  spec?: string,
  path = PAGE,
) {
  const head = spec ? `title: Page\nspec: ${spec}\n` : "title: Page\n";
  return checkReferences(
    index,
    path,
    draftFromSource(`---\n${head}---\n\n${body}\n`),
  );
}

/** Every message, whatever card it landed on. */
function said(problems: Map<string, { message: string }[]>): string[] {
  return [...problems.values()].flatMap((list) =>
    list.map((problem) => problem.message),
  );
}

describe("save-time references", () => {
  it("passes a page whose every id resolves", () => {
    const index = indexOf({
      pages: [page(PAGE, '::spec{id="demo/alpha"}', "demo/alpha")],
      assets: ["assets/shot.png"],
    });

    const problems = problemsFor(
      index,
      [
        '::spec{id="demo/alpha" requirement="Points are earned"}',
        "",
        '::spec{id="demo/alpha" scenario="alpha-SC-01"}',
        "",
        '::spec{id="demo/alpha" story="alpha-US-01"}',
        "",
        '::journeys{id="demo/alpha"}',
        "",
        '::cases{id="demo/alpha"}',
        "",
        '::changes{spec="demo/gamma"}',
        "",
        '::image{src="assets/shot.png" alt="a shot"}',
        "",
        '::story{id="blocks-store-cart--default"}',
      ].join("\n"),
      "demo/alpha",
    );

    expect(said(problems)).toEqual([]);
  });

  it("refuses ids no spec answers to", () => {
    const index = indexOf({ pages: [page(PAGE, "Prose.")] });

    expect(said(problemsFor(index, '::spec{id="demo/ghost"}'))).toEqual([
      "no spec `demo/ghost` in the store",
    ]);
    expect(said(problemsFor(index, '::journeys{id="demo/ghost"}'))).toEqual([
      "no spec `demo/ghost` in the store",
    ]);
    expect(said(problemsFor(index, '::cases{id="demo/ghost"}'))).toEqual([
      "no spec `demo/ghost` in the store",
    ]);
  });

  it("names the field a bad selector sits in", () => {
    const index = indexOf({ pages: [page(PAGE, "Prose.")] });
    const problems = problemsFor(
      index,
      '::spec{id="demo/alpha" requirement="Points are burned"}',
    );

    expect([...problems.values()][0]).toEqual([
      {
        attr: "requirement",
        message: "demo/alpha has no requirement `Points are burned`",
      },
    ]);
  });

  it("refuses a scenario or story the spec never issued", () => {
    const index = indexOf({ pages: [page(PAGE, "Prose.")] });

    expect(
      said(
        problemsFor(index, '::spec{id="demo/alpha" scenario="alpha-SC-99"}'),
      ),
    ).toEqual(["demo/alpha issues no scenario `alpha-SC-99`"]);
    expect(
      said(problemsFor(index, '::spec{id="demo/alpha" story="alpha-US-99"}')),
    ).toEqual(["demo/alpha issues no story `alpha-US-99`"]);
  });

  it("lets a ribbon point at a capability a change is still introducing", () => {
    const index = indexOf({ pages: [page(PAGE, "Prose.")] });

    expect(said(problemsFor(index, '::changes{spec="demo/gamma"}'))).toEqual(
      [],
    );
    expect(said(problemsFor(index, '::changes{spec="demo/nowhere"}'))).toEqual([
      "no spec `demo/nowhere` and no in-flight change touching it",
    ]);
  });

  it("resolves an image against the snapshot's assets", () => {
    const index = indexOf({
      pages: [page(PAGE, "Prose.")],
      assets: ["assets/shot.png"],
    });

    expect(
      said(problemsFor(index, '::image{src="assets/gone.png" alt="x"}')),
    ).toEqual(["no file `assets/gone.png` under manual/assets"]);
  });

  it("says nothing about images when the snapshot lists no assets", () => {
    const index = indexOf({ pages: [page(PAGE, "Prose.")], assets: [] });

    expect(
      said(problemsFor(index, '::image{src="assets/shot.png" alt="x"}')),
    ).toEqual([]);
  });

  it("refuses a save that drops the last page showing a durable spec", () => {
    const index = indexOf({
      pages: [page(PAGE, '::spec{id="demo/alpha"}', "demo/alpha")],
    });

    const problems = problemsFor(index, "Prose only now.");

    expect(problems.get(REFERENCE_ID)).toEqual([
      {
        message:
          "this page is the only one that names `demo/alpha`; dropping it leaves a durable spec no page shows",
      },
    ]);
  });

  it("allows the drop when another page still shows the spec", () => {
    const index = indexOf({
      pages: [
        page(PAGE, '::spec{id="demo/alpha"}', "demo/alpha"),
        page(OTHER, '::spec{id="demo/alpha"}'),
      ],
    });

    expect(said(problemsFor(index, "Prose only now."))).toEqual([]);
  });

  it("counts the frontmatter as showing the spec, on either side", () => {
    const index = indexOf({
      pages: [page(PAGE, '::spec{id="demo/alpha"}', "demo/alpha")],
    });

    // The block goes, the frontmatter stays: the spec is still shown.
    expect(said(problemsFor(index, "Prose only now.", "demo/alpha"))).toEqual(
      [],
    );
  });

  it("says nothing about a spec the page never showed", () => {
    const index = indexOf({ pages: [page(PAGE, "Prose.")] });

    expect(said(problemsFor(index, "Still prose."))).toEqual([]);
  });
});

/** The same rules, asked of the whole staged set. A batch is what gets pushed,
 * so a reference two staged pages hand between them is not a dropped one. */
describe("references across the staged set", () => {
  function stagedIndex(...staged: [string, string][]): ManualIndex {
    const store = createDraftStore({ read: () => null, write: () => {} });
    for (const [path, body] of staged) {
      store.stage(path, page(path, body).source, null);
    }
    return buildIndex(
      snapshotWithDrafts(
        snapshotOf({
          specs: [ALPHA],
          changes: [CHANGING],
          pages: [page(PAGE, '::spec{id="demo/alpha"}', "demo/alpha")],
        }),
        store.read(),
      ),
    );
  }

  it("allows a page to drop the spec another staged page picked up", () => {
    const index = stagedIndex([OTHER, '::spec{id="demo/alpha"}']);

    expect(said(problemsFor(index, "Prose only now."))).toEqual([]);
  });

  it("still refuses the drop when no page, staged or committed, names it", () => {
    const index = stagedIndex([OTHER, "Unrelated prose."]);

    expect(problemsFor(index, "Prose only now.").get(REFERENCE_ID)).toEqual([
      {
        message:
          "this page is the only one that names `demo/alpha`; dropping it leaves a durable spec no page shows",
      },
    ]);
  });

  it("resolves an id against a page that is staged and not yet committed", () => {
    const index = stagedIndex([
      "manual/products/demo/gamma.md",
      '::spec{id="demo/alpha"}',
    ]);

    expect(index.pageByPath.has("manual/products/demo/gamma.md")).toBe(true);
    expect(said(problemsFor(index, "Prose only now."))).toEqual([]);
  });
});
