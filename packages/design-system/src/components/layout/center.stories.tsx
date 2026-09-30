import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Center } from "./center";

const Box = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
    {children}
  </div>
);

/** A visible box, so where the content sits inside it is the thing you read. */
const Frame = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md border border-dashed">{children}</div>
);

const meta = {
  title: "Components/Center",
  component: Center,
  tags: ["autodocs"],
  args: {
    children: <Box>Centred</Box>,
    width: 320,
    height: 120,
  },
  argTypes: {
    axis: {
      control: "select",
      options: ["both", "horizontal", "vertical"],
    },
    padding: { control: "select", options: ["none", "xs", "sm", "md", "lg"] },
  },
  decorators: [
    (Story) => (
      <Frame>
        <Story />
      </Frame>
    ),
  ],
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `horizontal` centres left-to-right only, leaving the content at the top. */
export const Horizontal: Story = { args: { axis: "horizontal" } };

/** `vertical` centres top-to-bottom only, leaving the content at the left. */
export const Vertical: Story = { args: { axis: "vertical" } };

/** Sizing props pass through to `style`, so a number is pixels and `'100%'` works. */
export const Sized: Story = {
  args: { width: "100%", maxWidth: 420, minHeight: 160, height: undefined },
};

/** Horizontal padding. The rungs match `Stack`'s gap scale. */
export const PaddingInline: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Center {...args} axis="vertical" paddingInline="none">
        <Box>none</Box>
      </Center>
      <Center {...args} axis="vertical" paddingInline="xs">
        <Box>xs</Box>
      </Center>
      <Center {...args} axis="vertical" paddingInline="sm">
        <Box>sm</Box>
      </Center>
      <Center {...args} axis="vertical" paddingInline="md">
        <Box>md</Box>
      </Center>
      <Center {...args} axis="vertical" paddingInline="lg">
        <Box>lg</Box>
      </Center>
    </div>
  ),
  args: { height: 56 },
};

/** Vertical padding, on the same scale. */
export const PaddingBlock: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Center {...args} axis="horizontal" paddingBlock="none">
        <Box>none</Box>
      </Center>
      <Center {...args} axis="horizontal" paddingBlock="xs">
        <Box>xs</Box>
      </Center>
      <Center {...args} axis="horizontal" paddingBlock="sm">
        <Box>sm</Box>
      </Center>
      <Center {...args} axis="horizontal" paddingBlock="md">
        <Box>md</Box>
      </Center>
      <Center {...args} axis="horizontal" paddingBlock="lg">
        <Box>lg</Box>
      </Center>
    </div>
  ),
  args: { height: undefined },
};

/** `padding` sets both axes; a per-axis prop replaces it rather than stacking. */
export const PaddingPrecedence: Story = {
  args: { padding: "lg", paddingInline: "none", height: undefined },
};

/** `inline` swaps `flex` for `inline-flex`, so it sits in a run of text. */
export const Inline: Story = {
  render: (args) => (
    // A `div` rather than a `p`: the centred box is a `div`, and flow content
    // inside a paragraph is invalid HTML that React warns about.
    <div className="text-sm">
      A badge{" "}
      <Center {...args} inline width={undefined} height={undefined}>
        <Box>here</Box>
      </Center>{" "}
      sits on the text baseline.
    </div>
  ),
};
