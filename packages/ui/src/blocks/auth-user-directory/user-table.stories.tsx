import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TABLE_COPY, USERS } from "./fixtures";
import { UserTable } from "./user-table";

const meta = {
  title: "Auth User Directory/UserTable",
  component: UserTable,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: TABLE_COPY,
    users: USERS,
    onBan: fn(),
    onUnban: fn(),
    onSessions: fn(),
  },
} satisfies Meta<typeof UserTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Row lookup by the email in it, the way an operator finds one by eye. */
const rowFor = (canvasElement: HTMLElement, email: string) => {
  const row = within(canvasElement).getByText(email).closest("tr");
  if (!row) throw new Error(`no table row contains ${email}`);
  return within(row as HTMLElement);
};

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // An account is named by user id; email is an attribute of it.
    await expect(canvas.getByText("u1")).toBeInTheDocument();
    await expect(canvas.getByText("u2")).toBeInTheDocument();

    const active = rowFor(canvasElement, "active@example.com");
    await expect(active.getByText("staff")).toBeInTheDocument();
    await expect(active.getByText("auditor")).toBeInTheDocument();
    await expect(active.getByText("active")).toBeInTheDocument();
    await expect(active.getByText("On")).toBeInTheDocument();

    const banned = rowFor(canvasElement, "banned@example.com");
    await expect(banned.getByText("banned")).toBeInTheDocument();
    await expect(banned.getByText("Off")).toBeInTheDocument();
    // A row carrying no name shows the copy's placeholder.
    await expect(banned.getByText("—")).toBeInTheDocument();
  },
};

/** Ban is offered on an active account and Unban on a banned one — never
 *  both, so an operator cannot pick the move that does not apply. */
export const BanAndUnbanAreExclusive: Story = {
  play: async ({ args, canvasElement }) => {
    const active = rowFor(canvasElement, "active@example.com");
    await userEvent.click(active.getByRole("button", { name: "Ban" }));
    await expect(args.onBan).toHaveBeenCalledWith("u1");
    await expect(
      active.queryByRole("button", { name: "Unban" }),
    ).not.toBeInTheDocument();

    const banned = rowFor(canvasElement, "banned@example.com");
    await userEvent.click(banned.getByRole("button", { name: "Unban" }));
    await expect(args.onUnban).toHaveBeenCalledWith("u2");
  },
};

export const SessionsAreOfferedOnEveryAccount: Story = {
  play: async ({ args, canvasElement }) => {
    const active = rowFor(canvasElement, "active@example.com");
    await userEvent.click(active.getByRole("button", { name: "Sessions" }));
    await expect(args.onSessions).toHaveBeenCalledWith("u1");
  },
};

/** The elevated actions appear only when the consumer passes a handler, which
 *  is how a console hides what the operator's grants do not allow. */
export const WithoutElevatedActions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("button", { name: "Roles" }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  },
};

export const WithElevatedActions: Story = {
  args: { onEditRoles: fn(), onDelete: fn() },
  play: async ({ args, canvasElement }) => {
    const active = rowFor(canvasElement, "active@example.com");

    await userEvent.click(active.getByRole("button", { name: "Roles" }));
    await expect(args.onEditRoles).toHaveBeenCalledWith("u1");

    await userEvent.click(active.getByRole("button", { name: "Delete" }));
    await expect(args.onDelete).toHaveBeenCalledWith("u1");
  },
};

export const Empty: Story = {
  args: { users: [] },
};
