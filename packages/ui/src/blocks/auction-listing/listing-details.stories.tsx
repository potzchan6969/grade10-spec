import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { BASE_FACTS, ListingDetailsLoading, VAULT_SECTION } from "./fixtures";
import { ListingDetails } from "./listing-details";

const meta = {
  title: "Auction Listing/ListingDetails",
  component: ListingDetails,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    heading: "Description",
    body: "Shadowless 1st Ed. Authenticated and vaulted.",
    facts: [...BASE_FACTS],
    sections: [
      VAULT_SECTION,
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

export const Loading: Story = {
  render: () => <ListingDetailsLoading />,
};

export const PostSold: Story = {
  args: {
    facts: [...BASE_FACTS, { label: "Result", value: "Sold · HK$3,100.00" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Result")).toBeInTheDocument();
    expect(canvas.getByText(/Sold · HK\$3,100/)).toBeInTheDocument();
  },
};

export const PostUnsold: Story = {
  args: {
    facts: [...BASE_FACTS, { label: "Result", value: "Unsold" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Unsold")).toBeInTheDocument();
  },
};
