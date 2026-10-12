// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ListingQuickMaximumBidActions,
  type ListingQuickMaximumBidActionsCopy,
} from "./listing-quick-maximum-bid-actions";
import type { ListingAuctionBidView } from "./types";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const COPY: ListingQuickMaximumBidActionsCopy = {
  setPrivateMaximum: "Set your private maximum",
  raisePrivateMaximum: "Raise your private maximum",
  currentMaximum: "Max: {amount}",
  reviewMaximum: "Set maximum to {amount}",
  raiseMaximumReview: "Raise maximum to {amount}",
  bidNowReview: "Bid now at {amount}",
  privateMaximumTooltip: "The most we will bid for you.",
  maximumMechanismSubtext: "We bid only as needed.",
  customAmountPlaceholder: "{amount} min.",
  stepperMessage: "Min.: {amount}",
  invalidAmount: "Enter a valid amount",
  useMinimum: "Use minimum",
  bidImmediate: "Bid now",
  bidUpTo: "Bid up to",
  nextEligibleBid: "Min. bid",
  amountAboveCurrent: "{amount} vs current",
  amountAboveMaximum: "{amount} vs max",
  linkACardToBid: "Link a card to bid",
};

const CASES = [
  { currency: "USD", ceilingMinor: 1_000_000_000, ceilingMajor: "10000000" },
  { currency: "HKD", ceilingMinor: 8_000_000_000, ceilingMajor: "80000000" },
  { currency: "JPY", ceilingMinor: 5_000_000_000, ceilingMajor: "5000000000" },
] as const;

type CeilingCase = (typeof CASES)[number];
type RenderOptions = CeilingCase & {
  standing?: ListingAuctionBidView["standing"];
  viewerMaximumMinor?: number;
};

type RoleQueryOptions = { name?: string | RegExp };

function implicitRole(element: HTMLElement): string | null {
  const explicitRole = element.getAttribute("role");
  if (explicitRole != null) return explicitRole;
  if (element instanceof HTMLButtonElement) return "button";
  if (element instanceof HTMLInputElement) {
    return element.type === "number" ? "spinbutton" : "textbox";
  }
  return null;
}

function accessibleName(element: HTMLElement): string {
  return (
    element.getAttribute("aria-label") ??
    element.textContent?.replace(/\s+/g, " ").trim() ??
    ""
  );
}

function matchesName(element: HTMLElement, name: string | RegExp | undefined) {
  if (name == null) return true;
  const value = accessibleName(element);
  return typeof name === "string" ? value === name : name.test(value);
}

function getByRole<T extends HTMLElement = HTMLElement>(
  container: HTMLElement,
  role: string,
  options: RoleQueryOptions = {},
): T {
  const element = Array.from(
    container.querySelectorAll<HTMLElement>("[role], button, input"),
  ).find(
    (candidate) =>
      implicitRole(candidate) === role && matchesName(candidate, options.name),
  );
  if (!element) {
    throw new Error(`No ${role} with the requested accessible name was found`);
  }
  return element as T;
}

function queryByRole(
  container: HTMLElement,
  role: string,
  options: RoleQueryOptions = {},
): HTMLElement | null {
  return (
    Array.from(
      container.querySelectorAll<HTMLElement>("[role], button, input"),
    ).find(
      (candidate) =>
        implicitRole(candidate) === role &&
        matchesName(candidate, options.name),
    ) ?? null
  );
}

function within(container: HTMLElement) {
  return {
    getByRole: <T extends HTMLElement = HTMLElement>(
      role: string,
      options?: RoleQueryOptions,
    ) => getByRole<T>(container, role, options),
    queryByRole: (role: string, options?: RoleQueryOptions) =>
      queryByRole(container, role, options),
  };
}

const roots: Array<{ root: Root; container: HTMLDivElement }> = [];

afterEach(() => {
  for (const { root, container } of roots.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }
});

function baseView({
  currency,
  ceilingMinor,
  standing = "none",
  viewerMaximumMinor,
}: RenderOptions): ListingAuctionBidView & { ceilingMinor: number } {
  return {
    currency,
    ceilingMinor,
    headerLabel: "Auction",
    live: true,
    opens: false,
    closed: false,
    hasBids: true,
    isUnsold: false,
    showBidActions: true,
    priceLabel: "Current Bid",
    currentBidMinor: 100,
    bidCount: 1,
    bidCountLabel: "1 bid",
    countdown: "5m",
    countdownSeconds: 300,
    closesAtMs: null,
    countdownFormat: "short",
    extended: false,
    deadlineAtMs: null,
    standing,
    viewerMaximumMinor,
    minBidMinor: 100,
    incrementMinor: 100,
    suggestedMaxMinor: 500,
  };
}

function mount(options: RenderOptions) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const onCommitMaximum = vi.fn();
  roots.push({ root, container });

  act(() => {
    root.render(
      createElement(ListingQuickMaximumBidActions, {
        copy: COPY,
        locale: "en",
        onCommitMaximum,
        view: baseView(options),
      }),
    );
  });

  const field = within(container).getByRole<HTMLInputElement>("spinbutton", {
    name: /min\./i,
  });
  return { container, field, onCommitMaximum };
}

function input(
  field: HTMLInputElement,
  value: string,
  inputType: string,
  data: string | null,
) {
  act(() => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    if (!setter) throw new Error("input value setter was not found");
    setter.call(field, value);
    field.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        data,
        inputType,
      }),
    );
  });
}

function paste(field: HTMLInputElement, value: string) {
  act(() => {
    const event = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "clipboardData", {
      value: { getData: () => value },
    });
    field.dispatchEvent(event);
    if (event.defaultPrevented) return;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    if (!setter) throw new Error("input value setter was not found");
    setter.call(field, value);
    field.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        data: value,
        inputType: "insertFromPaste",
      }),
    );
  });
}

function primaryButton(container: HTMLDivElement): HTMLButtonElement {
  return within(container).getByRole<HTMLButtonElement>("button", {
    name: /maximum to|bid now at/i,
  });
}

describe("ListingQuickMaximumBidActions currency ceiling", () => {
  it.each(
    CASES.flatMap((entry) =>
      ["set", "raise"].map((mode) => ({ ...entry, mode })),
    ),
  )(
    "accepts the exact $currency ceiling in $mode mode and commits the matching minor amount (shared-ui-auction-listing-SC-38, shared-ui-auction-listing-SC-58)",
    ({ currency, ceilingMinor, ceilingMajor, mode }) => {
      const { container, field, onCommitMaximum } = mount({
        currency,
        ceilingMinor,
        standing: mode === "raise" ? "leading-max" : "none",
        viewerMaximumMinor: mode === "raise" ? 500 : undefined,
        ceilingMajor,
      });

      input(field, ceilingMajor, "insertText", ceilingMajor);

      expect(field.value).toBe(ceilingMajor);
      expect(primaryButton(container).textContent).toContain(
        Number(ceilingMajor).toLocaleString("en-US"),
      );
      expect(within(container).queryByRole("alert")).toBeNull();

      act(() => primaryButton(container).click());
      expect(onCommitMaximum).toHaveBeenCalledOnce();
      expect(onCommitMaximum).toHaveBeenCalledWith(ceilingMinor);
    },
  );

  it.each(
    CASES.flatMap((entry) =>
      ["set", "raise"].map((mode) => ({ ...entry, mode })),
    ),
  )(
    "restores a genuine single-digit append but clamps paste and replacement in $currency $mode mode (shared-ui-auction-listing-SC-39, shared-ui-auction-listing-SC-40, shared-ui-auction-listing-SC-41, shared-ui-auction-listing-SC-43, shared-ui-auction-listing-SC-59, shared-ui-auction-listing-SC-60)",
    ({ currency, ceilingMinor, ceilingMajor, mode }) => {
      const { container, field } = mount({
        currency,
        ceilingMinor,
        standing: mode === "raise" ? "leading-max" : "none",
        viewerMaximumMinor: mode === "raise" ? 500 : undefined,
        ceilingMajor,
      });

      input(field, ceilingMajor, "insertText", ceilingMajor);
      input(field, `${ceilingMajor}1`, "insertText", "1");
      expect(field.value).toBe(ceilingMajor);

      paste(field, `${ceilingMajor}1`);
      expect(field.value).toBe(ceilingMajor);

      input(field, "500", "insertText", "500");
      input(field, `${ceilingMajor}1`, "insertText", `${ceilingMajor}1`);
      expect(field.value).toBe(ceilingMajor);

      expect(within(container).queryByRole("alert")).toBeNull();
    },
  );

  it("clamps raw fractional and very long paste text after whole-major cleaning without a message (shared-ui-auction-listing-SC-42, shared-ui-auction-listing-SC-53)", () => {
    const { container, field } = mount({
      ...CASES[1],
      standing: "none",
    });

    paste(field, "80000001.99");
    expect(field.value).toBe("80000000");
    paste(field, "999999999999999999999999999999.99");
    expect(field.value).toBe("80000000");
    expect(within(container).queryByRole("alert")).toBeNull();
  });
});
