import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { BookingLocationPicker } from "./booking-location-picker";
import { CAUSEWAY_BAY, LOCATION_PICKER_COPY } from "./fixtures";

const { common } = getMessages("grade10", "en");

const meta = {
  title: "Appointment Booking/BookingLocationPicker",
  component: BookingLocationPicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: LOCATION_PICKER_COPY,
    locations: { status: "ready", data: [CAUSEWAY_BAY] },
    selectedId: CAUSEWAY_BAY.id,
    onSelect: fn(),
  },
} satisfies Meta<typeof BookingLocationPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One shop — Hong Kong Grade10 Store, same address as Store Locator. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("radio", { name: /Hong Kong Grade10 Store/ }),
    ).toBeChecked();
    expect(
      canvas.getByText("13 Pak Sha Road, Causeway Bay, Hong Kong"),
    ).toBeVisible();
  },
};

export const Failed: Story = {
  args: {
    selectedId: undefined,
    locations: {
      status: "error",
      message: "The shop could not be read.",
      action: { label: common.retry, onAction: fn() },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("The shop could not be read.")).toBeInTheDocument();
  },
};
