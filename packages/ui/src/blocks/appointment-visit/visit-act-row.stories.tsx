import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BOOKED_ACTS, ENDED_ACTS, TODAY_ACTS } from "./fixtures";
import { VisitActRow } from "./visit-act-row";

const meta = {
  title: "Appointment/Visit/Blocks/VisitActRow",
  component: VisitActRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { acts: BOOKED_ACTS },
} satisfies Meta<typeof VisitActRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Presses run here; links leave, Directions outside the site. */
export const Booked: Story = {
  parameters: {
    verification: { caseId: "vc_494698c9-d7bc-4003-99bd-8ce1c306e4a6" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Change time" })).toBeVisible();
    expect(canvas.getByRole("link", { name: "Directions" })).toHaveAttribute(
      "target",
      "_blank",
    );
  },
};

export const Today: Story = {
  parameters: {
    verification: { caseId: "vc_ef747e8b-d424-4281-a35e-861ff631b67a" },
  },
  args: { acts: TODAY_ACTS },
};

/** The primary across the row, and a wide secondary under it. */
export const Ended: Story = {
  parameters: {
    verification: { caseId: "vc_43774f27-b204-46ef-9785-49bc3b13195d" },
  },
  args: { acts: ENDED_ACTS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: "Book again" })).toHaveClass(
      "col-span-2",
    );
    expect(canvas.getByRole("link", { name: "My visits" })).toHaveClass(
      "col-span-2",
    );
  },
};

/** No acts draws nothing. */
export const None: Story = {
  parameters: {
    verification: { caseId: "vc_1cae98bd-b13c-40f3-a467-40e8e46f702e" },
  },
  args: { acts: [] },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-slot="act-row"]')).toBeNull();
  },
};
