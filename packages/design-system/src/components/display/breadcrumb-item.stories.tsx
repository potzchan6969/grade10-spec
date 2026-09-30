import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadcrumbItem } from "./breadcrumb-item";
import { Breadcrumbs } from "./breadcrumbs";

const meta = {
  title: "Components/BreadcrumbItem",
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

export const Default: Story = {};
export const Current: Story = {
  args: { current: true, children: "Current Page", href: undefined },
};
export const Disabled: Story = { args: { disabled: true } };
export const DisabledCurrent: Story = {
  args: { current: true, disabled: true, children: "Current Page" },
};
