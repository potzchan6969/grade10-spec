import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  PORTFOLIO_ASSETS,
  VAULT_PORTFOLIO_HREF,
  type VaultAsset,
  vaultItemRelatedStoryId,
} from "./vault-content";
import { VaultItemCard } from "./vault-item-card";
import { navigateToStory } from "./workbench-story-nav";

/**
 * One collectible tile on the Vault Portfolio grid. Only vaulted holdings —
 * intake and pre-check stay on Submissions. Click opens item detail,
 * or retrieval when pickup is pending.
 */
const meta = {
  title: "Pages/Vault/Vault Item Card",
  component: VaultItemCard,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex w-72 flex-col gap-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VaultItemCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const inVaultAsset: VaultAsset = {
  ...PORTFOLIO_ASSETS.find((a) => a.status === "In Vault")!,
  name: "1997 Pocket Monsters Checklist Carddass",
};
const retrievalAsset = PORTFOLIO_ASSETS.find(
  (a) => a.status === "Retrieval pending",
)!;

function LinkedCard({ asset }: { asset: VaultAsset }) {
  return (
    <>
      <VaultItemCard
        asset={asset}
        onOpen={() => navigateToStory(vaultItemRelatedStoryId(asset))}
      />
      <Text className="text-secondary-foreground" size="xs">
        Related:{" "}
        <Link href={VAULT_PORTFOLIO_HREF} size="xs">
          Vault Portfolio
        </Link>
      </Text>
    </>
  );
}

const cardArgs = {
  asset: inVaultAsset,
  onOpen: () => {},
} satisfies Story["args"];

/** Vaulted holding — opens item detail. */
export const InVault: Story = {
  args: cardArgs,
  render: () => <LinkedCard asset={inVaultAsset} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("In Vault")).toBeVisible();
    expect(
      canvas.getByText("1997 Pocket Monsters Checklist Carddass"),
    ).toBeVisible();
    expect(canvas.getByText("Intake estimate")).toBeVisible();
    expect(canvas.getByRole("link", { name: "Vault Portfolio" })).toBeVisible();
  },
};

/** Pickup requested — opens retrieval. */
export const RetrievalPending: Story = {
  args: { ...cardArgs, asset: retrievalAsset },
  render: () => <LinkedCard asset={retrievalAsset} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Retrieval pending")).toBeVisible();
    expect(canvas.getByText(retrievalAsset.name)).toBeVisible();
  },
};
