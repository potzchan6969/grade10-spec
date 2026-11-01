import { TextInput } from "@grade10/design-system/components/forms/text-input";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { TicketAgreementCheck } from "../ticketing-checkout/ticket-agreement-check";
import { EventPassCard } from "../ticketing-event-page/event-pass-card";
import { VIP_PERKS, WAS } from "../ticketing-event-page/fixtures";
import {
  JOIN_COPY,
  OFFER_COPY,
  OFFER_ENDED,
  OFFER_GONE,
  PLACE_COPY,
  SOMETHING_WRONG,
  TICKETS_LEFT,
} from "./fixtures";
import {
  TicketWaitingLineJoin,
  TicketWaitingLineOffer,
  TicketWaitingLinePlace,
} from "./ticket-waiting-line";

/**
 * A sold-out pass's waiting line, at the foot of its card: Join, the
 * buyer's place with Leave, and the offer the line holds for them with
 * Accept and Decline, each with its pending and refused states.
 */
const meta = {
  title: "Ticketing/Buying/Blocks/TicketWaitingLine",
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[560px] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj;

function JoinWithPicker() {
  const [value, setValue] = useState(2);
  return (
    <TicketWaitingLineJoin
      copy={JOIN_COPY}
      onJoin={fn()}
      quantity={{
        value,
        max: 8,
        onValueChange: setValue,
        label: "How many tickets to wait for: VIP Pass",
        decrementLabel: "Wait for one fewer: VIP Pass",
        incrementLabel: "Wait for one more: VIP Pass",
      }}
    />
  );
}

/** Sold out: how many to wait for, Join, and what joining does. */
export const Join: Story = {
  render: () => <JoinWithPicker />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Wait for one more: VIP Pass" }),
    );
    await expect(
      canvas.getByRole("spinbutton", {
        name: "How many tickets to wait for: VIP Pass",
      }),
    ).toHaveValue("3");
    await expect(
      canvas.getByRole("button", { name: "Join the Waiting Line" }),
    ).toBeVisible();
    await expect(canvas.getByText(JOIN_COPY.note ?? "")).toBeVisible();
  },
};

/** Join pressed: it waits, and refuses a second press. */
export const Joining: Story = {
  render: () => (
    <TicketWaitingLineJoin copy={JOIN_COPY} onJoin={fn()} pending />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", {
        name: "Join the Waiting Line",
      }),
    ).toHaveAttribute("aria-busy", "true");
  },
};

/** Tickets came back between reading and pressing: the line stays shut
 * while any is left, and Join is usable again. */
export const JoinRefused: Story = {
  name: "Join Refused",
  render: () => (
    <TicketWaitingLineJoin
      copy={JOIN_COPY}
      onJoin={fn()}
      refusal={TICKETS_LEFT}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      TICKETS_LEFT.title,
    );
    await expect(
      canvas.getByRole("button", { name: "Join the Waiting Line" }),
    ).not.toHaveAttribute("aria-busy");
  },
};

/** An offer that lapsed or was declined: joining again goes to the back. */
export const OfferEnded: Story = {
  name: "Offer Ended",
  render: () => (
    <TicketWaitingLineJoin copy={JOIN_COPY} ended={OFFER_ENDED} onJoin={fn()} />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(OFFER_ENDED)).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "Join the Waiting Line" }),
    ).toBeVisible();
  },
};

/** In the line: how many it waits for, roughly how far back, and Leave. */
export const Place: Story = {
  render: () => <TicketWaitingLinePlace copy={PLACE_COPY} onLeave={fn()} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const place = canvas.getByRole("region", { name: PLACE_COPY.title });
    await expect(within(place).getByText(PLACE_COPY.wanted)).toBeVisible();
    await expect(within(place).getByText(PLACE_COPY.band)).toBeVisible();
    await expect(
      within(place).getByRole("button", { name: "Leave the Line" }),
    ).toBeVisible();
  },
};

/** Leave pressed: it waits. */
export const Leaving: Story = {
  render: () => (
    <TicketWaitingLinePlace copy={PLACE_COPY} leaving onLeave={fn()} />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: "Leave the Line" }),
    ).toHaveAttribute("aria-busy", "true");
  },
};

/** Leave refused: why, under Leave, which is usable again. */
export const LeaveRefused: Story = {
  name: "Leave Refused",
  render: () => (
    <TicketWaitingLinePlace
      copy={PLACE_COPY}
      onLeave={fn()}
      refusal={SOMETHING_WRONG}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("alert")).toHaveTextContent(
      SOMETHING_WRONG.title,
    );
  },
};

/** Tickets held for the buyer: until when, Accept and Decline. */
export const Offer: Story = {
  render: () => (
    <TicketWaitingLineOffer
      copy={OFFER_COPY}
      onAccept={fn()}
      onDecline={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const offer = canvas.getByRole("region", { name: OFFER_COPY.title });
    await expect(within(offer).getByText(OFFER_COPY.body)).toBeVisible();
    await expect(
      within(offer).getByRole("button", { name: "Accept" }),
    ).toBeEnabled();
    await expect(
      within(offer).getByRole("button", { name: "Decline" }),
    ).toBeEnabled();
  },
};

/** The name the tickets print and the tick, asked in the offer before Accept. */
export const OfferWithTerms: Story = {
  name: "Offer With Terms",
  render: function Render() {
    const [name, setName] = useState("Ada Lovelace");
    const [agreed, setAgreed] = useState(false);
    return (
      <TicketWaitingLineOffer
        copy={OFFER_COPY}
        onAccept={fn()}
        onDecline={fn()}
      >
        <TextInput
          label="Name on the tickets"
          onChange={(change) => setName(change.target.value)}
          value={name}
        />
        <TicketAgreementCheck
          checked={agreed}
          copy={{
            label: "Agreement",
            detail:
              "Your tickets and the points from this order go to your Grade10 account.",
            required: "Tick the box to agree first.",
          }}
          onCheckedChange={setAgreed}
          statement="I agree to the Terms of Sale."
        />
      </TicketWaitingLineOffer>
    );
  },
  play: async ({ canvasElement }) => {
    const offer = within(canvasElement).getByRole("region", {
      name: OFFER_COPY.title,
    });
    await expect(
      within(offer).getByRole("textbox", { name: "Name on the tickets" }),
    ).toHaveValue("Ada Lovelace");
    const tick = within(offer).getByRole("checkbox");
    await userEvent.click(tick);
    await expect(tick).toBeChecked();
  },
};

/** Accept pressed: it waits for the payment page, and Decline waits too. */
export const Accepting: Story = {
  render: () => (
    <TicketWaitingLineOffer
      accepting
      copy={OFFER_COPY}
      onAccept={fn()}
      onDecline={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "Accept" }),
    ).toHaveAttribute("aria-busy", "true");
    await expect(
      canvas.getByRole("button", { name: "Decline" }),
    ).toBeDisabled();
  },
};

/** Decline pressed: it waits, and Accept waits too. */
export const Declining: Story = {
  render: () => (
    <TicketWaitingLineOffer
      copy={OFFER_COPY}
      declining
      onAccept={fn()}
      onDecline={fn()}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("button", { name: "Decline" }),
    ).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getByRole("button", { name: "Accept" })).toBeDisabled();
  },
};

/** The offer lapsed as Accept was pressed: why, under the presses. */
export const OfferRefused: Story = {
  name: "Offer Refused",
  render: () => (
    <TicketWaitingLineOffer
      copy={OFFER_COPY}
      onAccept={fn()}
      onDecline={fn()}
      refusal={OFFER_GONE}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole("alert")).toHaveTextContent(
      OFFER_GONE.title,
    );
  },
};

/** At the foot of a sold-out VIP card, as the event page holds it. */
export const OnThePassCard: Story = {
  name: "On the Pass Card",
  render: () => (
    <EventPassCard
      admits="Any 2 days of the event, once a day"
      badge={{ label: "Sold Out", tone: "ended" }}
      copy={WAS}
      name="VIP Pass"
      perks={VIP_PERKS}
      price={{ price: "HK$1,580.00" }}
      variant="vip"
      waitingLine={
        <TicketWaitingLineOffer
          copy={OFFER_COPY}
          onAccept={fn()}
          onDecline={fn()}
        />
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole("article", {
      name: "VIP Pass",
    });
    await expect(
      within(card).getByRole("region", { name: OFFER_COPY.title }),
    ).toBeVisible();
    await expect(within(card).queryByRole("spinbutton")).toBeNull();
  },
};
