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
  parameters: {
    verification: { caseId: "vc_11a20d4c-b2f6-49fc-8901-2c1cd0626950" },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("status", { name: "Loading the event" }),
    ).toBeVisible();
  },
};

/** Loading at 390 px. */
export const LoadingPhone: Story = {
  parameters: {
    verification: { caseId: "vc_3b72daca-da73-4f31-b97a-e7101d2742dc" },
  },
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
  parameters: {
    verification: { caseId: "vc_ff14825c-a05b-4121-b2a2-fb0e64d5e0a9" },
  },
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
  parameters: {
    verification: { caseId: "vc_c2f30166-6cfe-471f-ae5c-6665c264b3c5" },
  },
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
  parameters: {
    verification: { caseId: "vc_8b962a07-7a56-4bdf-a971-8cff3a43a13d" },
  },
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
  parameters: {
    verification: { caseId: "vc_20197769-1256-4658-a07e-aa84d28bc62f" },
  },
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
