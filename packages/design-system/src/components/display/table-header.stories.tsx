import type { Meta, StoryObj } from "@storybook/react-vite";
import { TableHead } from "./table-head";
import { TableHeader } from "./table-header";

const meta = {
  title: "Components/TableHeader",
  component: TableHeader,
  tags: ["autodocs"],
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
