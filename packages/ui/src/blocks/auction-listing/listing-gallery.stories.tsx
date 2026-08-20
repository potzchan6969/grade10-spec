import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ListingGalleryLoading } from "./fixtures";
import { ListingGallery } from "./listing-gallery";

const IMAGE = new URL(
  "../store-product-listing/product-card.fixture.png",
  import.meta.url,
).href;

const meta = {
  title: "Auction Listing/ListingGallery",
  component: ListingGallery,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    zoomLabel: "Click to zoom",
    previousLabel: "Previous image",
    nextLabel: "Next image",
    images: [
      { src: IMAGE, alt: "1999 Charizard, PSA 10", thumbLabel: "front" },
      { src: IMAGE, alt: "1999 Charizard, PSA 10 back", thumbLabel: "back" },
    ],
  },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListingGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("img", { name: /Charizard/ })).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Previous image" }),
    ).toBeEnabled();
  },
};

export const SingleImage: Story = {
  args: {
    images: [{ src: IMAGE, alt: "1999 Charizard, PSA 10" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Previous image" }),
    ).toBeDisabled();
    expect(canvas.queryByRole("button", { name: "front" })).toBeNull();
  },
};

export const Empty: Story = {
  args: { images: [] },
};

/** Page shell before images arrive — no zoom hint or carets. */
export const Loading: Story = {
  render: () => <ListingGalleryLoading />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Click to zoom")).toBeNull();
    expect(canvas.queryByRole("button", { name: "Previous image" })).toBeNull();
  },
};
