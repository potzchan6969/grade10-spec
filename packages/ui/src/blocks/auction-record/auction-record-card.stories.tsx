import {
  Table,
  TableBody,
} from "@grade10/design-system/components/display/table";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
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

const unwatchPressed = fn();

const FILLED_SMALL_VIEWPORT_STORY =
  "?path=/story/auction-bidding-blocks-auctionrecord--filled-small-viewport";
const MY_AUCTIONS_PAGE_STORY =
  "?path=/story/auction-bidding-screens-my-auctions--post-auction";

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
  title: "Auction/Bidding/Blocks/AuctionRecordRow",
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
  parameters: {
    verification: { caseId: "vc_3df78e40-5ee5-4710-83e9-21247285918f" },
  },
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
  parameters: {
    verification: { caseId: "vc_8eb01324-cdf3-4cf2-bc7f-b7ca2bc476d4" },
  },
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
  parameters: {
    verification: { caseId: "vc_2dd53569-2d09-4729-aa30-9e6e9a32d521" },
  },
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
  parameters: {
    verification: { caseId: "vc_dacd73ad-fab0-404e-ad23-c3207d31c48c" },
  },
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
  parameters: {
    verification: { caseId: "vc_f394e219-f8a9-4261-bb80-bb3465924ad9" },
  },
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
  parameters: {
    verification: { caseId: "vc_1994ad26-018a-4e20-896e-17de9aa7d037" },
  },
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
  parameters: {
    verification: { caseId: "vc_8f89118f-6dcb-428d-a448-d7891f7588b7" },
  },
  name: "Pending Payment",
  render: () => <AuctionCard {...BIDDING_WON_PENDING_PAYMENT} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Pending Payment")).toBeVisible();
    expect(canvas.getByRole("link", { name: /View order/ })).toBeVisible();
  },
};

/** Unwatch in flight in both presentations: busy, focusable, a second press is refused. */
export const UnwatchPending: Story = {
  parameters: {
    verification: { caseId: "vc_af5b9ba1-697f-4967-9524-2afdeaf97def" },
  },
  name: "Unwatch pending",
  render: () => (
    <div className="flex flex-col gap-6">
      <AuctionCard
        {...WATCHING_CAMERA}
        onWatchToggle={unwatchPressed}
        watchPending
      />
      <Table>
        <TableBody>
          <AuctionRecordRow
            {...WATCHING_CAMERA}
            onWatchToggle={unwatchPressed}
            watchPending
          />
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    unwatchPressed.mockClear();
    const buttons = within(canvasElement).getAllByRole("button", {
      name: "Unwatch this auction",
    });
    expect(buttons).toHaveLength(2);
    for (const button of buttons) {
      expect(button).toHaveAttribute("aria-busy", "true");
      button.focus();
      expect(button).toHaveFocus();
      await userEvent.keyboard("{Enter}");
    }
    expect(unwatchPressed).not.toHaveBeenCalled();
  },
};
