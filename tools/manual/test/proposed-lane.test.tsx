import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import {
  buildIndex,
  capabilityStatus,
  changesForSpec,
  isProposal,
} from "../src/api/derive";
import { formatDate } from "../src/api/time";
import type { ChangeEntry, Snapshot } from "../src/api/types";
import {
  changeEntry,
  pageEntry,
  snapshotOf,
  specEntry,
} from "./manual-fixture";

/** The In Flight board's own lane. A proposal has no deltas and no tasks, so
 * everything derived from either has to keep ignoring it — the counts below
 * are the pin on that. */

const SPEC = "demo-product/alpha";

const held = vi.hoisted(() => ({
  index: undefined as unknown,
  session: { store: null as unknown },
}));

vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));
vi.mock("../src/editor/session", () => ({
  useEditorSession: () => held.session,
}));

const { InFlightPage } = await import("../src/pages/in-flight-page");

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
      pageEntry("docs/prds/products/demo-product/index.md", {
        title: "Demo product",
      }),
      pageEntry("docs/prds/products/demo-product/alpha.md", {
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
  session: { store: unknown } = { store: {} },
): string {
  held.index = buildIndex(snapshot(changes));
  held.session = session;
  return renderToStaticMarkup(
    <MemoryRouter>
      <InFlightPage />
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

  it("stands in its own lane, never among the work in flight", () => {
    const html = render([planned, proposal]);
    const proposed = html.slice(
      html.indexOf('data-lane="proposed"'),
      html.indexOf('data-lane="designed"'),
    );

    expect(proposed).toContain("Loyalty points should expire");
    expect(proposed).not.toContain("Add the thing");
    expect(html.slice(html.indexOf('data-lane="building"'))).toContain(
      "Add the thing",
    );
  });
});

describe("the proposed lane", () => {
  it("collects proposals, collapsed, with the count", () => {
    const html = render([planned, proposal]);

    expect(html).toContain("Proposed");
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("Loyalty points should expire");
  });

  /** `created:` is a date, not a timestamp — rendered as an age, a proposal
   * filed minutes ago already read "15 hours ago". */
  it("names the proposer, the date, the reason and the id", () => {
    const html = render([proposal]);

    expect(html).toContain("@echo");
    expect(html).toContain(`created ${formatDate("2026-01-01")}`);
    expect(html).toContain("Collectors hoard points they never spend.");
    expect(html).toContain("expire-loyalty-points");
  });

  /** The lane is a stage, so it is always a heading: with nothing proposed it
   * collapses to its count of none rather than disappearing. */
  it("collapses to its heading when nothing has been proposed", () => {
    const html = render([planned]);
    const proposed = html.slice(
      html.indexOf('data-lane="proposed"'),
      html.indexOf('data-lane="designed"'),
    );

    expect(proposed).toContain(">Proposed<");
    expect(proposed).toContain(">0<");
    expect(proposed).not.toContain("Add the thing");
  });
});

describe("who may withdraw one", () => {
  it("offers it to whoever is at the dev server's keyboard", () => {
    expect(render([proposal])).toContain("Withdraw");
  });

  it("offers it to nobody when no store is answering", () => {
    const html = render([proposal], { store: null });
    expect(html).not.toContain("Withdraw");
  });
});
