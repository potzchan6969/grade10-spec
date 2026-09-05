import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BookingServicePicker } from "./booking-service-picker";
import {
  CONSULTATION_SERVICE,
  GRADING_SERVICE,
  SERVICE_PICKER_COPY,
} from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingServicePicker",
  component: BookingServicePicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: SERVICE_PICKER_COPY,
    services: {
      status: "ready",
      data: [GRADING_SERVICE, CONSULTATION_SERVICE],
    },
    onSelect: fn(),
  },
} satisfies Meta<typeof BookingServicePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Activating a service reports its id; the picker marks nothing on its own. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Collection consultation/ }),
    );
    expect(args.onSelect).toHaveBeenCalledWith("svc_consultation");
  },
};

export const Selected: Story = {
  args: { selectedId: "svc_consultation" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: /Collection consultation/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      canvas.getByRole("button", { name: /Card grading/ }),
    ).toHaveAttribute("aria-pressed", "false");
  },
};

export const Loading: Story = {
  args: { services: { status: "loading" } },
};

export const Failed: Story = {
  args: {
    services: {
      status: "error",
      message: "The services could not be read.",
      action: { label: "Try again", onAction: fn() },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("The services could not be read."),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Try again" })).toBeVisible();
  },
};
