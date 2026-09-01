import { describe, expect, it } from "vitest";
import { BLOCK_SPECS, parsePage, serializePage } from "../src/content/grammar";
import {
  attrsOf,
  BLOCK_TYPES,
  buildPage,
  checkItem,
  type Draft,
  type DraftBlock,
  type DraftContainer,
  type DraftLeaf,
  draftFromSource,
  draftId,
  isContainer,
  newDraftBlock,
  proseProblem,
} from "../src/editor/draft";

/** A value a descriptor accepts, chosen from the descriptor itself. */
function sample(attr: {
  name: string;
  kind?: string;
  oneOf?: readonly string[];
}) {
  if (attr.oneOf) return attr.oneOf[attr.oneOf.length - 1];
  if (attr.kind === "int") return "7";
  return `sample-${attr.name}`;
}

/**
 * Fills a new block the way a person would: every required field, then each
 * optional one that the block still accepts. Nothing here lists an attribute
 * by hand, so a block that gains one is covered the day it does.
 */
function filled(type: string): DraftBlock {
  const block = newDraftBlock(type);
  if (block.type === "prose") {
    return {
      ...block,
      markdown: "Prose with **emphasis** and a list:\n\n- one",
    };
  }

  const leaf = block as DraftLeaf;
  let attrs = { ...leaf.attrs };
  for (const attr of attrsOf(type)) {
    if (attr.required) attrs[attr.name] = sample(attr);
  }
  for (const attr of attrsOf(type)) {
    if (attr.required) continue;
    const candidate = { ...attrs, [attr.name]: sample(attr) };
    if (checkItem({ ...leaf, attrs: candidate }).problems.length === 0) {
      attrs = candidate;
    }
  }

  if (!isContainer(block)) return { ...leaf, attrs };
  return {
    ...(block as DraftContainer),
    attrs,
    body: [
      { id: draftId(), type: "prose", markdown: "Body prose." },
      {
        id: draftId(),
        type: "image",
        attrs: { src: "assets/x.png", alt: "x" },
      },
    ],
  };
}

function pageOf(blocks: DraftBlock[]): Draft {
  return {
    frontmatter: {
      title: "Round trip",
      summary: "",
      spec: "",
      audience: "",
      order: "",
    },
    blocks,
  };
}

describe("the draft covers the grammar", () => {
  it("offers every block type the grammar defines", () => {
    expect(BLOCK_TYPES).toEqual(["prose", ...Object.keys(BLOCK_SPECS)]);
  });
});

describe.each(BLOCK_TYPES)("a %s block", (type) => {
  const block = filled(type);
  const built = buildPage(pageOf([block]));

  it("builds from its form with no problems", () => {
    expect(built.ok ? [] : [...built.problems.values()].flat()).toEqual([]);
  });

  it("serializes to canonical text the grammar reads back", () => {
    if (!built.ok) throw new Error("did not build");
    expect(serializePage(parsePage(built.source))).toBe(built.source);
    expect(parsePage(built.source)).toEqual(built.ast);
  });

  it("re-reads into a draft that builds the same text", () => {
    if (!built.ok) throw new Error("did not build");
    const again = buildPage(draftFromSource(built.source));
    expect(again.ok && again.source).toBe(built.source);
  });
});

describe("a whole page of every block", () => {
  it("round-trips in one document", () => {
    const built = buildPage(pageOf(BLOCK_TYPES.map(filled)));
    if (!built.ok) throw new Error(`did not build: ${[...built.problems]}`);
    expect(serializePage(parsePage(built.source))).toBe(built.source);
    expect(buildPage(draftFromSource(built.source))).toMatchObject({
      source: built.source,
    });
  });
});

describe("what the forms refuse", () => {
  it("marks a quote in an attribute, and saves nothing", () => {
    const block = { ...(filled("figma") as DraftLeaf) };
    block.attrs = { ...block.attrs, title: 'a "quoted" title' };
    const built = buildPage(pageOf([block]));

    expect(built.ok).toBe(false);
    if (built.ok) return;
    expect(built.problems.get(block.id)).toEqual([
      { attr: "title", message: 'a " cannot appear in an attribute' },
    ]);
  });

  it("marks a missing required attribute", () => {
    const block = newDraftBlock("spec") as DraftLeaf;
    const built = buildPage(pageOf([block]));

    expect(built.ok).toBe(false);
    if (built.ok) return;
    expect(built.problems.get(block.id)).toEqual([
      { attr: "id", message: "id is required" },
    ]);
  });

  it("marks a choice outside the set", () => {
    const block = newDraftBlock("callout") as DraftLeaf;
    block.attrs = { kind: "shout" };
    const built = buildPage(pageOf([block]));

    expect(built.ok).toBe(false);
    if (built.ok) return;
    expect(built.problems.get(block.id)?.[0].message).toContain(
      "must be one of",
    );
  });

  it("marks a height that is not a whole number", () => {
    const block = filled("story") as DraftLeaf;
    block.attrs = { ...block.attrs, height: "4.5" };
    const built = buildPage(pageOf([block]));

    expect(built.ok).toBe(false);
    if (built.ok) return;
    expect(built.problems.get(block.id)?.[0].attr).toBe("height");
  });

  it("marks the spec block using two selectors at once", () => {
    const block = newDraftBlock("spec") as DraftLeaf;
    block.attrs = {
      id: "a/b",
      requirement: "R",
      scenario: "b-SC-01",
      story: "",
    };
    const built = buildPage(pageOf([block]));

    expect(built.ok).toBe(false);
    if (built.ok) return;
    expect(built.problems.get(block.id)?.[0].message).toContain(
      "use only one of",
    );
  });

  it("refuses a title-less page", () => {
    const built = buildPage({
      frontmatter: {
        title: "  ",
        summary: "",
        spec: "",
        audience: "",
        order: "",
      },
      blocks: [],
    });
    expect(built.ok).toBe(false);
  });

  it("catches prose that would parse as a directive", () => {
    expect(proseProblem('::spec{id="a/b"}')).toContain("directive");
    expect(proseProblem(":::")).not.toBe(null);
    expect(proseProblem("Plain words.")).toBe(null);
    expect(proseProblem('```\n::spec{id="a/b"}\n```')).toBe(null);
  });

  it("drops an empty prose block instead of writing whitespace", () => {
    const built = buildPage(
      pageOf([
        { id: draftId(), type: "prose", markdown: "   \n\n  " },
        { id: draftId(), type: "prose", markdown: "Kept." },
      ]),
    );
    expect(built.ok && built.ast.blocks).toEqual([
      { type: "prose", markdown: "Kept." },
    ]);
  });
});

describe("what the forms keep", () => {
  it("saves an attribute with the spaces the author typed", () => {
    const block = filled("image") as DraftLeaf;
    block.attrs = { ...block.attrs, caption: " — " };
    const built = buildPage(pageOf([block]));

    expect(built.ok ? [] : [...built.problems.values()].flat()).toEqual([]);
    if (!built.ok) return;
    expect(built.source).toContain('caption=" — "');

    const again = draftFromSource(built.source);
    expect((again.blocks[0] as DraftLeaf).attrs.caption).toBe(" — ");
    expect(buildPage(again)).toMatchObject({ source: built.source });
  });

  it("still calls a field of nothing but spaces empty", () => {
    const block = newDraftBlock("spec") as DraftLeaf;
    block.attrs = { ...block.attrs, id: "   " };
    const built = buildPage(pageOf([block]));

    expect(built.ok).toBe(false);
    if (built.ok) return;
    expect(built.problems.get(block.id)).toEqual([
      { attr: "id", message: "id is required" },
    ]);
  });
});

describe("frontmatter", () => {
  it("writes the five fields in canonical order and omits the empty ones", () => {
    const built = buildPage({
      frontmatter: {
        title: "Loyalty",
        summary: "Points.",
        spec: "grade10-store/loyalty",
        audience: "operator",
        order: "6",
      },
      blocks: [],
    });
    expect(built.ok && built.source).toBe(
      "---\ntitle: Loyalty\nsummary: Points.\nspec: grade10-store/loyalty\naudience: operator\norder: 6\n---\n",
    );
  });
});
