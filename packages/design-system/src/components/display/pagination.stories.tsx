import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Pagination,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Pagination>
      <PaginationPrevious />
      <PaginationLink>1</PaginationLink>
      <PaginationLink isActive>2</PaginationLink>
      <PaginationLink>3</PaginationLink>
      <PaginationEllipsis />
      <PaginationLink>10</PaginationLink>
      <PaginationNext />
    </Pagination>
  ),
};

export const PreviousDisabled: Story = {
  render: () => (
    <Pagination>
      <PaginationPrevious disabled />
      <PaginationLink isActive>1</PaginationLink>
      <PaginationLink>2</PaginationLink>
      <PaginationLink>3</PaginationLink>
      <PaginationEllipsis />
      <PaginationLink>10</PaginationLink>
      <PaginationNext />
    </Pagination>
  ),
};
