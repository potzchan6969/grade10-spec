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
  title: "Store/Order Detail/Blocks/OrderDetailsSidebar",
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

export const Full: Story = {
  parameters: {
    verification: { caseId: "vc_ce17c72a-f3da-4c5e-af0d-8fe91b7ab38d" },
  },
};

export const PointsEarned: Story = {
  parameters: {
    verification: { caseId: "vc_d826eab9-081b-482b-a352-d0e09fa7f835" },
  },
  args: { status: "completed" },
};

/** Points bill-credit after Discount — label includes points deducted. */
export const WithPointsCredit: Story = {
  parameters: {
    verification: { caseId: "vc_96c13262-aa3a-4af9-8e1c-2df24446bcaa" },
  },
  args: {
    summary: FILLED_SUMMARY_WITH_POINTS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Discount (WELCOME10)")).toBeVisible();
    expect(canvas.getByText("Points (100 pts)")).toBeVisible();
    expect(canvas.getByText("−$100.00")).toBeVisible();
    expect(canvas.getByText("HK$1,438.00")).toBeVisible();
  },
};

/** Order promo without points — Points credit row stays omitted. */
export const WithoutPointsCredit: Story = {
  parameters: {
    verification: { caseId: "vc_bc5126d5-87e1-4e4c-947e-207bac935627" },
  },
  args: {
    summary: FILLED_SUMMARY_ORDER_DISCOUNT,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Discount (WELCOME10)")).toBeVisible();
    expect(canvas.queryByText(/Points \(\d+ pts\)/)).not.toBeInTheDocument();
    expect(canvas.getByText("HK$1,538.00")).toBeVisible();
  },
};

export const Pickup: Story = {
  parameters: {
    verification: { caseId: "vc_dc6cdf13-6686-414c-9b74-f5f88f0332b9" },
  },
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
  parameters: {
    verification: { caseId: "vc_fccbae5c-b5f8-4d73-8430-0314efb72083" },
  },
  args: {
    payment: { brand: "mastercard", maskedNumber: "···· 4242" },
  },
};

/** Address lines stay useful when the recipient name is unavailable. */
export const PartialAddress: Story = {
  parameters: {
    verification: { caseId: "vc_efdef13e-7029-4800-977f-b09395211ac9" },
  },
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
  parameters: {
    verification: { caseId: "vc_a7d1e970-1b2c-40e2-9359-4b74a3fae2f7" },
  },
  args: {
    payment: { label: "Cartes Bancaires", maskedNumber: "···· 5678" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Cartes Bancaires")).toBeVisible();
    expect(canvas.getByText("···· 5678")).toBeVisible();
    expect(canvas.queryByRole("img")).not.toBeInTheDocument();
  },
};

/** A wallet name remains associated with its device-account mask. */
export const WalletPayment: Story = {
  parameters: {
    verification: { caseId: "vc_aacd0c67-633e-4cf9-aaba-9b04a0633976" },
  },
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
  parameters: {
    verification: { caseId: "vc_297aeb78-ab7c-4966-a468-05ba944e021b" },
  },
  args: {
    payment: {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Payment Method")).not.toBeInTheDocument();
  },
};

export const Minimal: Story = {
  parameters: {
    verification: { caseId: "vc_66caa7f4-cc4d-4ca3-8d80-07463641df7c" },
  },
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
  parameters: {
    verification: { caseId: "vc_e20322eb-a9b9-4e1d-9deb-b378d3d23fd1" },
  },
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
