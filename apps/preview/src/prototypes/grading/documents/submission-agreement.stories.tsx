import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AGREEMENT_STORY_IDS,
  type AgreementState,
  DOCUMENTS_COPY,
  DOCUMENTS_MANUAL_PATH,
  SUBMISSION_HANDED_IN_STORY_ID,
} from "../../../pages/grading/documents/documents-content";
import {
  AgreementDocument,
  AgreementSigning,
} from "../../../pages/grading/documents/documents-views";
import { expectPage } from "../../../pages/grading/grading-play";
import {
  GradingPageHeader,
  GradingPageShell,
  PrototypeNote,
} from "../../../pages/grading/grading-shared";
import { navigateToStory } from "../../../pages/workbench-story-nav";

/** The submission agreement on the shop iPad: the document and the signing block. A wireframe. */
function SubmissionAgreementPrototype({ state }: { state: AgreementState }) {
  return (
    <GradingPageShell wide>
      <PrototypeNote
        manualPath={DOCUMENTS_MANUAL_PATH}
        settles="how the ceremony's chrome, the link timer and the signing block sit beside the document on the shop iPad."
      />
      <GradingPageHeader
        description={`${DOCUMENTS_COPY.shop} · ${DOCUMENTS_COPY.submission} · ${DOCUMENTS_COPY.linkTimer}`}
        title="Submission agreement"
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <AgreementDocument state={state} />
        <div className="flex flex-col gap-4">
          <AgreementSigning
            onOpenSubmission={() =>
              navigateToStory(SUBMISSION_HANDED_IN_STORY_ID)
            }
            onSign={() => navigateToStory(AGREEMENT_STORY_IDS.sealed)}
            state={state}
          />
        </div>
      </div>
    </GradingPageShell>
  );
}

const meta = {
  title: "Grading/Documents/Prototypes/Submission Agreement",
  component: SubmissionAgreementPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  play: ({ canvasElement }) =>
    expectPage(canvasElement, "Submission agreement"),
} satisfies Meta<typeof SubmissionAgreementPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The agreement to sign: the parties, the cards, the fee and the seven clauses. */
export const Signable: Story = { args: { state: "signable" } };

/** Cover per card and the cover in total, at the Express level. */
export const CoverSchedule: Story = { args: { state: "cover-schedule" } };

/** The postal address is empty: Sign names the empty line. */
export const PostalAddressEmpty: Story = {
  args: { state: "postal-address-empty" },
};

/** The document was not read to the end: the refusal is named. */
export const PagesNotViewed: Story = { args: { state: "pages-not-viewed" } };

/** The name differs from the booking: the refusal is named against it. */
export const NameMismatch: Story = { args: { state: "name-mismatch" } };

/** Declined: nothing is paid and nothing is signed. */
export const Declined: Story = { args: { state: "declined" } };

/** Signed and sealed: the copies on the submission page, with the fingerprint. */
export const Sealed: Story = { args: { state: "sealed" } };

/** The link has expired: ask staff for a new one. */
export const LinkExpired: Story = { args: { state: "link-expired" } };

/** Already signed: the sealed copy is on the submission page. */
export const AlreadySigned: Story = { args: { state: "already-signed" } };

/** Placeholders outside production: the brackets, marked. */
export const PlaceholdersOutsideProduction: Story = {
  args: { state: "placeholders" },
};
