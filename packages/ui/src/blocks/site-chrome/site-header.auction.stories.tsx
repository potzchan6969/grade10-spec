import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SiteHeader } from "./site-header";
import {
  ACCOUNT_EMAIL,
  SITE_HEADER_BASE_ARGS,
} from "./site-header.story-shared";

const meta = {
  title: "Site Chrome/SiteHeader/Auction first",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    ...SITE_HEADER_BASE_ARGS,
    session: "signed-out",
    onLocaleChange: fn(),
    onSignIn: fn(),
    onMyAuctions: fn(),
    onSignOut: fn(),
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Language switch, primary Sign In, no Store, no cart. */
export const SignedOut: Story = {
  name: "Signed out",
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Account" })).toBeNull();
    expect(canvas.queryByRole("button", { name: "Cart" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "Store" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "Store Locator" })).toBeNull();
    const auction = canvas.getByRole("link", { name: "Auction" });
    expect(auction).toHaveAttribute("aria-current", "page");
    const help = canvas.getByRole("link", { name: "Help" });
    expect(
      auction.compareDocumentPosition(help) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(help).toHaveAttribute("href", "https://grade10.mintlify.io/");
    expect(help).toHaveAttribute("target", "_blank");
    expect(help).toHaveAttribute("rel", "noopener noreferrer");
    await userEvent.click(canvas.getByRole("button", { name: "Sign In" }));
    expect(args.onSignIn).toHaveBeenCalled();
  },
};

/** Account icon in the bar; no Cart, Store, or Store Locator yet. */
export const SignedIn: Story = {
  name: "Signed in",
  args: { session: "signed-in" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Account" })).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Sign In" })).toBeNull();
    expect(canvas.queryByRole("button", { name: "Cart" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "Store" })).toBeNull();
    expect(canvas.queryByRole("link", { name: "Store Locator" })).toBeNull();
  },
};

/**
 * Auction-launch account menu: email initial, sign-in email, My Auctions,
 * Sign Out. No Profile, My Orders, Membership, Cart, or My Auction Orders —
 * winners reach orders from My Auctions.
 */
export const AccountMenu: Story = {
  name: "Account menu open",
  args: { session: "signed-in", accountMenuDefaultOpen: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("button", { name: "Account" });
    expect(canvas.queryByRole("button", { name: /Cart/ })).toBeNull();
    const body = within(canvasElement.ownerDocument.body);
    expect(body.getByText(ACCOUNT_EMAIL)).toBeInTheDocument();
    expect(
      canvasElement.ownerDocument.body.querySelector(
        '[data-slot="avatar-fallback"]',
      ),
    ).toHaveTextContent("C");
    const items = await body.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "My Auctions",
      "Sign Out",
    ]);
    expect(body.queryByRole("menuitem", { name: "Profile" })).toBeNull();
    expect(body.queryByRole("menuitem", { name: "My Orders" })).toBeNull();
    expect(body.queryByRole("menuitem", { name: "Membership" })).toBeNull();
    expect(
      body.queryByRole("menuitem", { name: "My Auction Orders" }),
    ).toBeNull();
    await userEvent.click(body.getByRole("menuitem", { name: "My Auctions" }));
    expect(args.onMyAuctions).toHaveBeenCalledTimes(1);
    expect(args.onSignOut).not.toHaveBeenCalled();
    // Leave the menu open — layout SoT for the auction-launch account menu.
    await userEvent.click(canvas.getByRole("button", { name: "Account" }));
    expect(await body.findByText(ACCOUNT_EMAIL)).toBeInTheDocument();
    expect(
      body.getByRole("menuitem", { name: "My Auctions" }),
    ).toBeInTheDocument();
  },
};
