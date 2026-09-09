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
  BIDDING_POSTER,
  biddingItem,
  EMAIL_ALERTS_COPY,
  WATCH_COPY,
  WATCHING_CAMERA,
  WATCHING_POSTER,
  watchingItem,
} from "./fixtures";
import type { AuctionRecordRowProps } from "./types";
import { WatchButton } from "./watch-button";

const breadcrumbs = (
  <Breadcrumbs>
    <BreadcrumbItem href="#account">Account</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>My Auctions</BreadcrumbItem>
  </Breadcrumbs>
);

const onBrowseCatalogue = fn();
const onOpenBidding = fn();
const onWatchToggle = fn();
const onEmailAlertsChange = fn();
const watchPressed = fn();

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
  title: "Auction Record/AuctionRecord",
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

function auctionRecordRevealed(canvasElement: HTMLElement): boolean {
  const root = canvasElement.querySelector('[data-slot="auction-record"]');
  if (root?.getAttribute("data-revealed") !== "true") return false;

  const empty = canvasElement.querySelector(
    '[data-slot="auction-record-empty"]',
  );
  if (empty) {
    return Number(getComputedStyle(empty).opacity) > 0.9;
  }

  const row = canvasElement.querySelector('[data-slot="auction-record-row"]');
  const wrapper = row?.parentElement;
  if (!wrapper) return false;
  return Number(getComputedStyle(wrapper).opacity) > 0.9;
}

export const Filled: Story = {
  name: "Filled",
  render: () => <MyAuctions />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(auctionRecordRevealed(canvasElement)).toBe(true),
    );
    expect(
      canvas.getByRole("heading", { level: 1, name: "My Auctions" }),
    ).toBeVisible();

    // Bidding leads: a lot holding money outranks one only being followed.
    const headings = canvas.getAllByRole("heading", { level: 2 });
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "Bidding",
      "Watching",
    ]);
    expect(
      canvasElement.querySelectorAll('[data-slot="auction-record-row-image"]')
        .length,
    ).toBe(4);
  },
};

export const BiddingOnly: Story = {
  name: "Bidding only",
  render: () => <MyAuctions watching={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(auctionRecordRevealed(canvasElement)).toBe(true),
    );
    expect(
      canvas.getByRole("heading", { level: 2, name: "Bidding" }),
    ).toBeVisible();
    expect(
      canvas.queryByRole("heading", { level: 2, name: "Watching" }),
    ).not.toBeInTheDocument();
  },
};

export const WatchingOnly: Story = {
  name: "Watching only",
  render: () => <MyAuctions bidding={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(auctionRecordRevealed(canvasElement)).toBe(true),
    );
    expect(
      canvas.getByRole("heading", { level: 2, name: "Watching" }),
    ).toBeVisible();
    expect(
      canvas.queryByRole("heading", { level: 2, name: "Bidding" }),
    ).not.toBeInTheDocument();
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
    await waitFor(() =>
      expect(auctionRecordRevealed(canvasElement)).toBe(true),
    );
    expect(canvas.getByText("No lots yet")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "Browse auctions" }),
    );
    expect(onBrowseCatalogue).toHaveBeenCalled();
  },
};

export const ClosedAndCalledOff: Story = {
  name: "Closed and called off",
  args: {
    biddingItems: [],
    watchingItems: [
      watchingItem({
        id: "closed",
        title: "Studio Print, Edition of 12",
        state: "ended",
        stateLabel: "Closed",
        currentBid: "HK$2,200",
        closesAt: "Closed 8 Sep 2026, 20:00 HKT",
        href: "#lot-print",
        onWatchToggle,
        onEmailAlertsChange,
      }),
      watchingItem({
        id: "called-off",
        title: "Campaign Lot A",
        state: "ended",
        stateLabel: "Called off",
        currentBid: "HK$900",
        closesAt: "Called off 7 Sep 2026",
        href: "#lot-a",
        onWatchToggle,
        onEmailAlertsChange,
      }),
    ],
  },
};

export const Unavailable: Story = {
  name: "Unavailable",
  args: {
    biddingItems: [],
    watchingItems: [
      watchingItem({
        id: "gone",
        title: "Delisted Lot",
        state: "ended",
        stateLabel: "No longer listed",
        detail: "Details are no longer available",
        currentBid: undefined,
        closesAt: undefined,
        href: undefined,
        onWatchToggle,
        onEmailAlertsChange,
      }),
    ],
  },
};

export const BidOnMark: Story = {
  name: "Bid-on mark",
  args: {
    biddingItems: [],
    watchingItems: [
      watchingItem({
        id: "bid-on",
        title: "1994 Vintage Rangefinder Camera",
        state: "live",
        stateLabel: "Open",
        currentBid: "HK$4,800",
        closesAt: "9 Sep 2026, 21:00 HKT",
        href: "#lot-camera",
        bidPlaced: true,
        onOpenBidding,
        onWatchToggle,
        onEmailAlertsChange,
      }),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(auctionRecordRevealed(canvasElement)).toBe(true),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Bid" }));
    expect(onOpenBidding).toHaveBeenCalled();
    await userEvent.click(
      canvas.getByRole("button", { name: "Unwatch this lot" }),
    );
    expect(onWatchToggle).toHaveBeenCalled();
  },
};

export const Unwatch: Story = {
  name: "Unwatch",
  render: () => <MyAuctions bidding={[]} watching={[WATCHING_POSTER]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await waitFor(() =>
      expect(auctionRecordRevealed(canvasElement)).toBe(true),
    );

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
    await waitFor(() =>
      expect(auctionRecordRevealed(canvasElement)).toBe(true),
    );

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

    // The row stays on the page; muting is not unwatching.
    expect(canvas.getByText("1999 Base Set Charizard PSA 9")).toBeVisible();
  },
};

export const EmailAlertsMasterOff: Story = {
  name: "Email alerts master off",
  args: {
    biddingItems: [],
    watchingItems: [
      watchingItem({
        id: "master-off",
        title: "Signed Tour Poster, 1/50",
        state: "live",
        stateLabel: "Open",
        currentBid: "HK$1,050",
        closesAt: "12 Sep 2026, 18:00 HKT",
        href: "#lot-poster",
        emailAlerts: false,
        emailAlertsDisabled: true,
        emailAlertsCopy: EMAIL_ALERTS_COPY,
        onEmailAlertsChange,
        onWatchToggle,
      }),
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(auctionRecordRevealed(canvasElement)).toBe(true),
    );
    expect(canvas.getByRole("switch")).toHaveAttribute("aria-disabled", "true");
    expect(
      canvas.getByText(
        "Auction email alerts are off in account notifications.",
      ),
    ).toBeVisible();
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
        closesAt: "17 Sep 2026, 21:00 HKT",
        href: "#lot-charizard",
        emailAlertsPending: true,
        onEmailAlertsChange,
      }),
    ],
    watchingItems: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(auctionRecordRevealed(canvasElement)).toBe(true),
    );
    const alerts = canvas.getByRole("switch");
    expect(alerts).toHaveAttribute("aria-disabled", "true");
    expect(alerts).toHaveAttribute("aria-busy", "true");
  },
};

export const WatchControl: Story = {
  name: "Watch control",
  render: () => (
    <div className="p-8">
      <WatchButton copy={WATCH_COPY} onPress={watchPressed} watched={false} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Watch this lot" }),
    );
    expect(watchPressed).toHaveBeenCalled();
  },
};
