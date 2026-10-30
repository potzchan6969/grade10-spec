import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { OfferAndRepaymentsPrototype } from "./offer-and-repayments-prototype";

const meta = {
  title: "Finance/Loan And Money/Prototypes/Offer And Repayments",
  component: OfferAndRepaymentsPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof OfferAndRepaymentsPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The offer: its figures, the total to repay, and Accept or Decline. */
export const Offer: Story = {
  args: { state: "offer" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Total to repay: HK$8,480.00.")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Accept this offer" }),
    ).toBeVisible();
  },
};

/** Accepted: the loan's terms, and the term runs from the payout. */
export const Accepted: Story = {
  args: { state: "accepted" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("30 days from the day the loan is paid out"),
    ).toBeVisible();
  },
};

/** Owed: the balance, the due date, the reminder dates and how to repay. */
export const Owed: Story = {
  args: { state: "owed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$8,480.00 of HK$8,480.00")).toBeVisible();
    expect(canvas.getByRole("list", { name: "Reminders" })).toBeVisible();
  },
};

/** How to pay: the lender's FPS ID and account, with the case reference as the transfer reference. */
export const HowToPay: Story = {
  args: { state: "how-to-pay" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("table", { name: "Where to send the money" }),
    ).toBeVisible();
    expect(canvas.getByText("K7HQ4R")).toBeVisible();
  },
};

/** A repayment recorded: the amount, the method and the balance after it. */
export const RepaymentMade: Story = {
  args: { state: "repayment-made" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Outstanding HK$4,480.00 of HK$8,480.00."),
    ).toBeVisible();
    expect(canvas.getByRole("table", { name: "Each repayment" })).toBeVisible();
  },
};

/** Settled: repaid in full, nothing outstanding, and the item can be collected. */
export const Settled: Story = {
  args: { state: "settled" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Loan settled")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Book a pickup visit" }),
    ).toBeVisible();
  },
};
