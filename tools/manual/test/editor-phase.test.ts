import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { DraftBlock } from "../src/editor/draft";
import {
  rulesAround,
  suggestionsFor,
  suggestionsForAttr,
} from "../src/editor/suggestions";
import { snapshotOf } from "./manual-fixture";
import { phases } from "./release-fixture";

const prose = (id: string, markdown: string): DraftBlock => ({
  id,
  type: "prose",
  markdown,
});
const phase = (id: string): DraftBlock => ({
  id,
  type: "phase",
  attrs: { id: "store-launch-2", priority: "P1", rules: "" },
});

describe("the phase block's form", () => {
  it("offers the registry's phase ids for `id`", () => {
    const suggestions = suggestionsFor(buildIndex(snapshotOf({ phases })));
    expect(suggestionsForAttr(suggestions, "phase", "id")).toEqual([
      "auction",
      "store-launch-1",
      "store-launch-2",
    ]);
  });

  it("offers the rules of the heading it sits under, and no other", () => {
    const blocks = [
      prose("a", "Opening.\n\n- **Loose** — before any heading"),
      prose("b", "## Promo Code"),
      phase("p"),
      prose(
        "c",
        "- **Typed** — a code\n  - **Held Codes** — a member's\n\n```\n## not a heading\n```\n\n## Points\n\n- **Spend** — off",
      ),
    ];
    expect(rulesAround(blocks, 2).map((rule) => rule.anchor)).toEqual([
      "typed",
      "held-codes",
    ]);
  });

  it("offers the page's opening rules before its first heading", () => {
    const blocks = [
      phase("p"),
      prose("a", "- **Loose** — x\n\n## Next\n\n- **Later** — y"),
    ];
    expect(rulesAround(blocks, 0).map((rule) => rule.anchor)).toEqual([
      "loose",
    ]);
  });
});
