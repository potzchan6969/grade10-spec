import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ProfileForm } from "./profile-form";

const meta = {
  title: "Store Profile/ProfileForm",
  component: ProfileForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    initialDisplayName: "Collector",
    initialBio: "",
    displayNameLabel: "Display name",
    bioLabel: "Bio",
    submitLabel: "Save",
    onSubmit: fn(),
  },
} satisfies Meta<typeof ProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pending: Story = { args: { pending: true } };

/** The consumer supplies the failure copy, and Cancel renders only when the
 * caller handles it. */
export const ErrorWithCancel: Story = {
  args: {
    error: "Profile could not be saved.",
    cancelLabel: "Cancel",
    onCancel: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Profile could not be saved.")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  },
};

export const SubmitsEditedValuesTrimmed: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole("textbox", { name: "Display name" });
    await userEvent.clear(name);
    await userEvent.type(name, "  New Name  ");
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Bio" }),
      "Cards. ",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    expect(args.onSubmit).toHaveBeenCalledWith({
      displayName: "New Name",
      bio: "Cards.",
    });
  },
};

export const CannotSubmitWithoutADisplayName: Story = {
  args: { initialDisplayName: "" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Save" })).toBeDisabled();
    await userEvent.type(
      canvas.getByRole("textbox", { name: "Display name" }),
      "A",
    );
    expect(canvas.getByRole("button", { name: "Save" })).toBeEnabled();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};
