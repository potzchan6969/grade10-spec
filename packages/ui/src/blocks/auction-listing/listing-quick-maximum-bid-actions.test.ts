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
  maximumAtCeiling: "This is the highest maximum this auction accepts.",
  biddingAtCeiling:
    "Bidding has reached {amount}, the highest this auction accepts.",
  ceilingChip: "Limit",
};

type CeilingCase = {
  currency: "USD";
  ceilingMinor: number;
  ceilingMajor: string;
};

const CASES: readonly CeilingCase[] = [
  { currency: "USD", ceilingMinor: 1_000_000_000, ceilingMajor: "10000000" },
];

const BELOW_CEILING_CASES = [
  {
    currency: "USD",
    ceilingMinor: 1_000_000_000,
    ceilingMajor: "10000000",
    belowCeilingMinor: 999_999_900,
    belowCeilingMajor: "9999999",
  },
] as const;

type RenderOptions = CeilingCase & {
  standing?: ListingAuctionBidView["standing"];
  viewerMaximumMinor?: number;
  currentBidMinor?: number;
  minBidMinor?: number;
  incrementMinor?: number;
  hasBids?: boolean;
  amountEntryLocked?: boolean;
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
  currentBidMinor = 100,
  minBidMinor = 100,
  incrementMinor = 100,
  hasBids = true,
}: RenderOptions): ListingAuctionBidView & { ceilingMinor: number } {
  return {
    currency,
    ceilingMinor,
    headerLabel: "Auction",
    live: true,
    opens: false,
    closed: false,
    hasBids,
    isUnsold: false,
    showBidActions: true,
    priceLabel: "Current Bid",
    currentBidMinor,
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
    minBidMinor,
    incrementMinor,
    suggestedMaxMinor: 500,
  };
}

function mountView(options: RenderOptions) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const onCommitMaximum = vi.fn();
  roots.push({ root, container });

  act(() => {
    root.render(
      createElement(ListingQuickMaximumBidActions, {
        amountEntryLocked: options.amountEntryLocked,
        copy: COPY,
        locale: "en",
        onCommitMaximum,
        view: baseView(options),
      }),
    );
  });

  return { container, onCommitMaximum };
}

function mount(options: RenderOptions) {
  const { container, onCommitMaximum } = mountView(options);
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
      ...CASES[0],
      standing: "none",
    });

    paste(field, "10000000.99");
    expect(field.value).toBe("10000000");
    expectNoFieldMessage(container, field);
    paste(field, "10000001.99");
    expect(field.value).toBe("10000000");
    expectNoFieldMessage(container, field);
    paste(field, "999999999999999999999999999999.99");
    expect(field.value).toBe("10000000");
    expectNoFieldMessage(container, field);
    expect(within(container).queryByRole("alert")).toBeNull();
  });
});

describe("ListingQuickMaximumBidActions ceiling-bound entry", () => {
  function expectNoEntry(container: HTMLDivElement) {
    expect(within(container).queryByRole("spinbutton")).toBeNull();
    expect(
      within(container).queryByRole("button", {
        name: /maximum to|bid now at|maximum \$/i,
      }),
    ).toBeNull();
    expect(within(container).queryByRole("group")).toBeNull();
  }

  it("collapses the entry group to a status row when the viewer's maximum is the ceiling (shared-ui-auction-listing-SC-64)", () => {
    const { container } = mountView({
      ...CASES[0],
      standing: "leading-max",
      viewerMaximumMinor: 1_000_000_000,
      currentBidMinor: 120_000,
    });

    expectNoEntry(container);
    expect(within(container).getByText("Max: US$10,000,000")).not.toBeNull();
    expect(
      within(container).getByText(
        "This is the highest maximum this auction accepts.",
      ),
    ).not.toBeNull();
    expect(within(container).queryByText("We bid only as needed.")).toBeNull();
  });

  it("collapses when the minimum next bid passes the ceiling while the maximum sits below it (shared-ui-auction-listing-SC-63)", () => {
    const { container } = mountView({
      ...CASES[0],
      standing: "leading-max",
      viewerMaximumMinor: 999_995_000,
      currentBidMinor: 999_995_000,
      minBidMinor: 1_000_005_000,
      incrementMinor: 10_000,
    });

    expectNoEntry(container);
    expect(within(container).getByText("Max: US$9,999,950")).not.toBeNull();
    expect(
      within(container).getByText(
        "This is the highest maximum this auction accepts.",
      ),
    ).not.toBeNull();
  });

  it("collapses to the ceiling amount for a viewer holding no maximum (shared-ui-auction-listing-SC-65)", () => {
    const { container } = mountView({
      ...CASES[0],
      standing: "none",
      currentBidMinor: 999_995_000,
      minBidMinor: 1_000_005_000,
      incrementMinor: 10_000,
    });

    expectNoEntry(container);
    expect(within(container).getByText("US$10,000,000")).not.toBeNull();
    expect(
      within(container).getByText(
        "Bidding has reached US$10,000,000, the highest this auction accepts.",
      ),
    ).not.toBeNull();
  });

  it("renders the collapse instead of the needs-card lock (shared-ui-auction-listing-SC-66)", () => {
    const { container } = mountView({
      ...CASES[0],
      standing: "leading-max",
      viewerMaximumMinor: 1_000_000_000,
      amountEntryLocked: true,
    });

    expectNoEntry(container);
    expect(
      within(container).queryByRole("button", { name: /link a card/i }),
    ).toBeNull();
    expect(within(container).getByText("Max: US$10,000,000")).not.toBeNull();
  });

  it("clamps a chip above the ceiling and merges chips onto one amount (shared-ui-auction-listing-SC-61, shared-ui-auction-listing-SC-62)", () => {
    const { container } = mountView({
      ...CASES[0],
      standing: "leading-max",
      viewerMaximumMinor: 999_970_000,
      currentBidMinor: 120_000,
      incrementMinor: 10_000,
    });

    const group = within(container).getByRole("group");
    const chips = within(group).getAllByRole("button");
    expect(chips.map((chip) => chip.textContent)).toEqual([
      expect.stringContaining("US$9,999,800"),
      expect.stringContaining("US$9,999,900"),
      expect.stringContaining("US$10,000,000"),
    ]);
    expect(chips[2]?.textContent).toContain("Limit");

    act(() => chips[2]?.click());
    const commitButton = within(container).getByRole("button", {
      name: /maximum to/i,
    });
    expect(commitButton.textContent).toContain("10,000,000");

    const { container: merged } = mountView({
      ...CASES[0],
      standing: "leading-max",
      viewerMaximumMinor: 999_990_000,
      currentBidMinor: 120_000,
      incrementMinor: 10_000,
    });
    const mergedChips = within(within(merged).getByRole("group")).getAllByRole(
      "button",
    );
    expect(mergedChips).toHaveLength(1);
    expect(mergedChips[0]?.textContent).toContain("US$10,000,000");
  });
});
