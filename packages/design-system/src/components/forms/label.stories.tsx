import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  args: { children: "Email" },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithInput: Story = {
  render: (args) => (
    <div className="flex w-64 flex-col gap-2">
      <Label htmlFor="email" {...args} />
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  args: { children: "Remember me" },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="remember" />
      <Label htmlFor="remember" {...args} />
    </div>
  ),
};

/** `peer-disabled:` dims the label when its control is disabled. */
export const DisabledControl: Story = {
  args: { children: "Remember me" },
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="remember-disabled" disabled />
      <Label htmlFor="remember-disabled" {...args} />
    </div>
  ),
};
