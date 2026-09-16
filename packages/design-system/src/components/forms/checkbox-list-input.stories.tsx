import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxListInput } from "./checkbox-list-input";

const meta = {
  title: "Components/CheckboxListInput",
  component: CheckboxListInput,
  tags: ["autodocs"],
  args: { children: "Label", count: "10", defaultChecked: true },
  argTypes: {
    size: { control: "inline-radio", options: ["default", "sm"] },
  },
} satisfies Meta<typeof CheckboxListInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Unchecked: Story = { args: { defaultChecked: false } };
export const Small: Story = { args: { size: "sm" } };

/** `disabled` dims the label and count; the control keeps its own disabled drawing. */
export const Disabled: Story = {
  name: "Disabled checked",
  args: { disabled: true },
};

/** Cap-refuse pattern: dashed unchecked control beside a dimmed label. */
export const DisabledUnchecked: Story = {
  name: "Disabled unchecked",
  args: { disabled: true, defaultChecked: false },
  parameters: {
    docs: {
      description: {
        story:
          "Matches Winner Order Save for future at the address-book cap: label dimmed, CheckboxButton dashed / background-subtle.",
      },
    },
  },
};

export const DisabledSmall: Story = {
  name: "Disabled small",
  args: { disabled: true, size: "sm" },
};

/** Omit `count` and the trailing number is not rendered — Figma's `showCount`. */
export const WithoutCount: Story = { args: { count: undefined } };
