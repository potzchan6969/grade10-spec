import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";
import {
  FIXTURE_MONTH,
  SEPTEMBER_3_SLOTS,
  SEPTEMBER_DAYS,
  SLOT_PICKER_COPY,
} from "../appointment-booking/fixtures";
import { MOVE_PANEL_COPY } from "./fixtures";
import { VisitMovePanel } from "./visit-move-panel";

const meta = {
  title: "Appointment/Visit/Blocks/VisitMovePanel",
  component: VisitMovePanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: MOVE_PANEL_COPY,
    slotPicker: {
      copy: SLOT_PICKER_COPY,
      month: FIXTURE_MONTH,
      days: { status: "ready", data: SEPTEMBER_DAYS },
      selectedDate: "2026-09-03",
      slots: { status: "ready", data: SEPTEMBER_3_SLOTS },
      timeZone: "Asia/Hong_Kong",
      onMonthChange: fn(),
      onSelectDay: fn(),
      onSelectSlot: fn(),
    },
    picked: false,
    pending: false,
    onConfirm: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof VisitMovePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing picked yet: the confirm asks for a time. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_9d7d66f5-e96e-4692-923e-2b726f87db1e" },
  },
  play: async () => {
    const canvas = screen;
    expect(
      await canvas.findByRole("button", { name: "Pick a time" }),
    ).toBeDisabled();
    expect(canvas.getByRole("button", { name: "Keep 10:15" })).toBeEnabled();
  },
};

export const Picked: Story = {
  parameters: {
    verification: { caseId: "vc_8d414c75-6664-4644-a158-3a3495d675f3" },
  },
  args: {
    picked: true,
    copy: { ...MOVE_PANEL_COPY, confirm: "Move to Thu 3 Sep, 11:15" },
  },
  play: async () => {
    expect(
      await screen.findByRole("button", { name: "Move to Thu 3 Sep, 11:15" }),
    ).toBeEnabled();
  },
};

export const Taken: Story = {
  parameters: {
    verification: { caseId: "vc_58a1bee5-bc86-414f-9db7-f61916d1f656" },
  },
  args: { error: "That time was just taken. Pick another." },
};
