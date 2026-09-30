import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./table";
import { TableHead } from "./table-head";
import { TableHeader } from "./table-header";

const meta = {
  title: "Components/TableHead",
  component: TableHead,
  tags: ["autodocs"],
  // A part only has its table semantics inside the parts that own it.
  decorators: [
    (Story) => (
      <Table className="w-fit">
        <TableHeader>
          <Story />
        </TableHeader>
      </Table>
    ),
  ],
} satisfies Meta<typeof TableHead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TableHead className="w-40">Table Head</TableHead>,
};

export const EndAligned: Story = {
  render: () => (
    <TableHead align="end" className="w-24">
      Total
    </TableHead>
  ),
};
