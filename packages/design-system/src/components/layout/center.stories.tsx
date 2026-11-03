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
  title: "Design System/Layout/Center",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_7e362c7d-f177-47c1-8f37-969bc79094f0" },
  },
};

/** `horizontal` centres left-to-right only, leaving the content at the top. */
export const Horizontal: Story = {
  parameters: {
    verification: { caseId: "vc_0abf1bd6-477d-4321-be2a-fcfc70bc2bf1" },
  },
  args: { axis: "horizontal" },
};

/** `vertical` centres top-to-bottom only, leaving the content at the left. */
export const Vertical: Story = {
  parameters: {
    verification: { caseId: "vc_e23214bc-5dc8-441d-877c-8cc9644204ee" },
  },
  args: { axis: "vertical" },
};

/** Sizing props pass through to `style`, so a number is pixels and `'100%'` works. */
export const Sized: Story = {
  parameters: {
    verification: { caseId: "vc_f584b278-295f-4330-b3f1-7e80e24e3bf7" },
  },
  args: { width: "100%", maxWidth: 420, minHeight: 160, height: undefined },
};

/** Horizontal padding. The rungs match `Stack`'s gap scale. */
export const PaddingInline: Story = {
  parameters: {
    verification: { caseId: "vc_3071caf0-e217-46f0-8564-f8ab28f66dfd" },
  },
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
  parameters: {
    verification: { caseId: "vc_01cf4306-f3f9-44fa-8235-837f5eb96bcb" },
  },
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
  parameters: {
    verification: { caseId: "vc_1e97e3f0-fca2-46bb-a744-ae00d2f6a6db" },
  },
  args: { padding: "lg", paddingInline: "none", height: undefined },
};

/** `inline` swaps `flex` for `inline-flex`, so it sits in a run of text. */
export const Inline: Story = {
  parameters: {
    verification: { caseId: "vc_8a4f6bf8-50a2-4259-9a57-993c59d0852f" },
  },
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
