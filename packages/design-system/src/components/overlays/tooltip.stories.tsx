import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../forms/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const meta = {
  title: "Design System/Overlays/Tooltip",
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
  parameters: {
    verification: { caseId: "vc_e7580c46-7ac8-4d51-ac68-a1c762a94595" },
  },
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
  parameters: {
    verification: { caseId: "vc_07229736-21a0-4ba5-ab9c-73f20b36ca6c" },
  },
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
  parameters: {
    verification: { caseId: "vc_71b898ea-a357-4d43-ad1b-f9bc7ceadda7" },
  },
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
  parameters: {
    verification: { caseId: "vc_d0448080-e36c-4680-96f1-07d4b973b0c1" },
  },
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
  parameters: {
    verification: { caseId: "vc_212af1a4-50dd-4d8b-8748-a65c0268fa5d" },
  },
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
