import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EventOrderSummary } from "./event-order-summary";
import { LIMIT_NOTE, ORDER_COPY } from "./fixtures";

/* The catalog's whole sentence, its bold run drawn as the page draws it. */
const savingLine = (amount: string) => (
  <>
    <strong className="font-bold">You save {amount}</strong> with the early bird
    price.
  </>
);

const LINES = [
  {
    id: "adult2",
    label: "2 × General Pass (Two-Day), Adult",
    amount: "HK$760.00",
    was: "HK$960.00",
  },
  {
    id: "child2",
    label: "1 × General Pass (Two-Day), Child",
    amount: "HK$190.00",
    was: "HK$240.00",
  },
];

const meta = {
  title: "Ticketing/Buying/Blocks/EventOrderSummary",
  component: EventOrderSummary,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[340px]">
        <Story />
      </div>
    ),
  ],
  args: {
    copy: ORDER_COPY,
    lines: LINES,
    count: "3 tickets",
    total: "HK$950.00",
    savingLine: savingLine("HK$250.00"),
    points: "You will earn points in the Grade10 account for your email.",
    onContinue: fn(),
  },
} satisfies Meta<typeof EventOrderSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing chosen: how to choose, and Continue waits. */
export const Empty: Story = {
  args: {
    lines: [],
    count: "0 tickets",
    total: "HK$0.00",
    savingLine: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(
        "Choose how many of each pass. You pay on the next step, by card or WeChat Pay.",
      ),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Continue" }),
    ).toBeDisabled();
  },
};

/** Early bird: each line's full price struck, the saving on a gold tint,
 * and the Fast Pass prompt while none is chosen. */
export const WithSaving: Story = {
  name: "With Saving",
  args: {
    fastPassPrompt: {
      detail: "HK$300 a day for 3 people",
      options: [
        { id: "one", label: "Add 1 day", onAdd: fn() },
        { id: "all", label: "Add both days", onAdd: fn() },
      ],
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("You save HK$250.00")).toBeVisible();
    await expect(
      canvas.getByText("You save HK$250.00").parentElement,
    ).toHaveTextContent("You save HK$250.00 with the early bird price.");
    await userEvent.click(
      canvas.getByRole("button", { name: "Add both days" }),
    );
    await expect(args.fastPassPrompt?.options[1]?.onAdd).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await expect(args.onContinue).toHaveBeenCalledOnce();
  },
};

/** Fast Pass chosen: its line comes off with a ✕, and the prompt is gone. */
export const WithFastPass: Story = {
  name: "With Fast Pass",
  args: {
    lines: [
      ...LINES,
      {
        id: "fast",
        label: "Fast Pass × 6 days",
        amount: "HK$600.00",
        onRemove: fn(),
      },
    ],
    total: "HK$1,550.00",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove Fast Pass × 6 days" }),
    );
    await expect(
      canvas.queryByRole("group", { name: "Skip the queue with Fast Pass" }),
    ).not.toBeInTheDocument();
  },
};

/** At the email's limit, and signed in with the points estimate. */
export const AtTheLimit: Story = {
  name: "At the Limit",
  args: {
    lines: [
      {
        id: "adult2",
        label: "6 × General Pass (Two-Day), Adult",
        amount: "HK$2,280.00",
        was: "HK$2,880.00",
      },
      {
        id: "child2",
        label: "2 × General Pass (Two-Day), Child",
        amount: "HK$380.00",
        was: "HK$480.00",
      },
    ],
    count: "8 tickets",
    total: "HK$2,660.00",
    savingLine: savingLine("HK$700.00"),
    limitNote: LIMIT_NOTE,
    points: "Earn about 2,660 points on this order.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent(LIMIT_NOTE);
    await expect(
      canvas.getByText("Earn about 2,660 points on this order."),
    ).toBeVisible();
  },
};
