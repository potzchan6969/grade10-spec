import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { EMAIL } from "./fixtures";
import { TicketPointsRow } from "./ticket-points-row";

/** An order's points under its summary, at 390 px: about what it earns, what
 * it earned, and what a refund took back. The ledger itself is
 * Loyalty/Points/Blocks/PointHistory. */
const meta = {
  title: "Ticketing/Your Tickets/Blocks/TicketPointsRow",
  component: TicketPointsRow,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="mx-auto w-[390px] bg-background px-4 py-5">
        <Story />
      </div>
    ),
  ],
  args: {
    kind: "about",
    copy: {
      label: "Points",
      value: "About 1,150",
      note: `Points go to the Grade10 account for ${EMAIL} once the order is recorded.`,
    },
  },
} satisfies Meta<typeof TicketPointsRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const About: Story = {
  parameters: {
    verification: { caseId: "vc_d12f8ed6-67e8-444e-a5a4-28f3609be4cb" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Points")).toBeVisible();
    expect(canvas.getByText("About 1,150")).toBeVisible();
  },
};

export const Earned: Story = {
  parameters: {
    verification: { caseId: "vc_ff0e6833-c6ae-4111-9c7a-1b5fac97a342" },
  },
  args: {
    kind: "earned",
    copy: {
      label: "Points",
      value: "+1,150",
      note: `Added to the Grade10 account for ${EMAIL}.`,
    },
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText("+1,150")).toHaveClass(
      "text-success",
    );
  },
};

/** One ticket refunded: its share of the points went back. */
export const PartTakenBack: Story = {
  parameters: {
    verification: { caseId: "vc_63231e04-321a-40b4-a8a8-6f6db0f31724" },
  },
  name: "Part taken back",
  args: {
    kind: "about",
    copy: {
      label: "Points",
      value: "About 960",
      note: "19 points were taken back with the refunded ticket.",
    },
  },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).getByText(
        "19 points were taken back with the refunded ticket.",
      ),
    ).toBeVisible();
  },
};

export const TakenBack: Story = {
  parameters: {
    verification: { caseId: "vc_d3dcdae1-c2ce-4643-b614-d2c5f043868f" },
  },
  name: "Taken back",
  args: {
    kind: "takenBack",
    copy: {
      label: "Points",
      value: "Taken back",
      note: "The points this order earned were taken back.",
    },
  },
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).getByText("Taken back")).toBeVisible();
  },
};
