import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { RECONNECTING_COPY } from "./fixtures";
import { VisitReconnecting } from "./visit-reconnecting";

const meta = {
  title: "Appointment/Visit/Blocks/VisitReconnecting",
  component: VisitReconnecting,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: RECONNECTING_COPY, busy: false, onRetry: fn() },
} satisfies Meta<typeof VisitReconnecting>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Offline: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Try now" }));
    expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};

export const Trying: Story = {
  args: { busy: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Trying…" })).toBeDisabled();
  },
};
