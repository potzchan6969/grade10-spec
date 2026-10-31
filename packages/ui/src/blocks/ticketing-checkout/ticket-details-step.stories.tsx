import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BotCheckStandIn, phone } from "./checkout.story-fixtures";
import {
  DETAILS_COPY,
  EMAIL,
  LINES,
  LINES_FREE,
  NAME_HINT_EMPTY,
  NAME_HINT_PREFILLED,
  ORDER_COPY,
  SUBTITLE,
} from "./fixtures";
import { TicketCheckoutOrder } from "./ticket-checkout-order";
import { TicketDetailsStep } from "./ticket-details-step";
import { TicketPointsAbout } from "./ticket-points-about";

const guestOrder = (
  <TicketCheckoutOrder
    copy={ORDER_COPY}
    lines={LINES}
    points={
      <TicketPointsAbout
        copy={{ line: "Earn points in the Grade10 account for your email" }}
      />
    }
    total="HK$1,150.00"
  />
);

const accountOrder = (
  <TicketCheckoutOrder
    copy={ORDER_COPY}
    lines={LINES}
    points={<TicketPointsAbout copy={{ line: "Earn about 115 points" }} />}
    total="HK$1,150.00"
  />
);

const meta = {
  title: "Ticketing/Buying/Blocks/TicketDetailsStep",
  component: TicketDetailsStep,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [phone],
  args: {
    copy: DETAILS_COPY,
    subtitle: SUBTITLE,
    buyer: { kind: "guest" },
    order: guestOrder,
    botCheck: <BotCheckStandIn />,
    onBack: fn(),
    onSignIn: fn(),
    onNotYou: fn(),
    onContinue: fn(),
  },
} satisfies Meta<typeof TicketDetailsStep>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A guest, nothing typed: Sign In over a name and an email, typed once. */
export const Guest: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "Your Details" }),
    ).toBeVisible();
    expect(
      canvas.getByRole("textbox", { name: "Name on the tickets" }),
    ).toHaveValue("");
    expect(canvas.getByRole("textbox", { name: "Email" })).toHaveValue("");
    expect(
      canvas.getByText("Your tickets go here. You check it before paying."),
    ).toBeVisible();
    expect(canvas.getByRole("region", { name: "Your Order" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Sign In" }));
    expect(args.onSignIn).toHaveBeenCalledOnce();
  },
};

/** Continue pressed with the name empty and the email unfinished: each
 * field says what to fix, and the bar counts them. */
export const FieldErrors: Story = {
  args: { botCheck: <BotCheckStandIn checked /> },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Email" }),
      "alex.chan@example",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(await canvas.findByText("Enter your name")).toBeVisible();
    expect(
      canvas.getByText("Enter an email like name@example.com"),
    ).toBeVisible();
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "Check the 2 fields above.",
    );
    expect(
      canvas.getByRole("textbox", { name: "Name on the tickets" }),
    ).toHaveFocus();
    expect(args.onContinue).not.toHaveBeenCalled();
  },
};

/** Signed in: the account's name, which a friend's can replace, and the
 * account's email, fixed, with Not You?. */
export const SignedInPrefilled: Story = {
  args: {
    buyer: { kind: "signedIn", email: EMAIL },
    copy: { ...DETAILS_COPY, nameHint: NAME_HINT_PREFILLED },
    defaultValues: { name: "Alex Chan" },
    order: accountOrder,
    botCheck: <BotCheckStandIn checked />,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: "Sign In" })).toBeNull();
    expect(
      canvas.getByRole("textbox", { name: "Name on the tickets" }),
    ).toHaveValue("Alex Chan");
    expect(canvas.queryByRole("textbox", { name: "Email" })).toBeNull();
    expect(canvas.getByText(EMAIL)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Not You?" }));
    expect(args.onNotYou).toHaveBeenCalledOnce();
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(args.onContinue).toHaveBeenCalledWith({
      name: "Alex Chan",
      email: EMAIL,
    });
  },
};

/** Signed in, but the account's name is only its email: the name field
 * starts empty, saying what it is for. */
export const SignedInWithoutName: Story = {
  args: {
    buyer: { kind: "signedIn", email: EMAIL },
    copy: { ...DETAILS_COPY, nameHint: NAME_HINT_EMPTY },
    order: accountOrder,
    botCheck: <BotCheckStandIn checked />,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole("textbox", { name: "Name on the tickets" });
    expect(name).toHaveValue("");
    expect(canvas.getByText(NAME_HINT_EMPTY)).toBeVisible();
    expect(args.onContinue).not.toHaveBeenCalled();
  },
};

/** Continue pressed with only the name missing: one field to fix, and
 * typing clears it. */
export const NameMissing: Story = {
  args: {
    buyer: { kind: "signedIn", email: EMAIL },
    copy: { ...DETAILS_COPY, nameHint: NAME_HINT_EMPTY },
    order: accountOrder,
    botCheck: <BotCheckStandIn checked />,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(await canvas.findByText("Enter your name")).toBeVisible();
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "Check the field above.",
    );
    expect(args.onContinue).not.toHaveBeenCalled();
  },
};

/** The session is still resolving: the buyer's fields wait, and Continue
 * goes nowhere yet. */
export const SessionResolving: Story = {
  args: {
    buyer: { kind: "resolving" },
    order: (
      <TicketCheckoutOrder
        copy={ORDER_COPY}
        lines={LINES}
        total="HK$1,150.00"
      />
    ),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const buyer = canvas.getByRole("region", { name: "Buyer" });
    expect(within(buyer).getAllByRole("status")).toHaveLength(6);
    expect(within(buyer).queryByRole("textbox")).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    expect(args.onContinue).not.toHaveBeenCalled();
  },
};

/** A pass that costs nothing: Free, no points, no bot check. */
export const FreeOrder: Story = {
  args: {
    buyer: { kind: "signedIn", email: EMAIL },
    copy: { ...DETAILS_COPY, nameHint: NAME_HINT_PREFILLED },
    defaultValues: { name: "Alex Chan" },
    order: (
      <TicketCheckoutOrder copy={ORDER_COPY} lines={LINES_FREE} total="Free" />
    ),
    botCheck: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const order = canvas.getByRole("region", { name: "Your Order" });
    expect(within(order).getByText("Crew Pass, Two Days × 2")).toBeVisible();
    expect(within(order).getAllByText("Free")).toHaveLength(2);
    expect(canvas.queryByRole("group", { name: "Bot check" })).toBeNull();
    expect(canvas.queryByText(/points/)).toBeNull();
  },
};
