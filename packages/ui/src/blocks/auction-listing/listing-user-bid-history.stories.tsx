import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { expect, within } from "storybook/test";
import { formatMoment } from "../../lib/format-datetime";
import { ListingUserBidHistory } from "./listing-user-bid-history";
import type { ListingUserBidHistoryRow } from "./types";

const COPY = {
  link: "Your bid history",
  title: "Bid History",
  amount: "Your bid",
  type: "Type",
  time: "Time",
} as const;

const SAMPLE_ROWS: ListingUserBidHistoryRow[] = [
  {
    id: "bid-1",
    amountLabel: "US$4,800",
    bidType: "auto",
    bidTypeLabel: "Automatic",
    timeLabel: "2 min ago",
  },
  {
    id: "bid-2",
    amountLabel: "US$4,550",
    bidType: "manual",
    bidTypeLabel: "Manual",
    timeLabel: "18 min ago",
  },
  {
    id: "bid-3",
    amountLabel: "US$4,300",
    bidType: "auto",
    bidTypeLabel: "Automatic",
    timeLabel: "1 hr ago",
  },
];

function createLongRows(count: number): ListingUserBidHistoryRow[] {
  const baseMs = Date.UTC(2026, 7, 24, 18, 0);

  return Array.from({ length: count }, (_, index) => ({
    id: `bid-long-${index}`,
    amountLabel: `US$${(4_800 - index * 100).toLocaleString("en-US")}`,
    bidType: index % 2 === 0 ? "auto" : "manual",
    bidTypeLabel: index % 2 === 0 ? "Automatic" : "Manual",
    timeLabel:
      index === 0
        ? "Just now"
        : index < 8
          ? `${index * 4} min ago`
          : formatMoment(baseMs - index * 3_600_000),
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
  },
} satisfies Meta<typeof ListingUserBidHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DialogOpen: Story = {
  args: { rows: SAMPLE_ROWS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.getByRole("button", { name: "Your bid history" }).click();
    expect(canvas.getByRole("dialog", { name: "Bid History" })).toBeVisible();
    expect(canvas.getByText("US$4,800")).toBeVisible();
  },
};

export const LongHistory: Story = {
  args: { rows: LONG_ROWS },
  decorators: [openDialogDecorator],
  parameters: {
    docs: {
      description: {
        story:
          "Twenty-eight accepted bids exceed the dialog body height. The pinned title stays visible while older bids scroll into view — the oldest entry (US$2,100) sits below the fold until you scroll.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole("dialog", { name: "Bid History" });
    const body = dialog.querySelector(
      '[data-slot="listing-user-bid-history-scroll"]',
    ) as HTMLElement;

    expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);

    const oldestBid = canvas.getByText(OLDEST_BID_LABEL);
    expect(oldestBid).not.toBeVisible();

    body.scrollTop = body.scrollHeight;
    expect(oldestBid).toBeVisible();
  },
};
