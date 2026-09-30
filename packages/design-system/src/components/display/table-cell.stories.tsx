import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, TableBody } from "./table";
import { TableCell } from "./table-cell";
import { TableRow } from "./table-row";

const meta = {
  title: "Components/TableCell",
  component: TableCell,
  tags: ["autodocs"],
  // A part only has its table semantics inside the parts that own it.
  decorators: [
    (Story) => (
      <Table className="w-fit">
        <TableBody>
          <TableRow>
            <Story />
          </TableRow>
        </TableBody>
      </Table>
    ),
  ],
} satisfies Meta<typeof TableCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TableCell className="w-40">Table Cell</TableCell>,
};

export const EndAligned: Story = {
  render: () => (
    <TableCell align="end" className="w-24">
      1.20
    </TableCell>
  ),
};

export const CustomContent: Story = {
  render: () => (
    <TableCell className="w-60">
      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
        Badge
      </span>
    </TableCell>
  ),
};
