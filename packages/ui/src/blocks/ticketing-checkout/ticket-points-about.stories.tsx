import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { phone } from "./checkout.story-fixtures";
import { EMAIL } from "./fixtures";
import { TicketPointsAbout } from "./ticket-points-about";

const meta = {
  title: "Ticketing/Buying/Blocks/TicketPointsAbout",
  component: TicketPointsAbout,
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
    copy: {
      line: `Earn about 115 points. They go to the Grade10 account for ${EMAIL}.`,
    },
  },
} satisfies Meta<typeof TicketPointsAbout>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A guest: about how many, and the account for the email they go to. */
export const Guest: Story = {
  parameters: {
    verification: { caseId: "vc_8995c806-6cc9-4f43-af3c-f743c5a146e3" },
  },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByText(/Earn about 115 points/),
    ).toBeVisible();
  },
};

/** Signed in: they go to the buyer's own account. */
export const SignedIn: Story = {
  parameters: {
    verification: { caseId: "vc_42e9c173-0534-436a-a2a5-4b64521ac7ea" },
  },
  args: {
    copy: { line: "Earn about 115 points. They go to your Grade10 account." },
  },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByText(/your Grade10 account/),
    ).toBeVisible();
  },
};

/** A code made the order free: it earns none. */
export const NoPoints: Story = {
  parameters: {
    verification: { caseId: "vc_dec4beb0-3894-4b81-80ae-052025585d6f" },
  },
  args: {
    copy: { line: "This order is free with CREW4. It earns no points." },
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText(/It earns no points/)).toBeVisible();
  },
};
