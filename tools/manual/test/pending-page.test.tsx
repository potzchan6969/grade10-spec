import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { ChangeEntry, Delta, SchemaArtifact } from "../src/api/types";
import { changeEntry, snapshotOf } from "./manual-fixture";

/** The page somebody opens to find their own work: what each teammate owes,
 * every row derived from the artifacts a change has written. */

const held = vi.hoisted(() => ({ index: undefined as unknown }));

vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));

const { PendingPage } = await import("../src/pages/pending-page");

const delta: Delta = { spec: "demo/alpha", kinds: ["ADDED"], requirements: [] };

const artifact = (
  id: string,
  generates: string,
  teammate: string,
  requires: string[],
  required = true,
): SchemaArtifact => ({ id, generates, teammate, requires, required });

const SCHEMAS: Record<string, SchemaArtifact[]> = {
  demo: [
    artifact("specs", "specs/**/spec.md", "product-manager", []),
    artifact("ui-design", "ui-design.md", "designer", ["specs"], false),
    artifact("tasks", "tasks.md", "engineer", ["specs"]),
  ],
};

const on = (id: string, deltas: Delta[], fields: Partial<ChangeEntry> = {}) =>
  changeEntry(id, deltas, { schema: "demo", ...fields });

function render(changes: ChangeEntry[], schemas = SCHEMAS) {
  held.index = buildIndex(snapshotOf({ changes, schemas }));
  return renderToStaticMarkup(
    <MemoryRouter>
      <PendingPage />
    </MemoryRouter>,
  );
}

describe("the pending page", () => {
  it("heads a section per teammate, and names the file it is asked for", () => {
    const html = render([on("plan-it", [delta])]);

    expect(html).toContain("Engineer");
    expect(html).toContain("tasks.md");
    expect(html).toContain("/in-flight/plan-it");
  });

  it("carries the line a change wrote about what it is waiting on", () => {
    const html = render([
      on("draw-it", [delta], {
        awaiting: [
          { artifact: "ui-design", why: "nothing draws the `reminder` banner" },
        ],
      }),
    ]);

    expect(html).toContain("Designer");
    // The line is the author's prose, read the way every other card reads it.
    expect(html).toContain(">reminder</code>");
  });

  it("dates a change by the day it was filed, not by the hour", () => {
    const html = render([on("plan-it", [delta], { created: "2026-09-15" })]);

    expect(html).toContain("filed");
    expect(html).not.toMatch(/hours? ago/);
  });

  it("answers an idle teammate rather than leaving out its section", () => {
    const html = render([
      on("done", [delta], { written: ["proposal", "specs", "tasks"] }),
    ]);

    expect(html).toContain("Engineer");
    expect(html).toContain("has written what this teammate owes");
  });

  it("says so where no change names a schema this store defines", () => {
    expect(render([on("plan-it", [delta])], {})).toContain("No schema to read");
  });

  it("points a reviewer at the QA worklist rather than repeating it", () => {
    expect(render([])).toContain("/qa");
  });
});
