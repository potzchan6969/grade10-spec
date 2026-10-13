import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BookingPayNotice } from "./booking-pay-notice";

const meta = {
  title: "Appointment/Booking/Blocks/BookingPayNotice",
  component: BookingPayNotice,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      title: "Pay now",
      via: "You pay on a secure Stripe page. Nothing is charged until you finish there.",
    },
    amount: "HK$100.00 deposit",
    refund:
      "Refunded if you cancel at least 24 hours before, or if the shop cancels.",
  },
} satisfies Meta<typeof BookingPayNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Deposit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("group", { name: "Pay now" })).toBeVisible();
    expect(canvas.getByText("HK$100.00 deposit")).toBeVisible();
  },
};

export const Full: Story = {
  args: {
    amount: "HK$300.00",
    refund: "Refunded if the shop cancels.",
  },
};
