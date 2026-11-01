import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { phone } from "./checkout.story-fixtures";
import { PROMO_COPY, PROMO_REFUSALS } from "./fixtures";
import { TicketPromoCodeField } from "./ticket-promo-code-field";

/** Each refusal is said under the field, in the error tone; the order is
 * unchanged and Apply stays ready for another code. */
const meta = {
  title: "Ticketing/Buying/Blocks/TicketPromoCodeField/Refused",
  component: TicketPromoCodeField,
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
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const message =
      args.status?.kind === "refused" ? args.status.message : "unreachable";
    expect(canvas.getByRole("alert")).toHaveTextContent(message);
    expect(canvas.getByRole("textbox", { name: "Promo code" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(canvas.getByRole("button", { name: "Apply" })).toBeEnabled();
  },
} satisfies Meta<typeof TicketPromoCodeField>;

export default meta;
type Story = StoryObj<typeof meta>;

const refused = (code: string, message: string): Story => ({
  args: { defaultValue: code, status: { kind: "refused", message } },
});

export const NotFound = refused("SPRNG20", PROMO_REFUSALS.notFound);
export const Expired = refused("EARLY100", PROMO_REFUSALS.expired);
export const NotStarted = refused("SUMMER10", PROMO_REFUSALS.notStarted);
export const ConditionNotMet = refused(
  "WELCOME50",
  PROMO_REFUSALS.conditionNotMet,
);
export const AlreadyUsed = refused("SPRING20", PROMO_REFUSALS.alreadyUsed);
export const UsedUp = refused("SPRING20", PROMO_REFUSALS.usedUp);
export const ListedEmailsOnly = refused("PRESS15", PROMO_REFUSALS.emailsOnly);
