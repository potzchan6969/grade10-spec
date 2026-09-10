import { Skeleton } from "@grade10/design-system/components/display/skeleton";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  FIXTURE_ACTIVITY_TIME_COPY,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
  LISTING_LOT_GRID_CLASS,
  ListingAuctionCardSidebar,
  ListingLotGallery,
  ListingLotHeader,
  ListingUserBidHistory,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, within } from "storybook/test";
import {
  AUCTION_LISTING_HREF,
  AUCTION_LOT,
  AUCTION_LOT_BADGES,
  AUCTION_LOT_DETAILS_COPY,
  AUCTION_LOT_FACTS,
} from "../pages/auction-lot-details-content";
import { ListingAuctionBidCardLoading } from "./fixtures";
import {
  type BiddingState,
  bidHistoryForState,
  buildListingAuctionBidView,
  userBidHistoryForState,
} from "./listing-auction-bid-fixtures";

/**
 * Lot product composition used by Auction Lot Details — gallery, header, and
 * auction-card sidebar (bid card + About this lot). Site chrome lives on the
 * page story.
 */
const meta = {
  title: "Auction Listing/Listing Product",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Same block composition as Pages/Auction Lot Details (without site nav/footer). Prefer the page stories for full bidding states with live simulation.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const MARKET_COMPS = {
  title: "Market price",
  range: "HK$46,800–HK$171,600",
} as const;

const noop = () => undefined;

function lotMetaLoading() {
  return (
    <VStack className="w-full" gap="lg">
      <VStack gap="md">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-24" />
      </VStack>
      <VStack className="border-t border-border pt-6" gap="sm">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-40" />
      </VStack>
      <VStack className="border-t border-border pt-6" gap="sm">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-full" />
      </VStack>
    </VStack>
  );
}

function galleryLoading() {
  return (
    <VStack className="w-full" gap="lg">
      <Skeleton className="aspect-square w-full rounded-4xl" />
      <Skeleton className="aspect-square w-full rounded-4xl" />
    </VStack>
  );
}

function lotShell(main: ReactNode, header?: ReactNode) {
  return (
    <VStack className="mx-auto w-full max-w-[1280px]" gap="lg">
      {header}
      <div className={LISTING_LOT_GRID_CLASS}>{main}</div>
    </VStack>
  );
}

function lotPage(state: BiddingState) {
  const view = buildListingAuctionBidView(state);
  return lotShell(
    <>
      <ListingLotGallery images={AUCTION_LOT.images} />
      <ListingAuctionCardSidebar
        badges={AUCTION_LOT_BADGES}
        copy={AUCTION_LOT_DETAILS_COPY.sidebar}
        description={AUCTION_LOT.description}
        facts={AUCTION_LOT_FACTS}
        history={bidHistoryForState(state)}
        historyResetKey={state}
        locale={FIXTURE_SHIPPED_LOCALE}
        marketComps={view.closed ? undefined : MARKET_COMPS}
        onCommitMaximum={noop}
        onPlaceBid={noop}
        recentBidsAccessory={
          <ListingUserBidHistory
            activityTimeCopy={FIXTURE_ACTIVITY_TIME_COPY}
            copy={AUCTION_LOT_DETAILS_COPY.userBidHistory}
            locale={FIXTURE_SHIPPED_LOCALE}
            rows={userBidHistoryForState(state)}
            timeZone={FIXTURE_TIME_ZONE}
          />
        }
        timeZone={FIXTURE_TIME_ZONE}
        vaultShippingBody={AUCTION_LOT_DETAILS_COPY.vaultShippingBody}
        view={view}
      />
    </>,
    <ListingLotHeader
      auctionHref={AUCTION_LISTING_HREF}
      copy={AUCTION_LOT_DETAILS_COPY.header}
      title={AUCTION_LOT.title}
    />,
  );
}

export const Loading: Story = {
  render: () =>
    lotShell(
      <>
        {galleryLoading()}
        <VStack className="w-full" gap="lg">
          <ListingAuctionBidCardLoading />
          {lotMetaLoading()}
        </VStack>
      </>,
      <VStack className="w-full" gap="md">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-2/3" />
      </VStack>,
    ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: /^Set maximum/ })).toBeNull();
  },
};

export const PreAuction: Story = {
  render: () => lotPage("opens"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Starting bid")).toBeInTheDocument();
    expect(canvas.getByText("About this lot")).toBeInTheDocument();
    expect(canvas.getByText("Year")).toBeInTheDocument();
    expect(canvas.getByText("1997")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: /^Set maximum/ })).toBeNull();
  },
};

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        name: /Carddass/,
      }),
    ).toBeInTheDocument();
    expect(canvas.getByText("About this lot")).toBeInTheDocument();
    expect(canvas.getByText("Set your private maximum")).toBeInTheDocument();
    expect(canvas.getByText("Min. bid")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: /^Set maximum/ }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Cert number")).toBeInTheDocument();
    expect(canvas.getByText("95109007")).toBeInTheDocument();
  },
  render: () => lotPage("live-manual"),
};

export const PostSold: Story = {
  render: () => lotPage("closed-sold"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Winning bid")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: /^Set maximum/ })).toBeNull();
  },
};

export const PostWonPaymentDue: Story = {
  render: () => lotPage("closed-won-payment-due"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Continue" })).toBeVisible();
  },
};

export const PostWonSettled: Story = {
  render: () => lotPage("closed-won-settled"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/auction won/i)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Continue" })).toBeNull();
  },
};

export const PostLost: Story = {
  render: () => lotPage("closed-lost"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/did not win/i)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: /^Set maximum/ })).toBeNull();
  },
};

export const PostUnsold: Story = {
  render: () => lotPage("closed-unsold"),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Unsold").length).toBeGreaterThan(0);
  },
};
