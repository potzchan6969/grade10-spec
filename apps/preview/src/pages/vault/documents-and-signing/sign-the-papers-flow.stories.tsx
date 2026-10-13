import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  SigningBody,
  type SigningState,
} from "../../../prototypes/vault/documents-and-signing/signing-prototype";
import { walkFlowCases } from "../../vault-shared";

const SIGN_CASES: readonly (readonly [string, SigningState])[] = [
  ["Read and sign", "sign"],
  ["Decline to sign on screen", "refuse"],
  ["Signed", "signed"],
  ["Download every document", "download-all"],
];

function SignThePapersFlow() {
  return (
    <FlowContainer
      cases={SIGN_CASES}
      description={
        <p>
          At the shop counter, with staff present, a collector reads every page
          on the iPad, types their name and signs once, or declines to sign on
          screen and nothing at all is signed. Once signed, every signed
          document from their cases is one download, each with its fingerprint.
        </p>
      }
    >
      {(state, title) => <SigningBody key={title} state={state} />}
    </FlowContainer>
  );
}

const meta = {
  title: "Vault/Documents And Signing/Flows/Sign The Papers",
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-vault-documents-and-signing-US-01",
      "grade10-site-vault-documents-and-signing-US-02",
      "grade10-site-vault-documents-and-signing-US-05",
    ],
  },
  render: () => <SignThePapersFlow />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await walkFlowCases(canvasElement, [
      "Read and sign",
      "Decline to sign on screen",
      "Signed",
      "Download every document",
    ]);
  },
};
