import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { ChangeEntry, Delta, SchemaArtifact } from "../src/api/types";
import { changeEntry, snapshotOf } from "./manual-fixture";

/** The page somebody opens to find their own work: what each hand owes,
 * every row derived from the artifacts a change has written. */

const held = vi.hoisted(() => ({ index: undefined as unknown }));

vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));

const { PendingPage } = await import("../src/pages/pending-page");

const delta: Delta = { spec: "demo/alpha", kinds: ["ADDED"], requirements: [] };

const ARTIFACTS: SchemaArtifact[] = [
  {
    id: "specs",
    generates: "specs/**/spec.md",
    role: "product-manager",
    requires: [],
    required: true,
  },
  {
    id: "ui-design",
    generates: "ui-design.md",
    role: "designer",
    requires: ["specs"],
    required: false,
  },
  {
    id: "tasks",
    generates: "tasks.md",
    role: "engineer",
    requires: ["specs"],
    required: true,
  },
];

function render(changes: ChangeEntry[]) {
  held.index = buildIndex(snapshotOf({ changes, artifacts: ARTIFACTS }));
  return renderToStaticMarkup(
    <MemoryRouter>
      <PendingPage />
    </MemoryRouter>,
  );
}

describe("the pending page", () => {
  it("heads a section per hand, and names the file it is asked for", () => {
    const html = render([changeEntry("plan-it", [delta])]);

    expect(html).toContain("Engineer");
    expect(html).toContain("tasks.md");
    expect(html).toContain("/in-flight/plan-it");
  });

  it("carries the line a change wrote about what it is waiting on", () => {
    const html = render([
      changeEntry("draw-it", [delta], {
        awaiting: [
          { artifact: "ui-design", why: "nothing draws the reminder banner" },
        ],
      }),
    ]);

    expect(html).toContain("Designer");
    expect(html).toContain("nothing draws the reminder banner");
  });

  it("says nothing where every change has written what it owes", () => {
    const html = render([
      changeEntry("done", [delta], {
        written: ["proposal", "specs", "tasks"],
      }),
    ]);

    expect(html).toContain("Nothing pending");
    expect(html).not.toContain("Engineer");
  });

  it("points a reviewer at the QA worklist rather than repeating it", () => {
    expect(render([])).toContain("/qa");
  });
});
