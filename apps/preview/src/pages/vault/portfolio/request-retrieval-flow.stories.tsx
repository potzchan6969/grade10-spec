import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  PORTFOLIO_ASSETS,
  VAULT_ASSET_DETAILS,
  VAULT_RETRIEVAL_PENDING_ASSET_DETAIL,
  type VaultAsset,
} from "../../vault-content";
import { VaultAssetDetails } from "./vault-asset-details";
import { VaultAssetList } from "./vault-asset-list";
import { VaultAssetSummary } from "./vault-asset-summary";

type RetrievalStep =
  | { kind: "holdings"; assets: VaultAsset[] }
  | { kind: "item"; asset: VaultAsset };

const RETRIEVAL_CASES: readonly (readonly [string, RetrievalStep])[] = [
  ["Your holdings", { kind: "holdings", assets: PORTFOLIO_ASSETS }],
  ["The item’s page", { kind: "item", asset: VAULT_ASSET_DETAILS[0] }],
  [
    "Retrieval pending",
    { kind: "item", asset: VAULT_RETRIEVAL_PENDING_ASSET_DETAIL },
  ],
];

function RetrievalStepView({ step }: { step: RetrievalStep }) {
  if (step.kind === "holdings") {
    return (
      <VaultAssetList assets={step.assets} onOpenAsset={() => undefined} />
    );
  }
  return (
    <div className="flex flex-col gap-6">
      <VaultAssetSummary asset={step.asset} />
      <VaultAssetDetails
        asset={step.asset}
        onRequestRetrieval={() => undefined}
      />
    </div>
  );
}

function RequestRetrievalFlow() {
  return (
    <FlowContainer
      cases={RETRIEVAL_CASES}
      description={
        <p>
          The collector finds the item in their holdings, opens its page and
          asks for it back with Request Retrieval. Once asked, the item reads
          Retrieval Pending and Request Retrieval is gone until staff decide.
        </p>
      }
    >
      {(step, title) => <RetrievalStepView key={title} step={step} />}
    </FlowContainer>
  );
}

const meta = {
  title: "Vault/Portfolio/Flows/Request Retrieval",
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-vault-portfolio-US-01",
      "grade10-site-vault-portfolio-US-06",
    ],
  },
  render: () => <RequestRetrievalFlow />,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Holdings, the item's page with Request Retrieval, then the item Retrieval Pending. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const next = canvas.getByRole("button", { name: "Next" });
    await waitFor(() => {
      expect(canvas.getAllByText("Your holdings").length).toBeGreaterThan(0);
    });

    await userEvent.click(next);
    await waitFor(() => {
      expect(
        canvas.getByRole("link", { name: "Request Retrieval" }),
      ).toBeVisible();
    });

    await userEvent.click(next);
    await waitFor(() => {
      expect(canvas.getAllByText("Retrieval Pending").length).toBeGreaterThan(
        0,
      );
    });
    expect(
      canvas.queryByRole("link", { name: "Request Retrieval" }),
    ).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      RETRIEVAL_CASES.length,
    );
  },
};
