import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadcrumbEllipsis } from "./breadcrumb-ellipsis";
import { Breadcrumbs } from "./breadcrumbs";

const meta = {
  title: "Design System/Display/BreadcrumbEllipsis",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_efdd08ec-9459-495b-a1a9-025f3e0801e5" },
  },
};
