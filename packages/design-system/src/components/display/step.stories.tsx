import type { Meta, StoryObj } from "@storybook/react-vite";
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

export const Upcoming: Story = {
  args: { state: "upcoming" },
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
