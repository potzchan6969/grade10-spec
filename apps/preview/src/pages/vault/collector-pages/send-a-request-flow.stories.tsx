import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  RequestWizardBody,
  type RequestWizardState,
} from "../../../prototypes/vault/collector-pages/request-wizard-prototype";
import { walkFlowCases } from "../../vault-shared";

const SEND_CASES: readonly (readonly [string, RequestWizardState])[] = [
  ["Describe the item", "describe"],
  ["Photograph it", "photograph"],
  ["Read the request back", "review"],
  ["Sent with a reference", "sent"],
];

function SendARequestFlow() {
  return (
    <FlowContainer
      cases={SEND_CASES}
      description={
        <p>
          A collector describes one card, photographs it, reads the request back
          and sends it in. The outcome is a case with its reference, which the
          collector can say at the shop and type as the transfer reference.
        </p>
      }
    >
      {(state, title) => <RequestWizardBody key={title} state={state} />}
    </FlowContainer>
  );
}

const meta = {
  title: "Vault/Collector Pages/Flows/Send A Request",
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-vault-case-intake-US-01",
      "grade10-site-vault-case-intake-US-04",
      "grade10-site-vault-case-intake-US-05",
    ],
  },
  render: () => <SendARequestFlow />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await walkFlowCases(canvasElement, [
      "Describe the item",
      "Photograph it",
      "Read the request back",
      "Sent with a reference",
    ]);
  },
};
