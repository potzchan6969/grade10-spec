import type { Meta, StoryObj } from "@storybook/react-vite";
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

export const Upcoming: Story = {
  args: { state: "upcoming" },
};

export const Progress: Story = {
  args: { state: "progress" },
};

export const Completed: Story = {
  args: { state: "completed" },
};
