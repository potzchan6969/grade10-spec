import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { StepIndicator } from "./step-indicator";

const meta = {
  title: "Design System/Display/StepIndicator",
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

/** The same indicator moving on, as a stepper does when an order advances. */
export const UpcomingBecomesCompleted: Story = {
  render: () => {
    const [done, setDone] = useState(false);
    return (
      <div>
        <StepIndicator state={done ? "completed" : "upcoming"} />
        <button onClick={() => setDone(true)} type="button">
          Advance
        </button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const ring = () =>
      canvasElement.querySelector('[data-slot="checkbox-button"]');
    await expect(ring()).not.toHaveAttribute("data-checked");
    await userEvent.click(within(canvasElement).getByText("Advance"));
    await expect(ring()).toHaveAttribute("data-checked");
  },
};
