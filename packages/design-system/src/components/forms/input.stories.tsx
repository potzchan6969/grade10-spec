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
  title: "Components/InputShell",
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

export const Default: Story = {};

/** Exported as `ErrorStatus` rather than `Error`, which shadows the global. */
export const ErrorStatus: Story = {
  args: { status: "error", message: "Enter a valid amount" },
};
export const Success: Story = {
  args: { status: "success", message: "Looks good" },
};

/** Disabled overrides every tone, including the status icon, and returns the
 * border to the resting one. */
export const Disabled: Story = { args: { disabled: true, status: "error" } };

export const WithoutLabel: Story = { args: { label: undefined } };
export const WithoutMessage: Story = { args: { message: undefined } };

/** Focus wins the border on every status, so an error field still shows where
 * the caret is. */
export const Statuses: Story = {
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
