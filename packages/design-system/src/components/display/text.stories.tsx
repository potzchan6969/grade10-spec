import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./text";

const meta = {
  title: "Components/Text",
  component: Text,
  tags: ["autodocs"],
  args: { children: "The quick brown fox" },
  argTypes: {
    size: { control: "select", options: ["xs", "sm", "base", "lg", "xl"] },
    weight: { control: "select", options: ["regular", "medium", "bold"] },
    tone: {
      control: "select",
      options: ["primary", "secondary", "muted", "success", "error"],
    },
    as: { control: "select", options: ["span", "p", "div", "h2", "h3"] },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The type scale. `base` is the default, so it needs no story of its own. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text {...args} size="xs" />
      <Text {...args} size="sm" />
      <Text {...args} size="lg" />
      <Text {...args} size="xl" />
    </div>
  ),
};

export const Weights: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text {...args} weight="medium" />
      <Text {...args} weight="bold" />
    </div>
  ),
};

/** Tone carries meaning, not emphasis — `success` and `error` read as status. */
export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Text {...args} tone="secondary" />
      <Text {...args} tone="muted" />
      <Text {...args} tone="success" />
      <Text {...args} tone="error" />
    </div>
  ),
};

/** `as` changes the tag only; the type scale still comes from `size`. */
export const AsHeading: Story = {
  args: { as: "h3", size: "lg", weight: "medium", children: "Section heading" },
};

/** `truncate` clamps to one line, so a long market label cannot break a row. */
export const Truncated: Story = {
  args: {
    truncate: true,
    children: "Will the price of Bitcoin close above $100,000 this Friday?",
  },
  decorators: [
    (Story) => (
      <div className="w-48">
        <Story />
      </div>
    ),
  ],
};
