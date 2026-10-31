import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { phone } from "./checkout.story-fixtures";
import { REFUSALS } from "./fixtures";
import { TicketCheckoutRefusalNotice } from "./ticket-checkout-refusal-notice";

const byCode = (code: string) => {
  const found = REFUSALS.find((refusal) => refusal.code === code);
  if (!found) throw new Error(`No refusal ${code}`);
  return found;
};

const meta = {
  title: "Ticketing/Buying/Blocks/TicketCheckoutRefusalNotice",
  component: TicketCheckoutRefusalNotice,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="p-4">
        <Story />
      </div>
    ),
    phone,
  ],
  args: {
    copy: byCode("CHECKOUT_BUSY").copy,
    action: { label: "Pay", tone: "primary", onClick: fn() },
  },
} satisfies Meta<typeof TicketCheckoutRefusalNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every answer the checkout can give instead of a payment page, each with
 * its sentence and the way on. */
export const EveryRefusal: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {REFUSALS.map((refusal) => (
        <article className="flex flex-col gap-2" key={refusal.code}>
          <h2 className="m-0 text-base leading-6 font-bold">{refusal.name}</h2>
          <code className="text-xs text-secondary-foreground">
            {refusal.code}
          </code>
          <TicketCheckoutRefusalNotice
            action={
              refusal.action ? { ...refusal.action, onClick: fn() } : undefined
            }
            copy={refusal.copy}
          />
        </article>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole("alert")).toHaveLength(REFUSALS.length);
    expect(
      canvas.getByText("This pass isn’t open to your email yet."),
    ).toBeVisible();
    expect(
      canvas.getByText("Your access lets this email hold 2 of this pass."),
    ).toBeVisible();
    expect(canvas.queryByText(/invit/i)).toBeNull();
  },
};

/** Busy after the page's own retries: Pay again, in the primary tone. */
export const Busy: Story = {
  play: async ({ args, canvasElement }) => {
    const notice = within(canvasElement).getByRole("alert");
    expect(notice).toHaveTextContent("Too many people are buying this second.");
    await userEvent.click(within(notice).getByRole("button", { name: "Pay" }));
    expect(args.action?.onClick).toHaveBeenCalledOnce();
  },
};

/** No rule opens this pass to the address before the public sale. */
export const NotOpenToYouYet: Story = {
  args: {
    copy: byCode("NOT_OPEN_TO_YOU_YET").copy,
    action: { label: "Back to Passes", tone: "outline", onClick: fn() },
  },
  play: async ({ canvasElement }) => {
    const notice = within(canvasElement).getByRole("alert");
    expect(notice).toHaveTextContent("This pass isn’t open to your email yet.");
    expect(
      within(notice).getByRole("button", { name: "Back to Passes" }),
    ).toBeVisible();
  },
};

/** More than the address's access lets it hold. */
export const OverYourAccessLimit: Story = {
  args: {
    copy: byCode("ACCESS_LIMIT").copy,
    action: { label: "Back to Passes", tone: "outline", onClick: fn() },
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("alert")).toHaveTextContent(
      "Your access lets this email hold 2 of this pass.",
    );
  },
};

/** Sales closed: the sentence alone, no way on. */
export const NoWayOn: Story = {
  args: { copy: byCode("TICKETING_CLOSED").copy, action: undefined },
  play: async ({ canvasElement }) => {
    const notice = within(canvasElement).getByRole("alert");
    expect(within(notice).queryByRole("button")).toBeNull();
  },
};

/** The same answer to a second press: the notice shakes once to say it
 * heard it. */
export const SameAnswerAgain: Story = {
  args: { attempt: 1 },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByRole("alert")).toHaveTextContent(
      "Too many people are buying this second.",
    );
  },
};
