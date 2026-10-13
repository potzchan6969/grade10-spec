import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  OfferAndRepaymentsBody,
  type OfferAndRepaymentsState,
} from "../../../prototypes/vault/loan-and-money/offer-and-repayments-prototype";
import { walkFlowCases } from "../../vault-shared";

const REPAY_CASES: readonly (readonly [string, OfferAndRepaymentsState])[] = [
  ["What is owed", "owed"],
  ["How to pay", "how-to-pay"],
  ["Repayment made", "repayment-made"],
  ["Loan settled", "settled"],
];

function RepayAndCollectFlow() {
  return (
    <FlowContainer
      cases={REPAY_CASES}
      description={
        <p>
          A borrower sees what is owed and the due date, then how to pay: the
          lender’s FPS ID and account, with the case reference as the transfer
          reference. Each repayment appears with the balance after it. When the
          loan is settled the page offers a pickup visit for the item.
        </p>
      }
    >
      {(state, title) => <OfferAndRepaymentsBody key={title} state={state} />}
    </FlowContainer>
  );
}

const meta = {
  title: "Vault/Loan And Money/Flows/Repay And Collect",
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-vault-loan-and-settlement-US-02",
      "grade10-site-vault-loan-and-settlement-US-05",
      "grade10-site-vault-loan-and-settlement-US-06",
    ],
  },
  render: () => <RepayAndCollectFlow />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await walkFlowCases(canvasElement, [
      "What is owed",
      "How to pay",
      "Repayment made",
      "Loan settled",
    ]);
  },
};
