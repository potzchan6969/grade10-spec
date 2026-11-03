import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BookingConfirmation } from "./booking-confirmation";
import { CONFIRMATION_COPY, LIVE_ANSWERS, LIVE_RECORD } from "./fixtures";

const meta = {
  title: "Appointment/Booking/Blocks/BookingConfirmation",
  component: BookingConfirmation,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: CONFIRMATION_COPY,
    record: LIVE_RECORD,
    manageHref: "#/book/manage",
    calendarHref: "#/book/bk_live.ics",
    description: "Hand in cards to be graded, each in a penny sleeve.",
    answers: LIVE_ANSWERS,
  },
} satisfies Meta<typeof BookingConfirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_ea9fed3c-7af0-4009-8cc6-c8de993267a2" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("link", { name: "Move or cancel this visit" }),
    ).toHaveAttribute("href", "#/book/manage");
    expect(
      canvas.getByRole("link", { name: "Add to calendar" }),
    ).toHaveAttribute("href", "#/book/bk_live.ics");
  },
};

/** The service's description sits under Before you come, and each answer
 * under What you told us, a list joined into one line. */
export const BeforeYouCome: Story = {
  parameters: {
    verification: { caseId: "vc_550cb09d-3997-4fe8-ab8b-5c82aab0a011" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Before you come")).toBeVisible();
    expect(
      canvas.getByText("Hand in cards to be graded, each in a penny sleeve."),
    ).toBeVisible();
    expect(canvas.getByText("What you told us")).toBeVisible();
    expect(canvas.getByText("Preferred grading company")).toBeVisible();
    expect(canvas.getByText("PSA")).toBeVisible();
    expect(canvas.getByText("Sleeves, Binder")).toBeVisible();
  },
};

export const WithoutDescriptionOrAnswers: Story = {
  parameters: {
    verification: { caseId: "vc_aab8bace-16cc-4cef-91d5-35b2804f426a" },
  },
  args: { description: undefined, answers: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Before you come")).toBeNull();
    expect(canvas.queryByText("What you told us")).toBeNull();
  },
};

export const WithoutCalendarFile: Story = {
  parameters: {
    verification: { caseId: "vc_74922b53-92d4-4f88-b8c3-ad6777f0bdab" },
  },
  args: { calendarHref: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("link", { name: "Add to calendar" })).toBeNull();
  },
};
