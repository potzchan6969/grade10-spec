import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BookingStepDots } from "./booking-step-dots";

const STEPS = [
  { id: "service", label: "Service" },
  { id: "location", label: "Shop" },
  { id: "time", label: "Time" },
  { id: "details", label: "Details" },
] as const;

const meta = {
  title: "Appointment/Booking/Blocks/BookingStepDots",
  component: BookingStepDots,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      label: "Booking steps",
      doneAria: "Step {n}, {label}, done. Go back to it.",
    },
    steps: STEPS,
    current: "time",
    onStep: fn(),
    className: "max-w-[560px]",
  },
} satisfies Meta<typeof BookingStepDots<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Done steps tick and go back; the current one is marked; the rest wait. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", {
        name: "Step 1, Service, done. Go back to it.",
      }),
    );
    expect(args.onStep).toHaveBeenCalledWith("service");
    expect(canvas.getByText("Time").closest("[aria-current]")).toHaveAttribute(
      "aria-current",
      "step",
    );
    expect(canvas.queryByRole("button", { name: /Details/ })).toBeNull();
  },
};

export const First: Story = { args: { current: "service" } };

/** One shop runs the service: three steps. */
export const NoShopStep: Story = {
  args: {
    steps: STEPS.filter((step) => step.id !== "location"),
    current: "details",
  },
};

/** A booking in flight: done steps do not go back. */
export const Busy: Story = {
  args: { current: "details", busy: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", {
        name: "Step 3, Time, done. Go back to it.",
      }),
    ).toBeDisabled();
  },
};
