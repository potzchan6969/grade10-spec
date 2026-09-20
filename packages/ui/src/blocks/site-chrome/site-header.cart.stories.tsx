import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SiteHeader } from "./site-header";
import { SITE_HEADER_BASE_ARGS } from "./site-header.story-shared";

/** Workbench Store Locator page — keep in sync with preview `STORE_LOCATOR_HREF`. */
const STORE_LOCATOR_HREF = "?path=/story/pages-store-locator-page--default";

const STORE_NAV_ITEMS = [
  { label: "Store", href: "#store", current: true },
  { label: "Auction", href: "#auction" },
  { label: "Store Locator", href: STORE_LOCATOR_HREF },
  {
    label: "Help",
    href: "https://grade10.mintlify.io/",
    external: true,
  },
];

const meta = {
  title: "Site Chrome/SiteHeader/Cart",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    ...SITE_HEADER_BASE_ARGS,
    copy: { ...SITE_HEADER_BASE_ARGS.copy, cart: "Cart" },
    navItems: STORE_NAV_ITEMS,
    session: "signed-out",
    onLocaleChange: fn(),
    onCartClick: fn(),
    onSignIn: fn(),
    onProfile: fn(),
    onMyOrders: fn(),
    onMyAuctions: fn(),
    onSignOut: fn(),
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

function cartBadge(canvasElement: HTMLElement) {
  const cart = within(canvasElement).getByRole("button", {
    name: /Cart/,
  });
  return cart.parentElement?.querySelector(
    '[data-slot="status-indicator"][data-type="count"]',
  );
}

/**
 * Empty cart — cart control present, count badge hidden.
 * Signed-out is valid here: Grade10 has no guest checkout, so a signed-out
 * shopper never has lines; an empty cart control may still show.
 */
export const EmptyCart: Story = {
  name: "Empty cart — no badge",
  args: { cartItemCount: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Cart" })).toBeInTheDocument();
    expect(cartBadge(canvasElement)).toBeNull();
  },
};

/**
 * One active line — brand count indicator shows `1`.
 * Signed in: cart lines require a session (no guest checkout).
 */
export const OneItem: Story = {
  name: "One item",
  args: { session: "signed-in", cartItemCount: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Account" })).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Sign In" })).toBeNull();
    expect(
      canvas.getByRole("button", { name: "Cart (1)" }),
    ).toBeInTheDocument();
    const badge = cartBadge(canvasElement);
    expect(badge).not.toBeNull();
    expect(badge).toHaveTextContent("1");
  },
};

/**
 * Several active lines — same full count the drawer title badge would show.
 * Signed in: cart lines require a session (no guest checkout).
 */
export const MultiItem: Story = {
  name: "Multi-item",
  args: { session: "signed-in", cartItemCount: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Account" })).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Cart (3)" }),
    ).toBeInTheDocument();
    expect(cartBadge(canvasElement)).toHaveTextContent("3");
  },
};

/**
 * Large count — StatusIndicator grows with the digits; SiteHeader does not
 * truncate (matches the cart drawer title badge).
 * Signed in: cart lines require a session (no guest checkout).
 */
export const LargeCount: Story = {
  name: "Large count",
  args: { session: "signed-in", cartItemCount: 12 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Account" })).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Cart (12)" }),
    ).toBeInTheDocument();
    expect(cartBadge(canvasElement)).toHaveTextContent("12");
  },
};

/**
 * Count omitted — same as empty: no badge.
 * Signed-out is valid: no lines, so no badge.
 */
export const CountOmitted: Story = {
  name: "Count omitted — no badge",
  args: { cartItemCount: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    expect(cartBadge(canvasElement)).toBeNull();
  },
};

/**
 * Post-store: Cart stays on Auction (and every other surface) so checkout
 * stays one tap away. Same primary-nav order as Store surfaces (Store,
 * Auction, Store Locator, Help); Auction is current. Auction-first stories
 * omit the cart handler until Store answers the cart drawer.
 */
export const OnAuctionSurface: Story = {
  name: "On auction surface (post-store)",
  args: {
    session: "signed-in",
    cartItemCount: 2,
    navItems: [
      { label: "Store", href: "#store" },
      { label: "Auction", href: "#auction", current: true },
      { label: "Store Locator", href: STORE_LOCATOR_HREF },
      {
        label: "Help",
        href: "https://grade10.mintlify.io/",
        external: true,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: "Store" })).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Auction" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const storeLocator = canvas.getByRole("link", { name: "Store Locator" });
    const help = canvas.getByRole("link", { name: "Help" });
    expect(
      storeLocator.compareDocumentPosition(help) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      canvas.getByRole("button", { name: "Cart (2)" }),
    ).toBeInTheDocument();
    expect(cartBadge(canvasElement)).toHaveTextContent("2");
  },
};

/**
 * Post-store: My Orders joins the menu once its handler is supplied, between
 * Profile and My Auctions. Activating it invokes exactly its own handler.
 */
export const AccountMenu: Story = {
  name: "Account menu open (post-store)",
  args: { session: "signed-in", accountMenuDefaultOpen: true },
  play: async ({ canvasElement, args }) => {
    const body = within(canvasElement.ownerDocument.body);
    const items = await body.findAllByRole("menuitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Profile",
      "My Orders",
      "My Auctions",
      "Sign out",
    ]);

    await userEvent.click(body.getByRole("menuitem", { name: "My Orders" }));

    expect(args.onMyOrders).toHaveBeenCalledTimes(1);
    expect(args.onProfile).not.toHaveBeenCalled();
    expect(args.onMyAuctions).not.toHaveBeenCalled();
    expect(args.onSignOut).not.toHaveBeenCalled();
  },
};
