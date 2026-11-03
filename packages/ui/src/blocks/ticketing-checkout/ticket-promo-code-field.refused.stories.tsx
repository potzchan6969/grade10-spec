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
NotFound.parameters = {
  ...NotFound.parameters,
  verification: { caseId: "vc_f350b725-90f8-4241-a90b-2cac415d5051" },
};
export const Expired = refused("EARLY100", PROMO_REFUSALS.expired);
Expired.parameters = {
  ...Expired.parameters,
  verification: { caseId: "vc_18d4d331-a359-4762-9c8b-3978e6fecd66" },
};
export const NotStarted = refused("SUMMER10", PROMO_REFUSALS.notStarted);
NotStarted.parameters = {
  ...NotStarted.parameters,
  verification: { caseId: "vc_4f53c2e5-ccc0-4b69-8576-633b77bbbf70" },
};
export const ConditionNotMet = refused(
  "WELCOME50",
  PROMO_REFUSALS.conditionNotMet,
);
ConditionNotMet.parameters = {
  ...ConditionNotMet.parameters,
  verification: { caseId: "vc_9bbdbbe4-8ed5-461a-b7ca-7a62a05851a2" },
};
export const AlreadyUsed = refused("SPRING20", PROMO_REFUSALS.alreadyUsed);
AlreadyUsed.parameters = {
  ...AlreadyUsed.parameters,
  verification: { caseId: "vc_6ce0df94-5fc7-48a2-b8e0-4273d6ebd95a" },
};
export const UsedUp = refused("SPRING20", PROMO_REFUSALS.usedUp);
UsedUp.parameters = {
  ...UsedUp.parameters,
  verification: { caseId: "vc_c67483d4-1d42-4690-b1d3-fae63020c823" },
};
export const ListedEmailsOnly = refused("PRESS15", PROMO_REFUSALS.emailsOnly);
ListedEmailsOnly.parameters = {
  ...ListedEmailsOnly.parameters,
  verification: { caseId: "vc_608135df-0753-416b-99fa-73dcb0891e53" },
};
