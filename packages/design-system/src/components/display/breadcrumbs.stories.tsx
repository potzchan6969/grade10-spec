import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "./breadcrumbs";

const meta = {
  title: "Design System/Display/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_aa6aa46e-04a3-4ba8-9fd6-8a09db015e33" },
  },
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="#home">Home</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem href="#shop">Shop</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Pokémon</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const WithEllipsis: Story = {
  parameters: {
    verification: { caseId: "vc_b306752d-624d-46ef-823f-caa64219f13f" },
  },
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem href="#home">Home</BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbEllipsis />
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Japanese Boxes</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const DisabledItem: Story = {
  parameters: {
    verification: { caseId: "vc_6caf2577-06ac-4389-a0a5-64a274cbc45f" },
  },
  render: () => (
    <Breadcrumbs>
      <BreadcrumbItem disabled href="#home">
        Home
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem current>Pokémon</BreadcrumbItem>
    </Breadcrumbs>
  ),
};
