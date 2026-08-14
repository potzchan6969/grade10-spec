import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxButton } from "./checkbox-button";

const meta = {
  title: "Components/CheckboxButton",
  component: CheckboxButton,
  tags: ["autodocs"],
  args: { "aria-label": "Select" },
} satisfies Meta<typeof CheckboxButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = { args: { defaultChecked: true } };
export const Unchecked: Story = {};
export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};
export const DisabledUnchecked: Story = { args: { disabled: true } };

/** The four states Figma draws, as a 2x2. */
export const States: Story = {
  render: () => (
    <div className="flex gap-3">
      <CheckboxButton aria-label="Checked" defaultChecked />
      <CheckboxButton aria-label="Unchecked" />
      <CheckboxButton aria-label="Disabled checked" defaultChecked disabled />
      <CheckboxButton aria-label="Disabled unchecked" disabled />
    </div>
  ),
};
