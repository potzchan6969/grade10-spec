import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { SiteHeader } from "./site-header";
import { AUCTION_STORE_BASE_ARGS } from "./site-header.auction-store.story-shared";
import { ACCOUNT_EMAIL } from "./site-header.story-shared";

const meta = {
  title: "Site Chrome/SiteHeader/Auction & Store/Account menu",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    ...AUCTION_STORE_BASE_ARGS,
    session: "signed-in",
    accountMenuDefaultOpen: true,
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * My Orders, My Auctions, Membership (destination TBC), Sign Out. Cart in the
 * bar. No Profile. Auction-launch menu SoT lives under Auction first.
 */
export const Open: Story = {
  name: "Open",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("button", { name: "Account" });
    expect(canvas.getByRole("button", { name: "Cart" })).toBeInTheDocument();
    const body = within(canvasElement.ownerDocument.body);
    expect(body.getByText(ACCOUNT_EMAIL)).toBeInTheDocument();
    expect(
      canvasElement.ownerDocument.body.querySelector(
        '[data-slot="avatar-fallback"]',
      ),
    ).toHaveTextContent("C");
    const items = await body.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "My Orders",
      "My Auctions",
      "Membership",
      "Sign Out",
    ]);
    expect(body.queryByRole("menuitem", { name: "Profile" })).toBeNull();
    await userEvent.click(body.getByRole("menuitem", { name: "Membership" }));
    expect(args.onMembership).toHaveBeenCalledTimes(1);
    expect(args.onMyOrders).not.toHaveBeenCalled();
    expect(args.onMyAuctions).not.toHaveBeenCalled();
    expect(args.onSignOut).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Account" }));
    expect(await body.findByText(ACCOUNT_EMAIL)).toBeInTheDocument();
    expect(
      body.getByRole("menuitem", { name: "Membership" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Cart" })).toBeInTheDocument();
  },
};
