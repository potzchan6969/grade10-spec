import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ListingDetails } from "./listing-details";

const meta = {
  title: "Auction Listing/ListingDetails",
  component: ListingDetails,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    heading: "Description",
    body: "Shadowless 1st Ed. Authenticated and vaulted.",
    facts: [
      { label: "Lot", value: "12" },
      { label: "Sale", value: "September Slabs" },
      { label: "Category", value: "Pokémon" },
    ],
    sections: [
      {
        heading: "Vault shipping",
        body: "Stored in Grade10 Vault — ships from our facility within 1 business day of payment.",
      },
      {
        heading: "Authentication",
        body: "Authenticated by Grade10 Marketplace",
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[720px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListingDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Description" }),
    ).toBeInTheDocument();
    expect(canvas.getByText(/Shadowless/)).toBeInTheDocument();
    expect(canvas.getByText("Lot")).toBeInTheDocument();
    expect(canvas.getByText("12")).toBeInTheDocument();
  },
};

export const BodyOnly: Story = {
  args: { facts: undefined, sections: undefined },
};
