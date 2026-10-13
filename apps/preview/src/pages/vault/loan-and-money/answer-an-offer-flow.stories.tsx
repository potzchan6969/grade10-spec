import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  OfferAndRepaymentsBody,
  type OfferAndRepaymentsState,
} from "../../../prototypes/vault/loan-and-money/offer-and-repayments-prototype";
import { walkFlowCases } from "../../vault-shared";

const OFFER_CASES: readonly (readonly [string, OfferAndRepaymentsState])[] = [
  ["Read the offer", "offer"],
  ["Accepted", "accepted"],
];

function AnswerAnOfferFlow() {
  return (
    <FlowContainer
      cases={OFFER_CASES}
      description={
        <p>
          A collector reads the offer on their own phone: the amount, the term,
          the total to repay and what a late day costs. Accepting it records the
          terms, and the term runs from the day the loan is paid out.
        </p>
      }
    >
      {(state, title) => <OfferAndRepaymentsBody key={title} state={state} />}
    </FlowContainer>
  );
}

const meta = {
  title: "Vault/Loan And Money/Flows/Answer An Offer",
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-vault-valuation-and-offer-US-02"],
  },
  render: () => <AnswerAnOfferFlow />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await walkFlowCases(canvasElement, ["Read the offer", "Accepted"]);
  },
};
