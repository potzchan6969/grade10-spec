import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BookingConfirmation } from "./booking-confirmation";
import { CONFIRMATION_COPY, LIVE_ANSWERS, LIVE_RECORD } from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingConfirmation",
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
  args: { description: undefined, answers: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Before you come")).toBeNull();
    expect(canvas.queryByText("What you told us")).toBeNull();
  },
};

export const WithoutCalendarFile: Story = {
  args: { calendarHref: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("link", { name: "Add to calendar" })).toBeNull();
  },
};
