import { describe, expect, it } from "vitest";
import { checkLanding, type LandInputs, roleFor } from "../src/land.ts";

/** The checks behind a moved `main`, over inputs already fetched.
 *
 * The record's `hands:` is read by the role the schema names as the artifact's
 * `teammate:`, so these fixtures key one against the other. The store's own
 * schema says `teammate: product-manager` where its records say `hands.pm`: the
 * two vocabularies have to be one before a word landing passes on the real
 * files, and the last case here is what a relay reads when they are not. */

const SCHEMA = `name: grade10-planning
artifacts:
  - id: proposal
    teammate: pm
  - id: ui-design
    teammate: design
  - id: specs
    required: true
apply:
  teammate: dev
`;

const RECORD = `schema: grade10-planning
promoted_by: "@ecchochan"
hands:
  pm: "@ecchochan"
  design: "@dee"
  dev: "@kinisworking"
`;

const CHANGE = "nav-cart-count-badge";

const REVIEWED_PATCH = `@@ -2,3 +2,6 @@
 promoted_by: "@ecchochan"
+reviewed:
+  proposal: 1a2b3c4d
+  decisions: 5e6f7a8b
`;

function inputs(over: Partial<LandInputs> = {}): LandInputs {
  return {
    kind: "word",
    change: CHANGE,
    artifact: "proposal",
    word: "land",
    senderHandle: "@ecchochan",
    record: RECORD,
    schema: SCHEMA,
    files: [
      { path: `openspec/changes/${CHANGE}/proposal.md`, patch: "" },
      { path: `openspec/changes/${CHANGE}/rounds.md`, patch: "" },
    ],
    ...over,
  };
}

describe("whose word lands which artifact", () => {
  it("reads the role off the artifact's teammate", () => {
    expect(roleFor(SCHEMA, "proposal")).toBe("pm");
    expect(roleFor(SCHEMA, "ui-design")).toBe("design");
  });

  it("reads a task group's role off the apply block", () => {
    expect(roleFor(SCHEMA, "2")).toBe("dev");
  });

  it("falls back to dev where the schema names no teammate", () => {
    expect(roleFor(SCHEMA, "specs")).toBe("dev");
    expect(roleFor(SCHEMA, "not-an-artifact")).toBe("dev");
  });
});

describe("a landing on a word", () => {
  it("shared-planning-agent-rounds-SC-73 - a word landing passes only after its checks", () => {
    expect(checkLanding(inputs())).toEqual({ ok: true });
  });

  it("takes land with recommendations, trimmed and in any case", () => {
    expect(
      checkLanding(inputs({ word: "  Land With Recommendations " })),
    ).toEqual({ ok: true });
    expect(checkLanding(inputs({ word: "LAND" }))).toEqual({ ok: true });
  });

  it("refuses a wake no word started", () => {
    expect(checkLanding(inputs({ word: "ship it" }))).toEqual({
      ok: false,
      check: "word-not-said",
    });
    expect(checkLanding(inputs({ word: null }))).toEqual({
      ok: false,
      check: "word-not-said",
    });
  });

  it("refuses a member the team map does not name", () => {
    expect(checkLanding(inputs({ senderHandle: null }))).toEqual({
      ok: false,
      check: "sender-unknown",
    });
  });

  it("refuses anybody but the hand of the stage", () => {
    expect(checkLanding(inputs({ senderHandle: "@dee" }))).toEqual({
      ok: false,
      check: "not-the-hand",
    });
    expect(
      checkLanding(inputs({ artifact: "ui-design", senderHandle: "@dee" })),
    ).toEqual({ ok: true });
  });

  it("reads a task group's hand from the apply block", () => {
    expect(
      checkLanding(inputs({ artifact: "3", senderHandle: "@kinisworking" })),
    ).toEqual({ ok: true });
    expect(checkLanding(inputs({ artifact: "3" }))).toEqual({
      ok: false,
      check: "not-the-hand",
    });
  });

  it("takes the change's own directory, the manual's pages and the references", () => {
    expect(
      checkLanding(
        inputs({
          files: [
            { path: `openspec/changes/${CHANGE}/decisions.md`, patch: "" },
            {
              path: "docs/prds/products/grade10-site/store/cart.md",
              patch: "",
            },
            { path: "docs/references/agent-runner.md", patch: "" },
          ],
        }),
      ),
    ).toEqual({ ok: true });
  });

  it("refuses a file outside them", () => {
    expect(
      checkLanding(
        inputs({
          files: [
            { path: `openspec/changes/${CHANGE}/proposal.md`, patch: "" },
            { path: "packages/ui/src/blocks/cart/cart-badge.tsx", patch: "" },
          ],
        }),
      ),
    ).toEqual({ ok: false, check: "file-outside-change" });
  });

  it("refuses another change's directory", () => {
    expect(
      checkLanding(
        inputs({
          files: [
            { path: "openspec/changes/another-change/proposal.md", patch: "" },
          ],
        }),
      ),
    ).toEqual({ ok: false, check: "file-outside-change" });
  });

  it("refuses a record whose hands are keyed differently from the schema's teammate", () => {
    expect(
      checkLanding(
        inputs({
          record: `hands:\n  product-manager: "@ecchochan"\n`,
        }),
      ),
    ).toEqual({ ok: false, check: "not-the-hand" });
  });
});

describe("a landing on a read again", () => {
  it("shared-planning-agent-rounds-SC-77 - a reviewed-only landing needs no word", () => {
    expect(
      checkLanding(
        inputs({
          kind: "reviewed",
          word: null,
          senderHandle: null,
          files: [
            {
              path: `openspec/changes/${CHANGE}/.openspec.yaml`,
              patch: REVIEWED_PATCH,
            },
          ],
        }),
      ),
    ).toEqual({ ok: true });
  });

  it("refuses a second file", () => {
    expect(
      checkLanding(
        inputs({
          kind: "reviewed",
          files: [
            {
              path: `openspec/changes/${CHANGE}/.openspec.yaml`,
              patch: REVIEWED_PATCH,
            },
            { path: `openspec/changes/${CHANGE}/rounds.md`, patch: "" },
          ],
        }),
      ),
    ).toEqual({ ok: false, check: "not-only-reviewed" });
  });

  it("refuses another file of the record's own directory", () => {
    expect(
      checkLanding(
        inputs({
          kind: "reviewed",
          files: [
            {
              path: `openspec/changes/${CHANGE}/rounds.md`,
              patch: REVIEWED_PATCH,
            },
          ],
        }),
      ),
    ).toEqual({ ok: false, check: "not-only-reviewed" });
  });

  it("refuses a line that is not the reviewed key or an artifact's sha", () => {
    expect(
      checkLanding(
        inputs({
          kind: "reviewed",
          files: [
            {
              path: `openspec/changes/${CHANGE}/.openspec.yaml`,
              patch: `@@ -2,2 +2,3 @@\n promoted_by: "@ecchochan"\n+reviewed:\n+  proposal: 1a2b3c4d\n+landed_by: "@ecchochan"\n`,
            },
          ],
        }),
      ),
    ).toEqual({ ok: false, check: "not-only-reviewed" });
  });

  it("refuses a sha that is not eight hex", () => {
    expect(
      checkLanding(
        inputs({
          kind: "reviewed",
          files: [
            {
              path: `openspec/changes/${CHANGE}/.openspec.yaml`,
              patch: "@@ -2,2 +2,3 @@\n+reviewed:\n+  proposal: mainline\n",
            },
          ],
        }),
      ),
    ).toEqual({ ok: false, check: "not-only-reviewed" });
  });

  it("refuses a patch that changed nothing", () => {
    expect(
      checkLanding(
        inputs({
          kind: "reviewed",
          files: [
            { path: `openspec/changes/${CHANGE}/.openspec.yaml`, patch: "" },
          ],
        }),
      ),
    ).toEqual({ ok: false, check: "not-only-reviewed" });
  });

  it("takes a sha rewritten in place", () => {
    expect(
      checkLanding(
        inputs({
          kind: "reviewed",
          files: [
            {
              path: `openspec/changes/${CHANGE}/.openspec.yaml`,
              patch:
                "@@ -4,3 +4,3 @@\n reviewed:\n-  proposal: 1a2b3c4d\n+  proposal: 9f8e7d6c\n",
            },
          ],
        }),
      ),
    ).toEqual({ ok: true });
  });
});
