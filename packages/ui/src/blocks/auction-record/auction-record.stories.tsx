import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { AuctionRecord } from "./auction-record";
import {
  AUCTION_RECORD_COPY,
  BIDDING_CHARIZARD,
  BIDDING_DIDNT_WIN,
  BIDDING_ENDED,
  BIDDING_POSTER,
  BIDDING_WON_AWAITING_ADDRESS,
  BIDDING_WON_CANCELLED,
  BIDDING_WON_DELIVERED,
  BIDDING_WON_EXPIRED,
  BIDDING_WON_PARTIALLY_PAID,
  BIDDING_WON_PAYMENT_VERIFYING,
  BIDDING_WON_PENDING_PAYMENT,
  BIDDING_WON_PREPARING_INVOICE,
  BIDDING_WON_PROCESSING,
  BIDDING_WON_REFUNDED,
  BIDDING_WON_SETUP_OVERDUE,
  BIDDING_WON_SHIPPED,
  biddingItem,
  WATCHING_CAMERA,
  WATCHING_ENDED,
  WATCHING_POSTER,
  WINNER_ORDER_HREF,
} from "./fixtures";
import type { AuctionRecordRowProps } from "./types";

const AUCTION_CARD_STORY =
  "?path=/story/auction-bidding-blocks-auctionrecordrow--leading";
const MY_AUCTIONS_PAGE_STORY =
  "?path=/story/auction-bidding-screens-my-auctions--post-auction";

const breadcrumbs = (
  <Breadcrumbs>
    <BreadcrumbItem href="#account">Account</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>My Auctions</BreadcrumbItem>
  </Breadcrumbs>
);

const onBrowseCatalogue = fn();
const onWatchToggle = fn();
const onEmailAlertsChange = fn();

const BIDDING_ROWS = [BIDDING_CHARIZARD, BIDDING_POSTER];
const WATCHING_ROWS = [WATCHING_CAMERA, WATCHING_POSTER];

function rowKey(item: AuctionRecordRowProps) {
  return item.id ?? item.href ?? item.title;
}

/**
 * The application's half of My Auctions: it owns the rows, applies one row's
 * alerts change to that row alone, and owns the unwatch toast and its Undo.
 */
function useAuctionRows(initial: readonly AuctionRecordRowProps[]) {
  const [rows, setRows] = useState<readonly AuctionRecordRowProps[]>(initial);

  const withAlerts = (item: AuctionRecordRowProps) => ({
    ...item,
    onEmailAlertsChange: (enabled: boolean) => {
      onEmailAlertsChange(rowKey(item), enabled);
      setRows((current) =>
        current.map((row) =>
          rowKey(row) === rowKey(item) ? { ...row, emailAlerts: enabled } : row,
        ),
      );
    },
  });

  const withUnwatch = (item: AuctionRecordRowProps) => ({
    ...withAlerts(item),
    onWatchToggle: () => {
      onWatchToggle(rowKey(item));
      setRows((current) =>
        current.filter((row) => rowKey(row) !== rowKey(item)),
      );
      toast(`Unwatched ${item.title}`, {
        description: "Email alerts for this auction are off.",
        action: {
          label: "Undo",
          onClick: () =>
            setRows((current) =>
              current.some((row) => rowKey(row) === rowKey(item))
                ? current
                : [item, ...current],
            ),
        },
      });
    },
  });

  return { rows, withAlerts, withUnwatch };
}

function MyAuctions({
  bidding = BIDDING_ROWS,
  watching = WATCHING_ROWS,
  ...args
}: Partial<Parameters<typeof AuctionRecord>[0]> & {
  bidding?: readonly AuctionRecordRowProps[];
  watching?: readonly AuctionRecordRowProps[];
}) {
  const biddingRows = useAuctionRows(bidding);
  const watchingRows = useAuctionRows(watching);

  return (
    <>
      <Toast position="bottom-right" />
      <AuctionRecord
        breadcrumbs={breadcrumbs}
        copy={AUCTION_RECORD_COPY}
        onBrowseCatalogue={onBrowseCatalogue}
        {...args}
        biddingItems={biddingRows.rows.map(biddingRows.withAlerts)}
        watchingItems={watchingRows.rows.map(watchingRows.withUnwatch)}
      />
    </>
  );
}

const meta = {
  title: "Auction/Bidding/Blocks/AuctionRecord",
  component: AuctionRecord,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
\`AuctionRecord\` owns the page body: table from \`md\`, stacked cards below.

Small-viewport lot card variants:
[Auction Card](${AUCTION_CARD_STORY}).

Full page with store chrome:
[My Auctions Page](${MY_AUCTIONS_PAGE_STORY}).
`,
      },
    },
  },

  args: {
    copy: AUCTION_RECORD_COPY,
    breadcrumbs,
    biddingItems: BIDDING_ROWS,
    watchingItems: WATCHING_ROWS,
    onBrowseCatalogue,
  },
  decorators: [
    (Story) => (
      <div className="flex w-full justify-center bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuctionRecord>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The record fades every part of itself in on its own stagger delay, so one
 * element having arrived says nothing about the next. Waiting for the
 * animations themselves to finish settles the whole record at once, however
 * many parts it has and whatever order they arrive in.
 */
async function auctionRecordSettled(canvasElement: HTMLElement) {
  await waitFor(() =>
    expect(
      canvasElement.querySelector('[data-slot="auction-record"]'),
    ).not.toBeNull(),
  );
  await Promise.all(
    canvasElement
      .getAnimations({ subtree: true })
      .filter(
        (animation) =>
          animation instanceof CSSTransition ||
          (animation instanceof CSSAnimation &&
            animation.animationName === "enter"),
      )
      .map((animation) => animation.finished.catch(() => undefined)),
  );
}

/** Default composition: bid rows first, watch-only after, one table from md. */
export const Filled: Story = {
  parameters: {
    verification: { caseId: "vc_6968ce6b-01e2-400a-bc56-5f50beb0a308" },
  },
  name: "Filled",
  render: () => <MyAuctions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await auctionRecordSettled(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "My Auctions" }),
    ).toBeVisible();
    expect(canvas.getByText("4")).toBeVisible();
    expect(canvas.getByText("Auction")).toBeVisible();
    expect(canvas.getByText("Status")).toBeVisible();
    expect(
      canvas.queryByRole("heading", { level: 2, name: "Bidding" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { level: 2, name: "Watching" }),
    ).not.toBeInTheDocument();

    const rows = canvasElement.querySelectorAll(
      '[data-slot="auction-record-row"]',
    );
    expect(rows).toHaveLength(4);
    // Bid rows first: Charizard Leading before watch-only camera.
    expect(within(rows[0] as HTMLElement).getByText("Leading")).toBeVisible();
    expect(within(rows[2] as HTMLElement).getByText("--")).toBeVisible();
    // Unwatch only on the two watch-only rows.
    expect(
      canvas.getAllByRole("button", { name: "Unwatch this auction" }),
    ).toHaveLength(2);
  },
};

/** Below md: stacked cards — same facts, no table header, no sideways pan. */
export const FilledSmallViewport: Story = {
  name: "Filled — small viewport",
  globals: { viewport: { value: "mobile1" } },
  parameters: {
    verification: { caseId: "vc_6894c117-19d8-4602-b71c-c70d1b6c2cd4" },
    docs: {
      description: {
        story: `Card anatomy SoT: [Auction Card](${AUCTION_CARD_STORY}).`,
      },
    },
  },
  render: () => <MyAuctions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await auctionRecordSettled(canvasElement);
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="auction-record-cards"]'),
      ).not.toBeNull(),
    );
    expect(
      canvasElement.querySelectorAll('[data-slot="auction-record-card"]'),
    ).toHaveLength(4);
    expect(
      canvasElement.querySelector('[data-slot="auction-record-row"]'),
    ).toBeNull();
    // Column header row is table-only.
    expect(
      canvas.queryByRole("columnheader", { name: "Auction" }),
    ).not.toBeInTheDocument();
    expect(canvas.getAllByText(/Current Bid/).length).toBeGreaterThan(0);
    expect(canvas.getAllByText("Leading").length).toBeGreaterThan(0);
    expect(
      canvas.getAllByRole("button", { name: "Unwatch this auction" }),
    ).toHaveLength(2);
  },
};

/** Sparse page: bids only — no Unwatch column actions. */
export const BiddingOnly: Story = {
  parameters: {
    verification: { caseId: "vc_db4736d1-9b1f-4a2a-92bb-5e928271a16c" },
  },
  name: "Bidding only",
  render: () => <MyAuctions watching={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await auctionRecordSettled(canvasElement);
    expect(canvas.getByText("2")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Unwatch this auction" }),
    ).not.toBeInTheDocument();
    expect(canvas.getAllByRole("switch")).toHaveLength(2);
  },
};

export const Empty: Story = {
  parameters: {
    verification: { caseId: "vc_eb5be423-fbd4-4b9e-906f-2d047aecb834" },
  },
  name: "Empty",
  args: {
    biddingItems: [],
    watchingItems: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await auctionRecordSettled(canvasElement);
    expect(canvas.getByText("No auctions yet")).toBeVisible();
    expect(canvas.queryByText("0")).not.toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "Browse auctions" }),
    );
    expect(onBrowseCatalogue).toHaveBeenCalled();
  },
};

/**
 * Closed lots stay on My Auctions while published. Unsold maps to Ended on
 * the watched row; a bid that did not win stays with Didn’t win standing.
 */
export const Ended: Story = {
  parameters: {
    verification: { caseId: "vc_9ee85690-4278-4984-8e1f-11e6bc712d5d" },
  },
  name: "Ended",
  render: () => (
    <MyAuctions bidding={[BIDDING_ENDED]} watching={[WATCHING_ENDED]} />
  ),
  play: async ({ canvasElement }) => {
    await auctionRecordSettled(canvasElement);

    const rows = canvasElement.querySelectorAll(
      '[data-slot="auction-record-row"]',
    );
    expect(rows).toHaveLength(2);

    const bidRow = within(rows[0] as HTMLElement);
    expect(bidRow.getByText("1977 Star Wars Topps Wax Pack")).toBeVisible();
    expect(bidRow.getByText("Didn’t win")).toBeVisible();
    expect(
      bidRow.getByRole("link", {
        name: "Open listing: 1977 Star Wars Topps Wax Pack",
      }),
    ).toHaveAttribute("href", "#lot-wax-pack");
    expect(
      bidRow.queryByRole("button", { name: "Unwatch this auction" }),
    ).not.toBeInTheDocument();

    const watchRow = within(rows[1] as HTMLElement);
    expect(
      watchRow.getByText("1986 World Cup Panini Sticker Album"),
    ).toBeVisible();
    expect(watchRow.getByText("Ended")).toBeVisible();
    expect(
      watchRow.getByRole("link", {
        name: "Open listing: 1986 World Cup Panini Sticker Album",
      }),
    ).toHaveAttribute("href", "#lot-sticker-album");
    expect(
      watchRow.getByRole("button", { name: "Unwatch this auction" }),
    ).toBeVisible();
  },
};

/**
 * Address-first post-auction standing on Won rows, plus Didn’t win and
 * watch-only Ended. Read-only — Won title / View order open Winner Order; no
 * pay control and no payment helper copy on Won rows.
 */
export const PostAuctionStanding: Story = {
  parameters: {
    verification: { caseId: "vc_013ca351-6d25-4e77-9dc2-09c7dea51109" },
  },
  name: "Post-auction standing",
  render: () => (
    <MyAuctions
      bidding={[
        BIDDING_WON_AWAITING_ADDRESS,
        BIDDING_WON_SETUP_OVERDUE,
        BIDDING_WON_PREPARING_INVOICE,
        BIDDING_WON_PENDING_PAYMENT,
        BIDDING_WON_PAYMENT_VERIFYING,
        BIDDING_WON_EXPIRED,
        BIDDING_WON_PARTIALLY_PAID,
        BIDDING_WON_PROCESSING,
        BIDDING_WON_SHIPPED,
        BIDDING_WON_DELIVERED,
        BIDDING_WON_CANCELLED,
        BIDDING_WON_REFUNDED,
        BIDDING_DIDNT_WIN,
        BIDDING_ENDED,
      ]}
      watching={[WATCHING_ENDED]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await auctionRecordSettled(canvasElement);

    expect(canvas.getByText("15")).toBeVisible();
    expect(canvas.getByText("Awaiting Setup")).toBeVisible();
    expect(canvas.getByText("Setup Overdue")).toBeVisible();
    expect(canvas.getByText("Preparing Invoice")).toBeVisible();
    expect(canvas.getByText("Pending Payment")).toBeVisible();
    expect(canvas.getByText("Payment Verifying")).toBeVisible();
    expect(canvas.getByText("Payment Overdue")).toBeVisible();
    expect(canvas.getByText("Partially Paid")).toBeVisible();
    expect(canvas.getByText("Preparing Shipment")).toBeVisible();
    expect(canvas.getByText("Shipped")).toBeVisible();
    expect(canvas.getByText("Delivered")).toBeVisible();
    expect(canvas.getByText("Cancelled")).toBeVisible();
    expect(canvas.getByText("Refunded")).toBeVisible();
    expect(
      canvas.queryByText("Confirm delivery address"),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByText("Address confirmed — invoice coming"),
    ).not.toBeInTheDocument();
    expect(canvas.queryByText(/Order total/i)).not.toBeInTheDocument();
    expect(
      canvas.queryByText("Contact Grade10 about payment"),
    ).not.toBeInTheDocument();
    expect(canvas.getAllByText("Your card was not charged.")).toHaveLength(2);
    expect(canvas.getAllByText("Didn’t win")).toHaveLength(2);
    expect(canvas.getByText("Ended")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: /pay/i }),
    ).not.toBeInTheDocument();

    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Base Set Charizard PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.awaitingAddress);
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Base Set Venusaur PSA 8",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.expiredSetup);
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1998 Neo Genesis Lugia PSA 10",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.preparingInvoice);
    expect(
      canvas.getByRole("link", {
        name: "Open order: 2000 Skyridge Crystal Charizard PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.pendingPayment);
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Neo Destiny Dark Tyranitar PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.paymentVerifying);
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Fossil Dragonite Holo PSA 8",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.expiredInvoice);
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Jungle Vaporeon Holo PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.partiallyPaid);
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Fossil Dragonite Holo PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.processing);
    expect(
      canvas.getByRole("link", {
        name: "Open order: 2000 Skyridge Crobat Holo PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.shipped);
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Base Set Blastoise PSA 8",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.delivered);
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Jungle Scyther Holo PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.cancelled);
    expect(
      canvas.getByRole("link", {
        name: "Open order: 1999 Fossil Kabutops Holo PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.refunded);
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Base Set Charizard PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.awaitingAddress);
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Base Set Venusaur PSA 8",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.expiredSetup);
    expect(
      canvas.getByRole("link", {
        name: "View order: 1998 Neo Genesis Lugia PSA 10",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.preparingInvoice);
    expect(
      canvas.getByRole("link", {
        name: "View order: 2000 Skyridge Crystal Charizard PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.pendingPayment);
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Neo Destiny Dark Tyranitar PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.paymentVerifying);
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Fossil Dragonite Holo PSA 8",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.expiredInvoice);
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Jungle Vaporeon Holo PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.partiallyPaid);
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Fossil Dragonite Holo PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.processing);
    expect(
      canvas.getByRole("link", {
        name: "View order: 2000 Skyridge Crobat Holo PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.shipped);
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Base Set Blastoise PSA 8",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.delivered);
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Jungle Scyther Holo PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.cancelled);
    expect(
      canvas.getByRole("link", {
        name: "View order: 1999 Fossil Kabutops Holo PSA 9",
      }),
    ).toHaveAttribute("href", WINNER_ORDER_HREF.refunded);
    expect(
      canvas.queryByRole("link", {
        name: "View order: 1999 Jungle Flareon Holo PSA 8",
      }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("link", {
        name: "Open listing: 1999 Jungle Flareon Holo PSA 8",
      }),
    ).toHaveAttribute("href", "#lot-flareon");
  },
};

export const Unwatch: Story = {
  parameters: {
    verification: { caseId: "vc_434c9a88-bd3c-42e0-957f-d35dabf59a1d" },
  },
  name: "Unwatch",
  render: () => <MyAuctions bidding={[]} watching={[WATCHING_POSTER]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await auctionRecordSettled(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Unwatch this auction" }),
    );
    await waitFor(() =>
      expect(
        body.getByText("Unwatched Signed Tour Poster, 1/50"),
      ).toBeInTheDocument(),
    );
    expect(
      body.getByText("Email alerts for this auction are off."),
    ).toBeInTheDocument();

    await userEvent.click(body.getByRole("button", { name: "Undo" }));
    await waitFor(() =>
      expect(canvas.getByText("Signed Tour Poster, 1/50")).toBeVisible(),
    );
  },
};

export const EmailAlertsMuted: Story = {
  parameters: {
    verification: { caseId: "vc_b78021aa-24a2-4139-a91f-b8f16936e7af" },
  },
  name: "Email alerts muted",
  render: () => <MyAuctions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await auctionRecordSettled(canvasElement);

    const switches = canvas.getAllByRole("switch");
    expect(switches).toHaveLength(4);

    // Muting one lot leaves every other lot's alerts alone.
    await userEvent.click(switches[0]);
    expect(switches[0]).not.toBeChecked();
    for (const other of switches.slice(1)) {
      expect(other).toBeChecked();
    }

    await waitFor(() =>
      expect(
        body.getByText("Email alerts off for this auction"),
      ).toBeInTheDocument(),
    );
    expect(body.getByText("Your bid stands.")).toBeInTheDocument();

    expect(canvas.getByText("1999 Base Set Charizard PSA 9")).toBeVisible();
  },
};

export const AlertsPending: Story = {
  parameters: {
    verification: { caseId: "vc_3cc1bea7-96f5-4567-9b66-88483f4d136f" },
  },
  name: "Email alerts pending",
  args: {
    biddingItems: [
      biddingItem({
        id: "pending",
        title: "1999 Base Set Charizard PSA 9",
        state: "leading",
        stateLabel: "Leading",
        currentBid: "US$12,800",
        closesAt: "Closes 17 Sep 2026, 21:00 HKT",
        href: "#lot-charizard",
        emailAlertsPending: true,
        onEmailAlertsChange,
      }),
    ],
    watchingItems: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await auctionRecordSettled(canvasElement);
    const alerts = canvas.getByRole("switch");
    expect(alerts).not.toHaveAttribute("aria-disabled");
    expect(alerts).toHaveAttribute("aria-busy", "true");
    onEmailAlertsChange.mockClear();
    await userEvent.click(alerts);
    expect(onEmailAlertsChange).toHaveBeenCalledWith(false);
  },
};

const REFUSAL = "We could not save that. Try again.";

/** Holds each write for a beat, then refuses it and moves the row back. */
function RefusingRecord() {
  const [watchPending, setWatchPending] = useState(false);
  const [watchFailed, setWatchFailed] = useState<string>();
  const [alerts, setAlerts] = useState(true);
  const [alertsPending, setAlertsPending] = useState(false);
  const [alertsFailed, setAlertsFailed] = useState<string>();

  return (
    <AuctionRecord
      copy={AUCTION_RECORD_COPY}
      watchingItems={[
        {
          ...WATCHING_POSTER,
          watchPending,
          watchFailed,
          onWatchToggle: () => {
            setWatchFailed(undefined);
            setWatchPending(true);
            setTimeout(() => {
              setWatchPending(false);
              setWatchFailed(REFUSAL);
            }, 50);
          },
          emailAlerts: alerts,
          emailAlertsPending: alertsPending,
          emailAlertsFailed: alertsFailed,
          onEmailAlertsChange: (enabled) => {
            setAlertsFailed(undefined);
            setAlerts(enabled);
            setAlertsPending(true);
            setTimeout(() => {
              setAlerts(!enabled);
              setAlertsPending(false);
              setAlertsFailed(REFUSAL);
            }, 50);
          },
        },
      ]}
    />
  );
}

/** A refused Unwatch keeps the row on screen, pressable, with its refusal. */
export const UnwatchRefused: Story = {
  parameters: {
    verification: { caseId: "vc_41ee53e0-5b2c-493b-bba6-a4b09ca03106" },
  },
  name: "Unwatch refused",
  render: () => <RefusingRecord />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await auctionRecordSettled(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Unwatch this auction" }),
    );
    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(REFUSAL),
    );
    const unwatch = canvas.getByRole("button", {
      name: "Unwatch this auction",
    });
    expect(unwatch).toBeVisible();
    expect(unwatch).not.toHaveAttribute("aria-busy");
    expect(unwatch).toBeEnabled();
  },
};

/** A refused alerts change moves the switch back and says why, with no toast. */
export const EmailAlertsRefused: Story = {
  parameters: {
    verification: { caseId: "vc_077a48ad-6538-49cf-b534-3612a2c976ce" },
  },
  name: "Email alerts refused",
  render: () => <RefusingRecord />,
  play: async ({ canvasElement }) => {
    toast.dismiss();
    await waitFor(() =>
      expect(document.querySelector("[data-sonner-toast]")).toBeNull(),
    );
    const canvas = within(canvasElement);
    await auctionRecordSettled(canvasElement);

    const alerts = canvas.getByRole("switch");
    await userEvent.click(alerts);
    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(REFUSAL),
    );
    expect(alerts).toBeChecked();
    expect(document.querySelector("[data-sonner-toast]")).toBeNull();
  },
};
