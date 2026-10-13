import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  VerifyBody,
  type VerifyState,
} from "../../../prototypes/vault/identity-check/verify-prototype";
import { walkFlowCases } from "../../vault-shared";

const VERIFY_CASES: readonly (readonly [string, VerifyState])[] = [
  ["Invited", "invited"],
  ["Started", "started"],
  ["Submitted", "submitted"],
  ["Approved", "approved"],
  ["Declined", "declined"],
  ["Expired", "expired"],
];

function VerifyBeforeTheVisitFlow() {
  return (
    <FlowContainer
      cases={VERIFY_CASES}
      description={
        <p>
          A collector invited before their visit checks their identity on their
          own phone, with no account. A check that is started can be carried on,
          and one the provider has not decided waits with nothing asked. A check
          that passes or fails leaves the collector with one thing to do: bring
          the item and ID to the visit, or bring the ID to the counter. An
          expired invitation asks for a new one.
        </p>
      }
    >
      {(state, title) => <VerifyBody key={title} state={state} />}
    </FlowContainer>
  );
}

const meta = {
  title: "Vault/Identity Check/Flows/Verify Before The Visit",
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-e-kyc-hosted-verification-US-01",
      "grade10-site-e-kyc-hosted-verification-US-02",
    ],
  },
  render: () => <VerifyBeforeTheVisitFlow />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await walkFlowCases(canvasElement, [
      "Invited",
      "Started",
      "Submitted",
      "Approved",
      "Declined",
      "Expired",
    ]);
  },
};
