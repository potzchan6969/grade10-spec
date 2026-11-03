import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FIXTURE_TIME_ZONE } from "../../lib/datetime-fixtures";
import { BookingSummary, BookingSummaryBar } from "./booking-summary";
import { hkSlot, SUMMARY_COPY } from "./fixtures";

const PICKED = hkSlot("2026-10-22", "15:00");

const meta = {
  title: "Appointment/Booking/Blocks/BookingSummary",
  component: BookingSummary,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: SUMMARY_COPY,
    service: "Grading drop-off",
    location: "Central",
    start: PICKED.start,
    end: PICKED.end,
    timeZone: FIXTURE_TIME_ZONE,
    onChangeService: fn(),
    onChangeLocation: fn(),
    notes: [
      "Grading fees are paid at the counter",
      "Bring the cards in sleeves.",
    ],
    footer: "You can change or cancel until your visit starts.",
    className: "max-w-[380px]",
  },
} satisfies Meta<typeof BookingSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every pick with its value and a Change on each but the step being made. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_fb33b9f2-d7ad-42af-8bba-e4a80cafbb3e" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Your visit" }),
    ).toBeVisible();
    expect(
      canvas.getByText("Thu 22 Oct, 15:00 to 15:30 HKT"),
    ).toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("button", { name: "Change service" }),
    );
    expect(args.onChangeService).toHaveBeenCalledTimes(1);
    expect(canvas.queryByRole("button", { name: "Change time" })).toBeNull();
    expect(
      canvas.getByText("You can change or cancel until your visit starts."),
    ).toBeVisible();
  },
};

/** Before anything is picked every row says so. */
export const NothingYet: Story = {
  parameters: {
    verification: { caseId: "vc_7c5206a3-c017-4582-8f93-44232a26c3eb" },
  },
  args: {
    service: undefined,
    location: undefined,
    start: undefined,
    end: undefined,
    notes: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Not chosen yet")).toHaveLength(3);
    expect(canvas.queryByRole("button", { name: /Change/ })).toBeNull();
  },
};

/** No service runs at more than one shop: no shop row. */
export const OneShop: Story = {
  parameters: {
    verification: { caseId: "vc_adf0d61f-4e4e-4d39-88ab-c13ceb481580" },
  },
  args: { hideLocation: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Shop")).toBeNull();
  },
};

/** Booking for someone else, for a paid service: who comes in, and what is
 * charged now. */
export const ForSomeoneElsePaid: Story = {
  parameters: {
    verification: { caseId: "vc_b08ca250-9103-46bc-bb5c-4490e0c7b820" },
  },
  args: {
    service: "Bulk grading drop-off",
    extraRows: [
      { label: "For", value: "Ben Chan" },
      { label: "Pay now", value: "HK$100.00 deposit at booking" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Ben Chan")).toBeVisible();
    expect(canvas.getByText("HK$100.00 deposit at booking")).toBeVisible();
  },
};

/** A booking in flight: no Change works. */
export const Busy: Story = {
  parameters: {
    verification: { caseId: "vc_9301699c-7148-4dd0-b451-26f43008a609" },
  },
  args: { busy: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Change service" }),
    ).toBeDisabled();
  },
};

/** Under 1024px the summary is a bar on top: one line, unfolding into the rows. */
export const Bar: Story = {
  parameters: {
    verification: { caseId: "vc_2a92cb63-002f-4e92-893e-758db4e8d8b5" },
  },
  render: (args) => (
    <BookingSummaryBar
      {...args}
      line="Grading drop-off · Central · Thu 22 Oct, 15:00"
    />
  ),
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: /Your visit/ });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(
      canvas.getByText("Grading drop-off · Central · Thu 22 Oct, 15:00"),
    ).toBeVisible();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(
      canvas.getByText("Thu 22 Oct, 15:00 to 15:30 HKT"),
    ).toBeInTheDocument();
  },
};
