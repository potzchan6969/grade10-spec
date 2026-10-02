import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { AuctionRecordRow } from "./auction-record-row";
import {
  AUCTION_RECORD_COPY,
  BIDDING_CHARIZARD,
  BIDDING_ENDED,
  BIDDING_POSTER,
  BIDDING_WON_AWAITING_ADDRESS,
  BIDDING_WON_PENDING_PAYMENT,
  WATCHING_CAMERA,
  WATCHING_ENDED,
} from "./fixtures";
import type { AuctionRecordRowProps } from "./types";

const CARD_FACT_LABELS = {
  currentBid: AUCTION_RECORD_COPY.currentBidColumn,
  standing: AUCTION_RECORD_COPY.standingColumn,
  emailAlerts: AUCTION_RECORD_COPY.emailAlertsColumn,
};

const FILLED_SMALL_VIEWPORT_STORY =
  "?path=/story/my-auctions-my-auctions--filled-small-viewport";
const MY_AUCTIONS_PAGE_STORY = "?path=/story/pages-my-auctions-page--default";

function AuctionCard(item: AuctionRecordRowProps) {
  return (
    <ul className="flex w-full flex-col gap-3">
      <AuctionRecordRow
        {...item}
        factLabels={CARD_FACT_LABELS}
        onEmailAlertsChange={
          item.onEmailAlertsChange ?? (item.emailAlertsCopy ? fn() : undefined)
        }
        presentation="card"
      />
    </ul>
  );
}

/**
 * Small-viewport lot card (`AuctionRecordRow` `presentation="card"`).
 * One story per standing / action shape — revise in Figma, then sync back.
 */
const meta = {
  title: "My Auctions/Auction Card",
  component: AuctionRecordRow,
  args: BIDDING_CHARIZARD,
  tags: ["autodocs"],
  globals: { viewport: { value: "mobile1" } },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
\`AuctionRecordRow\` with \`presentation="card"\` — the lot cell below \`md\`.
Composed into the list on
[Filled — small viewport](${FILLED_SMALL_VIEWPORT_STORY}) and
[My Auctions Page](${MY_AUCTIONS_PAGE_STORY}).
`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-md bg-background p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuctionRecordRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live bid — Leading badge, email alerts, no Unwatch. */
export const Leading: Story = {
  name: "Leading",
  render: () => <AuctionCard {...BIDDING_CHARIZARD} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector('[data-slot="auction-record-card"]'),
    ).not.toBeNull();
    expect(canvas.getByText("Leading")).toBeVisible();
    expect(canvas.getByRole("switch")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Unwatch this auction" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("link", {
        name: "Open listing: 1999 Base Set Charizard PSA 9",
      }),
    ).toHaveAttribute("href", "#lot-charizard");
  },
};

/** Live bid — Outbid standing, email alerts stay. */
export const Outbid: Story = {
  name: "Outbid",
  render: () => <AuctionCard {...BIDDING_POSTER} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Outbid")).toBeVisible();
    expect(canvas.getByRole("switch")).toBeVisible();
  },
};

/** Watch-only — alerts + Unwatch; no standing badge when none supplied. */
export const Watching: Story = {
  name: "Watching",
  render: () => <AuctionCard {...WATCHING_CAMERA} onWatchToggle={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("1994 Vintage Rangefinder Camera")).toBeVisible();
    expect(canvas.getByRole("switch")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Unwatch this auction" }),
    ).toBeVisible();
  },
};

/** Closed watch-only — Ended badge, Unwatch still available. */
export const Ended: Story = {
  name: "Ended",
  render: () => <AuctionCard {...WATCHING_ENDED} onWatchToggle={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Ended")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Unwatch this auction" }),
    ).toBeVisible();
  },
};

/** Closed bid that did not win — no Unwatch, no View order. */
export const DidntWin: Story = {
  name: "Didn’t win",
  render: () => <AuctionCard {...BIDDING_ENDED} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Didn’t win")).toBeVisible();
    expect(canvas.getByText("Your card was not charged.")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Unwatch this auction" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("link", { name: /View order/ }),
    ).not.toBeInTheDocument();
  },
};

/** Won — Awaiting Setup; whole card + View order open Winner Order. */
export const AwaitingSetup: Story = {
  name: "Awaiting Setup",
  render: () => <AuctionCard {...BIDDING_WON_AWAITING_ADDRESS} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Awaiting Setup")).toBeVisible();
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Base Set Charizard PSA 9",
      }),
    ).toHaveAttribute("href", BIDDING_WON_AWAITING_ADDRESS.href);
    expect(canvas.getByRole("link", { name: /View order/ })).toHaveAttribute(
      "href",
      BIDDING_WON_AWAITING_ADDRESS.href,
    );
  },
};

/** Won — Pending Payment; View order still the row action. */
export const PendingPayment: Story = {
  name: "Pending Payment",
  render: () => <AuctionCard {...BIDDING_WON_PENDING_PAYMENT} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Pending Payment")).toBeVisible();
    expect(canvas.getByRole("link", { name: /View order/ })).toBeVisible();
  },
};
