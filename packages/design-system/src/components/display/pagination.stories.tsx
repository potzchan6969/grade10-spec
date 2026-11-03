import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Pagination,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

const meta = {
  title: "Design System/Display/Pagination",
  component: Pagination,
  tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the published Figma composition: first page active, previous disabled. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_3f8cdd41-a9ee-420c-8634-5256783866ea" },
  },
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

export const NextDisabled: Story = {
  parameters: {
    verification: { caseId: "vc_0eb28890-d290-4c47-9616-580ac6350330" },
  },
  render: () => (
    <Pagination>
      <PaginationPrevious />
      <PaginationLink>1</PaginationLink>
      <PaginationEllipsis />
      <PaginationLink>8</PaginationLink>
      <PaginationLink>9</PaginationLink>
      <PaginationLink isActive>10</PaginationLink>
      <PaginationNext disabled />
    </Pagination>
  ),
};
