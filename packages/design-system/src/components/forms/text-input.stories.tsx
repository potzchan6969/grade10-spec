import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "./text-input";

const meta = {
  title: "Components/TextInput",
  component: TextInput,
  tags: ["autodocs"],
  args: {
    label: "Input Field",
    message: "Message",
    placeholder: "Placeholder",
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
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultValue: "Value" } };

/** Figma's `status=placeholder` is not a prop — it is what an empty field
 * looks like. */
export const Placeholder: Story = {};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  args: {
    status: "error",
    defaultValue: "Value",
    message: "Enter a valid value",
  },
};
export const Success: Story = {
  args: { status: "success", defaultValue: "Value", message: "Looks good" },
};

export const Disabled: Story = { args: { disabled: true, value: "Value" } };

/** The spinner takes the trailing slot from the status icon, and the message
 * keeps its tone — while loading the status is stale, not gone. */
export const Loading: Story = {
  args: { loading: true, defaultValue: "Value" },
};
export const LoadingWithStatus: Story = {
  args: { loading: true, status: "error", defaultValue: "Value" },
};

export const WithoutLabel: Story = { args: { label: undefined } };
export const WithoutMessage: Story = { args: { message: undefined } };

export const WithPrefix: Story = {
  args: { prefix: "US$", defaultValue: "4,800" },
};
