import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  checkReviewed,
  checkWord,
  LANDING_PATHS,
  type ReviewedLanding,
  roleFor,
  type WordLanding,
} from "../src/land.ts";

/** The checks behind a moved `main`, over inputs already fetched.
 *
 * The record's `hands:` is read by the artifact's `hand:` in the schema — its
 * role key, beside the `teammate:` that titles whoever writes it. These
 * fixtures carry both names, as the store's schema does, and a task group
 * takes the plan's hand. */

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
  - id: tasks
    teammate: engineer
    hand: dev
  - id: release-notes
    hand: chief
`;

const RECORD = `schema: grade10-planning
promoted_by: "@ecchochan"
hands:
  pm: "@ecchochan"
  design: "@dee"
  qa: "@quinn"
  dev: "@kinisworking"
landed_by:
  proposal: "@ecchochan"
  ui-design: "@dee"
  "3": "@kinisworking"
`;

const CHANGE = "nav-cart-count-badge";

function word(over: Partial<WordLanding> = {}): WordLanding {
  return {
    change: CHANGE,
    artifact: "proposal",
    word: "land",
    senderHandle: "ecchochan",
    record: RECORD,
    schema: SCHEMA,
    paths: [
      `openspec/changes/${CHANGE}/proposal.md`,
      `openspec/changes/${CHANGE}/rounds.md`,
    ],
    ...over,
  };
}

const AT_MAIN = `schema: grade10-planning
hands:
  pm: "@ecchochan"
reviewed:
  ui-design: 1a2b3c4d
`;

function reviewed(over: Partial<ReviewedLanding> = {}): ReviewedLanding {
  return {
    change: CHANGE,
    paths: [`openspec/changes/${CHANGE}/.openspec.yaml`],
    atMain: AT_MAIN,
    atSha: `${AT_MAIN}  tech-design: 5e6f7a8b\n`,
    ...over,
  };
}

describe("whose word lands which artifact", () => {
  it("reads the role off the artifact's hand, not its teammate", () => {
    expect(roleFor(SCHEMA, "proposal")).toEqual({ role: "pm" });
    expect(roleFor(SCHEMA, "ui-design")).toEqual({ role: "design" });
    expect(roleFor(SCHEMA, "test-cases")).toEqual({ role: "qa" });
  });

  it("reads a task group's role off the plan's hand", () => {
    expect(roleFor(SCHEMA, "3")).toEqual({ role: "dev" });
    expect(roleFor(SCHEMA, " 12 ")).toEqual({ role: "dev" });
  });

  it("refuses an id the schema does not name", () => {
    expect(roleFor(SCHEMA, "not-an-artifact")).toEqual({
      check: "unknown-artifact",
    });
    expect(roleFor("name: grade10-planning\n", "2")).toEqual({
      check: "unknown-artifact",
    });
  });

  it("refuses an artifact the schema gives no role in the six", () => {
    expect(roleFor(SCHEMA, "specs")).toEqual({ check: "unknown-role" });
    expect(roleFor(SCHEMA, "release-notes")).toEqual({ check: "unknown-role" });
  });
});

describe("a landing on a word", () => {
  it("shared-planning-agent-rounds-SC-73 - A run lands through the relay, which checks the word", () => {
    expect(checkWord(word())).toEqual({ ok: true });
  });

  it("refuses a wake no word started", () => {
    expect(checkWord(word({ word: "ship it" }))).toEqual({
      ok: false,
      check: "word-not-said",
    });
    expect(checkWord(word({ word: null }))).toEqual({
      ok: false,
      check: "word-not-said",
    });
  });

  it("refuses a member the team map does not name", () => {
    expect(checkWord(word({ senderHandle: null }))).toEqual({
      ok: false,
      check: "sender-unknown",
    });
  });

  it("refuses an artifact the schema does not name, and one with no role", () => {
    expect(checkWord(word({ artifact: "not-an-artifact" }))).toEqual({
      ok: false,
      check: "unknown-artifact",
    });
    expect(checkWord(word({ artifact: "specs" }))).toEqual({
      ok: false,
      check: "unknown-role",
    });
  });

  it("matches the artifact's hand against the record's hands", () => {
    // The proposal's hand is `pm`, whom the record names @ecchochan; the
    // design's is `design`, whom it names @dee.
    expect(checkWord(word({ senderHandle: "dee" }))).toEqual({
      ok: false,
      check: "not-the-hand",
    });
    expect(
      checkWord(
        word({
          artifact: "ui-design",
          senderHandle: "dee",
          paths: [`openspec/changes/${CHANGE}/ui-design.md`],
        }),
      ),
    ).toEqual({ ok: true });
  });

  it("reads the hand and the handle in one spelling", () => {
    expect(checkWord(word({ senderHandle: "@Ecchochan" }))).toEqual({
      ok: true,
    });
  });

  it("refuses a record that names no hand for the role", () => {
    expect(checkWord(word({ record: `hands:\n  design: "@dee"\n` }))).toEqual({
      ok: false,
      check: "not-the-hand",
    });
  });

  it("refuses a commit whose landed_by is somebody else, or missing", () => {
    expect(
      checkWord(
        word({
          record: `hands:\n  pm: "@ecchochan"\nlanded_by:\n  proposal: "@dee"\n`,
        }),
      ),
    ).toEqual({ ok: false, check: "landed-by-mismatch" });
    expect(checkWord(word({ record: `hands:\n  pm: "@ecchochan"\n` }))).toEqual(
      { ok: false, check: "landed-by-mismatch" },
    );
  });

  it("takes the change's own directory, the manual's pages and the references", () => {
    expect(
      checkWord(
        word({
          paths: [
            `openspec/changes/${CHANGE}/decisions.md`,
            "docs/prds/products/grade10-site/store/cart.md",
            "docs/references/agent-runner.md",
          ],
        }),
      ),
    ).toEqual({ ok: true });
  });

  it("refuses a file outside them, and another change's directory", () => {
    expect(
      checkWord(
        word({
          paths: [
            `openspec/changes/${CHANGE}/proposal.md`,
            "packages/ui/src/blocks/cart/cart-badge.tsx",
          ],
        }),
      ),
    ).toEqual({ ok: false, check: "file-outside-change" });
    expect(
      checkWord(
        word({ paths: ["openspec/changes/another-change/proposal.md"] }),
      ),
    ).toEqual({ ok: false, check: "file-outside-change" });
  });

  it("holds a task group to the word and the hand, and to no record line", () => {
    // A group lands code: its paths are the group's own, held by the run's
    // guard before it pushes, and the record carries no `landed_by:` for a
    // group, so the relay checks the word and the hand alone (`Q68`).
    const group = {
      artifact: "3",
      senderHandle: "kinisworking",
      paths: [
        "packages/ui/src/blocks/cart/cart-badge.tsx",
        `openspec/changes/${CHANGE}/tasks.md`,
      ],
    };
    expect(checkWord(word(group))).toEqual({ ok: true });
    expect(checkWord(word({ ...group, senderHandle: "dee" }))).toEqual({
      ok: false,
      check: "not-the-hand",
    });
    expect(checkWord(word({ ...group, word: "ship it" }))).toEqual({
      ok: false,
      check: "word-not-said",
    });
    expect(checkWord(word({ ...group, artifact: "4" }))).toEqual({ ok: true });
  });
});

describe("what the relay's path check is the coarse superset of", () => {
  /** One proposal in the store's shape: two pages marked, one of them by a
   * section, and two links that are neither. */
  const PROPOSAL = `## Why

The badge is marked on
[Agent Rounds](../../../docs/prds/products/shared/planning/agent-rounds.md#product-decisions)
and on [change stages](../../../docs/prds/products/shared/planning/change-stages.md),
against [the runner](../../../docs/references/agent-runner.md) and
[the schema](../../../openspec/schemas/grade10-planning/schema.yaml).

A page the store does not hold, [the cart](../../../docs/prds/products/grade10-site/store/nothing-here.md),
is no page.
`;

  /**
   * The store's own reading of what a re-read of one change may write,
   * replicated: `scripts/openspec/lib/writable.mjs` reads the proposal
   * through `perspectives.mjs`, which imports `node:fs` and the manual's
   * schema reader, so the rule is written here rather than the module
   * imported — the change's own directory, then every `docs/prds/` page the
   * proposal links that the store holds.
   */
  function writableBy(change: string, proposal: string): string[] {
    const root = new URL("../../../", import.meta.url);
    const dir = `openspec/changes/${change}`;
    const pages = new Set<string>();
    for (const link of proposal.matchAll(/\]\(([^)\s]+)\)/g)) {
      const [target] = link[1].split("#");
      if (!target.endsWith(".md")) continue;
      const page = String(new URL(target, new URL(`${dir}/`, root))).slice(
        String(root).length,
      );
      if (!page.startsWith("docs/prds/")) continue;
      try {
        readFileSync(`${decodeURIComponent(root.pathname)}${page}`, "utf8");
      } catch {
        continue;
      }
      pages.add(page);
    }
    return [`${dir}/`, ...pages];
  }

  it("takes every path a re-read of one change may write", () => {
    const writable = writableBy(CHANGE, PROPOSAL);
    expect(writable).toEqual([
      `openspec/changes/${CHANGE}/`,
      "docs/prds/products/shared/planning/agent-rounds.md",
      "docs/prds/products/shared/planning/change-stages.md",
    ]);
    const coarse = [`openspec/changes/${CHANGE}/`, ...LANDING_PATHS];
    for (const path of writable)
      expect(coarse.some((one) => path.startsWith(one))).toBe(true);
    // And the check itself takes a landing that wrote them.
    expect(
      checkWord(
        word({
          paths: [
            `openspec/changes/${CHANGE}/proposal.md`,
            ...writable.slice(1),
          ],
        }),
      ),
    ).toEqual({ ok: true });
  });
});

describe("a landing on a read again", () => {
  it("shared-planning-agent-rounds-SC-77 - A reviewed-only landing needs no word", () => {
    expect(checkReviewed(reviewed())).toEqual({ ok: true });
  });

  it("takes a line rewritten in place", () => {
    expect(
      checkReviewed(
        reviewed({
          atSha: AT_MAIN.replace("1a2b3c4d", "9f8e7d6c"),
        }),
      ),
    ).toEqual({ ok: true });
  });

  it("takes the first line of a record that had none", () => {
    expect(
      checkReviewed(
        reviewed({
          atMain: "schema: grade10-planning\n",
          atSha: "schema: grade10-planning\nreviewed:\n  proposal: 1a2b3c4d\n",
        }),
      ),
    ).toEqual({ ok: true });
  });

  it("refuses a second file, and another file of the change's directory", () => {
    expect(
      checkReviewed(
        reviewed({
          paths: [
            `openspec/changes/${CHANGE}/.openspec.yaml`,
            `openspec/changes/${CHANGE}/rounds.md`,
          ],
        }),
      ),
    ).toEqual({ ok: false, check: "not-only-reviewed" });
    expect(
      checkReviewed(
        reviewed({ paths: [`openspec/changes/${CHANGE}/rounds.md`] }),
      ),
    ).toEqual({ ok: false, check: "not-only-reviewed" });
  });

  it("refuses another key of the record moving with it", () => {
    expect(
      checkReviewed(
        reviewed({
          atSha: `${AT_MAIN}  tech-design: 5e6f7a8b\nlanded_by:\n  proposal: "@ecchochan"\n`,
        }),
      ),
    ).toEqual({ ok: false, check: "not-only-reviewed" });
    expect(
      checkReviewed(
        reviewed({
          atSha: `${AT_MAIN.replace("@ecchochan", "@dee")}  tech-design: 5e6f7a8b\n`,
        }),
      ),
    ).toEqual({ ok: false, check: "not-only-reviewed" });
  });

  it("refuses a record that says the same thing at both ends", () => {
    expect(checkReviewed(reviewed({ atSha: AT_MAIN }))).toEqual({
      ok: false,
      check: "not-only-reviewed",
    });
  });

  it("refuses a line that is not an artifact against a content id", () => {
    expect(
      checkReviewed(reviewed({ atSha: `${AT_MAIN}  tech-design: mainline\n` })),
    ).toEqual({ ok: false, check: "not-only-reviewed" });
    expect(
      checkReviewed(
        reviewed({ atSha: "schema: grade10-planning\nreviewed: yesterday\n" }),
      ),
    ).toEqual({ ok: false, check: "not-only-reviewed" });
  });

  it("refuses a line another artifact's read again wrote being dropped", () => {
    expect(
      checkReviewed(
        reviewed({
          atMain: `${AT_MAIN}  tech-design: 5e6f7a8b\n`,
          atSha: AT_MAIN.replace("1a2b3c4d", "9f8e7d6c"),
        }),
      ),
    ).toEqual({ ok: false, check: "reviewed-line-removed" });
  });
});
