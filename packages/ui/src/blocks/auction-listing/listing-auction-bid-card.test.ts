// @vitest-environment jsdom

import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";
import { within } from "storybook/test";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FIXTURE_ACTIVITY_TIME_COPY } from "../../lib/datetime-fixtures";
import {
  ListingAuctionBidCard,
  type ListingAuctionBidCardCopy,
} from "./listing-auction-bid-card";
import type { ListingAuctionBidView } from "./types";

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

const USD_CEILING_MINOR = 1_000_000_000;
const USD_CEILING_MAJOR = "10000000";

const COPY: ListingAuctionBidCardCopy = {
  recentBids: "Recent Bids",
  bidHistory: {
    you: "You",
    empty: "No bids yet",
    winner: "Winner",
    samePricePriorityTip: "Earlier maximum leads.",
  },
  activityTimeCopy: FIXTURE_ACTIVITY_TIME_COPY,
  auctionWon: "Auction won",
  completePurchase: "Complete purchase",
  completePurchaseBody: "Choose shipping and payment.",
  completePurchaseAction: "Complete purchase",
  paid: "Paid",
  paidBody: "Track your order.",
  viewOrderDetails: "View order details",
  didNotWin: "You did not win",
  outbid: "Outbid",
  highestBid: "Highest bid",
  yourMaximum: "Your maximum",
  setMaximumLabel: "Set maximum",
  setMaximumCurrentLabel: "Current maximum",
  opensIn: "Opens in",
  closed: "Closed",
  timeLeft: "Time left",
  timeLeftAutoExtended: "Time left (extended)",
  autoExtendedTooltip: "The close can extend.",
  placeBidSection: "Place a bid",
  placeBid: "Place bid",
  signInToBid: "Sign In to Bid",
  confirmMaximum: "Confirm maximum",
  raiseMaximum: "Raise maximum",
  confirmMaximumTooltip: "The most we will bid for you.",
  confirmMaximumAriaLabel: "Confirm maximum",
  raiseMaximumAriaLabel: "Raise maximum",
  enableAutoBidding: "Enable auto-bidding",
  autoBiddingTooltip: "We bid as needed.",
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
  bidUpTo: "Bid up to {amount}",
  nextEligibleBid: "Min. bid",
  amountAboveCurrent: "{amount} vs current",
  amountAboveStarting: "{amount} vs starting",
  amountAboveMaximum: "{amount} vs max",
  linkACardToBid: "Link a card to bid",
  maximumAtCeiling: "This is the highest maximum this auction accepts.",
  biddingAtCeiling:
    "Bidding has reached {amount}, the highest this auction accepts.",
  ceilingChip: "Limit",
  minimumMaximumFloor: "Minimum: {amount}",
  minimumMaximumLeadingNudge: "Minimum: {amount} ({increment} higher)",
  minimumMaximumLeadingIncrement: "Minimum: {amount} ({increment} increment)",
  maximumBelowMinimum: "Enter at least {amount}",
  buyerFeeHint: "20% buyer fee on top of the winning bid.",
  noBidsYet: "No bids yet",
  noBids: "No bids",
  endsLabel: "Ends",
  opensLabel: "Opens",
  closedAt: "Closed at {when}",
  closedSummary: "Closed at {time}. Ran {duration}",
  unsold: "Ended",
};

type ViewOverrides = Partial<ListingAuctionBidView>;

const roots: Array<{ root: Root; container: HTMLDivElement }> = [];

afterEach(() => {
  for (const { root, container } of roots.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }
});

function baseView(overrides: ViewOverrides = {}): ListingAuctionBidView {
  return {
    currency: "USD",
    ceilingMinor: USD_CEILING_MINOR,
    headerLabel: "Auction",
    live: true,
    opens: false,
    closed: false,
    hasBids: true,
    isUnsold: false,
    showBidActions: true,
    priceLabel: "Current Bid",
    currentBidMinor: 120_000,
    bidCount: 1,
    bidCountLabel: "1 bid",
    countdown: "5m",
    countdownSeconds: 300,
    closesAtMs: null,
    deadlineAtMs: null,
    countdownFormat: "short",
    extended: false,
    standing: "none",
    minBidMinor: 124_000,
    incrementMinor: 4_000,
    suggestedMaxMinor: 200_000,
    ...overrides,
  };
}

function mountView(
  viewOverrides: ViewOverrides = {},
  bidEnrollment: "signed-out" | "needs-card" | "ready" = "ready",
) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const onCommitMaximum = vi.fn();
  const onPlaceBid = vi.fn();
  roots.push({ root, container });

  act(() => {
    root.render(
      createElement(ListingAuctionBidCard, {
        bidEnrollment,
        copy: COPY,
        history: [],
        locale: "en",
        onCommitMaximum,
        onPlaceBid,
        timeZone: "Asia/Hong_Kong",
        view: baseView(viewOverrides),
      }),
    );
  });

  return { container, onCommitMaximum, onPlaceBid };
}

function field(container: HTMLDivElement): HTMLInputElement {
  return within(container).getByRole<HTMLInputElement>("spinbutton", {
    name: /min\./i,
  });
}

function input(
  element: HTMLInputElement,
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
    setter.call(element, value);
    element.dispatchEvent(
      new InputEvent("input", {
        bubbles: true,
        data,
        inputType,
      }),
    );
  });
}

function paste(element: HTMLInputElement, value: string) {
  act(() => {
    const event = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "clipboardData", {
      value: { getData: () => value },
    });
    element.dispatchEvent(event);
    if (event.defaultPrevented) return;
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    if (!setter) throw new Error("input value setter was not found");
    setter.call(element, value);
    element.dispatchEvent(
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
    name: /^(?:Set maximum to|Raise maximum to|Bid now at)/i,
  });
}

function expectNoCeilingMessage(
  container: HTMLDivElement,
  inputElement: HTMLInputElement,
) {
  expect(container.querySelector('[data-slot="input-message"]')).toBeNull();
  expect(inputElement.getAttribute("aria-invalid")).not.toBe("true");
  expect(within(container).queryByRole("alert")).toBeNull();
}

function expectNoEntry(container: HTMLDivElement) {
  expect(within(container).queryByRole("group")).toBeNull();
  expect(within(container).queryByRole("spinbutton")).toBeNull();
  expect(
    within(container).queryByRole("button", {
      name: /^(?:Set maximum to|Raise maximum to|Bid now at)/i,
    }),
  ).toBeNull();
}

describe("ListingAuctionBidCard USD ceiling through its public render seam", () => {
  it("accepts a USD draft at the ceiling without a ceiling message (shared-ui-auction-listing-SC-38)", () => {
    const { container } = mountView();
    const custom = field(container);

    input(custom, USD_CEILING_MAJOR, "insertText", USD_CEILING_MAJOR);

    expect(custom.value).toBe(USD_CEILING_MAJOR);
    expectNoCeilingMessage(container, custom);
  });

  it.each([
    ["set", "none", undefined],
    ["raise", "leading-max", 200_000],
  ] as const)(
    "keeps the previous draft when a typed digit passes the ceiling in %s mode (shared-ui-auction-listing-SC-39, shared-ui-auction-listing-SC-43)",
    (_mode, standing, viewerMaximumMinor) => {
      const { container } = mountView({
        standing,
        viewerMaximumMinor,
      });
      const custom = field(container);

      input(custom, USD_CEILING_MAJOR, "insertText", USD_CEILING_MAJOR);
      input(custom, `${USD_CEILING_MAJOR}0`, "insertText", "0");

      expect(custom.value).toBe(USD_CEILING_MAJOR);
      expectNoCeilingMessage(container, custom);
    },
  );

  it("clamps an oversized paste into an empty USD field to the ceiling (shared-ui-auction-listing-SC-40)", () => {
    const { container } = mountView();
    const custom = field(container);

    paste(custom, "10000001");

    expect(custom.value).toBe(USD_CEILING_MAJOR);
    expectNoCeilingMessage(container, custom);
  });

  it("clamps an oversized paste over an existing USD draft to the ceiling (shared-ui-auction-listing-SC-41)", () => {
    const { container } = mountView();
    const custom = field(container);

    input(custom, "2500", "insertText", "2500");
    paste(custom, "99999999999");

    expect(custom.value).toBe(USD_CEILING_MAJOR);
    expectNoCeilingMessage(container, custom);
  });

  it("cleans a fractional USD paste before clamping it to the ceiling (shared-ui-auction-listing-SC-42)", () => {
    const { container } = mountView();
    const custom = field(container);

    input(custom, "2500", "insertText", "2500");
    paste(custom, "10000001.99");

    expect(custom.value).toBe(USD_CEILING_MAJOR);
    expectNoCeilingMessage(container, custom);
  });

  it("accepts a fractional paste whose cleaned USD amount equals the ceiling (shared-ui-auction-listing-SC-53)", () => {
    const { container } = mountView();
    const custom = field(container);

    input(custom, "2500", "insertText", "2500");
    paste(custom, "10000000.99");

    expect(custom.value).toBe(USD_CEILING_MAJOR);
    expectNoCeilingMessage(container, custom);
  });

  it.each([
    ["set", "none", undefined],
    ["raise", "leading-max", 200_000],
  ] as const)(
    "commits exactly 1000000000 USD minor units at the ceiling in %s mode (shared-ui-auction-listing-SC-58)",
    (_mode, standing, viewerMaximumMinor) => {
      const { container, onCommitMaximum } = mountView({
        standing,
        viewerMaximumMinor,
      });
      const custom = field(container);

      input(custom, USD_CEILING_MAJOR, "insertText", USD_CEILING_MAJOR);
      act(() => primaryButton(container).click());

      expect(onCommitMaximum).toHaveBeenCalledOnce();
      expect(onCommitMaximum).toHaveBeenCalledWith(USD_CEILING_MINOR);
    },
  );

  it.each([
    ["set", "none", undefined, "typing"],
    ["set", "none", undefined, "paste"],
    ["raise", "leading-max", 200_000, "typing"],
    ["raise", "leading-max", 200_000, "paste"],
  ] as const)(
    "clamps an oversized replacement in %s mode by %s (shared-ui-auction-listing-SC-59)",
    (_mode, standing, viewerMaximumMinor, origin) => {
      const { container } = mountView({
        standing,
        viewerMaximumMinor,
      });
      const custom = field(container);

      input(custom, "2500", "insertText", "2500");
      if (origin === "paste") {
        paste(custom, "10000001");
      } else {
        input(custom, "10000001", "insertText", "10000001");
      }

      expect(custom.value).toBe(USD_CEILING_MAJOR);
      expectNoCeilingMessage(container, custom);
    },
  );

  it.each([
    ["set", "none", undefined],
    ["raise", "leading-max", 200_000],
  ] as const)(
    "keeps a typed suffix and clamps a pasted suffix in %s mode (shared-ui-auction-listing-SC-60)",
    (_mode, standing, viewerMaximumMinor) => {
      const { container } = mountView({
        standing,
        viewerMaximumMinor,
      });
      const custom = field(container);

      input(custom, USD_CEILING_MAJOR, "insertText", USD_CEILING_MAJOR);
      paste(custom, `${USD_CEILING_MAJOR}1`);
      expect(custom.value).toBe(USD_CEILING_MAJOR);
      expectNoCeilingMessage(container, custom);

      input(custom, USD_CEILING_MAJOR, "insertText", USD_CEILING_MAJOR);
      input(custom, `${USD_CEILING_MAJOR}1`, "insertText", "1");
      expect(custom.value).toBe(USD_CEILING_MAJOR);
      expectNoCeilingMessage(container, custom);
    },
  );
});

describe("ListingAuctionBidCard USD chip bounds and collapse", () => {
  it("offers only legal USD chip amounts, clamps the last chip, and commits the ceiling (shared-ui-auction-listing-SC-61)", () => {
    const { container, onCommitMaximum } = mountView({
      standing: "leading-max",
      viewerMaximumMinor: 999_970_000,
      currentBidMinor: 120_000,
      incrementMinor: 10_000,
    });
    const chips = within(within(container).getByRole("group")).getAllByRole(
      "button",
    );

    expect(chips.map((chip) => chip.getAttribute("aria-label"))).toEqual([
      "Bid up to US$9,999,800",
      "Bid up to US$9,999,900",
      "Bid up to US$10,000,000",
    ]);
    expect(
      chips.every((chip) => chip.textContent?.includes("HK$") === false),
    ).toBe(true);
    expect(chips.at(-1)?.textContent).toContain("Limit");

    act(() => chips.at(-1)?.click());
    act(() => primaryButton(container).click());

    expect(onCommitMaximum).toHaveBeenCalledWith(USD_CEILING_MINOR);
  });

  it("merges chips that clamp to the same USD ceiling amount (shared-ui-auction-listing-SC-62)", () => {
    const { container, onCommitMaximum } = mountView({
      standing: "leading-max",
      viewerMaximumMinor: 999_990_000,
      currentBidMinor: 120_000,
      incrementMinor: 10_000,
    });
    const chips = within(within(container).getByRole("group")).getAllByRole(
      "button",
    );

    expect(chips).toHaveLength(1);
    expect(chips[0].getAttribute("aria-label")).toBe("Bid up to US$10,000,000");
    expect(chips[0].textContent).toContain("Limit");

    act(() => chips[0]?.click());
    act(() => primaryButton(container).click());

    expect(onCommitMaximum).toHaveBeenCalledOnce();
    expect(onCommitMaximum).toHaveBeenCalledWith(USD_CEILING_MINOR);
  });

  it("leaves no entry when a leader's raise floor passes the USD ceiling (shared-ui-auction-listing-SC-63)", () => {
    const { container } = mountView({
      standing: "leading-max",
      viewerMaximumMinor: 999_995_000,
      currentBidMinor: 999_995_000,
      minBidMinor: 1_000_005_000,
      incrementMinor: 10_000,
    });

    expectNoEntry(container);
    expect(within(container).getByText("Max: US$9,999,950")).not.toBeNull();
    expect(within(container).getByText(COPY.maximumAtCeiling)).not.toBeNull();
  });

  it("collapses the entry group when the viewer maximum is the USD ceiling (shared-ui-auction-listing-SC-64)", () => {
    const { container } = mountView({
      standing: "leading-max",
      viewerMaximumMinor: USD_CEILING_MINOR,
    });

    expectNoEntry(container);
    expect(within(container).getByText("Max: US$10,000,000")).not.toBeNull();
    expect(within(container).getByText(COPY.maximumAtCeiling)).not.toBeNull();
    expect(within(container).getByText(COPY.buyerFeeHint)).not.toBeNull();
    expect(
      within(container).queryByText(COPY.maximumMechanismSubtext),
    ).toBeNull();
  });

  it("collapses the entry group when the lot's minimum bid is above the USD ceiling (shared-ui-auction-listing-SC-65)", () => {
    const { container } = mountView({
      currentBidMinor: 999_995_000,
      minBidMinor: 1_000_005_000,
      incrementMinor: 10_000,
    });

    expectNoEntry(container);
    expect(within(container).getByText("US$10,000,000")).not.toBeNull();
    expect(
      within(container).getByText(
        COPY.biddingAtCeiling.replace("{amount}", "US$10,000,000"),
      ),
    ).not.toBeNull();
    expect(within(container).getByText(COPY.buyerFeeHint)).not.toBeNull();
  });

  it("renders the collapse before the needs-card lock at the USD ceiling (shared-ui-auction-listing-SC-66)", () => {
    const { container, onPlaceBid } = mountView(
      {
        standing: "leading-max",
        viewerMaximumMinor: USD_CEILING_MINOR,
      },
      "needs-card",
    );

    expectNoEntry(container);
    expect(
      within(container).queryByRole("button", { name: COPY.linkACardToBid }),
    ).toBeNull();
    expect(within(container).getByText("Max: US$10,000,000")).not.toBeNull();
    expect(onPlaceBid).not.toHaveBeenCalled();
  });
});
