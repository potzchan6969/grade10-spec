import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextInput } from "./text-input";

const meta = {
  title: "Design System/Forms/TextInput",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_47ba30b2-7bfa-4f6c-b890-9c2e38abf5f1" },
  },
  args: { defaultValue: "Value" },
};

/** Figma's `status=placeholder` is not a prop — it is what an empty field
 * looks like. */
export const Placeholder: Story = {
  parameters: {
    verification: { caseId: "vc_55b44eb7-6325-46ea-8101-61b23d1db5ef" },
  },
};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  parameters: {
    verification: { caseId: "vc_34cd22be-5941-4085-9f22-533f9a384711" },
  },
  args: {
    status: "error",
    defaultValue: "Value",
    message: "Enter a valid value",
  },
};
export const Success: Story = {
  parameters: {
    verification: { caseId: "vc_99631089-ae0f-4ee4-a76c-bd7188ede139" },
  },
  args: { status: "success", defaultValue: "Value", message: "Looks good" },
};

export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_4dd81888-a09a-4c69-8992-3dca1e08fc2c" },
  },
  args: { disabled: true, value: "Value" },
};

/** The spinner takes the trailing slot from the status icon, and the message
 * keeps its tone — while loading the status is stale, not gone. */
export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_d60f8e2d-6c10-4b96-996f-9f8bbbf9c436" },
  },
  args: { loading: true, defaultValue: "Value" },
};
export const LoadingWithStatus: Story = {
  parameters: {
    verification: { caseId: "vc_d45084fe-0271-478f-b43f-89f884ca05ba" },
  },
  args: { loading: true, status: "error", defaultValue: "Value" },
};

/** No visible label, so the field takes its name from `aria-label`. */
export const WithoutLabel: Story = {
  parameters: {
    verification: { caseId: "vc_bf472a9f-6964-4bf1-bbbc-5b0e88847feb" },
  },
  args: { label: undefined, "aria-label": "Input Field" },
};
export const WithoutMessage: Story = {
  parameters: {
    verification: { caseId: "vc_f4ca1c3d-ef39-4135-b682-aa501fe4a660" },
  },
  args: { message: undefined },
};

export const WithPrefix: Story = {
  parameters: {
    verification: { caseId: "vc_576adda5-ea55-4c23-bbbc-135215e644b7" },
  },
  args: { prefix: "US$", defaultValue: "4,800" },
};
