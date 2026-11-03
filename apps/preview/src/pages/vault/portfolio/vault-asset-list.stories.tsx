import { Text } from "@grade10/design-system/components/display/text";
import { Link } from "@grade10/design-system/components/forms/link";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  PORTFOLIO_ASSETS,
  VAULT_PORTFOLIO_HREF,
  vaultItemRelatedStoryId,
} from "../../vault-content";
import { navigateToStory } from "../../workbench-story-nav";
import { VaultAssetList } from "./vault-asset-list";

/**
 * Holdings grid with status tabs — Figma `Vault Asset List`
 * (`7077:10911`). In Vault includes Retrieval Pending items
 * (annotation); tabs with zero items hide.
 */
const meta = {
  title: "Vault/Portfolio/Blocks/VaultAssetList",
  component: VaultAssetList,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-4">
        <Story />
        <Text className="text-secondary-foreground" size="xs">
          Related:{" "}
          <Link href={VAULT_PORTFOLIO_HREF} size="xs">
            Vault Portfolio
          </Link>
        </Text>
      </div>
    ),
  ],
} satisfies Meta<typeof VaultAssetList>;

export default meta;
type Story = StoryObj<typeof meta>;

const listArgs = {
  assets: PORTFOLIO_ASSETS,
  onOpenAsset: (asset: (typeof PORTFOLIO_ASSETS)[number]) =>
    navigateToStory(vaultItemRelatedStoryId(asset)),
} satisfies Story["args"];

export const AllAssets: Story = {
  args: listArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: "In Vault" })).toBeVisible();
      expect(
        canvas.getByRole("button", { name: "Live Auction" }),
      ).toBeVisible();
      expect(canvas.getByRole("button", { name: "Listed" })).toBeVisible();
    });
    const cards = canvasElement.querySelectorAll(
      '[data-slot="vault-asset-card"]',
    );
    expect(cards.length).toBe(6);
  },
};

/** In Vault also lists Retrieval Pending items awaiting admin approval. */
export const InVault: Story = {
  args: listArgs,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Open the In Vault tab", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "In Vault" }));
    });
    const cards = canvasElement.querySelectorAll(
      '[data-slot="vault-asset-card"]',
    );
    expect(cards.length).toBe(2);
    await waitFor(() =>
      expect(canvas.getByText("Retrieval Pending")).toBeVisible(),
    );
    // In Vault card carries no badge.
    expect(cards[0]?.textContent).not.toContain("In Vault");
    expect(cards[1]?.textContent).not.toContain("In Vault");
  },
};

/** Live Auction filters to cards under the hammer. */
export const LiveAuction: Story = {
  args: listArgs,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Open the Live Auction tab", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Live Auction" }),
      );
    });
    const cards = canvasElement.querySelectorAll(
      '[data-slot="vault-asset-card"]',
    );
    expect(cards.length).toBe(2);
    expect(cards[0]?.textContent).toContain("Pocket Monsters");
  },
};

/** Listed filters to store-listed cards. */
export const Listed: Story = {
  args: listArgs,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Open the Listed tab", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Listed" }));
    });
    const cards = canvasElement.querySelectorAll(
      '[data-slot="vault-asset-card"]',
    );
    expect(cards.length).toBe(2);
    expect(cards[0]?.textContent).toContain("Rolex");
  },
};

/** Only statuses present get tabs — here nothing is listed or on auction. */
export const VaultedOnly: Story = {
  args: {
    ...listArgs,
    assets: PORTFOLIO_ASSETS.filter(
      (a) => a.status === "In Vault" || a.status === "Retrieval Pending",
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: "Live Auction" })).toBeNull();
    expect(canvas.queryByRole("button", { name: "Listed" })).toBeNull();
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "In Vault" })).toBeVisible(),
    );
  },
};
