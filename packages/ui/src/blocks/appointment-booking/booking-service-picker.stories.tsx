import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BookingServicePicker } from "./booking-service-picker";
import {
  CONSULTATION_SERVICE,
  GRADING_SERVICE,
  SERVICE_PICKER_COPY,
  VAULTING_SERVICE,
} from "./fixtures";

const { common } = getMessages("grade10", "en");

const meta = {
  title: "Appointment Booking/BookingServicePicker",
  component: BookingServicePicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: SERVICE_PICKER_COPY,
    services: {
      status: "ready",
      data: [GRADING_SERVICE, VAULTING_SERVICE, CONSULTATION_SERVICE],
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
    expect(canvas.getByText("Grading Submission")).toBeVisible();
    expect(canvas.getByText("Vault Drop-Off")).toBeVisible();
    expect(canvas.getByText("Store/Auction Listing")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("radio", { name: /Store\/Auction Listing/ }),
    );
    expect(args.onSelect).toHaveBeenCalledWith("svc_consultation");
  },
};

export const Selected: Story = {
  args: { selectedId: "svc_grading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("radio", { name: /Grading Submission/ }),
    ).toBeChecked();
    expect(
      canvas.getByRole("radio", { name: /Vault Drop-Off/ }),
    ).not.toBeChecked();
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
      action: { label: common.retry, onAction: fn() },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("The services could not be read."),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: common.retry })).toBeVisible();
  },
};
