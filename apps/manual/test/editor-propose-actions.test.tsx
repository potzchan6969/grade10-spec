import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";

/** The door is visible. A reader with no token used to see no Propose control
 * anywhere in the manual, so the one loop the site exists to start was
 * invisible to exactly the people who had not started it yet. */

const held = vi.hoisted(() => ({
  session: { store: null as unknown, kind: "github" as string },
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

function render(readOnly: string | null): string {
  held.session = {
    store: { readOnly, author: "echo", kind: "github" },
    kind: "github",
  };
  return renderToStaticMarkup(
    <MemoryRouter>
      <ProposePageAction cites={["demo-product/alpha"]} />
      <ProposeRowAction cites={["alpha-SC-01"]} label="Propose a change" />
    </MemoryRouter>,
  );
}

const LOCKED = "Read-only: no GitHub token. Add a fine-grained token.";

describe("the propose control a read-only session sees", () => {
  it("renders both controls, locked, and says what they would take", () => {
    const markup = render(LOCKED);

    expect(markup).toContain("Propose");
    expect(markup).toContain("Propose a change — sign in with GitHub first");
  });

  it("renders them unlocked once the session can write", () => {
    const markup = render(null);

    expect(markup).toContain("Propose");
    expect(markup).toContain("Propose a change to this page&#x27;s spec");
    expect(markup).not.toContain("needs a GitHub token");
  });

  it("shows nothing at all while the store is still being found", () => {
    held.session = { store: null, kind: "github" };
    expect(
      renderToStaticMarkup(
        <MemoryRouter>
          <ProposePageAction cites={[]} />
        </MemoryRouter>,
      ),
    ).toBe("");
  });
});
