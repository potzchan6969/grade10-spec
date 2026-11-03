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
  parameters: {
    verification: { caseId: "vc_07658c78-0332-4bbb-adc6-971e87251c78" },
  },
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
export const ChangeTime: Story = {
  parameters: {
    verification: { caseId: "vc_df90a6f9-b9bf-4534-ae38-9afcf17f3633" },
  },
  args: { opened: "move" },
};

/** Cancel: what frees up, who hears of it, and an optional reason. */
export const Cancel: Story = {
  parameters: {
    verification: { caseId: "vc_165e12a4-606b-4bdf-a1b0-2f987cffa33f" },
  },
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
export const JustBooked: Story = {
  parameters: {
    verification: { caseId: "vc_fde8b766-c7ae-4499-8b63-ee949aad45b8" },
  },
  args: { state: "justBooked" },
};

/** Cancelled by the collector: the time struck, the reason they gave. */
export const CancelledByYou: Story = {
  parameters: {
    verification: { caseId: "vc_814622c1-ce33-4eed-af17-65a2a75f0dff" },
  },
  args: { state: "cancelledYou" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("I booked the wrong time")).toBeVisible();
    expect(canvas.getByRole("link", { name: "Book again" })).toBeVisible();
  },
};

export const CancelledByShop: Story = {
  parameters: {
    verification: { caseId: "vc_a7bfe81d-519e-4084-80a6-7e740f9f8650" },
  },
  args: { state: "cancelledShop" },
};

/** The shop closed for the weather: the visit is off, pick another time. */
export const ShopClosed: Story = {
  parameters: {
    verification: { caseId: "vc_39bbfcbe-5fb5-4b57-9bb6-fd9ed935def1" },
  },
  args: { state: "shopClosed" },
};

export const Completed: Story = {
  parameters: {
    verification: { caseId: "vc_18850702-a439-4472-8107-e1dd2b544bbb" },
  },
  args: { state: "completed" },
};

/** Missed: what you told us comes with Book again. */
export const Missed: Story = {
  parameters: {
    verification: { caseId: "vc_082817d3-efba-40d6-85de-7003eacc1aab" },
  },
  args: { state: "missed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("region", { name: "What you told us" }),
    ).toBeVisible();
  },
};

/** Paid: the deposit among the facts, and when it comes back. */
export const Paid: Story = {
  parameters: {
    verification: { caseId: "vc_ac01cef8-bc29-4800-9e43-af7337540e93" },
  },
  args: { state: "paid" },
};

/** Paid, cancelled a day or more ahead: the deposit goes back. */
export const PaidCancel: Story = {
  parameters: {
    verification: { caseId: "vc_387f969d-8406-48a3-9bd0-bddad256086a" },
  },
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
  parameters: {
    verification: { caseId: "vc_084bb15d-138c-4c51-b531-830b4d5fcd51" },
  },
  args: { state: "paid", opened: "cancel", refund: "kept" },
};

/** Paid and cancelled: the refund reached the card. */
export const PaidRefunded: Story = {
  parameters: {
    verification: { caseId: "vc_d25f49a6-91e9-4bcd-a724-f5038686c56b" },
  },
  args: { state: "paidRefunded" },
};

/** Lost signal: what it last knew, with Try now. */
export const Reconnecting: Story = {
  parameters: {
    verification: { caseId: "vc_7f7bffea-4452-4736-afb0-0c0f0cb28c43" },
  },
  args: { state: "reconnecting" },
};

/** A link that names no visit says why, and never guesses one. */
export const LinkOpensNothing: Story = {
  parameters: {
    verification: { caseId: "vc_161e7ddc-925e-4ca2-9050-178aeaa93891" },
  },
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
  parameters: {
    verification: { caseId: "vc_6a9a888e-29b7-446f-998c-30670c1fdd20" },
  },
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
  parameters: {
    verification: { caseId: "vc_6f06785e-92a3-45ba-9c70-d206887f8614" },
  },
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
