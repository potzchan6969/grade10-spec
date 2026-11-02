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
 * Holdings grid with status tabs and a per-tab sort — Figma `Vault Asset
 * List` (`7077:10911`). In Vault includes Retrieval Pending items
 * (annotation); tabs with zero items hide; each tab keeps its own sort.
 */
const meta = {
  title: "Vault/Portfolio/Parts/VaultAssetList",
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
      expect(
        canvas.getByRole("button", { name: "Highest Est. Value" }),
      ).toBeVisible();
    });
    // Highest estimate first — 1986 Fleer Michael Jordan at 156,000.
    const cards = canvasElement.querySelectorAll(
      '[data-slot="vault-asset-card"]',
    );
    expect(cards.length).toBe(6);
    expect(cards[0]?.textContent).toContain("1986 Fleer Michael Jordan");
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

/** Live Auction sorts Ending Soonest by default; Highest Bid is the other option. */
export const LiveAuction: Story = {
  args: listArgs,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Open the Live Auction tab", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Live Auction" }),
      );
    });
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "Ending Soonest" }),
      ).toBeVisible(),
    );
    const cards = canvasElement.querySelectorAll(
      '[data-slot="vault-asset-card"]',
    );
    expect(cards.length).toBe(2);
    // Ending soonest first — va-004 ends 24 Oct before va-005 on 27 Oct.
    expect(cards[0]?.textContent).toContain("Pocket Monsters");
    await step("Switch sort to Highest Bid", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Ending Soonest" }),
      );
      const menu = await within(canvasElement.ownerDocument.body).findByRole(
        "menu",
      );
      await userEvent.click(
        within(menu).getByRole("menuitem", { name: "Highest Bid" }),
      );
      // Base UI removes its focus-guard span a tick after the menu closes.
      await waitFor(() =>
        expect(
          canvasElement.ownerDocument.querySelector(
            "[data-base-ui-focus-guard]",
          ),
        ).toBeNull(),
      );
    });
    const resorted = canvasElement.querySelectorAll(
      '[data-slot="vault-asset-card"]',
    );
    // Highest bid first — va-005 at 52,000 outbids va-004 at 10,000.
    expect(resorted[0]?.textContent).toContain("Lincoln Cent");
  },
};

/** Listed sorts Recently Listed by default. */
export const Listed: Story = {
  args: listArgs,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("Open the Listed tab", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Listed" }));
    });
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "Recently Listed" }),
      ).toBeVisible(),
    );
    const cards = canvasElement.querySelectorAll(
      '[data-slot="vault-asset-card"]',
    );
    // Most recently listed first — va-006 (25 Oct) before va-002 (20 Oct).
    expect(cards[0]?.textContent).toContain("Illustrator");
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
