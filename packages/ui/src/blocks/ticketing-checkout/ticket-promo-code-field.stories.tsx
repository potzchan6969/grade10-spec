import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { phone } from "./checkout.story-fixtures";
import { PROMO_COPY, PROMO_REFUSALS } from "./fixtures";
import { TicketPromoCodeField } from "./ticket-promo-code-field";

const meta = {
  title: "Ticketing/Buying/Blocks/TicketPromoCodeField",
  component: TicketPromoCodeField,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="px-4">
        <Story />
      </div>
    ),
    phone,
  ],
  args: { copy: PROMO_COPY, onApply: fn() },
} satisfies Meta<typeof TicketPromoCodeField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Always shown under the order lines: a code and Apply. Apply and Enter
 * send the code; an empty field sends nothing. */
export const Empty: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("textbox", { name: "Promo code" });
    await userEvent.click(canvas.getByRole("button", { name: "Apply" }));
    expect(args.onApply).not.toHaveBeenCalled();
    await userEvent.type(field, " SPRING20 ");
    await userEvent.click(canvas.getByRole("button", { name: "Apply" }));
    expect(args.onApply).toHaveBeenLastCalledWith("SPRING20");
    await userEvent.type(field, "{Enter}");
    expect(args.onApply).toHaveBeenCalledTimes(2);
  },
};

/** SPRING20 typed, or brought by a share link. */
export const Typed: Story = {
  args: { defaultValue: "SPRING20" },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByRole("textbox", { name: "Promo code" }),
    ).toHaveValue("SPRING20");
  },
};

/** The code is on its way: Apply waits. */
export const Applying: Story = {
  args: { defaultValue: "SPRING20", status: { kind: "applying" } },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Apply" }), {
      pointerEventsCheck: 0,
    });
    expect(args.onApply).not.toHaveBeenCalled();
  },
};

/** Applied: the code's line with Remove takes the field's place. */
export const Applied: Story = {
  args: {
    applied: {
      copy: {
        title: "Promo SPRING20",
        detail: "20% off General passes",
        remove: "Remove",
        removeLabel: "Remove SPRING20",
      },
      amount: "−HK$190.00",
      onRemove: fn(),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("textbox")).toBeNull();
    expect(canvas.getByText("−HK$190.00")).toBeVisible();
    expect(
      canvas.getByRole("button", { name: "Remove SPRING20" }),
    ).toBeVisible();
  },
};

/** Ten wrong codes in an hour: the wait is named and Apply waits it out. */
export const TooManyTries: Story = {
  args: {
    defaultValue: "SPRNG21",
    status: { kind: "tooManyTries", message: PROMO_REFUSALS.tooManyTries },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      PROMO_REFUSALS.tooManyTries,
    );
    expect(canvas.getByRole("button", { name: "Apply" })).toBeDisabled();
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Promo code" }),
      "{Enter}",
    );
    expect(args.onApply).not.toHaveBeenCalled();
  },
};
