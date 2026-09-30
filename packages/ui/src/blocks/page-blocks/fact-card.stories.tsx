import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FactCard } from "./fact-card";
import {
  KEEPS_ROWS,
  KEEPS_TITLE,
  OFFER_ACCEPT,
  OFFER_LEAD,
  OFFER_OPEN_UNTIL,
  OFFER_ROWS,
  OFFER_ROWS_LABEL,
  OFFER_TITLE,
  OFFER_TOTAL,
  REMINDERS_FREE,
  REMINDERS_TITLE,
} from "./fixtures";

const meta = {
  title: "Page Blocks/FactCard",
  component: FactCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: { title: OFFER_TITLE } },
} satisfies Meta<typeof FactCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Whether `a` comes before `b` in the document. */
const before = (a: Node, b: Node) =>
  Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

/** Every part, drawn in one order; the card a region named by its title,
 * the rows a table named by their own label (shared-ui-page-blocks-SC-03).
 * Given no slot, the card keeps `card` (shared-ui-page-blocks-SC-18). */
export const EveryPart: Story = {
  args: {
    copy: {
      title: OFFER_TITLE,
      description: OFFER_OPEN_UNTIL,
      rowsLabel: OFFER_ROWS_LABEL,
    },
    lead: <Text size="lg">{OFFER_LEAD}</Text>,
    rows: OFFER_ROWS,
    children: <Text weight="medium">{OFFER_TOTAL}</Text>,
    actions: <Button>{OFFER_ACCEPT}</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", { name: OFFER_TITLE });
    expect(region).toHaveAttribute("data-slot", "card");
    const table = within(region).getByRole("table", {
      name: OFFER_ROWS_LABEL,
    });
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(OFFER_ROWS.length);
    expect(rows[0]).toHaveTextContent("LoanHK$8,000.00");
    const order = [
      within(region).getByText(OFFER_TITLE),
      within(region).getByText(OFFER_OPEN_UNTIL),
      within(region).getByText(OFFER_LEAD),
      table,
      within(region).getByText(OFFER_TOTAL),
      within(region).getByRole("button", { name: OFFER_ACCEPT }),
    ];
    for (let at = 1; at < order.length; at++) {
      expect(before(order[at - 1], order[at])).toBe(true);
    }
  },
};

/** Rows alone: the table takes the card's title, and nothing else is drawn
 * (shared-ui-page-blocks-SC-04). */
export const RowsOnly: Story = {
  args: { copy: { title: KEEPS_TITLE }, rows: KEEPS_ROWS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = canvas.getByRole("region", { name: KEEPS_TITLE });
    within(region).getByRole("table", { name: KEEPS_TITLE });
    expect(region).toHaveTextContent(
      [
        KEEPS_TITLE,
        ...KEEPS_ROWS.flatMap((row) => [row.label, String(row.value)]),
      ].join(""),
      { normalizeWhitespace: false },
    );
    expect(within(region).queryByRole("button")).toBeNull();
  },
};

/** A body with no rows draws no table (shared-ui-page-blocks-SC-05). */
export const BodyOnly: Story = {
  args: {
    copy: { title: REMINDERS_TITLE },
    children: <Text size="sm">{REMINDERS_FREE}</Text>,
  },
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole("region", {
      name: REMINDERS_TITLE,
    });
    expect(within(region).getByText(REMINDERS_FREE)).toBeInTheDocument();
    expect(within(region).queryByRole("table")).toBeNull();
  },
};

/** An empty list of rows is no rows (shared-ui-page-blocks-SC-05). */
export const EmptyRows: Story = {
  args: { ...BodyOnly.args, rows: [] },
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole("region", {
      name: REMINDERS_TITLE,
    });
    expect(within(region).getByText(REMINDERS_FREE)).toBeInTheDocument();
    expect(within(region).queryByRole("table")).toBeNull();
  },
};

/** The card carries the slot it is given (shared-ui-page-blocks-SC-18). */
export const WithSlot: Story = {
  args: { ...RowsOnly.args, slot: "vault-case-keeps" },
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole("region", {
      name: KEEPS_TITLE,
    });
    expect(region).toHaveAttribute("data-slot", "vault-case-keeps");
  },
};
