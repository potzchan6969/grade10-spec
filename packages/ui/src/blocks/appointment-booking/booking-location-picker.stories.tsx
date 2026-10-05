import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BookingLocationPicker } from "./booking-location-picker";
import { CENTRAL, KOWLOON, LOCATION_PICKER_COPY } from "./fixtures";

const meta = {
  title: "Appointment Booking/BookingLocationPicker",
  component: BookingLocationPicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: LOCATION_PICKER_COPY,
    locations: { status: "ready", data: [CENTRAL, KOWLOON] },
    onSelect: fn(),
  },
} satisfies Meta<typeof BookingLocationPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: /Grade10 Central/ }),
    );
    expect(args.onSelect).toHaveBeenCalledWith("loc_central");
  },
};

/** One shop is a fact row, not a radio list. */
export const OneShop: Story = {
  args: {
    locations: { status: "ready", data: [CENTRAL] },
    selectedId: CENTRAL.id,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: /Grade10 Central/ }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      canvas.getByText("12 Queen’s Road Central, Hong Kong"),
    ).toBeVisible();
  },
};

export const Empty: Story = {
  args: {
    locations: {
      status: "empty",
      message: "No shop offers this service yet.",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("No shop offers this service yet."),
    ).toBeInTheDocument();
  },
};
