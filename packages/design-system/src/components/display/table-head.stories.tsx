import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableHead } from "./table-head";

const meta = {
  title: "Components/TableHead",
  component: TableHead,
  tags: ["autodocs"],
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
