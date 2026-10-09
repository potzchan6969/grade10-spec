import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
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
 * My Orders, My Auctions, Sign Out. Cart in the bar. No Profile, and no
 * Membership, which no site supplies yet. Auction-launch menu SoT lives
 * under Auction first.
 */
export const Open: Story = {
  name: "Open",
  args: { onMembership: undefined },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("button", { name: "Account" });
    expect(canvas.getByRole("button", { name: "Cart" })).toBeInTheDocument();
    const body = within(canvasElement.ownerDocument.body);
    const label = body.getByText(ACCOUNT_EMAIL);
    const avatar = canvasElement.ownerDocument.body.querySelector(
      '[data-slot="avatar-fallback"]',
    );
    expect(avatar).toHaveTextContent("C");
    expect(label.firstElementChild).toContainElement(avatar as HTMLElement);
    expect(label.lastChild?.textContent).toBe(ACCOUNT_EMAIL);
    const items = await body.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "My Orders",
      "My Auctions",
      "Sign Out",
    ]);
    await userEvent.click(body.getByRole("menuitem", { name: "My Orders" }));
    expect(args.onMyOrders).toHaveBeenCalledTimes(1);
    expect(args.onMyAuctions).not.toHaveBeenCalled();
    expect(args.onSignOut).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Account" }));
    expect(await body.findByText(ACCOUNT_EMAIL)).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Cart" })).toBeInTheDocument();
  },
};

/**
 * Every handler supplied: the account menu's whole fixed order - Profile,
 * My Orders, My Auctions, Membership, Sign Out - and nothing else.
 */
export const WithProfile: Story = {
  name: "Open, with Profile",
  args: { onProfile: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("button", { name: "Account" });
    const body = within(canvasElement.ownerDocument.body);
    const items = await body.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Profile",
      "My Orders",
      "My Auctions",
      "Membership",
      "Sign Out",
    ]);
    await userEvent.click(body.getByRole("menuitem", { name: "Membership" }));
    expect(args.onMembership).toHaveBeenCalledTimes(1);
    expect(args.onProfile).not.toHaveBeenCalled();
    expect(args.onMyOrders).not.toHaveBeenCalled();
    expect(args.onMyAuctions).not.toHaveBeenCalled();
    expect(args.onSignOut).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Account" }));
    expect(
      await body.findByRole("menuitem", { name: "Membership" }),
    ).toBeInTheDocument();
  },
};

/** No sign-in email: the account label alone, with no avatar. */
export const WithoutEmail: Story = {
  name: "Open, without email",
  args: { accountEmail: undefined },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("button", { name: "Account" });
    const body = within(canvasElement.ownerDocument.body);
    expect(
      await body.findByText(args.copy.accountMenuLabel),
    ).toBeInTheDocument();
    expect(
      canvasElement.ownerDocument.body.querySelector('[data-slot="avatar"]'),
    ).toBeNull();
  },
};
