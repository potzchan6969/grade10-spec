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

/** `disabled` is Figma's other axis here — `Opacity/opacity-50` over the row. */
export const Disabled: Story = { args: { disabled: true } };

export const DisabledSmall: Story = { args: { disabled: true, size: "sm" } };

/** Omit `count` and the trailing number is not rendered — Figma's `showCount`. */
export const WithoutCount: Story = { args: { count: undefined } };
