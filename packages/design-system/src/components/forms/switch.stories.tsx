import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch";

const meta = {
  title: "Design System/Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: { "aria-label": "Toggle setting" },
  argTypes: {
    size: { control: "select", options: ["lg", "md"] },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  parameters: {
    verification: { caseId: "vc_ba5daae0-1864-41b4-a07a-82095e06a8cc" },
  },
  args: { defaultChecked: true },
};
export const Unchecked: Story = {
  parameters: {
    verification: { caseId: "vc_3b48281b-5f68-40db-99de-db74710787d3" },
  },
};
export const Medium: Story = {
  parameters: {
    verification: { caseId: "vc_f9fbd141-7f7e-4db6-92b0-589346aa8fd4" },
  },
  args: { size: "md" },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_17b949e0-8b66-407d-b916-9090ce9d02f6" },
  },
  args: { disabled: true, defaultChecked: true },
};
export const DisabledUnchecked: Story = {
  parameters: {
    verification: { caseId: "vc_0bf53005-6ee1-4434-a8aa-db1a974a744e" },
  },
  args: { disabled: true },
};

/** The eight states Figma draws, as a 4×2 grid. */
export const States: Story = {
  parameters: {
    verification: { caseId: "vc_353c5f13-1f04-45bc-a96a-af744b314667" },
  },
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
