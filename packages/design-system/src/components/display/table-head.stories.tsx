import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table } from "./table";
import { TableHead } from "./table-head";
import { TableHeader } from "./table-header";

const meta = {
  title: "Design System/Display/TableHead",
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
  parameters: {
    verification: { caseId: "vc_2595ca8b-cf83-4730-9ac4-e2b2f172af3d" },
  },
  render: () => <TableHead className="w-40">Table Head</TableHead>,
};

export const EndAligned: Story = {
  parameters: {
    verification: { caseId: "vc_b0b62d58-3628-4342-81be-f67ec5f05750" },
  },
  render: () => (
    <TableHead align="end" className="w-24">
      Total
    </TableHead>
  ),
};
