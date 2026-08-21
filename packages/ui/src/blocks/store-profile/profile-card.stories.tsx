import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { ProfileCard } from "./profile-card";
import { ProfileDetails } from "./profile-details";
import { ProfileForm } from "./profile-form";

const meta = {
  title: "Store Profile/ProfileCard",
  component: ProfileCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      title: "My profile",
      description: "Store data, keyed by your account.",
    },
    state: {
      status: "ready",
      data: (
        <ProfileDetails
          bio="Chasing PSA 10s since 2019."
          displayName="Collector"
          copy={{ edit: "Edit profile" }}
          meta="Member since Mar 12, 2024"
          onEdit={fn()}
        />
      ),
    },
  },
} satisfies Meta<typeof ProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = { args: { state: { status: "loading" } } };

/** The consumer supplies the message and what to call the action. */
export const ErrorState: Story = {
  args: {
    state: {
      status: "error",
      message: "Could not load your profile.",
      action: { label: "Try again", onAction: fn() },
    },
  },
};

/** View-versus-edit is product state: the consumer swaps the body, the card
 * stays put. */
export const EditingBody: Story = {
  args: {
    state: {
      status: "ready",
      data: (
        <ProfileForm
          copy={{ displayName: "Display name", bio: "Bio", submit: "Save" }}
          initialBio=""
          initialDisplayName="Collector"
          onSubmit={fn()}
        />
      ),
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("textbox", { name: "Display name" }),
    ).toBeInTheDocument();
  },
};
