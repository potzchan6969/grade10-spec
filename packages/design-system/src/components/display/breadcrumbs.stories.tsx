import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "./breadcrumbs";

const meta = {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs,
  tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
