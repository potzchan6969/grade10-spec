import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./table";
import { TableHead } from "./table-head";
import { TableHeader } from "./table-header";

const meta = {
  title: "Components/TableHeader",
  component: TableHeader,
  tags: ["autodocs"],
  // A part only has its table semantics inside the parts that own it.
  decorators: [
    (Story) => (
      <Table className="w-fit">
        <Story />
      </Table>
    ),
  ],
} satisfies Meta<typeof TableHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoColumns: Story = {
  render: () => (
    <TableHeader className="w-80">
      <TableHead className="w-28 shrink-0">Table Head</TableHead>
      <TableHead className="min-w-0 flex-1">Table Head</TableHead>
    </TableHeader>
  ),
};
