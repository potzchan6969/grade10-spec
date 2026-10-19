import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { AVATAR_IMAGE } from "./profile.story-shared";
import { ProfileForm } from "./profile-form";

const { common, profile } = getMessages("grade10", "en");

const COPY = {
  displayName: profile.displayNameLabel,
  bio: profile.bioLabel,
  submit: common.save,
  chooseAvatar: profile.chooseAvatar,
  removeAvatar: profile.removeAvatar,
};

const meta = {
  title: "Account/Profile/Blocks/ProfileForm",
  component: ProfileForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: COPY,
    avatarAlt: profile.avatarAlt,
    avatarFallback: "C",
    email: "collector@example.com",
    displayNameMaxLength: 80,
    bioMaxLength: 500,
    initialDisplayName: "Collector",
    initialBio: "",
    onSubmit: fn(),
  },
} satisfies Meta<typeof ProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

function fileInput(canvasElement: HTMLElement): HTMLInputElement {
  const input = canvasElement.querySelector<HTMLInputElement>(
    '[data-slot="profile-avatar-input"]',
  );
  if (!input) throw new Error("avatar file input expected");
  return input;
}

/** The email shows read-only; no control edits it. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("collector@example.com")).toBeInTheDocument();
    expect(
      canvas.queryByDisplayValue("collector@example.com"),
    ).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: common.save }));
    expect(args.onSubmit).toHaveBeenCalledWith({
      displayName: "Collector",
      bio: "",
      avatar: { outcome: "unchanged" },
    });
  },
};

export const WithAvatar: Story = {
  args: { avatarSrc: AVATAR_IMAGE },
};

/** A save in flight shows busy and cannot be sent again. */
export const Pending: Story = {
  args: { pending: true },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole("button", { name: common.save });
    expect(save).toHaveAttribute("aria-busy", "true");
    save.click();
    await userEvent.type(
      canvas.getByRole("textbox", { name: profile.displayNameLabel }),
      "{enter}",
    );
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

/** The application supplies the refusal; the entered values are kept. */
export const Refused: Story = {
  args: { error: profile.displayNameRequired, initialDisplayName: "" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(profile.displayNameRequired)).toBeInTheDocument();
  },
};

/** A cancel reports to its handler and never to the submit handler. */
export const CancelReportsNoValues: Story = {
  args: { copy: { ...COPY, cancel: common.cancel }, onCancel: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByRole("textbox", { name: profile.displayNameLabel }),
      "x",
    );
    await userEvent.upload(
      fileInput(canvasElement),
      new File(["x"], "a.png", { type: "image/png" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: common.cancel }));
    expect(args.onCancel).toHaveBeenCalledOnce();
    expect(args.onSubmit).not.toHaveBeenCalled();
  },
};

/** A handler without a label, or a label without a handler, offers no cancel. */
export const NoCancelWithoutBoth: Story = {
  render: (args) => (
    <div>
      <ProfileForm {...args} onCancel={fn()} />
      <ProfileForm {...args} copy={{ ...COPY, cancel: common.cancel }} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).queryByRole("button", { name: common.cancel }),
    ).toBeNull();
  },
};

export const SubmitsEditedValuesTrimmed: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole("textbox", {
      name: profile.displayNameLabel,
    });
    await userEvent.clear(name);
    await userEvent.type(name, "  New Name  ");
    await userEvent.type(
      canvas.getByRole("textbox", { name: profile.bioLabel }),
      "Cards. ",
    );
    await userEvent.click(canvas.getByRole("button", { name: common.save }));
    expect(args.onSubmit).toHaveBeenCalledWith({
      displayName: "New Name",
      bio: "Cards.",
      avatar: { outcome: "unchanged" },
    });
  },
};

/** The bio is a field of several lines, and its break is reported. */
export const BioKeepsLineBreaks: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const bio = canvas.getByRole("textbox", { name: profile.bioLabel });
    expect(bio.tagName).toBe("TEXTAREA");
    await userEvent.type(bio, "Line one{enter}Line two");
    await userEvent.click(canvas.getByRole("button", { name: common.save }));
    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ bio: "Line one\nLine two" }),
    );
  },
};

/** An empty display name is the application's to refuse, not the form's. */
export const EmptyDisplayNameReachesTheApplication: Story = {
  args: { initialDisplayName: "" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const save = canvas.getByRole("button", { name: common.save });
    expect(save).toBeEnabled();
    expect(
      canvas.getByRole("textbox", { name: profile.displayNameLabel }),
    ).not.toBeRequired();
    await userEvent.click(save);
    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ displayName: "" }),
    );
  },
};

/** Each field takes no more than the limit the application passed. */
export const LimitsAreTheApplications: Story = {
  args: { displayNameMaxLength: 5, bioMaxLength: 7 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("textbox", { name: profile.displayNameLabel }),
    ).toHaveAttribute("maxlength", "5");
    expect(
      canvas.getByRole("textbox", { name: profile.bioLabel }),
    ).toHaveAttribute("maxlength", "7");
  },
};

/** A chosen file of any type is previewed and reported, never judged. */
export const ChosenImageIsPreviewedAndReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const file = new File(["not really a picture"], "notes.txt", {
      type: "text/plain",
    });
    await userEvent.upload(fileInput(canvasElement), file);
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="avatar-fallback"]'),
      ).toHaveTextContent("C"),
    );
    await userEvent.click(canvas.getByRole("button", { name: common.save }));
    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ avatar: { outcome: "chosen", file } }),
    );
  },
};

/** A chosen picture replaces the current one in the preview. */
export const ChosenImagePreview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const svg = await (await fetch(AVATAR_IMAGE)).blob();
    await userEvent.upload(
      fileInput(canvasElement),
      new File([svg], "me.svg", { type: "image/svg+xml" }),
    );
    const image = await canvas.findByRole("img", { name: profile.avatarAlt });
    expect(image.getAttribute("src")).toMatch(/^blob:/);
  },
};

/** Removing the current avatar shows the fallback and reports the removal. */
export const RemovalIsReported: Story = {
  args: { avatarSrc: AVATAR_IMAGE },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findByRole("img", { name: profile.avatarAlt });
    await userEvent.click(
      canvas.getByRole("button", { name: profile.removeAvatar }),
    );
    await waitFor(() =>
      expect(canvas.queryByRole("img")).not.toBeInTheDocument(),
    );
    expect(
      canvasElement.querySelector('[data-slot="avatar-fallback"]'),
    ).toHaveTextContent("C");
    await userEvent.click(canvas.getByRole("button", { name: common.save }));
    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ avatar: { outcome: "removed" } }),
    );
  },
};

/** An untouched avatar is reported unchanged, whether or not one is set. */
export const UntouchedAvatarIsUnchanged: Story = {
  args: { avatarSrc: AVATAR_IMAGE },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: common.save }));
    expect(args.onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ avatar: { outcome: "unchanged" } }),
    );
  },
};

/** Every visible word is the application's. */
export const EveryWordIsSupplied: Story = {
  args: { avatarSrc: AVATAR_IMAGE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    for (const label of [
      COPY.displayName,
      COPY.bio,
      COPY.submit,
      COPY.chooseAvatar,
      COPY.removeAvatar,
      "collector@example.com",
    ]) {
      expect(canvas.getAllByText(label).length).toBeGreaterThan(0);
    }
  },
};
