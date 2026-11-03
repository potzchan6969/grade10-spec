import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, TableBody } from "./table";
import { TableCell } from "./table-cell";
import { TableRow } from "./table-row";

const meta = {
  title: "Design System/Display/TableCell",
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
  parameters: {
    verification: { caseId: "vc_b86f785d-8d80-4952-82f3-5557fa7150d3" },
  },
  render: () => <TableCell className="w-40">Table Cell</TableCell>,
};

export const EndAligned: Story = {
  parameters: {
    verification: { caseId: "vc_8d3f2d73-12f3-4945-9f60-af47ed021837" },
  },
  render: () => (
    <TableCell align="end" className="w-24">
      1.20
    </TableCell>
  ),
};

export const CustomContent: Story = {
  parameters: {
    verification: { caseId: "vc_812e3f4b-51f3-4398-aaae-facddac8c463" },
  },
  render: () => (
    <TableCell className="w-60">
      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
        Badge
      </span>
    </TableCell>
  ),
};
