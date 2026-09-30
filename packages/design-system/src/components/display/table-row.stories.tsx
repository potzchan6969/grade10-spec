import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, TableBody } from "./table";
import { TableCell } from "./table-cell";
import { TableRow } from "./table-row";

const meta = {
  title: "Components/TableRow",
  component: TableRow,
  tags: ["autodocs"],
  // A part only has its table semantics inside the parts that own it.
  decorators: [
    (Story) => (
      <Table className="w-fit">
        <TableBody>
          <Story />
        </TableBody>
      </Table>
    ),
  ],
} satisfies Meta<typeof TableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoColumns: Story = {
  render: () => (
    <TableRow className="w-80">
      <TableCell className="w-28 shrink-0">Table Cell</TableCell>
      <TableCell className="min-w-0 flex-1">Table Cell</TableCell>
    </TableRow>
  ),
};
