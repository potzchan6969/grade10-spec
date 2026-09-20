import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { MainHead } from "../src/api/head";
import type { CheckoutStanding } from "../src/api/types";
import { fakeClock, fakeHttp } from "./fake-net";
import { snapshotOf } from "./manual-fixture";

/**
 * The banner a page wears while it is behind `main`, in both readings: the
 * hosted page waiting for its own rebuild, and the checkout a teammate is
 * running the manual out of.
 *
 * The poll is the part with teeth. A reader mid-sentence in the editor is not
 * interrupted, and nothing here ever reloads the window — the snapshot is
 * re-read, which keeps the reader on the page and at the scroll position they
 * were already at.
 */

const HEAD = "0".repeat(40);
const MOVED = "9f1c2b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b";
const SUBJECT = "docs(planning): the surfaces round on both changes";

const held = vi.hoisted(() => ({
  checkout: undefined as unknown,
  head: null as unknown,
  reloads: 0,
  snapshot: undefined as unknown,
  store: null as unknown,
}));

vi.mock("../src/api/snapshot-provider", () => ({
  useSnapshotData: () => held.snapshot,
  useSnapshotReload: () => () => {
    held.reloads += 1;
  },
}));
vi.mock("../src/editor/session", () => ({
  useEditorSession: () => ({ status: "ready", store: held.store }),
}));
vi.mock("../src/api/head", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../src/api/head")>()),
  useCheckout: () => held.checkout,
  useMainHead: () => held.head,
}));

const { pullMain } = await import("../src/api/head");
const { DEPLOYED_POLL_MS, isTyping, MainMoved, watchDeployedHead } =
  await import("../src/shell/main-moved");

/** A head `main` reached `minutes` ago, which is what the sentence dates
 * itself by. */
function movedHead(minutes: number, main = MOVED): MainHead {
  return {
    at: new Date(Date.now() - minutes * 60_000).toISOString(),
    main,
    subject: SUBJECT,
  };
}

function standing(parts: Partial<CheckoutStanding> = {}): CheckoutStanding {
  return { ahead: 0, behind: 0, dirty: false, fetched: true, ...parts };
}

function render(
  reading: {
    head?: MainHead | null;
    local?: boolean;
    refused?: string | null;
    standing?: CheckoutStanding | null;
  } = {},
): string {
  held.snapshot = snapshotOf({ storeHead: HEAD });
  held.head = reading.head ?? null;
  held.store = reading.local ? { label: "the working tree" } : null;
  held.checkout = {
    pull: () => {},
    pulling: false,
    refused: reading.refused ?? null,
    reread: () => {},
    standing: reading.standing ?? null,
  };
  return renderToStaticMarkup(<MainMoved />);
}

describe("a hosted page while `main` is ahead of it", () => {
  const html = render({ head: movedHead(2) });

  it("says when `main` moved, with the commit's own subject", () => {
    expect(html).toContain("moved 2 minutes ago");
    expect(html).toContain(SUBJECT);
    expect(html).toContain("<code");
  });

  it("says the site catches up on its own, and offers it now", () => {
    expect(html).toContain(
      "This site rebuilds in a few minutes and refreshes on its own.",
    );
    expect(html).toContain("Refresh now");
  });

  it("is a status, never an alert", () => {
    expect(html).toContain('role="status"');
    expect(html).not.toContain('role="alert"');
  });
});

describe("a page that is caught up", () => {
  it.each([
    ["no relay answers", { head: null }],
    ["the head it shows is `main`", { head: movedHead(2, HEAD) }],
    ["the checkout is level", { local: true, standing: standing() }],
  ])("renders nothing where %s", (_what, reading) => {
    expect(render(reading)).toBe("");
  });
});

describe("the checkout the manual is running out of", () => {
  it("says how far behind it is, and offers the pull", () => {
    const html = render({ local: true, standing: standing({ behind: 3 }) });

    expect(html).toContain("Your checkout is 3 commits behind");
    expect(html).toContain("Pull");
  });

  it("counts one commit as one", () => {
    const html = render({ local: true, standing: standing({ behind: 1 }) });

    expect(html).toContain("Your checkout is 1 commit behind");
  });

  it("offers no pull while the checkout is ahead", () => {
    const html = render({ local: true, standing: standing({ ahead: 2 }) });

    expect(html).toContain("2 commits ahead");
    expect(html).not.toContain(">Pull<");
  });

  it("says a refused pull where the press left it", () => {
    const html = render({
      local: true,
      refused: "Your checkout has uncommitted changes.",
      standing: standing({ behind: 2, dirty: true }),
    });

    expect(html).toContain("Your checkout has uncommitted changes.");
  });

  it("reads nothing about a checkout on the hosted site", () => {
    expect(render({ standing: standing({ behind: 3 }) })).toBe("");
  });
});

describe("the poll while the page is behind", () => {
  const watch = (
    parts: { storeHead?: string; typing?: () => boolean } = {},
  ) => {
    const { asked, http } = fakeHttp({
      "/api/head": { storeHead: parts.storeHead ?? MOVED },
    });
    const clock = fakeClock();
    let reloads = 0;
    const stop = watchDeployedHead({
      head: HEAD,
      http,
      reload: () => {
        reloads += 1;
      },
      typing: parts.typing,
      wait: clock.wait,
    });
    return { asked, clock, reloads: () => reloads, stop };
  };

  it("re-reads the store once the site's own head has moved", async () => {
    const poll = watch();

    expect(poll.clock.next()).toBe(DEPLOYED_POLL_MS);
    expect(poll.asked).toEqual([]);

    await poll.clock.fire();

    expect(poll.asked).toEqual(["/api/head"]);
    expect(poll.reloads()).toBe(1);
    poll.stop();
  });

  it("leaves the page alone while the site is still behind too", async () => {
    const poll = watch({ storeHead: HEAD });

    await poll.clock.fire();

    expect(poll.reloads()).toBe(0);
    expect(poll.clock.next()).toBe(DEPLOYED_POLL_MS);
  });

  it("waits for the next poll while a reader is typing", async () => {
    let typing = true;
    const poll = watch({ typing: () => typing });

    await poll.clock.fire();
    expect(poll.reloads()).toBe(0);

    typing = false;
    await poll.clock.fire();
    expect(poll.reloads()).toBe(1);
  });

  it("polls nothing more once it is stopped", async () => {
    const poll = watch();
    poll.stop();

    await poll.clock.fire();

    expect(poll.reloads()).toBe(0);
  });
});

describe("what counts as typing", () => {
  const focused = (tag: string, attributes: Record<string, string> = {}) =>
    ({
      getAttribute: (name: string) => attributes[name] ?? null,
      tagName: tag,
    }) as unknown as Element;

  it.each([
    ["a textarea", focused("TEXTAREA"), true],
    ["a text field", focused("INPUT"), true],
    ["a search field", focused("INPUT", { type: "search" }), true],
    ["a checkbox", focused("INPUT", { type: "checkbox" }), false],
    ["a button", focused("BUTTON"), false],
    ["an editable block", focused("DIV", { contenteditable: "true" }), true],
    ["a block that is not editable", focused("DIV", {}), false],
    ["nothing at all", null, false],
  ])("reads %s as %s", (_what, active, typing) => {
    expect(isTyping(active)).toBe(typing);
  });
});

describe("the pull the button presses", () => {
  it("answers what landed", async () => {
    const http = (async () =>
      new Response(JSON.stringify({ head: MOVED, pulled: true }), {
        headers: { "content-type": "application/json" },
        status: 200,
      })) as typeof fetch;

    expect(await pullMain(http)).toEqual({ head: MOVED, pulled: true });
  });

  it("carries a refusal back in the endpoint's own words", async () => {
    const http = (async () =>
      new Response(
        JSON.stringify({ reason: "Your checkout has uncommitted changes." }),
        {
          headers: { "content-type": "application/json" },
          status: 409,
        },
      )) as typeof fetch;

    expect(await pullMain(http)).toEqual({
      reason: "Your checkout has uncommitted changes.",
    });
  });

  it("says so where no dev server answered", async () => {
    const http = (async () =>
      new Response("no", { status: 404 })) as typeof fetch;

    expect(await pullMain(http)).toHaveProperty("reason");
  });
});
