import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, InputShell, InputStatusIcon } from "./input";

/**
 * `InputShell` is the label / field box / message stack that `TextInput`,
 * `NumberInput` and `SearchInput` all compose, and `Input` is the bare control
 * that sits inside it. Neither is a Figma component on its own — the three
 * published sets are. Reach for the shell only when building a field the
 * design has not drawn yet.
 */
const meta = {
  title: "Design System/Forms/InputShell",
  component: InputShell,
  tags: ["autodocs"],
  args: { label: "Input Field", message: "Message" },
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
  render: ({ status, ...args }) => (
    <InputShell
      {...args}
      status={status}
      trailing={<InputStatusIcon status={status ?? undefined} />}
    >
      <Input placeholder="Placeholder" />
    </InputShell>
  ),
} satisfies Meta<typeof InputShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_51a828d3-9b3d-4ae0-ac9f-df37fc755dd8" },
  },
};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  parameters: {
    verification: { caseId: "vc_2c6c4a2b-6918-469d-b013-9380c9080532" },
  },
  args: { status: "error", message: "Enter a valid amount" },
};
export const Success: Story = {
  parameters: {
    verification: { caseId: "vc_cdef25fd-17fb-423f-b33f-08da00b66d18" },
  },
  args: { status: "success", message: "Looks good" },
};

/** Disabled overrides every tone, including the status icon, and returns the
 * border to the resting one. */
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_b862d370-8b8e-4b1b-a588-8e90168ee372" },
  },
  args: { disabled: true, status: "error" },
};

/** The 48px rung, as Stepper Input's `lg`; its text stays `text-base` at every
 * width. */
export const Large: Story = {
  parameters: {
    verification: { caseId: "vc_560d1a54-89a2-440c-9e49-9f66e03b6db7" },
  },
  args: { size: "lg" },
};

export const WithoutLabel: Story = {
  parameters: {
    verification: { caseId: "vc_4f02cddd-47a0-426e-a5e6-4090cae60b10" },
  },
  args: { label: undefined },
};
export const WithoutMessage: Story = {
  parameters: {
    verification: { caseId: "vc_6dae821c-14f0-4f29-932d-381f27f38a70" },
  },
  args: { message: undefined },
};

/** Focus wins the border on every status, so an error field still shows where
 * the caret is. */
export const Statuses: Story = {
  parameters: {
    verification: { caseId: "vc_d748e714-c354-4b86-945a-5877426d66c8" },
  },
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(["default", "error", "success"] as const).map((status) => (
        <InputShell
          key={status}
          {...args}
          status={status}
          message={status}
          trailing={<InputStatusIcon status={status} />}
        >
          <Input placeholder="Placeholder" />
        </InputShell>
      ))}
    </div>
  ),
};
