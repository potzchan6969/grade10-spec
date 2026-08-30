import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberInput } from "./number-input";

const meta = {
  title: "Components/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  args: {
    label: "Number Input",
    message: "Message",
    placeholder: "1",
    unit: "%",
    defaultValue: 100,
  },
  argTypes: {
    status: {
      control: "inline-radio",
      options: ["default", "error", "success"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  args: { status: "error", message: "Enter a number between 0 and 100" },
};
export const Success: Story = {
  args: { status: "success", message: "Looks good" },
};

/** The clear button is dropped while disabled — a field that cannot be edited
 * cannot be cleared. */
export const Disabled: Story = { args: { disabled: true, onClear: () => {} } };

export const Loading: Story = { args: { loading: true } };

export const WithoutUnit: Story = { args: { unit: undefined } };
export const WithoutLabel: Story = { args: { label: undefined } };
export const WithoutMessage: Story = { args: { message: undefined } };

/** The trailing slot holds one thing at a time: spinner, then status icon,
 * then the clear button. */
export const WithClear: Story = { args: { onClear: () => {} } };

export const WithPrefix: Story = {
  args: { prefix: "US$", unit: undefined, defaultValue: "4,800" },
};
