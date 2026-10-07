import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FIXTURE_TIME_ZONE } from "../../lib/datetime-fixtures";
import { BookingSummary } from "./booking-summary";
import { LIVE_RECORD, SUMMARY_COPY } from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingSummary",
  component: BookingSummary,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: SUMMARY_COPY,
    service: "Grading Submission",
    location: "Hong Kong Grade10 Store",
    address: "13 Pak Sha Road, Causeway Bay, Hong Kong",
    start: LIVE_RECORD.start,
    end: LIVE_RECORD.end,
    timeZone: FIXTURE_TIME_ZONE,
  },
} satisfies Meta<typeof BookingSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Shop")).toBeInTheDocument();
    expect(canvas.getByText("3 Sep 2026, 10:15")).toBeInTheDocument();
    expect(canvas.queryByText("HKT")).toBeNull();
  },
};

/** Only the picks made so far render. */
export const ServiceOnly: Story = {
  args: {
    location: undefined,
    address: undefined,
    start: undefined,
    end: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Grading Submission")).toBeInTheDocument();
    expect(canvas.queryByText("Shop")).toBeNull();
  },
};
