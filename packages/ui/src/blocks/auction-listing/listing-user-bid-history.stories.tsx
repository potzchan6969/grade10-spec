import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
} from "../../lib/datetime-fixtures";
import { ListingUserBidHistory } from "./listing-user-bid-history";
import type {
  ListingUserBidHistoryRow,
  ListingUserMaximumHistoryRow,
} from "./types";

const COPY = {
  link: "Your bidding",
  title: "Your bidding",
  description:
    "We bid only as needed up to your maximum. If two people set the same maximum, the earlier one leads.",
  maximumsTab: "Your maximums",
  bidsTab: "Bid placed",
  maximumColumn: "Maximum",
  bidColumn: "Bid",
  time: "Time",
  emptyBids: "No bids placed for you yet.",
} as const;

const STORY_NOW_MS = Date.now();

const SINGLE_MAXIMUM: ListingUserMaximumHistoryRow[] = [
  {
    id: "max-1",
    amountLabel: "HK$5,200",
    acceptedAtMs: STORY_NOW_MS - 5 * 60_000,
    status: "set",
  },
];

const RAISED_MAXIMUMS: ListingUserMaximumHistoryRow[] = [
  {
    id: "max-3",
    amountLabel: "HK$6,000",
    acceptedAtMs: STORY_NOW_MS - 8 * 60_000,
    status: "raised",
  },
  {
    id: "max-2",
    amountLabel: "HK$5,500",
    acceptedAtMs: STORY_NOW_MS - 45 * 60_000,
    status: "raised",
  },
  {
    id: "max-1",
    amountLabel: "HK$5,200",
    acceptedAtMs: STORY_NOW_MS - 3 * 60 * 60_000,
    status: "set",
  },
];

const SEVERAL_BIDS: ListingUserBidHistoryRow[] = [
  {
    id: "bid-1",
    amountLabel: "HK$4,800",
    acceptedAtMs: STORY_NOW_MS - 2 * 60_000,
  },
  {
    id: "bid-2",
    amountLabel: "HK$4,550",
    acceptedAtMs: STORY_NOW_MS - 18 * 60_000,
  },
  {
    id: "bid-3",
    amountLabel: "HK$4,300",
    acceptedAtMs: STORY_NOW_MS - 60 * 60_000,
  },
];

const openDialogDecorator: Decorator = (Story) => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const trigger = document.querySelector(
        '[data-slot="listing-user-bid-history"]',
      );
      if (trigger instanceof HTMLElement) {
        trigger.click();
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  return <Story />;
};

const meta = {
  title: "Auction Listing/ListingUserBidHistory",
  component: ListingUserBidHistory,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [openDialogDecorator],
  args: {
    copy: COPY,
    locale: FIXTURE_SHIPPED_LOCALE,
    timeZone: FIXTURE_TIME_ZONE,
    activityTimeCopy: FIXTURE_ACTIVITY_TIME_COPY,
  },
} satisfies Meta<typeof ListingUserBidHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One maximum with several placed bids — defaults to Bid placed (leading tab). */
export const OneMaxSeveralBids: Story = {
  name: "One maximum, several bids",
  args: {
    maximumRows: SINGLE_MAXIMUM,
    bidRows: SEVERAL_BIDS,
  },
  play: async () => {
    const page = within(document.body);
    const dialog = await page.findByRole("dialog", { name: "Your bidding" });
    await waitFor(() => {
      expect(dialog).toBeVisible();
    });
    const tabs = within(dialog).getAllByRole("tab");
    expect(tabs[0]).toHaveAccessibleName("Bid placed");
    expect(tabs[1]).toHaveAccessibleName("Your maximums");
    expect(
      within(dialog).getByRole("tab", {
        name: "Bid placed",
        selected: true,
      }),
    ).toBeVisible();
    expect(within(dialog).getByText("HK$4,800")).toBeVisible();
    expect(within(dialog).queryByText("Type")).not.toBeInTheDocument();
  },
};

/** Maximum raised over time — defaults to Bid placed; maximums list every raise. */
export const MaxRaisedOverTime: Story = {
  name: "Maximum raised over time",
  args: {
    maximumRows: RAISED_MAXIMUMS,
    bidRows: SEVERAL_BIDS,
  },
  play: async () => {
    const page = within(document.body);
    const dialog = await page.findByRole("dialog", { name: "Your bidding" });
    await waitFor(() => {
      expect(dialog).toBeVisible();
    });
    expect(
      within(dialog).getByRole("tab", {
        name: "Bid placed",
        selected: true,
      }),
    ).toBeVisible();
    await userEvent.click(
      within(dialog).getByRole("tab", { name: "Your maximums" }),
    );
    expect(within(dialog).getByText("HK$6,000")).toBeVisible();
    expect(within(dialog).getByText("HK$5,500")).toBeVisible();
    expect(within(dialog).getByText("HK$5,200")).toBeVisible();
    expect(within(dialog).queryByText("Raised")).not.toBeInTheDocument();
    expect(within(dialog).queryByText("Set")).not.toBeInTheDocument();
  },
};

/**
 * Single maximum, no bid steps — defaults to Your maximums; Bid placed shows
 * the empty message (one story covers both halves of that state).
 */
export const SingleMaxNoBids: Story = {
  name: "Single maximum, no bids",
  args: {
    maximumRows: SINGLE_MAXIMUM,
    bidRows: [],
  },
  play: async () => {
    const page = within(document.body);
    const dialog = await page.findByRole("dialog", { name: "Your bidding" });
    await waitFor(() => {
      expect(dialog).toBeVisible();
    });
    expect(
      within(dialog).getByRole("tab", {
        name: "Your maximums",
        selected: true,
      }),
    ).toBeVisible();
    expect(within(dialog).getByText("HK$5,200")).toBeVisible();
    await userEvent.click(
      within(dialog).getByRole("tab", { name: "Bid placed" }),
    );
    const empty = within(dialog).getByText("No bids placed for you yet.");
    expect(empty).toBeVisible();
    expect(empty.className).toMatch(/text-secondary-foreground/);
  },
};
