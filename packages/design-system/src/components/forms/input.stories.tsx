import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  args: { placeholder: "Enter an amount" },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "1,250" } };
export const Disabled: Story = { args: { disabled: true, value: "1,250" } };
export const Invalid: Story = { args: { "aria-invalid": true, value: "abc" } };
export const Password: Story = {
  args: { type: "password", placeholder: "Password" },
};
/** A file input has no placeholder to fall back on, so it needs a name. */
export const File: Story = {
  args: {
    "aria-label": "Upload a statement",
    type: "file",
    placeholder: undefined,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="amount">Amount</Label>
      <Input id="amount" {...args} />
    </div>
  ),
};
