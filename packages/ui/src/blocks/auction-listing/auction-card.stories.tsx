import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  formatListingClosed,
  formatListingEnds,
} from "../../lib/format-datetime";
import { formatMoney } from "../../lib/format-money";
import { AuctionCard } from "./auction-card";

const IMAGE = new URL(
  "../store-product-listing/product-card.fixture.png",
  import.meta.url,
).href;

const LOT = "1999 Base Set Charizard PSA 10";
const CLOSES_AT = Date.UTC(2026, 8, 24, 18, 0);
const CURRENCY = "HKD";
const LOCALE = "en" as const;

const copy = {
  live: "Live",
  endingSoon: "Ending soon",
  watch: {
    watch: "Watch",
    watching: "Watching",
    watchAriaLabel: "Watch this lot",
    unwatchAriaLabel: "Unwatch this lot",
  },
};

const price = (minor: number) =>
  formatMoney(minor, CURRENCY, { locale: LOCALE });

const ends = formatListingEnds(CLOSES_AT, LOCALE);
const closedLine = formatListingClosed(CLOSES_AT, LOCALE);

const defaults = {
  copy,
  name: LOT,
  imageSrc: IMAGE,
  imageAlt: "1999 Base Set Charizard, front",
  currentBidMinor: 5_800_000,
  currency: CURRENCY,
  priceLabel: "Current bid",
  bidCountLabel: "14 bids",
  when: { kind: "ends" as const, at: CLOSES_AT },
  locale: LOCALE,
  live: "open" as const,
  onClick: fn(),
  onWatchToggle: fn(),
};

const meta = {
  title: "Auction Listing/AuctionCard",
  component: AuctionCard,
  tags: ["autodocs"],
  args: defaults,
  decorators: [
    (Story) => (
      <>
        <Toast position="bottom-right" />
        <div className="w-[260px]">
          <Story />
        </div>
      </>
    ),
  ],
} satisfies Meta<typeof AuctionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Live lot with bids, the current price, and watch. */
export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Current bid")).toBeInTheDocument();
    expect(canvas.getByText(price(args.currentBidMinor))).toBeInTheDocument();
    expect(canvas.getByText("14 bids")).toBeInTheDocument();
    expect(canvas.getByText(ends)).toBeInTheDocument();
    expect(canvas.getByLabelText("Live")).toBeInTheDocument();
    const openers = canvas.getAllByRole("button", { name: LOT });
    expect(openers).toHaveLength(2);
    await userEvent.click(openers[1]);
    expect(args.onClick).toHaveBeenCalled();
    await userEvent.click(
      canvas.getByRole("button", { name: "Watch this lot" }),
    );
    expect(args.onWatchToggle).toHaveBeenCalled();
  },
};

/** No bids yet. The caption is the consumer's "Starting bid". */
export const LiveNoBids: Story = {
  args: {
    currentBidMinor: 100_000,
    priceLabel: "Starting bid",
    bidCountLabel: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Starting bid")).toBeInTheDocument();
    expect(canvas.getByText(price(100_000))).toBeInTheDocument();
    expect(canvas.queryByText(/bids/)).not.toBeInTheDocument();
    expect(canvas.getByText(ends)).toBeInTheDocument();
  },
};

/** Last minutes: warning badge and the error pip. */
export const EndingSoon: Story = {
  args: {
    live: "last-minutes",
    badges: [{ label: "Ending soon", variant: "warning" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Ending soon")).toBeInTheDocument();
    expect(canvas.getByLabelText("Ending soon")).toHaveAttribute(
      "data-variant",
      "error",
    );
  },
};

/** The collector is already watching. */
export const Watching: Story = {
  args: { watched: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Unwatch this lot" }),
    ).toHaveAttribute("aria-pressed", "true");
  },
};

/** A grade mark on the photo. The tile does not read the cert. */
export const Graded: Story = {
  args: {
    badges: [{ label: "PSA 10", variant: "outline" }],
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText("PSA 10")).toBeInTheDocument();
  },
};

/** A featured lot uses the brand badge. */
export const Featured: Story = {
  args: {
    badges: [{ label: "Featured", variant: "brand" }],
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText("Featured")).toBeInTheDocument();
  },
};

/** Closed lot: outline badge, muted photo, no watch control. */
export const Closed: Story = {
  args: {
    closed: true,
    live: undefined,
    badges: [{ label: "Ended", variant: "outline" }],
    when: { kind: "closed", at: CLOSES_AT },
    onWatchToggle: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Ended")).toBeInTheDocument();
    expect(canvas.getByText(closedLine)).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: /watch/i })).toBeNull();
    expect(canvasElement.querySelector("img")).toHaveClass("opacity-50");
    expect(canvas.getAllByRole("button", { name: LOT })).toHaveLength(2);
  },
};

/** Unsold close. Same muted photo, the consumer's own badge. */
export const Unsold: Story = {
  args: {
    closed: true,
    live: undefined,
    priceLabel: "Starting bid",
    bidCountLabel: undefined,
    badges: [{ label: "Unsold", variant: "outline" }],
    when: { kind: "closed", at: CLOSES_AT },
    onWatchToggle: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Unsold")).toBeInTheDocument();
    expect(canvasElement.querySelector("img")).toHaveClass("opacity-50");
  },
};

/** Extended bidding stays live. The badge is supplied, the clock does not tick. */
export const ExtendedBidding: Story = {
  args: {
    badges: [{ label: "Extended", variant: "warning" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Extended")).toBeInTheDocument();
    expect(canvas.getByLabelText("Live")).toHaveAttribute(
      "data-variant",
      "brand",
    );
    expect(canvas.getByText(ends)).toBeInTheDocument();
  },
};
