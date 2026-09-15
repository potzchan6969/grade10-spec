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
  BIDDING_DIDNT_WIN_HOLD_RELEASING,
  BIDDING_ENDED,
  BIDDING_POSTER,
  BIDDING_WON_AWAITING_ADDRESS,
  BIDDING_WON_PENDING_PAYMENT,
  BIDDING_WON_PREPARING_INVOICE,
  BIDDING_WON_PROCESSING,
  biddingItem,
  WATCHING_CAMERA,
  WATCHING_ENDED,
  WATCHING_POSTER,
} from "./fixtures";
import type { AuctionRecordRowProps } from "./types";

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
        description: "Email alerts for this lot are off too.",
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
  title: "My Auctions/Page",
  component: AuctionRecord,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
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
 * transitions themselves to finish settles the whole record at once, however
 * many parts it has and whatever order they arrive in.
 */
async function auctionRecordSettled(canvasElement: HTMLElement) {
  await waitFor(() =>
    expect(
      canvasElement
        .querySelector('[data-slot="auction-record"]')
        ?.getAttribute("data-revealed"),
    ).toBe("true"),
  );
  await Promise.all(
    canvasElement
      .getAnimations({ subtree: true })
      .filter((animation) => animation instanceof CSSTransition)
      .map((animation) => animation.finished.catch(() => undefined)),
  );
}

/** Default composition: bid rows first, watch-only after, one table. */
export const Filled: Story = {
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
    expect(canvas.getByText("Your Standing")).toBeVisible();
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
      canvas.getAllByRole("button", { name: "Unwatch this lot" }),
    ).toHaveLength(2);
  },
};

/** Sparse page: bids only — no Unwatch column actions. */
export const BiddingOnly: Story = {
  name: "Bidding only",
  render: () => <MyAuctions watching={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await auctionRecordSettled(canvasElement);
    expect(canvas.getByText("2")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Unwatch this lot" }),
    ).not.toBeInTheDocument();
    expect(canvas.getAllByRole("switch")).toHaveLength(2);
  },
};

export const Empty: Story = {
  name: "Empty",
  args: {
    biddingItems: [],
    watchingItems: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await auctionRecordSettled(canvasElement);
    expect(canvas.getByText("No lots yet")).toBeVisible();
    expect(canvas.queryByText("0")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Browse lots" }));
    expect(onBrowseCatalogue).toHaveBeenCalled();
  },
};

/**
 * Closed lots stay on My Auctions while published. Unsold maps to Ended on
 * the watched row; a bid that did not win stays with Didn't win standing.
 */
export const Ended: Story = {
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
    expect(bidRow.getByText("Didn't win")).toBeVisible();
    expect(
      bidRow.getByRole("link", {
        name: "Open listing: 1977 Star Wars Topps Wax Pack",
      }),
    ).toHaveAttribute("href", "#lot-wax-pack");
    expect(
      bidRow.queryByRole("button", { name: "Unwatch this lot" }),
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
      watchRow.getByRole("button", { name: "Unwatch this lot" }),
    ).toBeVisible();
  },
};

/**
 * Address-first post-auction standing on Won rows, plus Didn't win hold copy
 * and watch-only Ended. Read-only — opens the order / listing; no pay control.
 */
export const PostAuctionStanding: Story = {
  name: "Post-auction standing",
  render: () => (
    <MyAuctions
      bidding={[
        BIDDING_WON_AWAITING_ADDRESS,
        BIDDING_WON_PREPARING_INVOICE,
        BIDDING_WON_PENDING_PAYMENT,
        BIDDING_WON_PROCESSING,
        BIDDING_DIDNT_WIN_HOLD_RELEASING,
        BIDDING_ENDED,
      ]}
      watching={[WATCHING_ENDED]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await auctionRecordSettled(canvasElement);

    expect(canvas.getByText("7")).toBeVisible();
    expect(canvas.getByText("Awaiting Address")).toBeVisible();
    expect(canvas.getByText("Preparing Invoice")).toBeVisible();
    expect(canvas.getByText("Pending Payment")).toBeVisible();
    expect(canvas.getByText("Processing")).toBeVisible();
    expect(canvas.getByText("Confirm delivery address")).toBeVisible();
    expect(canvas.getByText("Card hold being released")).toBeVisible();
    expect(canvas.getAllByText("Didn't win")).toHaveLength(2);
    expect(canvas.getByText("Ended")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: /pay/i }),
    ).not.toBeInTheDocument();
  },
};

export const Unwatch: Story = {
  name: "Unwatch",
  render: () => <MyAuctions bidding={[]} watching={[WATCHING_POSTER]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await auctionRecordSettled(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Unwatch this lot" }),
    );
    await waitFor(() =>
      expect(
        body.getByText("Unwatched Signed Tour Poster, 1/50"),
      ).toBeInTheDocument(),
    );
    expect(
      body.getByText("Email alerts for this lot are off too."),
    ).toBeInTheDocument();

    await userEvent.click(body.getByRole("button", { name: "Undo" }));
    await waitFor(() =>
      expect(canvas.getByText("Signed Tour Poster, 1/50")).toBeVisible(),
    );
  },
};

export const EmailAlertsMuted: Story = {
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
        body.getByText("Email alerts off for this lot"),
      ).toBeInTheDocument(),
    );
    expect(body.getByText("Your bid stands.")).toBeInTheDocument();

    expect(canvas.getByText("1999 Base Set Charizard PSA 9")).toBeVisible();
  },
};

export const AlertsPending: Story = {
  name: "Email alerts pending",
  args: {
    biddingItems: [
      biddingItem({
        id: "pending",
        title: "1999 Base Set Charizard PSA 9",
        state: "leading",
        stateLabel: "Leading",
        currentBid: "HK$12,800",
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
    expect(alerts).toHaveAttribute("aria-disabled", "true");
    expect(alerts).toHaveAttribute("aria-busy", "true");
  },
};
