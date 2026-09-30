import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadcrumbEllipsis } from "./breadcrumb-ellipsis";
import { Breadcrumbs } from "./breadcrumbs";

const meta = {
  title: "Components/BreadcrumbEllipsis",
  component: BreadcrumbEllipsis,
  tags: ["autodocs"],
  // A crumb is a list item: it renders inside the trail's list.
  decorators: [
    (Story) => (
      <Breadcrumbs>
        <Story />
      </Breadcrumbs>
    ),
  ],
} satisfies Meta<typeof BreadcrumbEllipsis>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
