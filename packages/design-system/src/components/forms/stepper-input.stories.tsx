import { Trash } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { StepperInput } from "./stepper-input";

const meta = {
  title: "Components/StepperInput",
  component: StepperInput,
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
} satisfies Meta<typeof StepperInput>;

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
    <StepperInput
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

/** Step size on ± buttons; middle value uses grouping separators. */
export const WithStepAmount: Story = {
  args: {
    label: "Private maximum",
    message: "Min.: HK$11,950",
    min: 11_950,
    step: 250,
    defaultValue: 11_950,
    stepAmountLabel: "$250",
    formatValue: (value: number) =>
      value.toLocaleString("en-HK", { maximumFractionDigits: 0 }),
    decrementLabel: "Decrease by $250",
    incrementLabel: "Increase by $250",
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

/** At `min`, decrement stays enabled and runs a custom action (e.g. remove). */
export const AtMinAction: Story = {
  render: function AtMinActionExample() {
    const [value, setValue] = useState(1);
    const [removed, setRemoved] = useState(false);
    if (removed) {
      return <p className="text-sm text-secondary-foreground">Removed</p>;
    }
    return (
      <StepperInput
        decrementAtMinIcon={<Trash aria-hidden />}
        decrementAtMinLabel="Remove item"
        label="Cart quantity"
        max={5}
        min={1}
        onDecrementAtMin={() => setRemoved(true)}
        onValueChange={setValue}
        value={value}
      />
    );
  },
};
