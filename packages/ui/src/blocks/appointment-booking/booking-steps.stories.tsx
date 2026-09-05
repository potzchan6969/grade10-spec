import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BookingSteps } from "./booking-steps";
import { STEPS_COPY } from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingSteps",
  component: BookingSteps,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: STEPS_COPY, current: "day", onBack: fn() },
} satisfies Meta<typeof BookingSteps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    expect(args.onBack).toHaveBeenCalledWith("location");
  },
};

/** The first step has nothing behind it, so nothing offers a way back. */
export const FirstStep: Story = {
  args: { current: "service" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: "Back" })).toBeNull();
  },
};
