import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
} from "../../lib/datetime-fixtures";
import { ListingUserBidHistory } from "./listing-user-bid-history";
import type { ListingUserBidHistoryRow } from "./types";

const COPY = {
  link: "Your bid history",
  title: "Bid History",
  amount: "Your bid",
  type: "Type",
  time: "Time",
} as const;

const STORY_NOW_MS = Date.now();

const SAMPLE_ROWS: ListingUserBidHistoryRow[] = [
  {
    id: "bid-1",
    amountLabel: "HK$4,800",
    bidType: "auto",
    bidTypeLabel: "Automatic",
    acceptedAtMs: STORY_NOW_MS - 2 * 60_000,
  },
  {
    id: "bid-2",
    amountLabel: "HK$4,550",
    bidType: "manual",
    bidTypeLabel: "Manual",
    acceptedAtMs: STORY_NOW_MS - 18 * 60_000,
  },
  {
    id: "bid-3",
    amountLabel: "HK$4,300",
    bidType: "auto",
    bidTypeLabel: "Automatic",
    acceptedAtMs: STORY_NOW_MS - 60 * 60_000,
  },
];

function createLongRows(count: number): ListingUserBidHistoryRow[] {
  const baseMs = STORY_NOW_MS;

  return Array.from({ length: count }, (_, index) => ({
    id: `bid-long-${index}`,
    amountLabel: `HK$${(4_800 - index * 100).toLocaleString("en-HK")}`,
    bidType: index % 2 === 0 ? "auto" : "manual",
    bidTypeLabel: index % 2 === 0 ? "Automatic" : "Manual",
    acceptedAtMs:
      index === 0
        ? baseMs - 30_000
        : index < 8
          ? baseMs - index * 4 * 60_000
          : baseMs - (index + 1) * 24 * 60 * 60_000,
  }));
}

const LONG_ROWS = createLongRows(28);
const OLDEST_BID_LABEL = LONG_ROWS.at(-1)?.amountLabel ?? "";

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
  args: {
    copy: COPY,
    locale: FIXTURE_SHIPPED_LOCALE,
    timeZone: FIXTURE_TIME_ZONE,
    activityTimeCopy: FIXTURE_ACTIVITY_TIME_COPY,
  },
} satisfies Meta<typeof ListingUserBidHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DialogOpen: Story = {
  args: { rows: SAMPLE_ROWS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    await userEvent.click(
      canvas.getByRole("button", { name: "Your bid history" }),
    );
    const dialog = await page.findByRole("dialog", { name: "Bid History" });
    expect(dialog).toBeVisible();
    expect(within(dialog).getByText("US$4,800")).toBeVisible();
    expect(within(dialog).getByText("2 min ago")).toBeVisible();
  },
};

export const LongHistory: Story = {
  args: { rows: LONG_ROWS },
  decorators: [openDialogDecorator],
  parameters: {
    docs: {
      description: {
        story:
          "Twenty-eight accepted bids exceed the dialog body height. The pinned title stays visible while older bids scroll into view — the oldest entry (HK$2,100) sits below the fold until you scroll.",
      },
    },
  },
  play: async () => {
    const page = within(document.body);
    const dialog = await page.findByRole("dialog", { name: "Bid History" });
    const scrollBody = dialog.querySelector(
      '[data-slot="listing-user-bid-history-scroll"]',
    ) as HTMLElement;

    expect(scrollBody.scrollHeight).toBeGreaterThan(scrollBody.clientHeight);

    const oldestBid = within(dialog).getByText(OLDEST_BID_LABEL);
    expect(oldestBid).not.toBeVisible();

    scrollBody.scrollTop = scrollBody.scrollHeight;
    oldestBid.scrollIntoView({ block: "end" });
    await waitFor(() => {
      expect(oldestBid).toBeVisible();
    });
  },
};
