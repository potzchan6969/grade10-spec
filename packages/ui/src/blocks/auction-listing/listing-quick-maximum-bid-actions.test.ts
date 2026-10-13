// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { within } from "storybook/test";
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

type CeilingCase = {
  currency: "USD" | "HKD" | "JPY";
  ceilingMinor: number;
  ceilingMajor: string;
};

const CASES: readonly CeilingCase[] = [
  { currency: "USD", ceilingMinor: 1_000_000_000, ceilingMajor: "10000000" },
  { currency: "HKD", ceilingMinor: 8_000_000_000, ceilingMajor: "80000000" },
  { currency: "JPY", ceilingMinor: 5_000_000_000, ceilingMajor: "5000000000" },
];

const BELOW_CEILING_CASES = [
  {
    currency: "USD",
    ceilingMinor: 1_000_000_000,
    ceilingMajor: "10000000",
    belowCeilingMinor: 999_999_900,
    belowCeilingMajor: "9999999",
  },
  {
    currency: "HKD",
    ceilingMinor: 8_000_000_000,
    ceilingMajor: "80000000",
    belowCeilingMinor: 7_999_999_900,
    belowCeilingMajor: "79999999",
  },
  {
    currency: "JPY",
    ceilingMinor: 5_000_000_000,
    ceilingMajor: "5000000000",
    belowCeilingMinor: 4_999_999_999,
    belowCeilingMajor: "4999999999",
  },
] as const;

type RenderOptions = CeilingCase & {
  standing?: ListingAuctionBidView["standing"];
  viewerMaximumMinor?: number;
};

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

function expectNoFieldMessage(
  container: HTMLDivElement,
  field: HTMLInputElement,
) {
  expect(container.querySelector('[data-slot="input-message"]')).toBeNull();
  expect(field.getAttribute("aria-invalid")).not.toBe("true");
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
      expectNoFieldMessage(container, field);

      act(() => primaryButton(container).click());
      expect(onCommitMaximum).toHaveBeenCalledOnce();
      expect(onCommitMaximum).toHaveBeenCalledWith(ceilingMinor);
    },
  );

  it.each(
    BELOW_CEILING_CASES.flatMap((entry) =>
      ["set", "raise"].map((mode) => ({ ...entry, mode })),
    ),
  )(
    "retains a below-ceiling draft after a genuine typed append in $currency $mode mode and commits it (shared-ui-auction-listing-SC-39, shared-ui-auction-listing-SC-43)",
    ({
      currency,
      ceilingMinor,
      ceilingMajor,
      belowCeilingMinor,
      belowCeilingMajor,
      mode,
    }) => {
      const { container, field, onCommitMaximum } = mount({
        currency,
        ceilingMinor,
        standing: mode === "raise" ? "leading-max" : "none",
        viewerMaximumMinor: mode === "raise" ? 500 : undefined,
        ceilingMajor,
      });

      input(field, belowCeilingMajor, "insertText", belowCeilingMajor);
      input(field, `${belowCeilingMajor}1`, "insertText", "1");

      expect(field.value).toBe(belowCeilingMajor);
      expect(primaryButton(container).textContent).toContain(
        Number(belowCeilingMajor).toLocaleString("en-US"),
      );
      expectNoFieldMessage(container, field);

      act(() => primaryButton(container).click());
      expect(onCommitMaximum).toHaveBeenCalledOnce();
      expect(onCommitMaximum).toHaveBeenCalledWith(belowCeilingMinor);
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
      expectNoFieldMessage(container, field);

      paste(field, `${ceilingMajor}1`);
      expect(field.value).toBe(ceilingMajor);
      expectNoFieldMessage(container, field);

      input(field, "500", "insertText", "500");
      input(field, `${ceilingMajor}1`, "insertText", `${ceilingMajor}1`);
      expect(field.value).toBe(ceilingMajor);
      expectNoFieldMessage(container, field);

      expect(within(container).queryByRole("alert")).toBeNull();
    },
  );

  it("clamps raw fractional and very long paste text after whole-major cleaning without a message (shared-ui-auction-listing-SC-42, shared-ui-auction-listing-SC-53)", () => {
    const { container, field } = mount({
      ...CASES[1],
      standing: "none",
    });

    paste(field, "80000000.99");
    expect(field.value).toBe("80000000");
    expectNoFieldMessage(container, field);
    paste(field, "80000001.99");
    expect(field.value).toBe("80000000");
    expectNoFieldMessage(container, field);
    paste(field, "999999999999999999999999999999.99");
    expect(field.value).toBe("80000000");
    expectNoFieldMessage(container, field);
    expect(within(container).queryByRole("alert")).toBeNull();
  });
});
