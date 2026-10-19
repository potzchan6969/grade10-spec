import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { FIXTURE_MEMBER_SINCE } from "../../lib/datetime-fixtures";
import { AVATAR_IMAGE } from "./profile.story-shared";
import { ProfileDetails } from "./profile-details";

const meta = {
  title: "Account/Profile/Blocks/ProfileDetails",
  component: ProfileDetails,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    avatarAlt: "Your profile picture",
    avatarFallback: "C",
    displayName: "Collector",
    email: "collector@example.com",
    bio: "Chasing PSA 10s since 2019.",
    meta: FIXTURE_MEMBER_SINCE,
  },
} satisfies Meta<typeof ProfileDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No avatar image: the supplied fallback stands in. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Collector")).toBeInTheDocument();
    expect(canvas.getByText("collector@example.com")).toBeInTheDocument();
    expect(canvas.getByText("Chasing PSA 10s since 2019.")).toBeInTheDocument();
    expect(canvas.getByText(FIXTURE_MEMBER_SINCE)).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="avatar-fallback"]'),
    ).toHaveTextContent("C");
  },
};

/** All five values, the image named by the application. */
export const WithAvatar: Story = {
  args: { avatarSrc: AVATAR_IMAGE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const image = await canvas.findByRole("img", {
      name: "Your profile picture",
    });
    expect(image).toHaveAttribute("src", AVATAR_IMAGE);
    expect(canvas.getByText("collector@example.com")).toBeInTheDocument();
  },
};

/** An image that fails to load shows the fallback, never a broken image. */
export const AvatarFailsToLoad: Story = {
  args: { avatarSrc: "https://invalid.example/avatar.png" },
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="avatar-fallback"]'),
      ).toHaveTextContent("C"),
    );
    expect(canvasElement.querySelector("img")).toBeNull();
  },
};

/** An omitted value is absent: nothing of the component's own stands in. */
export const WithoutOptionalValues: Story = {
  args: { bio: undefined, email: undefined, meta: undefined },
  play: async ({ canvasElement }) => {
    const details = canvasElement.querySelector(
      '[data-slot="profile-details"]',
    );
    expect(details?.textContent).toBe("CCollector");
  },
};

/** The bio's line breaks show as typed. */
export const BioOverSeveralLines: Story = {
  args: { bio: "Chasing PSA 10s.\nSince 2019." },
  play: async ({ canvasElement }) => {
    const bio = within(canvasElement).getByText(/Chasing PSA 10s\./);
    expect(bio.textContent).toBe("Chasing PSA 10s.\nSince 2019.");
    expect(getComputedStyle(bio).whiteSpace).toBe("pre-line");
  },
};

export const EditIsReported: Story = {
  args: { copy: { edit: "Edit profile" }, onEdit: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Edit profile" }));
    expect(args.onEdit).toHaveBeenCalledOnce();
  },
};

/** A handler without a label, or a label without a handler, offers no edit. */
export const ReadOnly: Story = {
  render: (args) => (
    <div>
      <ProfileDetails {...args} onEdit={fn()} />
      <ProfileDetails {...args} copy={{ edit: "Edit profile" }} />
      <ProfileDetails {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    expect(within(canvasElement).queryByRole("button")).toBeNull();
  },
};
