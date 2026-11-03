import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { EventGoodToKnow } from "./event-good-to-know";
import { GOOD_TO_KNOW_COPY, NOTES } from "./fixtures";

const meta = {
  title: "Ticketing/Buying/Blocks/EventGoodToKnow",
  component: EventGoodToKnow,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[788px] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: { copy: GOOD_TO_KNOW_COPY, notes: NOTES },
} satisfies Meta<typeof EventGoodToKnow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed out: the sign-in hints above the notes. */
export const SignedOut: Story = {
  parameters: {
    verification: { caseId: "vc_cddd7de1-5aef-4a70-b80f-bd40aed53ad4" },
  },
  name: "Signed Out",
  args: {
    hints: [
      {
        id: "access",
        content: (
          <>
            Early access? <a href="#sign-in">Sign in</a> to see your passes.
          </>
        ),
      },
      {
        id: "lost",
        content: (
          <>
            Lost your tickets?{" "}
            <a href="#sign-in">Sign in with the email you bought with</a>.
          </>
        ),
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "Sign in" })).toBeVisible();
    await expect(
      within(canvas.getByRole("list", { name: "Good to know" })).getAllByRole(
        "listitem",
      ),
    ).toHaveLength(4);
  },
};

/** Signed in: the notes alone. */
export const SignedIn: Story = {
  parameters: {
    verification: { caseId: "vc_59bc1e8c-ced2-49df-a062-93801a82d3b1" },
  },
  name: "Signed In",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("link")).not.toBeInTheDocument();
  },
};
