import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BookingNotice } from "./booking-notice";

const meta = {
  title: "Appointment/Booking/Blocks/BookingNotice",
  component: BookingNotice,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "15:00 on Thu 22 Oct was just taken.",
    body: "Pick another time. We kept your details.",
  },
} satisfies Meta<typeof BookingNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TimeJustTaken: Story = {
  parameters: {
    verification: { caseId: "vc_db793cd5-87a6-403a-ac13-13c5e7a41d97" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "15:00 on Thu 22 Oct was just taken.",
    );
  },
};

/** A repeat press: the notice shakes. */
export const Repeated: Story = {
  parameters: {
    verification: { caseId: "vc_0d40c17c-a072-4c1b-bfa1-2f466cf57603" },
  },
  args: { attempt: 1 },
};
