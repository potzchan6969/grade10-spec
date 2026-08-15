import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Divider } from "./divider";

const Box = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
    {children}
  </div>
);

const meta = {
  title: "Components/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Unlabelled, this forwards straight to `Separator`. */
export const Default: Story = {};

/** The labelled case: a line, the label, a line. */
export const WithLabel: Story = { args: { label: "or" } };

/** In context — the reason the labelled case exists. */
export const BetweenContent: Story = {
  args: { label: "or" },
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Box>Sign in with email</Box>
      <Divider {...args} />
      <Box>Continue with Google</Box>
    </div>
  ),
};

/** Vertical needs a parent with a height, since the line grows to fill it. */
export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="flex h-24 flex-row items-stretch gap-4">
      <Box>Left</Box>
      <Divider {...args} />
      <Box>Right</Box>
    </div>
  ),
};

/** A vertical label pads the block axis instead of the inline one. */
export const VerticalWithLabel: Story = {
  args: { orientation: "vertical", label: "or" },
  render: (args) => (
    <div className="flex h-40 flex-row items-stretch gap-4">
      <Box>Left</Box>
      <Divider {...args} />
      <Box>Right</Box>
    </div>
  ),
};

/** A consumer's own `aria-label` wins over the rendered label. */
export const CustomAccessibleName: Story = {
  args: { label: "or", "aria-label": "Alternative sign-in methods" },
};
