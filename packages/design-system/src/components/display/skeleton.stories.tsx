import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Design System/Display/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    shape: { control: "select", options: ["text", "line", "block"] },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `block` stands in for a card or chart region. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_746001c5-e425-434f-8e3b-3f6c6969c60d" },
  },
};

/** `text` stands in for a short inline value, such as a price or an odds pill. */
export const Text: Story = {
  parameters: {
    verification: { caseId: "vc_89b668a7-1438-4fa1-b4cc-6714ec049579" },
  },
  args: { shape: "text" },
};

/** `line` fills its container, for a paragraph or a list row. */
export const Line: Story = {
  parameters: {
    verification: { caseId: "vc_47c6a8aa-8252-4dca-ab50-bc231e6bae41" },
  },
  args: { shape: "line" },
};

/** The shapes compose into a loading region without any extra CSS. */
export const LoadingRegion: Story = {
  parameters: {
    verification: { caseId: "vc_46cf42b7-cf3d-432a-b325-6ce03fcfee37" },
  },
  render: () => (
    <div className="flex flex-col gap-2">
      <Skeleton shape="line" />
      <Skeleton shape="block" />
    </div>
  ),
};
