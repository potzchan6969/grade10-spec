import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton";

const meta = {
  title: "Components/Skeleton",
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
export const Default: Story = {};

/** `text` stands in for a short inline value, such as a price or an odds pill. */
export const Text: Story = { args: { shape: "text" } };

/** `line` fills its container, for a paragraph or a list row. */
export const Line: Story = { args: { shape: "line" } };

/** The shapes compose into a loading region without any extra CSS. */
export const LoadingRegion: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Skeleton shape="line" />
      <Skeleton shape="block" />
    </div>
  ),
};
