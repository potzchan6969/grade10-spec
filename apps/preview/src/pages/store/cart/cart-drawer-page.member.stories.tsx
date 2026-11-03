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

/** The signed-in drawer: lines, the open-time read, discounts and checkout. */
const meta = {
  title: "Store/Cart/Screens/Cart Drawer/Member",
  component: CartDrawerPage,
  tags: ["autodocs"],
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

/** Signed-in cart with two lines, one pictured, and the tender rows collapsed. */
export const Items: Story = {
  parameters: {
    verification: { caseId: "vc_138378e3-022a-46ae-a067-2f753b58b4e3" },
  },
  play: () => {
    const canvas = drawer();
    expect(canvas.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
    expect(canvas.getByText(BOOSTER_NAME)).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeEnabled();
    expect(canvas.getByRole("button", { name: /Use points/i })).toBeVisible();
  },
};

/** No lines: the design-system empty state, with no count badge and no footer. */
export const Empty: Story = {
  parameters: {
    verification: { caseId: "vc_565416fe-60cb-4c1d-a39e-9eda8887417c" },
  },
  args: { items: [], subtotal: "HK$0.00", estimatedTotal: "HK$0.00" },
  play: () => {
    const canvas = drawer();
    expect(canvas.getByText("Your cart is empty")).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Proceed to Checkout" }),
    ).not.toBeInTheDocument();
  },
};

/** Narrow viewport: the drawer takes the phone width and the lines stay readable. */
export const Narrow: Story = {
  parameters: {
    verification: { caseId: "vc_7bb346f1-6c64-446a-8c87-5f26f30f5ee0" },
  },
  globals: { viewport: { value: "mobile1" } },
  play: () => {
    const canvas = drawer();
    expect(canvas.getByText(BOOSTER_NAME)).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeEnabled();
  },
};
