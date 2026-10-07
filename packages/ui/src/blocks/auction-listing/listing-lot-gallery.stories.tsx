import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
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
  name: "Several images - wide",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumbnails = canvas.getAllByRole("button", {
      name: /^Thumbnail:/,
    });
    const stage = canvas.getByRole("region", { name: "Auction images" });

    expect(thumbnails).toHaveLength(3);
    expect(thumbnails[0].getBoundingClientRect().left).toBeLessThan(
      stage.getBoundingClientRect().left,
    );
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

    await userEvent.click(
      canvas.getByRole("button", { name: "Thumbnail: Lot image 2, back" }),
    );
    expect(canvas.getByText("2 / 3")).toBeInTheDocument();
    expect(
      canvas.getByRole("img", { name: "Lot image 2, back" }),
    ).toBeInTheDocument();

    const gallery = canvasElement.querySelector<HTMLElement>(
      '[data-slot="listing-lot-gallery"]',
    );
    if (!gallery) throw new Error("ListingLotGallery root was not rendered");

    gallery.style.width = "20rem";
    await waitFor(() =>
      expect(
        canvas.queryByRole("button", { name: /^Thumbnail:/ }),
      ).not.toBeInTheDocument(),
    );
    expect(canvas.getByText("2 / 3")).toBeInTheDocument();
    expect(
      canvas.getByRole("img", { name: "Lot image 2, back" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Previous image" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Next image" }),
    ).toBeInTheDocument();

    gallery.style.width = "36rem";
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "Thumbnail: Lot image 2, back" }),
      ).toHaveAttribute("aria-current", "true"),
    );
    expect(canvas.getByText("2 / 3")).toBeInTheDocument();
    expect(
      canvas.getByRole("img", { name: "Lot image 2, back" }),
    ).toBeInTheDocument();
  },
};

export const StackedSeveralImages: Story = {
  name: "Several images - stacked",
  decorators: [
    (Story) => (
      <div className="w-80 max-w-full">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.queryByRole("button", { name: /^Thumbnail:/ }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("navigation", { name: "Auction images" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("1 / 3")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Next image" }),
    ).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", {
        name: "Show image 2: Lot image 2, back",
      }),
    );
    expect(canvas.getByText("2 / 3")).toBeInTheDocument();
    expect(
      canvas.getByRole("img", { name: "Lot image 2, back" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Previous image" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Next image" }),
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
      canvas.queryByRole("button", { name: "Next image" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /^Thumbnail:/ }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("navigation", { name: "Auction images" }),
    ).not.toBeInTheDocument();
  },
};

export const EmptyGallery: Story = {
  name: "Empty gallery",
  args: { images: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.queryAllByRole("img")).toHaveLength(0);
    expect(
      canvas.queryByRole("button", { name: "Previous image" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Next image" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /^Thumbnail:/ }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("navigation", { name: "Auction images" }),
    ).not.toBeInTheDocument();
  },
};
