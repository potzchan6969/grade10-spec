import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Stepper } from "./stepper-input";

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  args: {
    label: "Number Stepper",
    message: "Message",
    placeholder: "10",
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["default", "error", "success"],
    },
    size: {
      control: "inline-radio",
      options: ["md", "lg"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultValue: 10 } };

/** Figma's `placeholder=true` is not a prop — it is what an empty field
 * looks like. */
export const Placeholder: Story = { args: { defaultValue: undefined } };

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  args: {
    status: "error",
    defaultValue: 10,
    message: "Enter a value between 1–100",
  },
};
export const Success: Story = {
  args: { status: "success", defaultValue: 10, message: "Looks good" },
};

export const Large: Story = { args: { size: "lg", defaultValue: 10 } };

export const Disabled: Story = { args: { disabled: true, defaultValue: 10 } };

export const WithoutLabel: Story = {
  args: { label: undefined, defaultValue: 10 },
};
export const WithoutMessage: Story = {
  args: { message: undefined, defaultValue: 10 },
};

function BoundedExample() {
  const [value, setValue] = useState(1);
  return (
    <Stepper
      label="Number Stepper"
      max={5}
      message="Enter a value between 1–5"
      min={1}
      onValueChange={setValue}
      value={value}
    />
  );
}

/** Minus disables at `min`, plus at `max`. */
export const AtBounds: Story = {
  render: () => <BoundedExample />,
};
