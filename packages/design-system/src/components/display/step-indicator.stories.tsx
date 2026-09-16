import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { StepIndicator } from "./step-indicator";

const meta = {
  title: "Components/StepIndicator",
  component: StepIndicator,
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["upcoming", "progress", "completed"],
    },
  },
  args: {
    state: "upcoming",
  },
} satisfies Meta<typeof StepIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Empty ring at full-strength `border-border` — same token as the Step
 * connector. Must not use CheckboxButton `disabled` (`opacity-50`).
 */
export const Upcoming: Story = {
  args: { state: "upcoming" },
  play: async ({ canvasElement }) => {
    const ring = canvasElement.querySelector('[data-slot="checkbox-button"]');
    await expect(ring).toBeInstanceOf(HTMLElement);
    await expect(ring).not.toBeDisabled();
    await expect(ring).not.toHaveAttribute("data-checked");
  },
};

export const Progress: Story = {
  args: { state: "progress" },
};

export const Completed: Story = {
  args: { state: "completed" },
  play: async ({ canvasElement }) => {
    const ring = canvasElement.querySelector('[data-slot="checkbox-button"]');
    await expect(ring).toBeInstanceOf(HTMLElement);
    await expect(ring).not.toBeDisabled();
    await expect(ring).toHaveAttribute("data-checked");
  },
};
