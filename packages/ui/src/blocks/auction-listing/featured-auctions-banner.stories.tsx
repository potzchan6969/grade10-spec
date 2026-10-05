import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  FeaturedAuctionsBanner,
  type FeaturedAuctionsBannerCopy,
  type FeaturedAuctionsBannerSlide,
} from "./featured-auctions-banner";

const { auction } = getMessages("grade10", "en");

const COPY: FeaturedAuctionsBannerCopy = auction.featured;

/**
 * Story fixture for the front page stage. Production uploads target
 * 2400×1500 (8:5) with the subject centred; this file is a lighter stand-in
 * at the same ratio.
 */
const FRONT_PAGE = new URL(
  "./featured-auctions-banner-stage.fixture.jpg",
  import.meta.url,
).href;

const CLOSE_MS = Date.now() + 2 * 24 * 60 * 60 * 1000;
const OPEN_MS = Date.now() + 5 * 24 * 60 * 60 * 1000;

const SLIDES: FeaturedAuctionsBannerSlide[] = [
  {
    id: "carddass-checklist",
    title: "1997 Pocket Monsters Carddass Checklist, PSA 10",
    status: "active",
    imageSrc: FRONT_PAGE,
    imageAlt:
      "Front page image for 1997 Pocket Monsters Carddass Checklist, PSA 10",
    href: "https://grade10.com/auction/listings/carddass-checklist",
    currentBidMinor: 8_216_000,
    currency: "HKD",
    countdown: { kind: "ends", atMs: CLOSE_MS },
  },
  {
    id: "63261275",
    title: "1997 Pocket Monsters Carddass 000 Bandai Starters, PSA 10",
    status: "active",
    imageSrc: FRONT_PAGE,
    imageAlt:
      "Front page image for 1997 Pocket Monsters Carddass 000 Bandai Starters, PSA 10",
    href: "https://grade10.com/auction/listings/63261275",
    currentBidMinor: 14_706_400,
    currency: "HKD",
    countdown: { kind: "ends", atMs: CLOSE_MS + 86_400_000 },
  },
  {
    id: "mew-upcoming",
    title: "2025 Pokemon Simplified Chinese Mew Ex, PSA 10",
    status: "upcoming",
    imageSrc: FRONT_PAGE,
    imageAlt:
      "Front page image for 2025 Pokemon Simplified Chinese Mew Ex, PSA 10",
    href: "https://grade10.com/auction/listings/mew-upcoming",
    currentBidMinor: 36_505_723,
    currency: "HKD",
    countdown: { kind: "opens", atMs: OPEN_MS },
  },
];

/**
 * Featured carousel contract stories. The quiet All auctions grid lives under
 * Auction List/All Auctions. Full page chrome (Featured + All auctions) lives
 * under Pages/Auction/Auction List → Default. Earlier row/pair explorations live under
 * Featured Auctions/Archived.
 */
const meta = {
  title: "Auction List/Featured Auctions",
  component: FeaturedAuctionsBanner,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Stage image uses `object-cover object-center`. Operator canvas: 2400×1500 (8:5), subject centred. Below `md` the stage is `aspect-[8/5]` full-bleed with previous/next chevrons, swipe, and horizontal page motion; copy slides stack so the band height is the tallest slide (no title-length jump), the end clock sits beside the CTA, and progress sits under the stack with extra top pad, left-aligned. From `md` the band is a 600px side-by-side row with a crossfade stage. Optional `imageSrcSet` / `imageSizes`; default sizes `(min-width: 768px) 66vw, 100vw`.",
      },
    },
  },
  args: {
    copy: COPY,
    slides: SLIDES,
    locale: "en",
  },
} satisfies Meta<typeof FeaturedAuctionsBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default — two or three slides with progress (SC-31, SC-34, SC-35). */
export const CarouselBanner: Story = {
  name: "Carousel banner",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const stage = canvas.getByRole("img", {
      name: SLIDES[0].imageAlt ?? "",
    });
    expect(stage).toHaveAttribute("sizes", "(min-width: 768px) 66vw, 100vw");
    expect(stage).toHaveAttribute("fetchpriority", "high");
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: SLIDES[0].title,
      }),
    ).toBeInTheDocument();
    // Stacked slides keep inactive copy in the DOM (crossfade); match any.
    expect(canvas.getAllByText("LIVE BIDDING").length).toBeGreaterThan(0);
    expect(canvas.getAllByText("CURRENT BID").length).toBeGreaterThan(0);
    expect(canvas.getByRole("link", { name: /Bid Now/i })).toHaveAttribute(
      "href",
      SLIDES[0].href,
    );
    expect(
      canvas.getByRole("navigation", { name: "Featured lots" }),
    ).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[aria-label="Previous featured lot"]'),
    ).not.toBeNull();
    expect(
      canvasElement.querySelector('[aria-label="Next featured lot"]'),
    ).not.toBeNull();

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
  name: "Live bidding",
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
    expect(
      canvasElement.querySelector('[aria-label="Previous featured lot"]'),
    ).toBeNull();
    expect(canvas.getByRole("link", { name: /Bid Now/i })).toBeInTheDocument();
  },
};

/** Upcoming slide counts down to open (SC-33, SC-58). */
export const Upcoming: Story = {
  name: "Upcoming",
  args: { slides: [SLIDES[2]] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("UPCOMING")).toBeInTheDocument();
    expect(canvas.queryByText("STARTING BID")).toBeNull();
    expect(canvas.queryByText(/HK\$/)).toBeNull();
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
