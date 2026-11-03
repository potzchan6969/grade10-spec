import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StoreCollectionTile } from "./store-collection-tile";

const meta = {
  title: "Store/Home/Blocks/StoreCollectionTile",
  component: StoreCollectionTile,
  tags: ["autodocs"],
  args: {
    label: "Pokémon",
    icon: "🐭",
    href: "#pokemon",
  },
  decorators: [
    (Story) => (
      <div className="grid w-[540px] grid-cols-5 gap-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StoreCollectionTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  parameters: {
    verification: { caseId: "vc_886d70d9-d541-4750-8889-2dd481dba611" },
  },
};

export const Featured: Story = {
  parameters: {
    verification: { caseId: "vc_2d53ffce-b909-4b17-a92c-79364c44f7d4" },
  },
  args: { featured: true },
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector(
      '[data-slot="store-collection-tile"]',
    );
    expect(tile).toHaveAttribute("data-featured");
  },
};

export const Activatable: Story = {
  parameters: {
    verification: { caseId: "vc_5d68ee08-116c-4fa9-9f5d-29105ccb789a" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: /Pokémon/ })).toHaveAttribute(
      "href",
      "#pokemon",
    );
  },
};
