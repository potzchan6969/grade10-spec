import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BOOKED_ACTS, ENDED_ACTS, TODAY_ACTS } from "./fixtures";
import { VisitActRow } from "./visit-act-row";

const meta = {
  title: "Appointment Visit/VisitActRow",
  component: VisitActRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { acts: BOOKED_ACTS },
} satisfies Meta<typeof VisitActRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Presses run here; links leave, Directions outside the site. */
export const Booked: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Change time" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Directions" })).toHaveAttribute(
      "target",
      "_blank",
    );
  },
};

export const Today: Story = { args: { acts: TODAY_ACTS } };

export const Ended: Story = { args: { acts: ENDED_ACTS } };

/** No acts draws nothing. */
export const None: Story = {
  args: { acts: [] },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-slot="act-row"]')).toBeNull();
  },
};
