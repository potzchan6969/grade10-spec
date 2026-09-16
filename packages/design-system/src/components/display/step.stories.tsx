import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Step } from "./step";

const meta = {
  title: "Components/Step",
  component: Step,
  tags: ["autodocs"],
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["upcoming", "progress", "completed"],
    },
  },
  args: {
    label: "Step",
    description: "Description",
    state: "progress",
    showLeadingConnector: true,
    showTrailingConnector: true,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Step>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Progress: Story = {};

export const Completed: Story = {
  args: { state: "completed" },
};

/**
 * Connectors stay visible so the upcoming ring can be checked against the
 * horizontal `border-border` lines — same token, full strength (no
 * CheckboxButton `disabled` washout).
 */
export const Upcoming: Story = {
  args: {
    state: "upcoming",
    showLeadingConnector: true,
    showTrailingConnector: true,
  },
  play: async ({ canvasElement }) => {
    const ring = canvasElement.querySelector('[data-slot="checkbox-button"]');
    await expect(ring).toBeInstanceOf(HTMLElement);
    await expect(ring).not.toBeDisabled();
    await expect(ring).not.toHaveAttribute("data-checked");
  },
};

export const WithoutDescription: Story = {
  args: { description: undefined },
};

export const FirstStep: Story = {
  args: { showLeadingConnector: false },
};

export const LastStep: Story = {
  args: { showTrailingConnector: false },
};
