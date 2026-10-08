import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AUCTION_RESTRICTED_COPY } from "./auction-restricted-content";
import { AuctionRestrictedPage } from "./auction-restricted-page";

/**
 * The auction restriction surface: chrome with every auction entry point
 * removed, static catalog copy, and Browse the Store. Words match the
 * planned `@grade10/i18n` shared `auctionAvailability` keys.
 */
const meta = {
  title: "Pages/Auction Restricted",
  component: AuctionRestrictedPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    onBrowseStore: fn(),
  },
} satisfies Meta<typeof AuctionRestrictedPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: AUCTION_RESTRICTED_COPY.title,
      }),
    ).toBeVisible();
    expect(
      canvas.getByText(AUCTION_RESTRICTED_COPY.description),
    ).toBeVisible();
    const browseStore = canvas.getByRole("button", {
      name: AUCTION_RESTRICTED_COPY.browseStore,
    });
    expect(browseStore).toBeVisible();
    await userEvent.click(browseStore);
    expect(args.onBrowseStore).toHaveBeenCalledOnce();
    expect(
      canvas.queryByRole("link", { name: "Auction" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /my auctions/i }),
    ).not.toBeInTheDocument();
  },
};
