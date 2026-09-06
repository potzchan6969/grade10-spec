import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  FILLED_ADDRESS,
  FILLED_PAYMENT,
  FILLED_PICKUP_ADDRESS,
  FILLED_SUMMARY,
  ORDER_DETAILS_COPY,
} from "./fixtures";
import { OrderDetailsSidebar } from "./order-details-sidebar";

const meta = {
  title: "Store Order Detail/OrderDetailsSidebar",
  component: OrderDetailsSidebar,
  tags: ["autodocs"],
  args: {
    copy: ORDER_DETAILS_COPY.sidebar,
    summary: FILLED_SUMMARY,
    payment: FILLED_PAYMENT,
    status: "shipped",
    shippingAddress: FILLED_ADDRESS,
    loyaltyPoints: (
      <>
        <span className="font-semibold">+177</span>{" "}
        <span className="text-sm font-medium text-secondary-foreground">
          pts
        </span>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="flex w-full max-w-[360px] bg-background p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OrderDetailsSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {};

export const PointsEarned: Story = {
  args: { status: "completed" },
};

export const Pickup: Story = {
  args: {
    status: "pickup",
    shippingAddress: undefined,
    pickupAddress: FILLED_PICKUP_ADDRESS,
    summary: {
      ...FILLED_SUMMARY,
      shipping: undefined,
    },
  },
};

export const ApplePay: Story = {
  args: {
    payment: { brand: "apple-pay" },
  },
};

export const GooglePay: Story = {
  args: {
    payment: { brand: "google-pay" },
  },
};

export const Mastercard: Story = {
  args: {
    payment: { brand: "mastercard", maskedNumber: "···· 4242" },
  },
};

export const Minimal: Story = {
  args: {
    summary: {
      subtotal: FILLED_SUMMARY.subtotal,
      total: FILLED_SUMMARY.total,
    },
    shippingAddress: undefined,
    loyaltyPoints: undefined,
  },
};

export const PaidTotalOnly: Story = {
  args: {
    loyaltyPoints: undefined,
    payment: undefined,
    pickupAddress: undefined,
    shippingAddress: undefined,
    summary: { total: { label: "Total", value: "HK$1,704.50" } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$1,704.50")).toBeVisible();
    expect(canvas.queryByText("Subtotal")).not.toBeInTheDocument();
    expect(canvas.queryByText("Payment Method")).not.toBeInTheDocument();
  },
};
