import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  navigateToStory,
  TICKETING_STORY_IDS,
} from "../../workbench-story-nav";
import { BUYER, T, t } from "../ticketing-words";
import { DetailsPage } from "./checkout-pages";

/**
 * Your Details, the DetailsPhone board: a name for the tickets and an
 * email, then Continue to Check Your Order. Passes goes back to the event.
 */
const meta = {
  title: "Ticketing/Buying/Screens/Your Details",
  component: DetailsPage,
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-ticketing-buying-US-01"],
  },
  args: {
    buyer: "guest",
    onBack: () => navigateToStory(TICKETING_STORY_IDS.eventChosen),
    onContinue: () => navigateToStory(TICKETING_STORY_IDS.review),
  },
} satisfies Meta<typeof DetailsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A guest: empty fields, Sign In offered, the bot check. */
export const Guest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { level: 1, name: T.details.title }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("textbox", { name: T.details.name.label }),
    ).toHaveValue("");
    await expect(canvas.getByText(T.details.email.hint)).toBeVisible();
    await expect(
      canvas.getByRole("group", { name: T.details.botCheck.label }),
    ).toBeVisible();
    await expect(canvas.getByText(T.details.pointsGuest)).toBeVisible();
  },
};

/** Continue with nothing typed: each field says what to fix, and so does
 * the bar. */
export const FieldErrors: Story = {
  name: "Field errors",
  args: { onContinue: () => {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas
        .getAllByRole("button", { name: T.details.continue })
        .at(-1) as HTMLElement,
    );
    await expect(
      await canvas.findByText(T.details.name.required),
    ).toBeVisible();
    await expect(canvas.getByText(T.details.email.invalid)).toBeVisible();
    await expect(
      canvas.getByText(t(T.details.fieldsWrong, { count: 2 })),
    ).toBeVisible();
  },
};

/** Signed in: the account's name, a fixed email, and Not You?. */
export const SignedIn: Story = {
  name: "Signed in",
  args: { buyer: "signedIn" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("textbox", { name: T.details.name.label }),
    ).toHaveValue(BUYER.name);
    await expect(canvas.getByText(T.details.name.hintSignedIn)).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: T.details.email.notYou }),
    ).toBeVisible();
  },
};

/** Signed in with an account whose name is only its email: the name is
 * asked for. */
export const SignedInNoName: Story = {
  name: "Signed in without a usable name",
  args: { buyer: "signedInNoName" },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("textbox", {
        name: T.details.name.label,
      }),
    ).toHaveValue("");
  },
};

/** The session is still being read: the buyer's section waits. */
export const SessionResolving: Story = {
  name: "Session resolving",
  args: { buyer: "resolving" },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole("textbox", {
        name: T.details.name.label,
      }),
    ).not.toBeInTheDocument();
  },
};

/** A free order: no points line. */
export const FreeOrder: Story = {
  name: "Free order",
  args: { free: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText(T.summary.free).length).toBeGreaterThan(0);
    await expect(
      canvas.queryByText(T.details.pointsGuest),
    ).not.toBeInTheDocument();
  },
};
