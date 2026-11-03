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
  parameters: {
    verification: { caseId: "vc_0f3be77b-855e-4577-9746-0cb0b212df6f" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Try now" }));
    expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};

export const Trying: Story = {
  parameters: {
    verification: { caseId: "vc_ad3e19ee-607c-4596-a609-8d0e86007a50" },
  },
  args: { busy: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Trying…" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
  },
};

/** A refused retry says why beside Try now, which is pressable again. */
export const RetryFailed: Story = {
  parameters: {
    verification: { caseId: "vc_dce2a552-53b7-44a9-9ea2-9400fc4c1bc4" },
  },
  args: {
    retryFailed: "Still can't reach us. Check your connection and try again.",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "Still can't reach us. Check your connection and try again.",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Try now" }));
    expect(args.onRetry).toHaveBeenCalledTimes(1);
  },
};
