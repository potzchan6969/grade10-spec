import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  CaseBodyWithRail,
  type CasePageState,
} from "../../../prototypes/vault/collector-pages/case-page-prototype";
import { walkFlowCases } from "../../vault-shared";

const HEAR_CASES: readonly (readonly [string, CasePageState])[] = [
  ["Offer waiting", "offer-waiting"],
  ["Loan running", "loan-running"],
  ["Past due", "past-due"],
];

function HearAboutYourCaseFlow() {
  return (
    <FlowContainer
      cases={HEAR_CASES}
      description={
        <p>
          Each message links to the case page, which reads the same fact the
          message named: the offer waiting, the balance due, and the balance
          past due with the reminders already sent. The collector sees the
          figure first in the message and the same figure on the page.
        </p>
      }
    >
      {(state, title) => <CaseBodyWithRail key={title} state={state} />}
    </FlowContainer>
  );
}

const meta = {
  title: "Vault/Collector Pages/Flows/Hear About Your Case",
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-vault-collector-notifications-US-01",
      "grade10-site-vault-collector-notifications-US-02",
    ],
  },
  render: () => <HearAboutYourCaseFlow />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await walkFlowCases(canvasElement, [
      "Offer waiting",
      "Loan running",
      "Past due",
    ]);
  },
};
