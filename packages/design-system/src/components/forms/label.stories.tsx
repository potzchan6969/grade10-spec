import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxButton } from "./checkbox-button";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "Design System/Forms/Label",
  component: Label,
  tags: ["autodocs"],
  args: { children: "Email" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_bfd711a7-fb85-4768-b2e3-a34efcc87dde" },
  },
};

export const WithInput: Story = {
  parameters: {
    verification: { caseId: "vc_c017e5c3-d5ad-4f06-888d-f68f4e7bf02c" },
  },
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="email" {...args} />
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  parameters: {
    verification: { caseId: "vc_1eb7ee9b-5e28-4de7-b69b-dcc31c9746eb" },
  },
  args: { children: "Remember me" },
  render: (args) => (
    <div className="flex items-center gap-2">
      <CheckboxButton id="remember" />
      <Label htmlFor="remember" {...args} />
    </div>
  ),
};

/** `peer-disabled:` dims the label when its control is disabled. */
export const DisabledControl: Story = {
  parameters: {
    verification: { caseId: "vc_b14fbdcd-1e8d-4fd2-9b6d-150c1efd3490" },
  },
  args: { children: "Remember me" },
  render: (args) => (
    <div className="flex items-center gap-2">
      <CheckboxButton id="remember-disabled" disabled />
      <Label htmlFor="remember-disabled" {...args} />
    </div>
  ),
};
