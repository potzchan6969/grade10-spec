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
  title: "Design System/Display/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: {
    title: "Title",
    description: "Description",
    actions: defaultActions,
  },
  argTypes: {
    layout: {
      control: "inline-radio",
      options: ["block", "inline"],
    },
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

/** Figma's block layout — `layout=block`, `status=default`. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_679dfc69-7b4b-46bc-ab41-16b1cf8db07b" },
  },
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: Storybook export name matches Figma variant label.
export const Error: Story = {
  parameters: {
    verification: { caseId: "vc_1dba1916-bf52-4f34-b55f-2021c82b0bf6" },
  },
  args: { status: "error" },
};

export const Warning: Story = {
  parameters: {
    verification: { caseId: "vc_4efb96ee-7f76-4633-96ff-a89d065d1838" },
  },
  args: { status: "warning" },
};

export const Success: Story = {
  parameters: {
    verification: { caseId: "vc_650bcdc6-3ff7-4f88-8b30-bef87d1b1dd6" },
  },
  args: { status: "success" },
};

/** Figma's inline layout — icon, title, actions, and dismiss on one row. */
export const Inline: Story = {
  parameters: {
    verification: { caseId: "vc_df2eab19-a84f-4796-96d4-883f08caee74" },
  },
  args: {
    layout: "inline",
    description: undefined,
  },
};

export const InlineError: Story = {
  parameters: {
    verification: { caseId: "vc_bc3e585e-36b6-4cbc-b2b0-959b1ebaf91e" },
  },
  args: {
    layout: "inline",
    status: "error",
    description: undefined,
  },
};

export const InlineWarning: Story = {
  parameters: {
    verification: { caseId: "vc_be71907f-69e2-4bd4-8400-7fb22449dbe0" },
  },
  args: {
    layout: "inline",
    status: "warning",
    description: undefined,
  },
};

export const InlineSuccess: Story = {
  parameters: {
    verification: { caseId: "vc_2be85a2d-e51b-4633-80d0-373d4959a279" },
  },
  args: {
    layout: "inline",
    status: "success",
    description: undefined,
  },
};

export const WithoutActions: Story = {
  parameters: {
    verification: { caseId: "vc_db79360e-58fb-4f17-9439-a0641b2330be" },
  },
  args: { actions: undefined },
};

export const WithoutDismiss: Story = {
  parameters: {
    verification: { caseId: "vc_6fe9876c-4c94-4cbe-8e87-b1d8e8a25867" },
  },
  args: { dismissible: false },
};

export const TitleOnly: Story = {
  parameters: {
    verification: { caseId: "vc_27a7a35f-3113-4604-8940-44850ce289fd" },
  },
  args: {
    description: undefined,
    actions: undefined,
    dismissible: false,
  },
};
