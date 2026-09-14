import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { SiteHeader } from "./site-header";
import { SITE_HEADER_BASE_ARGS } from "./site-header.story-shared";

/** Workbench Store Locator page — keep in sync with preview `STORE_LOCATOR_HREF`. */
const STORE_LOCATOR_HREF = "?path=/story/pages-store-locator-page--default";

const STORE_NAV_ITEMS = [
  { label: "Store", href: "#store", current: true },
  { label: "Auction", href: "#auction" },
  { label: "Store Locator", href: STORE_LOCATOR_HREF },
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

/** Empty cart — cart control present, count badge hidden. */
export const EmptyCart: Story = {
  name: "Empty cart — no badge",
  args: { cartItemCount: 0 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Cart" })).toBeInTheDocument();
    expect(cartBadge(canvasElement)).toBeNull();
  },
};

/** One active line — brand count indicator shows `1`. */
export const OneItem: Story = {
  name: "One item",
  args: { cartItemCount: 1 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Cart (1)" }),
    ).toBeInTheDocument();
    const badge = cartBadge(canvasElement);
    expect(badge).not.toBeNull();
    expect(badge).toHaveTextContent("1");
  },
};

/** Several active lines — same full count the drawer title badge would show. */
export const MultiItem: Story = {
  name: "Multi-item",
  args: { cartItemCount: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Cart (3)" }),
    ).toBeInTheDocument();
    expect(cartBadge(canvasElement)).toHaveTextContent("3");
  },
};

/**
 * Large count — StatusIndicator grows with the digits; SiteHeader does not
 * truncate (matches the cart drawer title badge).
 */
export const LargeCount: Story = {
  name: "Large count",
  args: { cartItemCount: 12 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Cart (12)" }),
    ).toBeInTheDocument();
    expect(cartBadge(canvasElement)).toHaveTextContent("12");
  },
};

/** Count omitted — same as empty: no badge. */
export const CountOmitted: Story = {
  name: "Count omitted — no badge",
  args: { cartItemCount: undefined },
  play: async ({ canvasElement }) => {
    expect(cartBadge(canvasElement)).toBeNull();
  },
};
