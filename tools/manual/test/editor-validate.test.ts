import { describe, expect, it } from "vitest";
import { buildIndex, type ManualIndex } from "../src/api/derive";
import type {
  ChangeEntry,
  PageEntry,
  Snapshot,
  SpecEntry,
} from "../src/api/types";
import { draftFromSource } from "../src/editor/draft";
import { checkReferences, REFERENCE_ID } from "../src/editor/validate";
import { snapshotOf } from "./manual-fixture";

/** What the browser refuses before a save leaves it. Everything here is
 * proven by the snapshot alone — which is why `::story` ids are absent: the
 * browser cannot see the Storybook index. */

const PAGE = "docs/prds/products/demo/alpha.md";
const OTHER = "docs/prds/products/demo/beta.md";

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
  schema: "grade10-planning",
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
    ).toEqual(["no file `assets/gone.png` under assets/"]);
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
