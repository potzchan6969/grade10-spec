import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
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
    // A step is a list item; `Stepper` is that list everywhere but here.
    (Story) => (
      <ol className="m-0 w-64 list-none p-0">
        <Story />
      </ol>
    ),
  ],
} satisfies Meta<typeof Step>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The step in progress is the current one, and says so. */
export const Progress: Story = {
  play: async ({ canvasElement }) => {
    const step = within(canvasElement).getByRole("listitem");
    await expect(step).toHaveAttribute("aria-current", "step");
  },
};

export const Completed: Story = {
  args: { state: "completed" },
  play: async ({ canvasElement }) => {
    const step = within(canvasElement).getByRole("listitem");
    await expect(step).not.toHaveAttribute("aria-current");
  },
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
    await expect(
      within(canvasElement).getByRole("listitem"),
    ).not.toHaveAttribute("aria-current");
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
