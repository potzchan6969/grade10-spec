import { Trash } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { StepperInput } from "./stepper-input";

const meta = {
  title: "Design System/Forms/StepperInput",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_a3951377-8a38-43e1-8c8b-a2b627f1cd9d" },
  },
  args: { defaultValue: 10 },
};

/** Figma's `placeholder=true` is not a prop — it is what an empty field
 * looks like. */
export const Placeholder: Story = {
  parameters: {
    verification: { caseId: "vc_cacacd84-1e2d-4393-becb-3e62c4a3d6f1" },
  },
  args: { defaultValue: undefined },
};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  parameters: {
    verification: { caseId: "vc_8f9b0920-5ca2-40b4-99c9-a85e7de1434e" },
  },
  args: {
    status: "error",
    defaultValue: 10,
    message: "Enter a value between 1–100",
  },
};
export const Success: Story = {
  parameters: {
    verification: { caseId: "vc_e099866a-b4d3-4755-ba67-b985bc1ba84d" },
  },
  args: { status: "success", defaultValue: 10, message: "Looks good" },
};

export const Large: Story = {
  parameters: {
    verification: { caseId: "vc_a4383971-8217-44cc-ab8e-426660a1f113" },
  },
  args: { size: "lg", defaultValue: 10 },
};

export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_79afd4ce-93b5-47f9-98b8-f90b65490129" },
  },
  args: { disabled: true, defaultValue: 10 },
};

/** No visible label, so the field takes its name from `aria-label`. */
export const WithoutLabel: Story = {
  parameters: {
    verification: { caseId: "vc_88d94fde-131d-4ae1-8299-5ea5d60a5fba" },
  },
  args: { label: undefined, "aria-label": "Quantity", defaultValue: 10 },
};
export const WithoutMessage: Story = {
  parameters: {
    verification: { caseId: "vc_b9df34e3-cc7c-408b-8509-7aa03fcdc22c" },
  },
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
  parameters: {
    verification: { caseId: "vc_31ec9797-6d7d-4505-9f3f-83203d86562d" },
  },
  render: () => <BoundedExample />,
};

/** Step size on ± buttons; middle value uses grouping separators. */
export const WithStepAmount: Story = {
  parameters: {
    verification: { caseId: "vc_2d65fd3e-947f-493f-b1f9-68d214358ef0" },
  },
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
  parameters: {
    verification: { caseId: "vc_d8545780-e7c8-487a-8103-c9de28932506" },
  },
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
