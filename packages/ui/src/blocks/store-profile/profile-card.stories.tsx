import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FIXTURE_MEMBER_SINCE } from "../../lib/datetime-fixtures";
import { ProfileCard } from "./profile-card";
import { ProfileDetails } from "./profile-details";
import { ProfileForm } from "./profile-form";

const { common } = getMessages("grade10", "en");

const meta = {
  title: "Account/Profile/Blocks/ProfileCard",
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
          meta={FIXTURE_MEMBER_SINCE}
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
      action: { label: common.retry, onAction: fn() },
    },
  },
};

/** A retry under way spins on its button, keeps focus and takes no press. */
export const ErrorRetryPending: Story = {
  args: {
    state: {
      status: "error",
      message: "Could not load your profile.",
      action: { label: common.retry, onAction: fn(), pending: true },
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const retry = canvas.getByRole("button", { name: common.retry });
    expect(retry).toHaveAttribute("aria-busy", "true");
    retry.focus();
    expect(retry).toHaveFocus();
    await userEvent.click(retry);
    if (args.state.status !== "error") throw new Error("error state expected");
    expect(args.state.action?.onAction).not.toHaveBeenCalled();
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
          copy={{
            displayName: "Display name",
            bio: "Bio",
            submit: common.save,
          }}
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
