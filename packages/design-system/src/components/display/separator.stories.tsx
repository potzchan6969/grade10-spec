import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta = {
  title: "Design System/Display/Separator",
  component: Separator,
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  parameters: {
    verification: { caseId: "vc_4f4de1a0-4062-43f9-b9d5-40de3c91c1e1" },
  },
  render: (args) => (
    <div className="w-64 text-sm">
      <div className="pb-3">Open positions</div>
      <Separator {...args} />
      <div className="pt-3 text-muted-foreground">Settled positions</div>
    </div>
  ),
};

/** Vertical separators stretch to the height of a flex row. */
export const Vertical: Story = {
  parameters: {
    verification: { caseId: "vc_2725dc1b-e502-4ce5-a106-30eba70e58ac" },
  },
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-6 items-center gap-3 text-sm">
      <span>Markets</span>
      <Separator {...args} />
      <span>Leaderboard</span>
      <Separator {...args} />
      <span>Settings</span>
    </div>
  ),
};
