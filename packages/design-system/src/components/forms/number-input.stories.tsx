import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberInput } from "./number-input";

const meta = {
  title: "Design System/Forms/NumberInput",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_6f3b4674-67bc-4050-87f8-1a1d3dc525dd" },
  },
};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  parameters: {
    verification: { caseId: "vc_dfe7e79c-d5ce-4ac9-92aa-2bf229851ae5" },
  },
  args: { status: "error", message: "Enter a number between 0 and 100" },
};
export const Success: Story = {
  parameters: {
    verification: { caseId: "vc_32f0d8fb-a7cc-47c5-b170-53d6ebe19f5a" },
  },
  args: { status: "success", message: "Looks good" },
};

/** The clear button is dropped while disabled — a field that cannot be edited
 * cannot be cleared. */
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_0e4c1db2-c162-4bb6-aaa2-cc4d31e8dd91" },
  },
  args: { disabled: true, onClear: () => {} },
};

export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_6213267e-8ef5-423c-95b8-4b98a5a38d3d" },
  },
  args: { loading: true },
};

export const WithoutUnit: Story = {
  parameters: {
    verification: { caseId: "vc_28379032-a4be-420c-b185-f5965e82cb11" },
  },
  args: { unit: undefined },
};
/** No visible label, so the field takes its name from `aria-label`. */
export const WithoutLabel: Story = {
  parameters: {
    verification: { caseId: "vc_8d8e4e27-94e8-4793-9d2c-881e9263b637" },
  },
  args: { label: undefined, "aria-label": "Amount" },
};
export const WithoutMessage: Story = {
  parameters: {
    verification: { caseId: "vc_008ea84b-0722-4c32-83fc-a072ab17bef7" },
  },
  args: { message: undefined },
};

/** The trailing slot holds one thing at a time: spinner, then status icon,
 * then the clear button. */
export const WithClear: Story = {
  parameters: {
    verification: { caseId: "vc_55bca29d-d606-4374-9223-748895745345" },
  },
  args: { onClear: () => {} },
};

export const WithPrefix: Story = {
  parameters: {
    verification: { caseId: "vc_f564b11c-8ffc-46a2-ab24-8cbf3ef52587" },
  },
  args: { prefix: "US$", unit: undefined, defaultValue: "4,800" },
};
