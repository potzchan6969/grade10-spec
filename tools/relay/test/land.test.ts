import { describe, expect, it } from "vitest";
import { checkLanding, type LandInputs, roleFor } from "../src/land.ts";

/** The checks behind a moved `main`, over inputs already fetched.
 *
 * The record's `hands:` is read by the artifact's `hand:` in the schema — its
 * role key, beside the `teammate:` that titles whoever writes it. These
 * fixtures carry both names, as the store's schema does, and a task group's
 * hand is the `apply:` block's where the schema names one. */

const SCHEMA = `name: grade10-planning
artifacts:
  - id: proposal
    teammate: product-manager
    hand: pm
  - id: ui-design
    teammate: designer
    hand: design
  - id: test-cases
    hand: qa
  - id: specs
    required: true
`;

/** The same schema with a hand on its `apply:` block, which the store's own
 * schema does not carry yet. */
const SCHEMA_WITH_APPLY_HAND = `${SCHEMA}apply:
  hand: qa
`;

const RECORD = `schema: grade10-planning
promoted_by: "@ecchochan"
hands:
  pm: "@ecchochan"
  design: "@dee"
  qa: "@quinn"
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
  it("reads the role off the artifact's hand, not its teammate", () => {
    expect(roleFor(SCHEMA, "proposal")).toBe("pm");
    expect(roleFor(SCHEMA, "ui-design")).toBe("design");
    expect(roleFor(SCHEMA, "test-cases")).toBe("qa");
  });

  it("reads a task group's role off the apply block, or dev without one", () => {
    expect(roleFor(SCHEMA_WITH_APPLY_HAND, "2")).toBe("qa");
    expect(roleFor(SCHEMA, "2")).toBe("dev");
  });

  it("falls back to dev where the schema names no hand", () => {
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

  it("matches the artifact's hand against the record's hands", () => {
    // The proposal's hand is `pm`, whom the record names @ecchochan; the
    // design's is `design`, whom it names @dee.
    expect(checkLanding(inputs())).toEqual({ ok: true });
    expect(checkLanding(inputs({ senderHandle: "@dee" }))).toEqual({
      ok: false,
      check: "not-the-hand",
    });
    expect(
      checkLanding(inputs({ artifact: "ui-design", senderHandle: "@dee" })),
    ).toEqual({ ok: true });
    expect(checkLanding(inputs({ artifact: "ui-design" }))).toEqual({
      ok: false,
      check: "not-the-hand",
    });
  });

  it("lands a task group on the apply block's hand, or on dev without one", () => {
    expect(
      checkLanding(
        inputs({
          artifact: "3",
          schema: SCHEMA_WITH_APPLY_HAND,
          senderHandle: "@quinn",
        }),
      ),
    ).toEqual({ ok: true });
    expect(
      checkLanding(inputs({ artifact: "3", schema: SCHEMA_WITH_APPLY_HAND })),
    ).toEqual({ ok: false, check: "not-the-hand" });
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

  it("refuses a record that names no hand for the role", () => {
    expect(
      checkLanding(inputs({ record: `hands:\n  design: "@dee"\n` })),
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
