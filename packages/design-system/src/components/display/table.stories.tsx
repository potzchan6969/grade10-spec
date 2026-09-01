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

const OVERFLOW_ROWS = [
  {
    item: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5) Collector's Edition",
    total: "HK$1,770.00",
  },
  {
    item: "Pokémon TCG Sealed Booster Box – Ninja Spinner (M4) First Print Run",
    total: "HK$780.00",
  },
  {
    item: "Pokémon TCG Sealed Booster Box – Storm Emeralda (M6) Vault Release",
    total: "HK$780.00",
  },
  {
    item: "1999 Base Set Charizard Holo PSA 10 – Shadowless 1st Edition",
    total: "HK$42,500.00",
  },
  {
    item: "Grade10 archival slab sleeve twin-pack with tamper-evident seal",
    total: "HK$48.00",
  },
  {
    item: "Auction lot consignment intake label roll (500 labels per roll)",
    total: "HK$120.00",
  },
  {
    item: "Express insured vault transfer from Causeway Bay to Kowloon Bay",
    total: "HK$95.00",
  },
  {
    item: "Extended buyer's premium settlement adjustment for September Slabs",
    total: "HK$310.00",
  },
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

/** Long labels truncate in the flexible column; fixed-width columns keep their full value. */
export const OverflowingContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Give flexible columns `min-w-0` and `truncate` so long labels ellipsize. Give fixed columns enough width and `shrink-0 whitespace-nowrap` so values like currency are never clipped. Cap the shell and scroll `TableBody` when rows exceed the available height.",
      },
    },
  },
  render: () => {
    const totalColumnClass = "w-36 shrink-0 whitespace-nowrap tabular-nums";

    return (
      <Table className="flex max-h-72 w-80 flex-col overflow-hidden">
        <TableHeader className="shrink-0">
          <TableHead className="min-w-0 flex-1">Item</TableHead>
          <TableHead align="end" className={totalColumnClass}>
            Total
          </TableHead>
        </TableHeader>
        <TableBody className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          {OVERFLOW_ROWS.map((row) => (
            <TableRow className="shrink-0" key={row.item}>
              <TableCell className="min-w-0 flex-1">
                <span className="block truncate" title={row.item}>
                  {row.item}
                </span>
              </TableCell>
              <TableCell align="end" className={totalColumnClass}>
                {row.total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  },
};
