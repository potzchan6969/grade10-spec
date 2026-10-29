import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CasePagePrototype } from "./case-page-prototype";

const meta = {
  title: "Finance/Collector Pages/Prototypes/Case Page",
  component: CasePagePrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CasePagePrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The request is in and being valued: nothing is asked of the collector yet. */
export const RequestSent: Story = {
  args: { state: "request-sent" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "1999 Charizard" }),
    ).toBeVisible();
    expect(canvas.getByRole("button", { name: "Book a visit" })).toBeVisible();
  },
};

/** An offer is open: its figures, its expiry, and Accept or Decline. */
export const OfferWaiting: Story = {
  args: { state: "offer-waiting" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Open until 12 October, 18:00 HKT.")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Accept this offer" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Decline this offer" }),
    ).toBeVisible();
  },
};

/** The offer closed unanswered: no actions, and the visit still stands. */
export const OfferRanOut: Story = {
  args: { state: "offer-ran-out" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Offer ran out").length).toBeGreaterThan(0);
    expect(
      canvas.queryByRole("button", { name: "Accept this offer" }),
    ).not.toBeInTheDocument();
  },
};

/** The loan runs to its due date: what is owed, and how to repay and collect. */
export const LoanRunning: Story = {
  args: { state: "loan-running" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$8,480.00 of HK$8,480.00")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Book a visit to repay and collect" }),
    ).toBeVisible();
  },
};

/** The loan is past due: the days overdue and the reminders sent. */
export const PastDue: Story = {
  args: { state: "past-due" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("table", { name: "The balance" })).toBeVisible();
    expect(canvas.getByText("Days overdue")).toBeVisible();
    expect(canvas.getByRole("list", { name: "Reminders" })).toBeVisible();
  },
};
