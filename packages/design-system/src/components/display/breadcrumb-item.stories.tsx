import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadcrumbItem } from "./breadcrumb-item";
import { Breadcrumbs } from "./breadcrumbs";

const meta = {
  title: "Design System/Display/BreadcrumbItem",
  component: BreadcrumbItem,
  tags: ["autodocs"],
  // A crumb is a list item: it renders inside the trail's list.
  decorators: [
    (Story) => (
      <Breadcrumbs>
        <Story />
      </Breadcrumbs>
    ),
  ],
  args: { children: "Link", href: "#link" },
} satisfies Meta<typeof BreadcrumbItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_711a8714-ab91-4ff0-b2d4-5229149fee30" },
  },
};
export const Current: Story = {
  parameters: {
    verification: { caseId: "vc_961b6206-b466-46aa-8190-bf9b6efde41c" },
  },
  args: { current: true, children: "Current Page", href: undefined },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_00a3e072-20b1-4228-99fa-d672d51b92c9" },
  },
  args: { disabled: true },
};
export const DisabledCurrent: Story = {
  parameters: {
    verification: { caseId: "vc_ea3fd3b5-6c42-41ca-9bd5-143ec85a18ff" },
  },
  args: { current: true, disabled: true, children: "Current Page" },
};
