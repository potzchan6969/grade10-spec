import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FIXTURE_TIME_ZONE } from "../../lib/datetime-fixtures";
import { CONFIRMATION_COPY } from "../appointment-booking/fixtures";
import { VisitBookedPass } from "./visit-booked-pass";

const START = Date.UTC(2026, 9, 22, 7, 0);

const meta = {
  title: "Appointment/Visit/Blocks/VisitBookedPass",
  component: VisitBookedPass,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      confirmation: {
        ...CONFIRMATION_COPY,
        title: "You are booked",
        body: "We emailed alex.chan@example.com.",
        manage: "Change or cancel",
      },
      pass: {
        title: "Booked",
        nameLabel: "Booked for",
        note: "At the counter, give your phone or email.",
      },
      brand: "Grade10",
      directions: "Directions",
      until: "You can change or cancel until 15:00 on Thu 22 Oct.",
      before: "Before you come",
      getThere: "How to get there",
      another: "Book another visit",
      calendarSaved: "Calendar file saved",
    },
    confirmation: {
      record: {
        id: "bk_board",
        service: "Grading drop-off",
        location: "Central",
        address: "2/F, 18 Queen’s Road Central",
        timeZone: FIXTURE_TIME_ZONE,
        start: START,
        end: START + 30 * 60_000,
        state: "booked",
      },
      answers: [
        { key: "cards", label: "How many cards?", answer: "12" },
        { key: "company", label: "Grading company", answer: "PSA" },
        { key: "phone", label: "Phone", answer: "+852 9123 4567" },
      ],
      manageHref: "#/book/manage",
      calendarHref: "data:text/calendar,BEGIN:VCALENDAR",
    },
    name: "Alex Chan",
    when: "Thu 22 Oct, 15:00 to 15:30 HKT",
    directionsHref: "https://maps.google.com/?q=18+Queen%27s+Road+Central",
    before: [
      "Bring the cards in sleeves.",
      "We hold your time until 15:15. Running late? Tell us from your visit page.",
      "Grading fees are paid at the counter",
    ],
    getThere: [
      { label: "Shop", value: "Central" },
      { label: "Where", value: "2/F, 18 Queen’s Road Central" },
      { label: "Directions", value: "MTR Central exit D2" },
      {
        label: "Shop phone",
        value: (
          <a className="font-semibold underline" href="tel:+85223456789">
            2345 6789
          </a>
        ),
      },
    ],
    onAgain: fn(),
  },
} satisfies Meta<typeof VisitBookedPass>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The pass first, its acts under it, and what to know beside it. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "You are booked" }),
    ).toBeVisible();
    expect(canvas.getByText("Alex Chan")).toBeVisible();
    expect(canvas.getByText("Thu 22 Oct, 15:00 to 15:30 HKT")).toBeVisible();
    expect(
      canvas.getByRole("region", { name: "How to get there" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("link", { name: "Change or cancel" }),
    ).toHaveAttribute("href", "#/book/manage");
    await userEvent.click(
      canvas.getByRole("button", { name: "Book another visit" }),
    );
    expect(args.onAgain).toHaveBeenCalledTimes(1);
  },
};

/** Taking the calendar file says it was saved. */
export const CalendarSaved: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Add to calendar" });
    link.addEventListener("click", (event) => event.preventDefault());
    await userEvent.click(link);
    expect(
      canvas.getByRole("link", { name: "Calendar file saved" }),
    ).toBeVisible();
  },
};

/** Paid at booking: the receipt line, and what was paid on the pass. */
export const PaidAndBooked: Story = {
  args: {
    receipt: "Paid HK$100.00 deposit. Your receipt is in that email.",
    paid: {
      label: "Paid",
      value: "HK$100.00 deposit",
      refund:
        "Refunded if you cancel at least 24 hours before, or if the shop cancels.",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        "Paid HK$100.00 deposit. Your receipt is in that email.",
      ),
    ).toBeVisible();
    expect(canvas.getByText("HK$100.00 deposit")).toBeVisible();
  },
};

/** Booked for someone else: their name on the pass. */
export const ForSomeoneElse: Story = { args: { name: "Ben Chan" } };

/** No name on the visit: the pass names no one. */
export const NoName: Story = {
  args: { name: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Booked for")).toBeNull();
  },
};

export const Phone: Story = {
  globals: { viewport: { value: "mobile1" } },
};
