// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CouponList } from "./coupon-list";
import type { CouponItem } from "./types";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const COPY = {
  label: "Your coupons",
  spent: "Spent",
  void: "Void",
  scanTitle: "Use Coupon",
};

const coupon = (value: string): CouponItem => ({
  id: "reward",
  amount: "HK$50 off",
  expiry: "Use by 8 Nov 2026",
  status: "open",
  qrCode: {
    value,
    altText: "Show this code to store staff",
    toggleLabel: "Use now",
    caption: "Staff scan this at the counter",
  },
});

const roots: Root[] = [];

beforeEach(() => {
  document.body.replaceChildren();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: vi.fn((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

afterEach(() => {
  for (const root of roots.splice(0)) act(() => root.unmount());
});

function mount(value: string) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push(root);
  const render = (next: string) =>
    act(() =>
      root.render(
        createElement(CouponList, {
          copy: COPY,
          state: { status: "ready", data: [coupon(next)] },
        }),
      ),
    );
  render(value);
  return render;
}

/** The square the open scan card draws, read where the dialog portals it. */
const square = () =>
  document.querySelector('[role="dialog"] [data-slot="promo-qr-card"] svg')
    ?.innerHTML;

describe("CouponList's scan surface", () => {
  it("draws the token the consumer hands the coupon after Use now, and its renewal", () => {
    const render = mount("");
    const use = [...document.querySelectorAll("button")].find(
      (button) => button.textContent === "Use now",
    );
    if (!use) throw new Error("no Use now");
    act(() => use.click());
    const unminted = square();

    render("g10:presentation:first");
    const minted = square();
    expect(minted).toBeDefined();
    expect(minted).not.toBe(unminted);

    render("g10:presentation:renewed");
    expect(square()).not.toBe(minted);
  });
});
