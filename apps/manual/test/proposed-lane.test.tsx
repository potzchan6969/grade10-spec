import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import {
  buildIndex,
  capabilityStatus,
  changesForSpec,
  isProposal,
} from "../src/api/derive";
import { relativeTime } from "../src/api/time";
import type { ChangeEntry, Snapshot } from "../src/api/types";
import {
  changeEntry,
  pageEntry,
  snapshotOf,
  specEntry,
} from "./manual-fixture";

/** The planning board's own lane. A proposal has no deltas and no tasks, so
 * everything derived from either has to keep ignoring it — the counts below
 * are the pin on that. */

const SPEC = "demo-product/alpha";

const held = vi.hoisted(() => ({
  index: undefined as unknown,
  session: { store: null as unknown, kind: "github" as string },
}));

vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));
vi.mock("../src/editor/session", () => ({
  useEditorSession: () => held.session,
  noteWrite: () => {},
}));

const { PlanningPage } = await import("../src/pages/planning-page");

const planned = changeEntry(
  "add-thing",
  [{ spec: SPEC, kinds: ["ADDED"], requirements: [] }],
  {
    title: "Add the thing",
    taskGroups: [
      { title: "Contracts", repo: "grade10-spec", done: 1, total: 2 },
    ],
  },
);

const proposal = changeEntry("expire-loyalty-points", [], {
  title: "Loyalty points should expire",
  why: "Collectors hoard points they never spend.",
  author: "echo",
  created: "2026-01-01",
});

function snapshot(changes: ChangeEntry[]): Snapshot {
  return snapshotOf({
    config: {
      storybookBase: "",
      groups: [{ title: "Products", products: ["demo-product"] }],
      platform: [],
      guides: [],
    },
    taxonomy: { products: ["demo-product"], topics: [] },
    pages: [
      pageEntry("manual/products/demo-product/index.md", {
        title: "Demo product",
      }),
      pageEntry("manual/products/demo-product/alpha.md", {
        title: "Alpha",
        spec: SPEC,
      }),
    ],
    specs: [specEntry(SPEC, ["Alpha does things"])],
    changes,
  });
}

function render(
  changes: ChangeEntry[],
  session: { store: unknown; kind: string } = {
    store: { readOnly: null, author: "echo" },
    kind: "github",
  },
): string {
  held.index = buildIndex(snapshot(changes));
  held.session = session;
  return renderToStaticMarkup(
    <MemoryRouter>
      <PlanningPage />
    </MemoryRouter>,
  );
}

describe("what a proposal is not part of", () => {
  const index = buildIndex(snapshot([planned, proposal]));

  it("is a proposal exactly when nobody has planned it", () => {
    expect(isProposal(proposal)).toBe(true);
    expect(isProposal(planned)).toBe(false);
  });

  it("bumps no product's change count", () => {
    const product = index.groups[0].products[0];
    expect(product.changeCount).toBe(1);
    expect(index.changesByOwner.get("demo-product")).toEqual([planned]);
  });

  it("badges no spec and flips no capability status", () => {
    expect(changesForSpec(index, SPEC)).toEqual([planned]);
    expect(capabilityStatus(index, SPEC)).toBe("changing");

    const alone = buildIndex(snapshot([proposal]));
    expect(changesForSpec(alone, SPEC)).toEqual([]);
    expect(capabilityStatus(alone, SPEC)).toBe("stable");
    expect(alone.groups[0].products[0].changeCount).toBe(0);
  });

  it("stands outside the product groups on the board", () => {
    const html = render([planned, proposal]);
    const groups = html.slice(0, html.indexOf("Proposed"));

    expect(groups).toContain("Add the thing");
    expect(groups).not.toContain("Loyalty points should expire");
    expect(groups).toContain("1 change");
  });
});

describe("the proposed lane", () => {
  it("collects proposals, collapsed, with the count", () => {
    const html = render([planned, proposal]);

    expect(html).toContain("Proposed");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("Loyalty points should expire");
  });

  it("names the proposer, the age, the reason and the id", () => {
    const html = render([proposal]);

    expect(html).toContain("@echo");
    expect(html).toContain(relativeTime("2026-01-01"));
    expect(html).toContain("Collectors hoard points they never spend.");
    expect(html).toContain("expire-loyalty-points");
  });

  it("is not there at all when nothing has been proposed", () => {
    expect(render([planned])).not.toContain("Proposed");
  });
});

describe("who may withdraw one", () => {
  it("offers it to the author", () => {
    expect(render([proposal])).toContain("Withdraw");
  });

  it("offers it to nobody else", () => {
    const html = render([proposal], {
      store: { readOnly: null, author: "someone" },
      kind: "github",
    });
    expect(html).not.toContain("Withdraw");
  });

  it("offers it to whoever is at the dev server's keyboard", () => {
    const html = render([proposal], {
      store: { readOnly: null, author: null },
      kind: "local",
    });
    expect(html).toContain("Withdraw");
  });

  it("offers it to nobody who cannot write", () => {
    const html = render([proposal], {
      store: { readOnly: "no token", author: "echo" },
      kind: "github",
    });
    expect(html).not.toContain("Withdraw");
  });
});
