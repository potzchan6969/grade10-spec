import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  FeaturedAuctionsBanner,
  type FeaturedAuctionsBannerCopy,
  type FeaturedAuctionsBannerSlide,
} from "./featured-auctions-banner";

const COPY: FeaturedAuctionsBannerCopy = {
  active: "LIVE BIDDING",
  upcoming: "UPCOMING",
  ended: "ENDED",
  currentBid: "CURRENT BID",
  startingBid: "STARTING BID",
  finalBid: "FINAL BID",
  bidNow: "Bid Now",
  viewAuction: "View Auction",
  endsIn: "Ends in",
  opensIn: "Opens in",
  endedAt: "Ended",
  progress: "Featured lots",
  slide: "Show featured lot {position}: {title}",
};

const SLAB =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800">
      <rect width="100%" height="100%" fill="#5c4033"/>
      <text x="50%" y="50%" text-anchor="middle" fill="#f4f0ea" font-size="28" font-family="system-ui">Lot</text>
    </svg>`,
  );

const CLOSE_MS = Date.now() + 2 * 24 * 60 * 60 * 1000;
const OPEN_MS = Date.now() + 5 * 24 * 60 * 60 * 1000;

const SLIDES: FeaturedAuctionsBannerSlide[] = [
  {
    id: "carddass-checklist",
    title: "1997 Pocket Monsters Carddass Checklist, PSA 10",
    status: "active",
    imageSrc: SLAB,
    href: "https://grade10.com/auction/listings/carddass-checklist",
    currentBidMinor: 8_216_000,
    currency: "HKD",
    bidCountLabel: "12 bids",
    countdown: { kind: "ends", atMs: CLOSE_MS },
  },
  {
    id: "63261275",
    title: "1997 Pocket Monsters Carddass 000 Bandai Starters, PSA 10",
    status: "active",
    imageSrc: SLAB,
    href: "https://grade10.com/auction/listings/63261275",
    currentBidMinor: 14_706_400,
    currency: "HKD",
    bidCountLabel: "18 bids",
    countdown: { kind: "ends", atMs: CLOSE_MS + 86_400_000 },
  },
  {
    id: "mew-upcoming",
    title: "2025 Pokemon Simplified Chinese Mew Ex, PSA 10",
    status: "upcoming",
    imageSrc: SLAB,
    href: "https://grade10.com/auction/listings/mew-upcoming",
    currentBidMinor: 36_505_723,
    currency: "HKD",
    bidCountLabel: "0 bids",
    countdown: { kind: "opens", atMs: OPEN_MS },
  },
];

const meta = {
  title: "Auction Listing/FeaturedAuctionsBanner",
  component: FeaturedAuctionsBanner,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    copy: COPY,
    slides: SLIDES,
    locale: "en",
  },
} satisfies Meta<typeof FeaturedAuctionsBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two or three slides with progress (SC-31, SC-34, SC-35). */
export const ThreeSlides: Story = {
  name: "Three slides",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: SLIDES[0].title,
      }),
    ).toBeInTheDocument();
    expect(canvas.getByText("LIVE BIDDING")).toBeInTheDocument();
    expect(canvas.getByText("CURRENT BID")).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: /Bid Now/i })).toHaveAttribute(
      "href",
      SLIDES[0].href,
    );
    expect(
      canvas.getByRole("navigation", { name: "Featured lots" }),
    ).toBeInTheDocument();

    const second = canvas.getByRole("button", {
      name: `Show featured lot 2: ${SLIDES[1].title}`,
    });
    await userEvent.click(second);
    await waitFor(() => {
      expect(second).toHaveAttribute("aria-current", "true");
    });
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: SLIDES[1].title,
      }),
    ).toBeInTheDocument();
  },
};

/** One Featured slide needs no multi-dot advance (SC-36). */
export const OneSlide: Story = {
  name: "One slide",
  args: { slides: [SLIDES[0]] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: SLIDES[0].title,
      }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("navigation", { name: "Featured lots" }),
    ).not.toBeInTheDocument();
    expect(canvas.getByRole("link", { name: /Bid Now/i })).toBeInTheDocument();
  },
};

/** Upcoming slide counts down to open (SC-33, SC-58). */
export const UpcomingSlide: Story = {
  name: "Upcoming slide",
  args: { slides: [SLIDES[2]] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("UPCOMING")).toBeInTheDocument();
    expect(canvas.getByText("STARTING BID")).toBeInTheDocument();
    const clock = canvas.getByRole("time");
    expect(clock).toHaveTextContent(/Opens in/);
    expect(canvas.getByRole("link", { name: /View Auction/i })).toHaveAttribute(
      "href",
      SLIDES[2].href,
    );
    expect(canvas.queryByRole("link", { name: /Bid Now/i })).toBeNull();
  },
};

/** Current bid rolls when the served amount changes (SC-32). */
function RollingBidDemo() {
  const [minor, setMinor] = useState(8_216_000);
  const slide: FeaturedAuctionsBannerSlide = {
    ...SLIDES[0],
    currentBidMinor: minor,
  };
  return (
    <div className="flex flex-col gap-4">
      <FeaturedAuctionsBanner copy={COPY} slides={[slide]} />
      <button
        className="self-start rounded-md border border-border px-3 py-2 text-sm"
        onClick={() => setMinor((value) => value + 50_000)}
        type="button"
      >
        Raise bid
      </button>
    </div>
  );
}

export const RollingBid: Story = {
  name: "Rolling bid",
  render: () => <RollingBidDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/82,160/)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Raise bid" }));
    await waitFor(() => {
      expect(canvas.getByText(/82,660/)).toBeInTheDocument();
    });
  },
};
