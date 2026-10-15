import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import {
  BOOSTER_NAME,
  POINTS_COLLAPSED,
  READY_ITEMS,
  READY_SUBTOTAL,
} from "../cart-content";
import { CartDrawerPage } from "./cart-drawer-page";
import { drawer } from "./cart-drawer-page.test-helpers";

/** The signed-out drawer: guest checkout and the sign-in line. */
const meta = {
  title: "Store/Cart/Screens/Cart Drawer/Guest",
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

/** Signed-out drawer: guest checkout first, a quiet sign-in line, public codes
 * and no points or member codes. Checkout continues to Order Confirmed. */
export const Guest: Story = {
  args: { guest: true },
  parameters: {
    journeys: ["g10.store-cart-drawer.US10", "g10.store-cart-drawer.US11"],
  },
  play: () => {
    const canvas = drawer();
    expect(canvas.getByText(BOOSTER_NAME)).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Check Out as Guest" }),
    ).toBeEnabled();
    expect(canvas.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(canvas.getByText("for points and rewards")).toBeInTheDocument();
    expect(canvas.queryByText("Use points")).not.toBeInTheDocument();
  },
};
