import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ListingLotGallery } from "./listing-lot-gallery";

const IMAGE = new URL(
  "../store-product-listing/product-card.fixture.png",
  import.meta.url,
).href;

const { auctionListing } = getMessages("grade10", "en");

const COPY = {
  previous: auctionListing.previousImage,
  next: auctionListing.nextImage,
  images: auctionListing.auctionImages,
};

const THREE_IMAGES = [
  { src: IMAGE, alt: "Lot image 1, front" },
  { src: IMAGE, alt: "Lot image 2, back" },
  { src: IMAGE, alt: "Lot image 3, detail" },
] as const;

const meta = {
  title: "Auction Listing/ListingLotGallery",
  component: ListingLotGallery,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: COPY,
    images: THREE_IMAGES,
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListingLotGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SeveralImages: Story = {
  name: "Several images",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("1 / 3")).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Previous image" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Next image" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("navigation", { name: "Auction images" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("region", { name: "Auction images" }),
    ).toBeInTheDocument();
  },
};

export const SingleImage: Story = {
  name: "Single image",
  args: {
    images: [{ src: IMAGE, alt: "Lot image, front" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("img", { name: "Lot image, front" }),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/\d+ \/ \d+/)).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Previous image" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("navigation", { name: "Auction images" }),
    ).not.toBeInTheDocument();
  },
};
