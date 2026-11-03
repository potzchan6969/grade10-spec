import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BookingLocationPicker } from "./booking-location-picker";
import { BOARD_SHOPS, CAUSEWAY_BAY, LOCATION_PICKER_COPY } from "./fixtures";

const { common } = getMessages("grade10", "en");

const meta = {
  title: "Appointment/Booking/Blocks/BookingLocationPicker",
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
  parameters: {
    verification: { caseId: "vc_96a140f7-affd-403f-920e-1419b41525ff" },
  },
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

/** The ticked shop reports again when picked, so Back then Continue is never
 * stuck; before any pick nothing is ticked. */
export const Repick: Story = {
  parameters: {
    verification: { caseId: "vc_5a9b669c-1120-4381-87c6-0b120ea67fe8" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("radio", { name: /Hong Kong Grade10 Store/ }),
    );
    expect(args.onSelect).toHaveBeenCalledTimes(1);
    expect(args.onSelect).toHaveBeenLastCalledWith(CAUSEWAY_BAY.id);
  },
};

export const FirstPick: Story = {
  parameters: {
    verification: { caseId: "vc_846413bb-0185-429c-8152-eda44466a5bd" },
  },
  args: { selectedId: undefined },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const radio = canvas.getByRole("radio", {
      name: /Hong Kong Grade10 Store/,
    });
    expect(radio).not.toBeChecked();
    await userEvent.click(radio);
    expect(args.onSelect).toHaveBeenCalledTimes(1);
    expect(args.onSelect).toHaveBeenLastCalledWith(CAUSEWAY_BAY.id);
  },
};

export const Failed: Story = {
  parameters: {
    verification: { caseId: "vc_fbd5bcfd-de78-4567-9735-cee965ea52d9" },
  },
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

/** The board's shops: today's hours, the earliest free time, the address
 * where the shop has one, under the count. */
export const Board: Story = {
  parameters: {
    verification: { caseId: "vc_4cd36a47-b86f-4fa4-80b7-4d34d520c4b5" },
  },
  args: {
    copy: { title: "Pick a shop" },
    description: "3 shops run Grading drop-off.",
    locations: { status: "ready", data: BOARD_SHOPS },
    selectedId: "loc_central",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("3 shops run Grading drop-off.")).toBeVisible();
    expect(canvas.getByText("Earliest: today, 16:30")).toBeVisible();
    expect(canvas.getByRole("radio", { name: /Central/ })).toBeChecked();
  },
};
