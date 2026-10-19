import { afterEach, beforeEach, expect, test } from "vitest";
import { page } from "vitest/browser";
import type { CheckoutStanding } from "../src/api/types";
import { openManual } from "./setup";

/**
 * `shared-planning-change-stages-US-11`: the manual run from a checkout says
 * how far behind `main` it is and offers the pull. The dev server's three
 * endpoints are stubbed on `window.fetch` before the shell mounts — the shell
 * reads them through the global `fetch` — and everything else reaches the
 * fixture as it would.
 */
type Stub = {
  standing: CheckoutStanding;
  pull: { status: number; body: Record<string, unknown> };
  pulls: number;
};

let stub: Stub;
const real = window.fetch;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    status,
  });

beforeEach(() => {
  stub = {
    pull: { body: { head: "b".repeat(40), pulled: true }, status: 200 },
    pulls: 0,
    standing: { ahead: 0, behind: 0, dirty: false },
  };
  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(
      input instanceof Request ? input.url : String(input),
      window.location.origin,
    );
    if (url.pathname === "/api/dirty")
      return json(200, { dirty: false, files: [] });
    if (url.pathname === "/api/upstream") return json(200, stub.standing);
    if (url.pathname === "/api/pull") {
      stub.pulls += 1;
      if (stub.pull.status === 200) {
        stub.standing = { ahead: 0, behind: 0, dirty: false };
      }
      return json(stub.pull.status, stub.pull.body);
    }
    if (url.pathname === "/api/relay") return json(200, {});
    return real(input, init);
  }) as typeof fetch;
});

afterEach(() => {
  window.fetch = real;
});

test("shared-planning-change-stages-US11-TC1-1 - a checkout behind `main` names the count and pulls", async () => {
  stub.standing = { ahead: 0, behind: 3, dirty: false };
  await openManual("/");

  await expect
    .element(page.getByText("Your checkout is 3 commits behind"))
    .toBeVisible();
  await page.getByRole("button", { name: "Pull" }).click();

  await expect
    .element(page.getByText("Your checkout is 3 commits behind"))
    .not.toBeInTheDocument();
  await expect
    .element(page.getByRole("button", { name: "Pull" }))
    .not.toBeInTheDocument();
  expect(stub.pulls).toBe(1);
});

test.each([
  [
    "an uncommitted edit",
    { ahead: 0, behind: 3, dirty: true },
    "Your checkout is 3 commits behind main and has uncommitted work.",
  ],
  [
    "a commit `main` does not hold",
    { ahead: 1, behind: 3, dirty: false },
    "Your checkout is 3 commits behind main and 1 ahead.",
  ],
])(
  "shared-planning-change-stages-US11-TC2-1 - Pull is refused on %s",
  async (_what, standing, line) => {
    stub.standing = standing;
    await openManual("/");

    await expect.element(page.getByText(line)).toBeVisible();
    await expect
      .element(page.getByRole("button", { name: "Pull" }))
      .not.toBeInTheDocument();
    expect(stub.pulls).toBe(0);
  },
);

test("shared-planning-change-stages-US11-TC3-1 - a checkout with nothing to count says nothing", async () => {
  await openManual("/");

  await expect.element(page.getByRole("heading").first()).toBeVisible();
  await expect.element(page.getByText(/Your checkout/)).not.toBeInTheDocument();
  await expect
    .element(page.getByRole("button", { name: "Pull" }))
    .not.toBeInTheDocument();
});
