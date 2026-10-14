import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, screen, userEvent, within } from "storybook/test";
import { AppointmentVisitPage } from "./visit-page";

const meta = {
  title: "Appointment/Visit/Screens/Visit",
  component: AppointmentVisitPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { state: "booked" },
} satisfies Meta<typeof AppointmentVisitPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Before the day: the pass and the facts; Change time and Cancel open sheets. */
export const Booked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Grading Submission" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Cancel visit" }));
    expect(
      await screen.findByRole("dialog", { name: "Cancel your visit?" }),
    ).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "Keep my visit" }),
    );
    expect(canvas.getByRole("link", { name: "Directions" })).toBeVisible();
  },
};

/** Change time: the strip of days, the times grouped by part of the day. */
export const ChangeTime: Story = { args: { opened: "move" } };

/** Cancel: what frees up, who hears of it, and an optional reason. */
export const Cancel: Story = {
  args: { opened: "cancel" },
  play: async () => {
    const sheet = within(await screen.findByRole("dialog"));
    await userEvent.click(sheet.getByRole("button", { name: "Cancel visit" }));
    expect(
      await screen.findByRole("heading", { name: "You cancelled this visit" }),
    ).toBeVisible();
  },
};

/** Just booked: what was booked, the pass and how to get there. */
export const JustBooked: Story = { args: { state: "justBooked" } };

/** Cancelled by the collector: the time struck, the reason they gave. */
export const CancelledByYou: Story = {
  args: { state: "cancelledYou" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("I booked the wrong time")).toBeVisible();
    expect(canvas.getByRole("link", { name: "Book again" })).toBeVisible();
  },
};

export const CancelledByShop: Story = { args: { state: "cancelledShop" } };

/** The shop closed for the weather: the visit is off, pick another time. */
export const ShopClosed: Story = { args: { state: "shopClosed" } };

export const Completed: Story = { args: { state: "completed" } };

/** Missed: what you told us comes with Book again. */
export const Missed: Story = {
  args: { state: "missed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("region", { name: "What you told us" }),
    ).toBeVisible();
  },
};

/** Paid: the deposit among the facts, and when it comes back. */
export const Paid: Story = { args: { state: "paid" } };

/** Paid, cancelled a day or more ahead: the deposit goes back. */
export const PaidCancel: Story = {
  args: { state: "paid", opened: "cancel", refund: "due" },
  play: async () => {
    const sheet = within(await screen.findByRole("dialog"));
    expect(sheet.getByText("Refunded")).toBeVisible();
    await userEvent.click(sheet.getByRole("button", { name: "Cancel visit" }));
    expect(
      await screen.findByText("HK$100.00, on its way back to your card"),
    ).toBeVisible();
  },
};

/** Paid, cancelled under a day ahead: the deposit is kept. */
export const PaidCancelLate: Story = {
  args: { state: "paid", opened: "cancel", refund: "kept" },
};

/** Paid and cancelled: the refund reached the card. */
export const PaidRefunded: Story = { args: { state: "paidRefunded" } };

/** Lost signal: what it last knew, with Try now. */
export const Reconnecting: Story = { args: { state: "reconnecting" } };

/** A link that names no visit says why, and never guesses one. */
export const LinkOpensNothing: Story = {
  args: { state: "linkOpensNothing" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "This link doesn’t open a visit" }),
    ).toBeVisible();
  },
};

/** Sent to grading: no pass and no Directions, and grading's own mail follows. */
export const WithGrading: Story = {
  args: { state: "withGrading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Grading has your 12 cards" }),
    ).toBeVisible();
    expect(canvas.queryByText("Your pass")).toBeNull();
    expect(canvas.queryByRole("link", { name: "Directions" })).toBeNull();
    expect(canvas.getByRole("link", { name: "My visits" })).toBeVisible();
  },
};

/** Sent to the vault: no pass, and the vault's own mail follows. */
export const WithTheVault: Story = {
  args: { state: "withVault" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Your item is with the vault" }),
    ).toBeVisible();
    expect(canvas.queryByText("Your pass")).toBeNull();
    expect(canvas.getByText("Vault Drop-Off")).toBeVisible();
  },
};
