import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  FILLED_ADDRESS,
  FILLED_PAYMENT,
  FILLED_PICKUP_ADDRESS,
  FILLED_SUMMARY,
  FILLED_SUMMARY_ORDER_DISCOUNT,
  FILLED_SUMMARY_WITH_POINTS,
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

/** Points bill-credit after Discount — label includes points deducted. */
export const WithPointsCredit: Story = {
  args: {
    summary: FILLED_SUMMARY_WITH_POINTS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Discount (WELCOME10)")).toBeVisible();
    expect(canvas.getByText("Points (100 pts)")).toBeVisible();
    expect(canvas.getByText("−HK$100")).toBeVisible();
    expect(canvas.getByText("HK$1,438")).toBeVisible();
  },
};

/** Order promo without points — Points credit row stays omitted. */
export const WithoutPointsCredit: Story = {
  args: {
    summary: FILLED_SUMMARY_ORDER_DISCOUNT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Discount (WELCOME10)")).toBeVisible();
    expect(canvas.queryByText(/Points \(\d+ pts\)/)).not.toBeInTheDocument();
    expect(canvas.getByText("HK$1,538")).toBeVisible();
  },
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

/** Card brand + masked number — wallet pays still use Visa/Mastercard + number. */
export const Mastercard: Story = {
  args: {
    payment: { brand: "mastercard", maskedNumber: "···· 4242" },
  },
};

/** Address lines stay useful when the recipient name is unavailable. */
export const PartialAddress: Story = {
  args: {
    shippingAddress: {
      lines: ["Flat 12B, Tower 3", "Wan Chai, Hong Kong"],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Flat 12B, Tower 3")).toBeVisible();
    expect(canvas.getByText("Wan Chai, Hong Kong")).toBeVisible();
  },
};

/** An unrecognized provider stays text-only instead of receiving a guessed logo. */
export const UnrecognizedPayment: Story = {
  args: {
    payment: { label: "UnionPay", maskedNumber: "···· 5678" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("UnionPay")).toBeVisible();
    expect(canvas.getByText("···· 5678")).toBeVisible();
    expect(canvas.queryByRole("img")).not.toBeInTheDocument();
  },
};

/** A wallet name remains associated with its device-account mask. */
export const WalletPayment: Story = {
  args: {
    payment: { label: "Apple Pay", maskedNumber: "···· 1234" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Apple Pay")).toBeVisible();
    expect(canvas.getByText("···· 1234")).toBeVisible();
  },
};

/** An empty payment object leaves no empty Payment Method section behind. */
export const EmptyPayment: Story = {
  args: {
    payment: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Payment Method")).not.toBeInTheDocument();
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
    // Sole summary section must not stack a divider under the Card edge.
    const sidebar = canvasElement.querySelector(
      '[data-slot="order-details-sidebar"]',
    );
    expect(sidebar).not.toBeNull();
    const summaryBlock = sidebar?.querySelector(".border-b");
    expect(summaryBlock).toBeNull();
    expect(sidebar?.querySelector("hr")).toBeNull();
  },
};
