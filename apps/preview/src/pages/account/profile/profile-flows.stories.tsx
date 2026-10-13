import {
  type AsyncState,
  ProfileCard,
  ProfileDetails,
  ProfileForm,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  FIRST_SAVE_DATE,
  NEVER_SAVED_PROFILE,
  PROFILE_CARD_COPY,
  PROFILE_COPY,
  PROFILE_DETAILS_COPY,
  PROFILE_FORM_COPY,
  type ProfileView,
  SAVED_PROFILE,
} from "./profile-content";

const meta = {
  title: "Account/Profile/Flows/Edit Profile",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type ProfileStep =
  | "neverSaved"
  | "editing"
  | "saving"
  | "refused"
  | "failedSave"
  | "saved"
  | "failedRead";

const STEPS: ReadonlyArray<readonly [string, ProfileStep]> = [
  ["Never saved", "neverSaved"],
  ["Editing", "editing"],
  ["Saving", "saving"],
  ["Refused save", "refused"],
  ["Failed save", "failedSave"],
  ["Saved", "saved"],
  ["Failed read", "failedRead"],
];

/** What the collector typed into the form before saving. */
const DRAFT: ProfileView = {
  displayName: SAVED_PROFILE.displayName,
  bio: SAVED_PROFILE.bio,
};

/** One step of the profile card: what the collector sees at that point. */
function ProfileStepCard({ step }: { step: ProfileStep }) {
  if (step === "failedRead") {
    const state: AsyncState<never> = {
      status: "error",
      message: PROFILE_COPY.loadFailed,
      action: { label: PROFILE_COPY.retry, onAction: () => undefined },
    };
    return <ProfileCard copy={PROFILE_CARD_COPY} state={state} />;
  }

  const shown =
    step === "neverSaved"
      ? NEVER_SAVED_PROFILE
      : { ...DRAFT, memberSince: FIRST_SAVE_DATE };
  const body =
    step === "neverSaved" || step === "saved" ? (
      <ProfileDetails
        bio={shown.bio || PROFILE_COPY.emptyBio}
        copy={PROFILE_DETAILS_COPY}
        displayName={shown.displayName}
        meta={
          shown.memberSince
            ? PROFILE_COPY.memberSince(shown.memberSince)
            : undefined
        }
        onEdit={() => undefined}
      />
    ) : (
      <ProfileForm
        copy={PROFILE_FORM_COPY}
        error={
          step === "refused"
            ? PROFILE_COPY.refused
            : step === "failedSave"
              ? PROFILE_COPY.failed
              : undefined
        }
        initialBio={step === "editing" ? "" : DRAFT.bio}
        initialDisplayName={
          step === "editing"
            ? NEVER_SAVED_PROFILE.displayName
            : DRAFT.displayName
        }
        onCancel={() => undefined}
        onSubmit={() => undefined}
        pending={step === "saving"}
      />
    );

  return (
    <ProfileCard
      copy={PROFILE_CARD_COPY}
      state={{ status: "ready", data: body }}
    />
  );
}

/**
 * A collector opens their profile, edits the name and bio, and saves. A save
 * the server refuses or fails keeps what was typed, and a read that fails
 * says so and offers to read again.
 */
export const Default: Story = {
  parameters: {
    journeys: [
      "grade10-site-store-account-profile-US-01",
      "grade10-site-store-account-profile-US-02",
      "grade10-site-store-account-profile-US-05",
    ],
  },
  render: () => (
    <FlowContainer
      cases={STEPS}
      description={
        <p>
          A collector who has never saved sees the defaulted name and an edit
          control, never a create prompt. Edit opens the form with what is
          stored in it. A save the server refuses or fails keeps the entered
          values with the reason; a save that lands returns to the read view
          with the new values and the member-since date. A failed read says so
          and shows no profile fields.
        </p>
      }
    >
      {(step) => <ProfileStepCard step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole("button", { name: "Next" });

    expect(canvas.getByText("No bio yet.")).toBeVisible();
    expect(canvas.queryByText(/Member since/)).not.toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Edit profile" })).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByRole("textbox", { name: "Display name" })).toHaveValue(
      "Kit Lam",
    );

    await userEvent.click(next);
    expect(canvas.getByRole("button", { name: "Save" })).toBeDisabled();

    await userEvent.click(next);
    expect(canvas.getByText(PROFILE_COPY.refused)).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText(PROFILE_COPY.failed)).toBeVisible();
    expect(canvas.getByRole("textbox", { name: "Bio" })).toHaveValue(
      SAVED_PROFILE.bio,
    );

    await userEvent.click(next);
    expect(canvas.getByText(`Member since ${FIRST_SAVE_DATE}`)).toBeVisible();

    await userEvent.click(next);
    expect(canvas.getByText(PROFILE_COPY.loadFailed)).toBeVisible();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvas.getAllByText(PROFILE_CARD_COPY.title)).toHaveLength(
      STEPS.length,
    );
  },
};
