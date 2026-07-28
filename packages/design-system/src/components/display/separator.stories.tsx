import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta = {
  title: "Components/Separator",
  component: Separator,
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
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
