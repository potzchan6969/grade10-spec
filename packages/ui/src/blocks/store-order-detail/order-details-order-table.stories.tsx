import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FILLED_LINES, ORDER_DETAILS_COPY } from "./fixtures";
import { OrderDetailsOrderTable } from "./order-details-order-table";

const LONG_AMOUNT_LINES = [
  {
    ...FILLED_LINES[2],
    id: "line-paid",
    subtotal: "HK$2,888.00",
    total: "HK$2,888.00",
  },
  {
    ...FILLED_LINES[1],
    id: "line-refunded",
    subtotal: "HK$2,888.00",
    total: "HK$2,888.00",
  },
];

function expectAmountsInFull(canvasElement: HTMLElement) {
  const amounts = within(canvasElement).getAllByText("HK$2,888.00");
  expect(amounts).toHaveLength(4);
  for (const amount of amounts) {
    const cell = amount.closest<HTMLElement>('[data-slot="table-cell"]');
    const box = cell?.getBoundingClientRect();
    const text = amount.getBoundingClientRect();
    expect(text.left).toBeGreaterThanOrEqual(box?.left ?? Infinity);
    expect(text.right).toBeLessThanOrEqual(box?.right ?? -Infinity);
  }
  const heads = canvasElement.querySelectorAll<HTMLElement>(
    '[data-slot="table-head"]',
  );
  const cells = canvasElement.querySelectorAll<HTMLElement>(
    '[data-slot="order-details-order-item"] > [data-slot="table-cell"]',
  );
  heads.forEach((head, column) => {
    expect(cells[column]?.getBoundingClientRect().right).toBeCloseTo(
      head.getBoundingClientRect().right,
    );
  });
}

const LONG_PRODUCT_NAME =
  "Pokémon Store Korea Magikarp – Wobbling Keyring, 5 Designs Random (Wave 2)";

const meta = {
  title: "Store/Order Detail/Blocks/OrderDetailsOrderTable",
  component: OrderDetailsOrderTable,
  tags: ["autodocs"],
  args: {
    copy: ORDER_DETAILS_COPY.table,
    lines: FILLED_LINES,
    statusLabels: ORDER_DETAILS_COPY.status,
  },
} satisfies Meta<typeof OrderDetailsOrderTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongProductNameWrapsWithinTheTable: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "420px" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    lines: [{ ...FILLED_LINES[0], product: LONG_PRODUCT_NAME }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvasElement.querySelector<HTMLElement>(
      '[data-slot="order-details-order-table"]',
    );
    const tableContainer = table?.parentElement;
    const product = canvas.getByText(LONG_PRODUCT_NAME);

    expect(table).not.toBeNull();
    expect(tableContainer).not.toHaveAttribute(
      "data-slot",
      "order-details-order-table-rail",
    );
    expect(table).toHaveClass("w-full");
    expect(table).not.toHaveClass("w-max");
    expect(product.getBoundingClientRect().height).toBeGreaterThan(20);
    expect(tableContainer?.scrollWidth).toBeLessThanOrEqual(
      tableContainer?.clientWidth ?? -1,
    );
  },
};

export const AmountsShowInFull: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "608px" }}>
        <Story />
      </div>
    ),
  ],
  args: { lines: LONG_AMOUNT_LINES },
  play: ({ canvasElement }) => expectAmountsInFull(canvasElement),
};
