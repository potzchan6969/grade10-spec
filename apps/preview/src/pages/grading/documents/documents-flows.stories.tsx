import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { walkCases } from "../grading-play";
import { AgreementStep, ReceiptStep } from "./documents-views";

const meta = {
  title: "Grading/Documents/Flows/Signing at the Counter",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SIGN_AGREEMENT = [
  ["Sign the agreement", "signable"],
  ["The cover in total", "cover-schedule"],
  ["Signed and sealed", "sealed"],
] as const;

const DECLINE_AGREEMENT = [
  ["Sign the agreement", "signable"],
  ["Declined", "declined"],
] as const;

const SIGN_RECEIPT = [
  ["Sign the receipt", "signable"],
  ["ID matched", "id-matched"],
] as const;

const KEEP_COPY = [
  ["Signed and sealed", "sealed"],
  ["Already signed", "already-signed"],
] as const;

const titles = (cases: readonly (readonly [string, string])[]) =>
  cases.map(([title]) => title);

/** Collector signs the submission agreement at the counter; the cover is named before the sign. */
export const SignAgreement: Story = {
  parameters: { journeys: ["grade10-site-grading-counter-documents-US-01"] },
  render: () => (
    <FlowContainer
      cases={SIGN_AGREEMENT}
      description={
        <p>
          The agreement is signed on the shop iPad once every card is checked.
          The cover in total is read before the sign, and the sealed copy closes
          the walk.
        </p>
      }
    >
      {(state) => <AgreementStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(SIGN_AGREEMENT)),
};

/** Collector declines to sign: nothing is paid and nothing is signed. */
export const DeclineAgreement: Story = {
  parameters: { journeys: ["grade10-site-grading-counter-documents-US-02"] },
  render: () => (
    <FlowContainer
      cases={DECLINE_AGREEMENT}
      description={
        <p>
          Decline sits beside Sign on the iPad. A declined agreement is on the
          record, nothing is paid or signed, and the member of staff takes it
          from there.
        </p>
      }
    >
      {(state) => <AgreementStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) =>
    walkCases(canvasElement, titles(DECLINE_AGREEMENT)),
};

/** Collector signs the hand-back receipt and leaves with the slabs. */
export const SignHandBackReceipt: Story = {
  parameters: { journeys: ["grade10-site-grading-counter-documents-US-03"] },
  render: () => (
    <FlowContainer
      cases={SIGN_RECEIPT}
      description={
        <p>
          The receipt is signed once the balance is settled and every item is
          ticked. The ID line names whether the ID matched the name, and that
          nothing was kept.
        </p>
      }
    >
      {(state) => <ReceiptStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(SIGN_RECEIPT)),
};

/** Collector keeps a copy of every document: the sealed copies and the repeat sign. */
export const KeepCopy: Story = {
  parameters: { journeys: ["grade10-site-grading-counter-documents-US-05"] },
  render: () => (
    <FlowContainer
      cases={KEEP_COPY}
      description={
        <p>
          A sealed document is downloadable, emailed with the signed PDF
          attached, and kept on the submission page with its fingerprint.
        </p>
      }
    >
      {(state) => <AgreementStep state={state} />}
    </FlowContainer>
  ),
  play: ({ canvasElement }) => walkCases(canvasElement, titles(KEEP_COPY)),
};
