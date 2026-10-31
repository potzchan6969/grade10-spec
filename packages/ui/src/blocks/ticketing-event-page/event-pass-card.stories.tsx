import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { EventPassCard } from "./event-pass-card";
import { EventPassRow } from "./event-pass-row";
import { VIP_PERKS, WAS } from "./fixtures";

const meta = {
  title: "Ticketing/Buying/Blocks/EventPassCard",
  component: EventPassCard,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[788px] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
/* The card is a union of its two variants, so each story renders it. */
type Story = StoryObj;

function quantityFor(name: string, value: number, set: (n: number) => void) {
  return {
    value,
    max: 8,
    onValueChange: set,
    label: `How many tickets: ${name}`,
    decrementLabel: `One fewer ${name}`,
    incrementLabel: `One more ${name}`,
  };
}

function VipWithPicker() {
  const [value, setValue] = useState(0);
  return (
    <EventPassCard
      admits="Any 2 days of the event, once a day"
      copy={WAS}
      name="VIP Pass"
      perks={VIP_PERKS}
      price={{ price: "HK$1,280.00", was: "HK$1,580.00" }}
      quantity={quantityFor("VIP Pass", value, setValue)}
      variant="vip"
    />
  );
}

/** The gold card that leads the list: the perks, the early-bird price with
 * the full price struck through, and one stepper. No wristband. */
export const Vip: Story = {
  name: "VIP",
  render: () => <VipWithPicker />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("article", { name: "VIP Pass" });
    await expect(within(card).getByText("HK$1,580.00")).toBeVisible();
    await expect(
      within(card).queryByText(/wristband/i),
    ).not.toBeInTheDocument();
    await userEvent.click(
      within(card).getByRole("button", { name: "One more VIP Pass" }),
    );
    await expect(
      within(card).getByRole("spinbutton", {
        name: "How many tickets: VIP Pass",
      }),
    ).toHaveValue("1");
  },
};

/** At 390 px: the price and the stepper move under the perks. */
export const VipPhone: Story = {
  name: "VIP Phone",
  decorators: [
    (Story) => (
      <div className="w-[358px]">
        <Story />
      </div>
    ),
  ],
  render: () => <VipWithPicker />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("spinbutton", { name: "How many tickets: VIP Pass" }),
    ).toBeVisible();
  },
};

/** Sales ended: the price in grey, Sales Ended, no stepper. */
export const VipEnded: Story = {
  name: "VIP Ended",
  render: () => (
    <EventPassCard
      admits="Any 2 days of the event, once a day"
      badge={{ label: "Sales Ended", tone: "ended" }}
      copy={WAS}
      name="VIP Pass"
      perks={VIP_PERKS}
      price={{ price: "HK$1,580.00", muted: true }}
      variant="vip"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Sales Ended")).toBeVisible();
    await expect(canvas.queryByRole("spinbutton")).not.toBeInTheDocument();
  },
};

/** Before the public sale: when it goes on sale, no stepper. */
export const VipNotStarted: Story = {
  name: "VIP Not Started",
  render: () => (
    <EventPassCard
      admits="Any 2 days of the event, once a day"
      copy={WAS}
      name="VIP Pass"
      opening={{ label: "On sale Mon 16 Nov, 12:00" }}
      perks={VIP_PERKS}
      price={{ price: "HK$1,280.00", was: "HK$1,580.00" }}
      variant="vip"
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("On sale Mon 16 Nov, 12:00")).toBeVisible();
    await expect(canvas.queryByRole("spinbutton")).not.toBeInTheDocument();
  },
};

function RowsWithPickers({ chosen }: { chosen?: boolean }) {
  const [adult, setAdult] = useState(chosen ? 2 : 0);
  const [child, setChild] = useState(chosen ? 1 : 0);
  return (
    <EventPassCard
      admits="Any 2 days of the event, once a day"
      chosen={adult + child > 0}
      copy={WAS}
      name="General Pass (Two-Day)"
      variant="rows"
    >
      <EventPassRow
        copy={WAS}
        label="Adult"
        price={{ price: "HK$380.00", was: "HK$480.00" }}
        quantity={quantityFor("General Pass (Two-Day), Adult", adult, setAdult)}
        who="Ages [Product] and up"
      />
      <EventPassRow
        copy={WAS}
        label="Child"
        price={{ price: "HK$190.00", was: "HK$240.00" }}
        quantity={quantityFor("General Pass (Two-Day), Child", child, setChild)}
        who="[Ages: Product]"
      />
    </EventPassCard>
  );
}

/** A pass with Adult and Child rows; its border turns gold once a ticket is
 * chosen. */
export const Rows: Story = {
  render: () => <RowsWithPickers />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvas.getByRole("article", {
      name: "General Pass (Two-Day)",
    });
    await expect(card).not.toHaveAttribute("data-chosen");
    await userEvent.click(
      canvas.getByRole("button", {
        name: "One more General Pass (Two-Day), Adult",
      }),
    );
    await expect(card).toHaveAttribute("data-chosen", "true");
  },
};

/** Ended on event day 2: grey prices, Sales Ended, the note under the rows. */
export const RowsEnded: Story = {
  name: "Rows Ended",
  render: () => (
    <EventPassCard
      admits="Any 2 days of the event, once a day"
      badge={{ label: "Sales Ended", tone: "ended" }}
      copy={WAS}
      name="General Pass (Two-Day)"
      note="Sales ended when Sun 13 Dec began"
      variant="rows"
    >
      <EventPassRow
        copy={WAS}
        label="Adult"
        price={{ price: "HK$480.00", muted: true }}
        who="Ages [Product] and up"
      />
      <EventPassRow
        copy={WAS}
        label="Child"
        price={{ price: "HK$240.00", muted: true }}
        who="[Ages: Product]"
      />
    </EventPassCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText("Sales ended when Sun 13 Dec began"),
    ).toBeVisible();
    await expect(canvas.queryByRole("spinbutton")).not.toBeInTheDocument();
  },
};

/** An early-access pass before its public sale, to a buyer no access rule
 * lets in: `Opens …`, no stepper. */
export const EarlyAccessOpens: Story = {
  name: "Early Access Opens",
  render: () => (
    <EventPassCard
      admits="Any 2 days of the event, once a day"
      copy={WAS}
      name="Members’ Pass (Two-Day)"
      opening={{ label: "Opens Mon 16 Nov, 12:00" }}
      variant="rows"
    >
      <EventPassRow
        copy={WAS}
        label="Adult"
        price={{ price: "HK$350.00" }}
        who="Ages [Product] and up"
      />
    </EventPassCard>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Opens Mon 16 Nov, 12:00")).toBeVisible();
    await expect(canvas.queryByRole("spinbutton")).not.toBeInTheDocument();
  },
};

function EarlyAccessForYouCard() {
  const [value, setValue] = useState(2);
  return (
    <EventPassCard
      admits="Any 2 days of the event, once a day"
      badge={{ label: "For you now", tone: "access" }}
      chosen={value > 0}
      copy={WAS}
      name="Members’ Pass (Two-Day)"
      note="Your early access lets this email hold 4 before the public sale."
      variant="rows"
    >
      <EventPassRow
        copy={WAS}
        label="Adult"
        note="Yours to buy: up to 4"
        price={{ price: "HK$350.00" }}
        quantity={{
          ...quantityFor("Members’ Pass (Two-Day), Adult", value, setValue),
          max: 4,
        }}
        who="Ages [Product] and up"
      />
    </EventPassCard>
  );
}

/** The same pass to a buyer an access rule lets in now: `For you now`, a
 * stepper up to the rule's limit. */
export const EarlyAccessForYou: Story = {
  name: "Early Access For You",
  render: () => <EarlyAccessForYouCard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("For you now")).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", {
        name: "One more Members’ Pass (Two-Day), Adult",
      }),
    );
    await userEvent.click(
      canvas.getByRole("button", {
        name: "One more Members’ Pass (Two-Day), Adult",
      }),
    );
    await expect(
      canvas.getByRole("button", {
        name: "One more Members’ Pass (Two-Day), Adult",
      }),
    ).toBeDisabled();
  },
};

/** During an early bird with a later price set: when it ends, above the
 * early-access note, each on its own line. */
export const EarlyBirdEnds: Story = {
  name: "Early Bird Ends",
  render: () => (
    <EventPassCard
      admits="Any 2 days of the event, once a day"
      badge={{ label: "For you now", tone: "access" }}
      copy={WAS}
      earlyBirdEnds="Early bird ends Sun 29 Nov, 23:59"
      name="VIP Pass"
      note="Your early access lets this email hold 4."
      perks={VIP_PERKS}
      price={{ price: "HK$1,280.00", was: "HK$1,580.00" }}
      variant="vip"
    />
  ),
  play: async ({ canvasElement }) => {
    const card = within(canvasElement).getByRole("article", {
      name: "VIP Pass",
    });
    const ends = within(card).getByText("Early bird ends Sun 29 Nov, 23:59");
    const note = within(card).getByText(
      "Your early access lets this email hold 4.",
    );
    await expect(ends).toBeVisible();
    await expect(note).toBeVisible();
    await expect(
      ends.compareDocumentPosition(note) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  },
};
