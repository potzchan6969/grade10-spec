import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

/** The propose control only exists when a store is answering — the manual is
 * edited locally only, so a deployed build with no dev server behind it shows
 * none of this. */

const held = vi.hoisted(() => ({
  session: { store: null as unknown },
}));

vi.mock("../src/editor/session", () => ({
  useEditorSession: () => held.session,
  noteWrite: () => {},
  rememberedHandle: () => "",
  rememberHandle: () => {},
}));

const { ProposePageAction, ProposeRowAction } = await import(
  "../src/editor/propose-actions"
);

function render(store: unknown): string {
  held.session = { store };
  return renderToStaticMarkup(
    <MemoryRouter>
      <ProposePageAction cites={["demo-product/alpha"]} />
      <ProposeRowAction cites={["alpha-SC-01"]} label="Propose a change" />
    </MemoryRouter>,
  );
}

describe("the propose control", () => {
  it("renders both controls once a store is answering", () => {
    const markup = render({});

    expect(markup).toContain("Propose");
    expect(markup).toContain("Propose a change to this page&#x27;s spec");
  });

  it("shows nothing at all while the store is still being found", () => {
    expect(render(null)).toBe("");
  });
});
