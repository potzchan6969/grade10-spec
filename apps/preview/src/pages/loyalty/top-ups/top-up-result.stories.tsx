import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TopUpResultPrototype } from "./top-up-result-prototype";

const meta = {
  title: "Loyalty/Top Ups/Screens/Top Up Result",
  component: TopUpResultPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof TopUpResultPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Back from Stripe, still confirming the payment. */
export const ConfirmingPayment: Story = {
  name: "Confirming Payment",
  args: { state: "confirming" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: "Confirming your payment…",
      }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("status")).toBeInTheDocument();
  },
};

/** The pack credited: the new balance and the way back. */
export const PointsAdded: Story = {
  name: "Points Added",
  args: { state: "added" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "1,000 points added" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("New balance: 2,200 points")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Back to Membership" }),
    ).toBeInTheDocument();
  },
};

/** The pack held for an operator: what happens next and where to watch. */
export const UnderReview: Story = {
  name: "Under Review",
  args: { state: "under-review" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: "Top-up under review",
      }),
    ).toBeInTheDocument();
    expect(
      canvas.getByText(
        "Your card is charged only if it’s approved. You can close this page.",
      ),
    ).toBeVisible();
    expect(canvas.getByText("Reference TU-2026-0384")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "View Top-Up History" }),
    ).toBeInTheDocument();
  },
};

/** The review refused the pack: nothing charged. */
export const NotApproved: Story = {
  name: "Not Approved",
  args: { state: "not-approved" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: "Top-up not approved",
      }),
    ).toBeInTheDocument();
    expect(canvas.getByText("You haven’t been charged.")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Back to Membership" }),
    ).toBeInTheDocument();
  },
};

/** The member came back without paying: retry starts the pick again. */
export const PaymentNotCompleted: Story = {
  name: "Payment Not Completed",
  args: { state: "not-completed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: "Payment not completed",
      }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Try again" })).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Back to Membership" }),
    ).toBeInTheDocument();
  },
};

/** Points added at a phone width. */
export const Narrow: Story = {
  args: { state: "added" },
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "1,000 points added" }),
    ).toBeInTheDocument();
  },
};
