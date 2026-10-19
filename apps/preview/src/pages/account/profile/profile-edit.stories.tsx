import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { PROFILE_COPY } from "./profile-content";
import { ProfilePage } from "./profile-page";

const meta = {
  title: "Account/Profile/Screens/Profile/Edit",
  component: ProfilePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The form open on the saved profile: display name and bio, editable, with save and cancel. */
export const Editing: Story = {
  args: { mode: "edit" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("textbox", { name: "Display name" })).toHaveValue(
      "Kit Lam",
    );
    expect(canvas.getByRole("textbox", { name: "Bio" })).toHaveValue(
      "Chasing PSA 10s since 2019.",
    );
    expect(canvas.getByRole("button", { name: "Save" })).toBeEnabled();
  },
};

/** A save in flight: the save button is busy and cannot be sent again. */
export const Saving: Story = {
  args: { mode: "edit", save: "saving" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Save" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  },
};

/** The server refused the name: its reason shows, and the entered values stay. */
export const RefusedSave: Story = {
  name: "Refused save",
  args: { mode: "edit", save: "refused" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(PROFILE_COPY.refused)).toBeVisible();
    expect(canvas.getByRole("textbox", { name: "Display name" })).toHaveValue(
      "Kit Lam",
    );
  },
};

/** The save failed: it says so and keeps what was typed. */
export const FailedSave: Story = {
  name: "Failed save",
  args: { mode: "edit", save: "failed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(PROFILE_COPY.failed)).toBeVisible();
    expect(canvas.getByRole("textbox", { name: "Bio" })).toHaveValue(
      "Chasing PSA 10s since 2019.",
    );
  },
};

/** The display name cleared: the reason that a name is required shows (see gaps). */
export const EmptyDisplayName: Story = {
  name: "Empty display name",
  args: {
    mode: "edit",
    profile: { displayName: "", bio: "", email: "kitlam@example.com" },
    save: "emptyName",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(PROFILE_COPY.emptyName)).toBeVisible();
  },
};

/** Cancel returns to the read view with the stored profile, not the draft. */
export const Cancelled: Story = {
  args: { mode: "view" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Edit profile" }));
    await userEvent.clear(
      canvas.getByRole("textbox", { name: "Display name" }),
    );
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Display name" }),
      "Someone else",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
    expect(canvas.getByText("Kit Lam")).toBeVisible();
    expect(canvas.queryByText("Someone else")).not.toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Edit profile" })).toBeVisible();
  },
};
