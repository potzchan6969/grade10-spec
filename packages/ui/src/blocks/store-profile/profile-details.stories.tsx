import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FIXTURE_MEMBER_SINCE } from "../../lib/datetime-fixtures";
import { ProfileDetails } from "./profile-details";

const meta = {
  title: "Store Profile/ProfileDetails",
  component: ProfileDetails,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    displayName: "Collector",
    bio: "Chasing PSA 10s since 2019.",
    meta: FIXTURE_MEMBER_SINCE,
  },
} satisfies Meta<typeof ProfileDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** An empty bio is the consumer's copy decision — pass the placeholder as
 * the bio, or omit it and no line renders. */
export const WithoutBio: Story = {
  args: { bio: undefined, meta: undefined },
};

export const EditIsReported: Story = {
  args: { copy: { edit: "Edit profile" }, onEdit: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Edit profile" }));
    expect(args.onEdit).toHaveBeenCalledOnce();
  },
};
