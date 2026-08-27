import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BAN_COPY } from "./fixtures";
import { UserModerationDialog } from "./user-moderation-dialog";

const meta = {
  title: "Auth User Directory/UserModerationDialog",
  component: UserModerationDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    copy: BAN_COPY,
    subject: "person@example.com",
    tone: "destructive",
    collectsReason: true,
    pending: false,
    error: null,
    onCancel: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof UserModerationDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Portalled, so queries run against the document body. */
const dialog = () => within(document.body);

export const Ban: Story = {
  play: async ({ args }) => {
    await userEvent.type(dialog().getByLabelText("Reason (optional)"), "spam");
    await userEvent.click(dialog().getByRole("button", { name: "Ban" }));

    await expect(args.onConfirm).toHaveBeenCalledWith("spam");
  },
};

/** A move that collects no reason confirms with an empty one, so a consumer
 *  reads one signature whichever move it asked for. */
export const Unban: Story = {
  args: {
    copy: {
      title: "Unban user",
      description: "The account can sign in again immediately.",
      confirm: "Unban",
      cancel: "Cancel",
    },
    tone: "reversible",
    collectsReason: false,
  },
  play: async ({ args }) => {
    await expect(
      dialog().queryByLabelText("Reason (optional)"),
    ).not.toBeInTheDocument();

    await userEvent.click(dialog().getByRole("button", { name: "Unban" }));
    await expect(args.onConfirm).toHaveBeenCalledWith("");
  },
};

export const Delete: Story = {
  args: {
    copy: {
      title: "Delete account",
      description:
        "Permanent. The account is removed, its sessions are revoked, and every product erases this person's data on its next sweep.",
      confirm: "Delete",
      cancel: "Cancel",
    },
    collectsReason: false,
  },
};

export const Cancelled: Story = {
  play: async ({ args }) => {
    await userEvent.click(dialog().getByRole("button", { name: "Cancel" }));
    await expect(args.onCancel).toHaveBeenCalledOnce();
  },
};

export const ShowsTheServerRefusal: Story = {
  args: { error: "The action failed." },
  play: async () => {
    await expect(dialog().getByText("The action failed.")).toBeInTheDocument();
  },
};
