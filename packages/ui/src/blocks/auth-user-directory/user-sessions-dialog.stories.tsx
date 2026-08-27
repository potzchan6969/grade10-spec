import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { SESSIONS, SESSIONS_COPY } from "./fixtures";
import { UserSessionsDialog } from "./user-sessions-dialog";

const meta = {
  title: "Auth User Directory/UserSessionsDialog",
  component: UserSessionsDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    copy: SESSIONS_COPY,
    subject: "person@example.com",
    sessions: SESSIONS,
    loading: false,
    pending: false,
    error: null,
    onCancel: fn(),
    onRevoke: fn(),
    onRevokeAll: fn(),
  },
} satisfies Meta<typeof UserSessionsDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Portalled, so queries run against the document body. */
const dialog = () => within(document.body);

export const Default: Story = {
  play: async ({ args }) => {
    // Named by identifier; the secret that authenticates one is never shown.
    await expect(dialog().getByText("ses_one")).toBeInTheDocument();

    const row = dialog().getByText("ses_one").closest("tr");
    if (!row) throw new Error("no row for ses_one");
    await userEvent.click(
      within(row as HTMLElement).getByRole("button", { name: "Revoke" }),
    );
    await expect(args.onRevoke).toHaveBeenCalledWith("ses_one");
  },
};

export const RevokeAll: Story = {
  play: async ({ args }) => {
    await userEvent.click(dialog().getByRole("button", { name: "Revoke all" }));
    await expect(args.onRevokeAll).toHaveBeenCalledOnce();
  },
};

export const Loading: Story = {
  args: { loading: true, sessions: [] },
  play: async () => {
    await expect(dialog().getByText("Loading sessions...")).toBeInTheDocument();
  },
};

/** With nothing to end, ending everything is not offered. */
export const Empty: Story = {
  args: { sessions: [] },
  play: async () => {
    await expect(dialog().getByText("No sessions.")).toBeInTheDocument();
    await expect(
      dialog().getByRole("button", { name: "Revoke all" }),
    ).toBeDisabled();
  },
};

export const ShowsTheServerRefusal: Story = {
  args: { error: "Could not load sessions." },
  play: async () => {
    await expect(
      dialog().getByText("Could not load sessions."),
    ).toBeInTheDocument();
  },
};
