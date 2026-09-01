import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../forms/button";
import { Alert } from "./alert";

const defaultActions = (
  <>
    <Button size="sm" variant="outline">
      Button
    </Button>
    <Button size="sm">Button</Button>
  </>
);

const meta = {
  title: "Components/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: {
    title: "Title",
    description: "Description",
    actions: defaultActions,
  },
  argTypes: {
    status: {
      control: "select",
      options: ["default", "error", "warning", "success"],
    },
    dismissible: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[560px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma's neutral informational alert — `status=default`. */
export const Default: Story = {};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Storybook export name matches Figma variant label.
export const Error: Story = {
  args: { status: "error" },
};

export const Warning: Story = {
  args: { status: "warning" },
};

export const Success: Story = {
  args: { status: "success" },
};

export const WithoutActions: Story = {
  args: { actions: undefined },
};

export const WithoutDismiss: Story = {
  args: { dismissible: false },
};

export const TitleOnly: Story = {
  args: {
    description: undefined,
    actions: undefined,
    dismissible: false,
  },
};
