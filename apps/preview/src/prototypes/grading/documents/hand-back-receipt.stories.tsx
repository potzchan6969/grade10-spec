import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DOCUMENTS_COPY,
  DOCUMENTS_MANUAL_PATH,
  type ReceiptState,
  SUBMISSION_BACK_WITH_YOU_STORY_ID,
} from "../../../pages/grading/documents/documents-content";
import {
  ReceiptDocument,
  ReceiptStep,
} from "../../../pages/grading/documents/documents-views";
import { expectPage } from "../../../pages/grading/grading-play";
import {
  GradingPageHeader,
  GradingPageShell,
  PrototypeNote,
} from "../../../pages/grading/grading-shared";
import { navigateToStory } from "../../../pages/workbench-story-nav";

/** The hand-back receipt a collector, or the person they name, signs at collection. A wireframe. */
function HandBackReceiptPrototype({ state }: { state: ReceiptState }) {
  return (
    <GradingPageShell wide>
      <PrototypeNote
        manualPath={DOCUMENTS_MANUAL_PATH}
        settles="how the receipt's notices and the named person's line sit beside the signing block."
      />
      <GradingPageHeader
        description={DOCUMENTS_COPY.receipt.intro}
        title="Hand-back receipt"
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <ReceiptDocument state={state} />
        <div className="flex flex-col gap-4">
          <ReceiptStep
            onSign={() => navigateToStory(SUBMISSION_BACK_WITH_YOU_STORY_ID)}
            state={state}
          />
        </div>
      </div>
    </GradingPageShell>
  );
}

const meta = {
  title: "Grading/Documents/Prototypes/Hand Back Receipt",
  component: HandBackReceiptPrototype,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  play: ({ canvasElement }) => expectPage(canvasElement, "Hand-back receipt"),
} satisfies Meta<typeof HandBackReceiptPrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Handed back and settled: the signer is the collector. */
export const Signable: Story = { args: { state: "signable" } };

/** The named person signs in the collector's place; the name is printed as drawn. */
export const NamedPerson: Story = { args: { state: "named-person" } };

/** The ID matched the name and nothing was kept. */
export const IdMatched: Story = { args: { state: "id-matched" } };

/** One card is still with the grader: the receipt names it. */
export const CardHeld: Story = { args: { state: "card-held" } };

/** One card went to the vault: the receipt says so. */
export const VaultedSlab: Story = { args: { state: "vaulted-slab" } };

/** One card withdrawn before its batch closed: its fee refunded. */
export const WithdrawnCard: Story = { args: { state: "withdrawn-card" } };

/** A card not returned: what was paid out and how. */
export const PaidOut: Story = { args: { state: "paid-out" } };
