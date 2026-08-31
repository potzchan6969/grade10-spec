import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { "aria-label": "Toggle setting" },
  argTypes: {
    size: { control: "select", options: ["lg", "md"] },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = { args: { defaultChecked: true } };
export const Unchecked: Story = {};
export const Medium: Story = { args: { size: "md" } };
export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
};
export const DisabledUnchecked: Story = { args: { disabled: true } };

/** The eight states Figma draws, as a 4×2 grid. */
export const States: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-6">
      <Switch aria-label="Large unchecked" />
      <Switch aria-label="Large unchecked disabled" disabled />
      <Switch aria-label="Medium unchecked" size="md" />
      <Switch aria-label="Medium unchecked disabled" disabled size="md" />
      <Switch aria-label="Large checked" defaultChecked />
      <Switch aria-label="Large checked disabled" defaultChecked disabled />
      <Switch aria-label="Medium checked" defaultChecked size="md" />
      <Switch
        aria-label="Medium checked disabled"
        defaultChecked
        disabled
        size="md"
      />
    </div>
  ),
};
