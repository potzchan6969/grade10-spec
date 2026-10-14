// @vitest-environment jsdom

import { act, createElement, type ReactElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { within } from "storybook/test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CartDrawer,
  CartDrawerBody,
  CartDrawerFooter,
  CartItem,
  CartPromoSheet,
} from "./cart-drawer";
import { DEFAULT_CART_COPY, SAMPLE_HELD_PROMO_CODES } from "./fixtures";
import type { CartItemSummary, PointsState, PromoState } from "./types";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const ITEM: CartItemSummary = {
  id: "item-1",
  name: "Charizard Holo PSA 10",
  price: "HK$24,500.00",
  quantity: 1,
  maxQuantity: 3,
};

const ITEMS: readonly CartItemSummary[] = [ITEM];
const APPLIED_PROMO: PromoState = {
  status: "applied",
  label: "Discount (SAVE10)",
  discountAmount: "−HK$100.00",
};
const APPLIED_POINTS: PointsState = {
  status: "applied",
  amountLabel: "−HK$500.00",
};

const roots: Array<{ root: Root; container: HTMLDivElement }> = [];

afterEach(() => {
  for (const { root, container } of roots.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }
  vi.useRealTimers();
});

beforeEach(() => {
  document.body.replaceChildren();
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
    writable: true,
  });
});

function mount(element: ReactElement) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  roots.push({ root, container });

  act(() => root.render(element));

  return {
    container,
    rerender(next: ReactElement) {
      act(() => root.render(next));
    },
  };
}

function click(element: HTMLElement) {
  act(() => element.click());
}

function press(element: HTMLElement, key: string) {
  act(() => {
    element.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key }),
    );
  });
}

function setInputValue(input: HTMLInputElement, value: string) {
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    if (!setter) throw new Error("input value setter was not found");
    setter.call(input, value);
    input.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        data: value,
        inputType: "insertText",
      }),
    );
  });
}

function expectDisabled(element: HTMLElement) {
  expect(
    element.hasAttribute("disabled") ||
      element.getAttribute("aria-disabled") === "true",
  ).toBe(true);
}

function itemProps(overrides: Record<string, unknown> = {}) {
  return {
    copy: DEFAULT_CART_COPY.item,
    item: ITEM,
    ...overrides,
  };
}

function footerProps(overrides: Record<string, unknown> = {}) {
  return {
    copy: DEFAULT_CART_COPY.footer,
    estimatedTotal: "HK$24,500.00",
    subtotal: "HK$24,500.00",
    ...overrides,
  };
}

describe("shared store-cart pending operations", () => {
  it("blocks every item action while interactionPending is true (SC64)", () => {
    const onClickProduct = vi.fn();
    const onQuantityChange = vi.fn();
    const onRemove = vi.fn();
    const { container } = mount(
      createElement(CartItem, {
        ...itemProps({
          interactionPending: true,
          onClickProduct,
          onQuantityChange,
          onRemove,
        }),
      }),
    );

    const view = within(container);
    const product = view.getByRole("button", { name: ITEM.name });
    const quantity = view.getByRole<HTMLInputElement>("spinbutton", {
      name: ITEM.name,
    });
    const increase = view.getByRole("button", {
      name: DEFAULT_CART_COPY.item.increaseQtyLabel,
    });
    const remove = view.getByRole("button", {
      name: DEFAULT_CART_COPY.item.removeItemLabel,
    });

    expectDisabled(product);
    expectDisabled(quantity);
    expectDisabled(increase);
    expectDisabled(remove);

    click(product);
    press(product, "Enter");
    press(product, " ");
    click(increase);
    click(remove);
    setInputValue(quantity, "2");

    expect(onClickProduct).not.toHaveBeenCalled();
    expect(onQuantityChange).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });

  it("forwards pending to the body, keeps it scrollable, and cancels delayed removal (SC64, SC66, SC69)", () => {
    vi.useFakeTimers();
    const onRemoveItem = vi.fn();
    const { container, rerender } = mount(
      createElement(CartDrawerBody, {
        items: ITEMS,
        copy: DEFAULT_CART_COPY.item,
        emptyTitle: DEFAULT_CART_COPY.emptyTitle,
        interactionPending: false,
        onRemoveItem,
      }),
    );

    const body = container.querySelector<HTMLElement>(
      '[data-slot="cart-drawer-body"]',
    );
    if (!body) throw new Error("cart body was not rendered");
    body.scrollTop = 120;

    click(
      within(container).getByRole("button", {
        name: DEFAULT_CART_COPY.item.removeItemLabel,
      }),
    );
    rerender(
      createElement(CartDrawerBody, {
        items: ITEMS,
        copy: DEFAULT_CART_COPY.item,
        emptyTitle: DEFAULT_CART_COPY.emptyTitle,
        interactionPending: true,
        onRemoveItem,
      }),
    );

    act(() => vi.advanceTimersByTime(220));

    expect(onRemoveItem).not.toHaveBeenCalled();
    expect(body.scrollTop).toBe(120);
    expectDisabled(
      within(container).getByRole("button", {
        name: DEFAULT_CART_COPY.item.removeItemLabel,
      }),
    );

    rerender(
      createElement(CartDrawerBody, {
        items: ITEMS,
        copy: DEFAULT_CART_COPY.item,
        emptyTitle: DEFAULT_CART_COPY.emptyTitle,
        interactionPending: false,
        onRemoveItem,
      }),
    );
    expect(onRemoveItem).not.toHaveBeenCalled();
  });

  it("blocks footer actions and preserves accepted values and entered points (SC64)", () => {
    const onPromoStateChange = vi.fn();
    const onRemovePromo = vi.fn();
    const onPointsStateChange = vi.fn();
    const onApplyPoints = vi.fn(() => true);
    const onUseMaxPoints = vi.fn();
    const onRemovePoints = vi.fn();
    const onCheckout = vi.fn();
    const onSignIn = vi.fn();
    const { container, rerender } = mount(
      createElement(CartDrawerFooter, {
        ...footerProps({
          interactionPending: false,
          onPromoStateChange,
          onRemovePromo,
          onPointsStateChange,
          onApplyPoints,
          onUseMaxPoints,
          onRemovePoints,
          onCheckout,
          onSignIn,
          pointsState: { status: "expanded" },
          pointsBalanceLabel: "You have 1,200 pts.",
        }),
      }),
    );

    const view = within(container);
    const signInAction = DEFAULT_CART_COPY.footer.signInAction;
    if (!signInAction) throw new Error("sign-in copy was not configured");
    const points = view.getByRole<HTMLInputElement>("spinbutton", {
      name: DEFAULT_CART_COPY.footer.usePoints,
    });
    setInputValue(points, "500");

    rerender(
      createElement(CartDrawerFooter, {
        ...footerProps({
          interactionPending: true,
          onPromoStateChange,
          onRemovePromo,
          onPointsStateChange,
          onApplyPoints,
          onUseMaxPoints,
          onRemovePoints,
          onCheckout,
          onSignIn,
          pointsState: { status: "expanded" },
          pointsBalanceLabel: "You have 1,200 pts.",
        }),
      }),
    );

    expect(points.value).toBe("500");
    expectDisabled(points);
    click(
      view.getByRole("button", { name: DEFAULT_CART_COPY.footer.applyPoints }),
    );
    click(
      view.getByRole("button", { name: DEFAULT_CART_COPY.footer.useMaxPoints }),
    );
    click(
      view.getByRole("button", {
        name: DEFAULT_CART_COPY.footer.checkoutButton,
      }),
    );
    click(
      view.getByRole("button", {
        name: signInAction,
      }),
    );
    expect(onApplyPoints).not.toHaveBeenCalled();
    expect(onUseMaxPoints).not.toHaveBeenCalled();
    expect(onCheckout).not.toHaveBeenCalled();
    expect(onSignIn).not.toHaveBeenCalled();
    expect(onPromoStateChange).not.toHaveBeenCalled();
    expect(onPointsStateChange).not.toHaveBeenCalled();
    expect(container.textContent).toContain("HK$24,500.00");
  });

  it("blocks applied tender removal and disclosure while pending, then restores only allowed actions (SC67, SC68)", () => {
    const onPromoStateChange = vi.fn();
    const onRemovePromo = vi.fn();
    const onPointsStateChange = vi.fn();
    const onRemovePoints = vi.fn();
    const onCheckout = vi.fn();
    const { container, rerender } = mount(
      createElement(CartDrawerFooter, {
        ...footerProps({
          interactionPending: true,
          promoState: APPLIED_PROMO,
          pointsState: APPLIED_POINTS,
          onPromoStateChange,
          onRemovePromo,
          onPointsStateChange,
          onRemovePoints,
          onCheckout,
        }),
      }),
    );

    const view = within(container);
    expect(container.textContent).toContain(APPLIED_PROMO.label);
    expect(container.textContent).toContain(String(APPLIED_POINTS.amountLabel));
    const removeButtons = () =>
      view.getAllByRole("button", {
        name: DEFAULT_CART_COPY.footer.removePromo,
      });
    click(removeButtons()[0]);
    click(removeButtons()[1]);
    click(
      view.getByRole("button", {
        name: DEFAULT_CART_COPY.footer.checkoutButton,
      }),
    );

    expect(onRemovePromo).not.toHaveBeenCalled();
    expect(onRemovePoints).not.toHaveBeenCalled();
    expect(onCheckout).not.toHaveBeenCalled();

    rerender(
      createElement(CartDrawerFooter, {
        ...footerProps({
          interactionPending: false,
          tenderPending: true,
          promoState: APPLIED_PROMO,
          pointsState: APPLIED_POINTS,
          onPromoStateChange,
          onRemovePromo,
          onPointsStateChange,
          onRemovePoints,
          onCheckout,
        }),
      }),
    );
    click(removeButtons()[0]);
    click(removeButtons()[1]);
    click(
      view.getByRole("button", {
        name: DEFAULT_CART_COPY.footer.checkoutButton,
      }),
    );
    expect(onRemovePromo).not.toHaveBeenCalled();
    expect(onRemovePoints).not.toHaveBeenCalled();
    expect(onCheckout).not.toHaveBeenCalled();

    rerender(
      createElement(CartDrawerFooter, {
        ...footerProps({
          interactionPending: false,
          tenderPending: false,
          promoState: APPLIED_PROMO,
          pointsState: APPLIED_POINTS,
          onPromoStateChange,
          onRemovePromo,
          onPointsStateChange,
          onRemovePoints,
          onCheckout,
        }),
      }),
    );
    click(removeButtons()[0]);
    click(removeButtons()[1]);
    click(
      view.getByRole("button", {
        name: DEFAULT_CART_COPY.footer.checkoutButton,
      }),
    );
    expect(onRemovePromo).toHaveBeenCalledOnce();
    expect(onRemovePoints).toHaveBeenCalledOnce();
    expect(onCheckout).toHaveBeenCalledOnce();
    expect(onPromoStateChange).not.toHaveBeenCalled();
    expect(onPointsStateChange).not.toHaveBeenCalled();
  });

  it("keeps an open promo sheet readable and dismissible while blocking edits and navigation (SC65, SC66)", () => {
    const onClose = vi.fn();
    const onPromoStateChange = vi.fn();
    const onApplyPromo = vi.fn(() => true);
    const onSelectHeldPromo = vi.fn();
    const onBrowseLoyalty = vi.fn();
    const { container, rerender } = mount(
      createElement(CartPromoSheet, {
        open: true,
        copy: DEFAULT_CART_COPY.footer,
        promoState: { status: "expanded" },
        heldPromoCodes: SAMPLE_HELD_PROMO_CODES.slice(0, 1),
        interactionPending: false,
        onClose,
        onPromoStateChange,
        onApplyPromo,
        onSelectHeldPromo,
        onBrowseLoyalty,
      }),
    );

    const input = within(container).getByRole<HTMLInputElement>("textbox", {
      name: DEFAULT_CART_COPY.footer.promoSheetTitle,
    });
    setInputValue(input, "SAVE10");

    rerender(
      createElement(CartPromoSheet, {
        open: true,
        copy: DEFAULT_CART_COPY.footer,
        promoState: { status: "expanded" },
        heldPromoCodes: SAMPLE_HELD_PROMO_CODES.slice(0, 1),
        interactionPending: true,
        onClose,
        onPromoStateChange,
        onApplyPromo,
        onSelectHeldPromo,
        onBrowseLoyalty,
      }),
    );

    expect(input.value).toBe("SAVE10");
    expectDisabled(input);
    setInputValue(input, "OTHER");
    press(input, "Enter");
    for (const apply of within(container).getAllByRole("button", {
      name: DEFAULT_CART_COPY.footer.applyPromo,
    })) {
      click(apply);
    }
    const heldApplyButtons = within(container).getAllByRole("button", {
      name: DEFAULT_CART_COPY.footer.applyHeldPromo,
    });
    click(heldApplyButtons[heldApplyButtons.length - 1]);
    rerender(
      createElement(CartPromoSheet, {
        open: true,
        copy: DEFAULT_CART_COPY.footer,
        promoState: { status: "expanded" },
        heldPromoCodes: [],
        interactionPending: true,
        onClose,
        onPromoStateChange,
        onApplyPromo,
        onSelectHeldPromo,
        onBrowseLoyalty,
      }),
    );
    click(
      within(container).getByRole("button", {
        name: DEFAULT_CART_COPY.footer.browseLoyaltyOffers,
      }),
    );
    click(
      within(container).getByRole("button", {
        name: DEFAULT_CART_COPY.footer.promoSheetBackLabel,
      }),
    );

    expect(input.value).toBe("SAVE10");
    expect(onApplyPromo).not.toHaveBeenCalled();
    expect(onSelectHeldPromo).not.toHaveBeenCalled();
    expect(onBrowseLoyalty).not.toHaveBeenCalled();
    expect(onPromoStateChange).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledOnce();
    expect(
      container.querySelector('[class*="overflow-y-auto"]'),
    ).not.toBeNull();
  });

  it("keeps compound dismissal available and forwards interaction pending to every layer (SC64, SC66)", () => {
    const onClose = vi.fn();
    const onPromoStateChange = vi.fn();
    const onRemoveItem = vi.fn();
    const onCheckout = vi.fn();
    mount(
      createElement(CartDrawer, {
        open: true,
        onClose,
        items: ITEMS,
        subtotal: "HK$24,500.00",
        estimatedTotal: "HK$24,500.00",
        copy: DEFAULT_CART_COPY,
        interactionPending: true,
        promoState: { status: "expanded" },
        onPromoStateChange,
        onRemoveItem,
        onCheckout,
      }),
    );

    const page = within(document.body);
    click(
      page.getByRole("button", {
        name: DEFAULT_CART_COPY.header.closeCartLabel,
      }),
    );
    expect(onClose).toHaveBeenCalledOnce();

    click(
      page.getByRole("button", {
        name: DEFAULT_CART_COPY.footer.promoSheetBackLabel,
      }),
    );
    expect(onPromoStateChange).toHaveBeenCalledWith({ status: "collapsed" });
    expect(onRemoveItem).not.toHaveBeenCalled();
    expect(onCheckout).not.toHaveBeenCalled();

    const overlay = document.querySelector<HTMLElement>(
      '[data-slot="drawer-overlay"]',
    );
    if (!overlay) throw new Error("drawer backdrop was not rendered");
    click(overlay);
    act(() => {
      document.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
      );
    });
    expect(
      document.body.querySelector('[data-slot="cart-drawer-body"]'),
    ).not.toBeNull();
  });
});
