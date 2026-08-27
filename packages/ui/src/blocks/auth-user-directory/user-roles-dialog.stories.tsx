import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ROLE_OPTIONS, ROLES_COPY } from "./fixtures";
import { UserRolesDialog } from "./user-roles-dialog";

const meta = {
  title: "Auth User Directory/UserRolesDialog",
  component: UserRolesDialog,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    copy: ROLES_COPY,
    subject: "person@example.com",
    options: ROLE_OPTIONS,
    selected: ["support", "auditor"],
    pending: false,
    error: null,
    onCancel: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof UserRolesDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The dialog renders in a portal, so its content is not inside canvasElement
   — every query runs against the document body. */
const dialog = () => within(document.body);
const checkbox = (name: string) => dialog().getByRole("checkbox", { name });

export const Default: Story = {
  play: async () => {
    await expect(checkbox("support")).toBeChecked();
    await expect(checkbox("auditor")).toBeChecked();
    await expect(checkbox("admin")).not.toBeChecked();
    await expect(checkbox("staff")).not.toBeChecked();
  },
};

/** The selection comes back in the order the options were offered, not the
 *  order they were clicked, so one selection is always one list. */
export const EditedSelectionIsSubmittedInOptionOrder: Story = {
  play: async ({ args }) => {
    await userEvent.click(checkbox("auditor"));
    await userEvent.click(checkbox("staff"));
    await userEvent.click(dialog().getByRole("button", { name: "Save roles" }));

    await expect(args.onConfirm).toHaveBeenCalledWith(["staff", "support"]);
  },
};

/** Unchecking everything submits nothing — what a console does with an empty
 *  grant list is its decision, not this dialog's. */
export const EmptySelectionSubmitsEmpty: Story = {
  play: async ({ args }) => {
    await userEvent.click(checkbox("support"));
    await userEvent.click(checkbox("auditor"));
    await userEvent.click(dialog().getByRole("button", { name: "Save roles" }));

    await expect(args.onConfirm).toHaveBeenCalledWith([]);
  },
};

/** An operator editing their own account is warned before they drop the role
 *  that is holding the console open for them. */
export const WarnsAboutSelfLockout: Story = {
  args: { selected: ["admin"], lockoutRole: "admin" },
  play: async () => {
    const lockout = /locks you out/;
    await expect(dialog().queryByText(lockout)).not.toBeInTheDocument();
    await userEvent.click(checkbox("admin"));
    await expect(dialog().getByText(lockout)).toBeInTheDocument();
  },
};

export const ShowsTheServerRefusal: Story = {
  args: { error: "Saving roles failed." },
  play: async () => {
    await expect(
      dialog().getByText("Saving roles failed."),
    ).toBeInTheDocument();
  },
};

export const Saving: Story = {
  args: { pending: true },
};
