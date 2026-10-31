import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { EventPageState } from "./event-page-state";
import { CLOSED_COPY, MISSING_COPY, MISSING_SIGNED_IN_COPY } from "./fixtures";

const meta = {
  title: "Ticketing/Buying/Blocks/EventPageState",
  component: EventPageState,
  parameters: { layout: "fullscreen" },
  args: { kind: "loading", copy: { label: "Loading the event" } },
} satisfies Meta<typeof EventPageState>;

export default meta;
type Story = StoryObj<typeof meta>;

const phone = [
  (Story: () => React.JSX.Element) => (
    <div className="w-[390px]">
      <Story />
    </div>
  ),
];

/** The event is on its way: the header and three pass skeletons. */
export const Loading: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("status", { name: "Loading the event" }),
    ).toBeVisible();
  },
};

/** Loading at 390 px. */
export const LoadingPhone: Story = {
  name: "Loading Phone",
  decorators: phone,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("status", { name: "Loading the event" }),
    ).toBeVisible();
  },
};

/** No event at this address, signed out: Sign In, since a restricted
 * event's preview link needs one, and See the Shows. */
export const NoEvent: Story = {
  name: "No Event",
  args: {
    kind: "missing",
    copy: MISSING_COPY,
    onSignIn: fn(),
    onSeeShows: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "We can’t find this event" }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Sign In" }));
    if (args.kind === "missing") await expect(args.onSignIn).toHaveBeenCalled();
  },
};

/** No event at 390 px. */
export const NoEventPhone: Story = {
  name: "No Event Phone",
  decorators: phone,
  args: {
    kind: "missing",
    copy: MISSING_COPY,
    onSignIn: fn(),
    onSeeShows: fn(),
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", { name: "See the Shows" }),
    ).toBeVisible();
  },
};

/** No event, signed in: no Sign In. */
export const NoEventSignedIn: Story = {
  name: "No Event Signed In",
  args: { kind: "missing", copy: MISSING_SIGNED_IN_COPY, onSeeShows: fn() },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole("button", { name: "Sign In" }),
    ).not.toBeInTheDocument();
  },
};

/** A restricted event this account is outside of. */
export const NotOpenToYou: Story = {
  name: "Not Open to You",
  args: { kind: "closed", copy: CLOSED_COPY, onSeeShows: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "This event isn’t open to you yet" }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole("button", { name: "See the Shows" }),
    );
    if (args.kind === "closed")
      await expect(args.onSeeShows).toHaveBeenCalled();
  },
};
