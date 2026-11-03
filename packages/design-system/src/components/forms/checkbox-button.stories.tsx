import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxButton } from "./checkbox-button";

const meta = {
  title: "Design System/Forms/CheckboxButton",
  component: CheckboxButton,
  tags: ["autodocs"],
  args: { "aria-label": "Select" },
} satisfies Meta<typeof CheckboxButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  parameters: {
    verification: { caseId: "vc_ab3540d3-2570-43fb-9634-d47a5eac24f9" },
  },
  args: { defaultChecked: true },
};
export const Unchecked: Story = {
  parameters: {
    verification: { caseId: "vc_0f5829c1-c3f0-4ff6-8e99-107a3bda7138" },
  },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_6a16759f-0a8f-4e3e-ae1f-13a15ad64e09" },
  },
  args: { disabled: true, defaultChecked: true },
};
export const DisabledUnchecked: Story = {
  name: "Disabled unchecked",
  args: { disabled: true },
  parameters: {
    verification: { caseId: "vc_d17e0efb-05a6-4754-8827-5338efc0df70" },
    docs: {
      description: {
        story:
          "Figma `2176:4095`: background-subtle fill and dashed border — not an opacity wash.",
      },
    },
  },
};

/** The four states Figma draws, as a 2x2. */
export const States: Story = {
  parameters: {
    verification: { caseId: "vc_d76d102d-d799-4978-9156-604a125106e5" },
  },
  render: () => (
    <div className="flex gap-3">
      <CheckboxButton aria-label="Checked" defaultChecked />
      <CheckboxButton aria-label="Unchecked" />
      <CheckboxButton aria-label="Disabled checked" defaultChecked disabled />
      <CheckboxButton aria-label="Disabled unchecked" disabled />
    </div>
  ),
};
