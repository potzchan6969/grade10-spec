import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  navigateToStory,
  TICKETING_STORY_IDS,
} from "../../workbench-story-nav";
import { T, t } from "../ticketing-words";
import { EventPage } from "./event-page";

/**
 * The event page on a phone, the MainPhone and EventPhone boards: the
 * passes, then Good to know, then Your Order, with the order bar pinned to
 * the foot once a ticket is chosen.
 */
const meta = {
  title: "Ticketing/Buying/Screens/Event/Phone",
  component: EventPage,
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-ticketing-buying-US-01",
      "grade10-site-ticketing-buying-US-03",
    ],
  },
  globals: { viewport: { value: "mobile2" } },
  args: {
    mode: "earlyBird",
    onContinue: () => navigateToStory(TICKETING_STORY_IDS.details),
  },
} satisfies Meta<typeof EventPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const CHOSEN = { qty: { adult2: 2, child2: 1 } } as const;

/** Nothing chosen: no bar, Your Order last. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("region", { name: T.event.order.totalLabel }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("article", { name: "VIP Pass" }),
    ).toBeVisible();
  },
};

/** A ticket chosen: the bar pins with the total, the saving and the jump
 * to Your Order. */
export const Chosen: Story = {
  args: { choice: CHOSEN },
  play: async ({ canvasElement }) => {
    const bar = within(canvasElement).getByRole("region", {
      name: T.event.order.totalLabel,
    });
    await expect(within(bar).getByText("HK$950.00")).toBeVisible();
    await expect(
      within(bar).getByRole("link", {
        name: t(T.event.order.seeOrder, { count: 3 }),
      }),
    ).toHaveAttribute("href", "#order");
  },
};

/** Fast Pass per person: one pill per ticket, the tally and Add for
 * everyone. */
export const FastPassPerPerson: Story = {
  name: "Fast Pass per person",
  args: { choice: { ...CHOSEN, fast: { two: { all: 1 } } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: T.event.fastPass.choosePerPerson }),
    );
    await expect(
      canvas.getByRole("group", { name: T.event.fastPass.eachGroup }),
    ).toBeVisible();
    await expect(
      canvas.getByText(
        t(T.event.fastPass.summary, { on: 3, all: 6, amount: "HK$300.00" }),
      ),
    ).toBeVisible();
  },
};
