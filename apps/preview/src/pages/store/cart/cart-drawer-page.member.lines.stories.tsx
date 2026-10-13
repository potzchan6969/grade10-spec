import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  ADJUSTED_ITEMS,
  BOOSTER_NAME,
  DELISTED_ITEMS,
  DELISTED_NAME,
  POINTS_COLLAPSED,
  READY_ITEMS,
  READY_SUBTOTAL,
  SITE_SALE_ITEMS,
  SITE_SALE_SUBTOTAL,
  SOLD_OUT_ITEMS,
} from "../cart-content";
import { CartDrawerPage, drawer } from "./cart-drawer-page";

/** The signed-in drawer's line states: sold out, adjusted, on sale, removed. */
const meta = {
  title: "Store/Cart/Screens/Cart Drawer/Member/Lines",
  component: CartDrawerPage,
  parameters: { layout: "fullscreen" },
  args: {
    items: READY_ITEMS,
    subtotal: READY_SUBTOTAL,
    estimatedTotal: READY_SUBTOTAL,
    pointsState: POINTS_COLLAPSED,
  },
} satisfies Meta<typeof CartDrawerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A line that sold out after it was added keeps its row, marked Sold Out, and leaves the count. */
export const SoldOutLine: Story = {
  args: { items: SOLD_OUT_ITEMS },
  play: () => {
    const canvas = drawer();
    expect(canvas.getByText("Sold Out")).toBeInTheDocument();
  },
};

/** The shop filled fewer than the shopper asked for: the line reads adjusted, with the warning. */
export const QuantityAdjusted: Story = {
  parameters: { journeys: ["grade10-site-store-checkout-US-02"] },
  args: {
    items: ADJUSTED_ITEMS,
    subtotal: "HK$40,400.00",
    estimatedTotal: "HK$40,400.00",
  },
  play: () => {
    const canvas = drawer();
    expect(
      canvas.getByText("Low stock. Quantity adjusted"),
    ).toBeInTheDocument();
  },
};

/** Lines on the site sale show the sale price with the list price struck through. */
export const SiteSaleOnLines: Story = {
  args: {
    items: SITE_SALE_ITEMS,
    subtotal: SITE_SALE_SUBTOTAL,
    estimatedTotal: SITE_SALE_SUBTOTAL,
  },
  play: () => {
    const canvas = drawer();
    expect(canvas.getAllByText("HK$960.00").length).toBeGreaterThan(0);
    expect(canvas.getAllByText("HK$1,200.00").length).toBeGreaterThan(0);
  },
};

/** A delisted line is cleared by the open-time read; the rest stay and one toast names it. */
export const UnavailableLinesRemoved: Story = {
  args: { items: DELISTED_ITEMS, delistOnOpen: true },
  play: async () => {
    const body = within(document.body);
    await waitFor(
      () => {
        expect(body.getByText("Items removed from cart")).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
    expect(body.queryByText(DELISTED_NAME)).not.toBeInTheDocument();
    expect(body.getByText(BOOSTER_NAME)).toBeInTheDocument();
  },
};
