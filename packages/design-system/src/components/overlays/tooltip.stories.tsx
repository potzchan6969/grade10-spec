import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../forms/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover me
      </TooltipTrigger>
      <TooltipContent>Locks in at the current odds</TooltipContent>
    </Tooltip>
  ),
};

/** The arrow re-anchors itself per side. */
export const Sides: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline" />}>
            {side}
          </TooltipTrigger>
          <TooltipContent side={side}>Tooltip on {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

export const Open: Story = {
  args: { open: true },
  render: (args) => (
    <Tooltip {...args}>
      <TooltipTrigger render={<Button variant="outline" />}>
        Always open
      </TooltipTrigger>
      <TooltipContent>Locks in at the current odds</TooltipContent>
    </Tooltip>
  ),
};

/** The provider defaults to `delay={0}`; raise it to require a deliberate hover. */
export const Delayed: Story = {
  decorators: [
    (Story) => (
      <TooltipProvider delay={600}>
        <Story />
      </TooltipProvider>
    ),
  ],
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover and wait
      </TooltipTrigger>
      <TooltipContent>Shown after 600ms</TooltipContent>
    </Tooltip>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" />}>
        Hover me
      </TooltipTrigger>
      <TooltipContent>
        Predictions are settled against the closing price reported by the oracle
        at the end of the round.
      </TooltipContent>
    </Tooltip>
  ),
};
