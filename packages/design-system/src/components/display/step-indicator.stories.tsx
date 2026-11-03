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
      options: ["upcoming", "progress", "completed", "error"],
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
  parameters: {
    verification: { caseId: "vc_6af9bff7-fd04-43d9-821b-3177abfbf1c0" },
  },
  args: { state: "upcoming" },
  play: async ({ canvasElement }) => {
    const ring = canvasElement.querySelector('[data-slot="checkbox-button"]');
    await expect(ring).toBeInstanceOf(HTMLElement);
    await expect(ring).not.toBeDisabled();
    await expect(ring).not.toHaveAttribute("data-checked");
  },
};

export const Progress: Story = {
  parameters: {
    verification: { caseId: "vc_b11f329c-1117-41eb-b8f2-1afc85f0c15f" },
  },
  args: { state: "progress" },
};

export const Completed: Story = {
  parameters: {
    verification: { caseId: "vc_b5506e1a-a213-4bf6-be82-135399b53154" },
  },
  args: { state: "completed" },
  play: async ({ canvasElement }) => {
    const ring = canvasElement.querySelector('[data-slot="checkbox-button"]');
    await expect(ring).toBeInstanceOf(HTMLElement);
    await expect(ring).not.toBeDisabled();
    await expect(ring).toHaveAttribute("data-checked");
  },
};

/**
 * Destructive cross for a step that failed — appended outside the Figma
 * set, sized to match the checkbox ring.
 */
export const ErrorState: Story = {
  parameters: {
    verification: { caseId: "vc_71c2e744-0012-46c5-8e46-d009dd2a9729" },
  },
  name: "Error",
  args: { state: "error" },
  play: async ({ canvasElement }) => {
    const indicator = canvasElement.querySelector(
      '[data-slot="step-indicator"][data-state="error"]',
    );
    await expect(indicator).toBeInstanceOf(HTMLElement);
  },
};

/** The same indicator moving on, as a stepper does when an order advances. */
export const UpcomingBecomesCompleted: Story = {
  parameters: {
    verification: { caseId: "vc_c570bf09-5050-4117-80de-9f93ee3fa181" },
  },
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
