import type { Meta, StoryObj } from "@storybook/react-vite";
import { Table, TableBody } from "./table";
import { TableCell } from "./table-cell";
import { TableHead } from "./table-head";
import { TableHeader } from "./table-header";
import { TableRow } from "./table-row";

const meta = {
  title: "Components/Table",
  component: Table,
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROWS = [
  ["Apple", "1.20"],
  ["Banana", "0.80"],
  ["Orange", "1.50"],
] as const;

/** Matches the Figma `Table` composition frame (`4969:4934`). */
export const Default: Story = {
  render: () => (
    <Table className="w-80">
      <TableHeader>
        <TableHead className="w-28 shrink-0">Item</TableHead>
        <TableHead className="min-w-0 flex-1" align="end">
          Price
        </TableHead>
      </TableHeader>
      <TableBody>
        {ROWS.map(([item, price]) => (
          <TableRow key={item}>
            <TableCell className="w-28 shrink-0">{item}</TableCell>
            <TableCell className="min-w-0 flex-1" align="end">
              {price}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
