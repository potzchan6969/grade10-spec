import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableCell } from "./table-cell";

const meta = {
  title: "Components/TableCell",
  component: TableCell,
  tags: ["autodocs"],
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
