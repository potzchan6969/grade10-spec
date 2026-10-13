import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  NAMELESS_PROFILE,
  NEVER_SAVED_PROFILE,
  SAVED_PROFILE,
  SEVERAL_LINES_PROFILE,
} from "./profile-content";
import { ProfilePage } from "./profile-page";

const meta = {
  title: "Account/Profile/Screens/Profile",
  component: ProfilePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProfilePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The read view a collector who has never saved sees: the defaulted name, no date, an edit control. */
export const NeverSaved: Story = {
  name: "Never saved",
  args: { profile: NEVER_SAVED_PROFILE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 1, name: "My profile" }),
    ).toBeVisible();
    expect(canvas.getByText("Kit Lam")).toBeVisible();
    expect(canvas.getByText("No bio yet.")).toBeVisible();
    expect(canvas.queryByText(/Member since/)).not.toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Edit profile" })).toBeVisible();
  },
};

/** No account name: the address before the `@` stands in as the name. */
export const NamelessSession: Story = {
  name: "Nameless session",
  args: { profile: NAMELESS_PROFILE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("kitlam")).toBeVisible();
  },
};

/** A saved profile with no bio: the line that says what the bio is for. */
export const NoBio: Story = {
  name: "No bio",
  args: {
    profile: { ...SAVED_PROFILE, bio: "" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("No bio yet.")).toBeVisible();
  },
};

/**
 * A bio over several lines. The read view shows each line as typed; the
 * block's line is a single paragraph, so the lines run together (see gaps).
 */
export const BioOverSeveralLines: Story = {
  name: "Bio over several lines",
  args: { profile: SEVERAL_LINES_PROFILE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Chasing PSA 10s since 2019\./)).toBeVisible();
    expect(
      canvas.getByText(/Ask me about the Base Set trades\./),
    ).toBeVisible();
  },
};

/** A saved profile: member since the first save, with the date shown. */
export const MemberSince: Story = {
  name: "Member since",
  args: { profile: SAVED_PROFILE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Member since March 2024")).toBeVisible();
  },
};

/** Saved before member-since was recorded: no date, and no error. */
export const NoMemberSince: Story = {
  name: "No member-since",
  args: { profile: { ...SAVED_PROFILE, memberSince: undefined } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText(/Member since/)).not.toBeInTheDocument();
    expect(canvas.getByText("Chasing PSA 10s since 2019.")).toBeVisible();
  },
};

/** The page offered for a read-only account: the same view, with no edit control. */
export const ReadOnly: Story = {
  name: "Read-only",
  args: { readOnly: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Kit Lam")).toBeVisible();
    expect(
      canvas.queryByRole("button", { name: "Edit profile" }),
    ).not.toBeInTheDocument();
  },
};

/** The first read in flight: the card shows a loading placeholder and no profile fields. */
export const Loading: Story = {
  args: { read: "loading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Kit Lam")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Edit profile" }),
    ).not.toBeInTheDocument();
  },
};

/** The read failed: the card says so and offers to read it again. */
export const FailedRead: Story = {
  name: "Failed read",
  args: { read: "error" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Could not load your profile.")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Try again" })).toBeVisible();
  },
};
