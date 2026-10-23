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
  zoom: auctionListing.clickToZoom,
  zoomInstructions: auctionListing.zoomInstructions,
  previous: auctionListing.previousImage,
  next: auctionListing.nextImage,
  images: auctionListing.auctionImages,
};

const source = (kind: string, image: string) => `${IMAGE}?${kind}=${image}`;

const THREE_IMAGES = [
  {
    src: source("detail", "front"),
    thumbSrc: source("thumb", "front"),
    zoomSrc: source("zoom", "front"),
    alt: "Lot image 1, front",
  },
  {
    src: source("detail", "back"),
    thumbSrc: source("thumb", "back"),
    zoomSrc: source("zoom", "back"),
    alt: "Lot image 2, back",
  },
  {
    src: source("detail", "detail"),
    thumbSrc: source("thumb", "detail"),
    zoomSrc: source("zoom", "detail"),
    alt: "Lot image 3, detail",
  },
] as const;

const meta = {
  title: "Auction/Display/Blocks/ListingLotGallery",
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
  parameters: {
    verification: { caseId: "vc_fa13364b-7dd7-4314-9f6b-413e9114a546" },
  },
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
    expect(
      canvas.getByRole("img", { name: "Lot image 1, front" }),
    ).toHaveAttribute("src", THREE_IMAGES[0].src);
    expect(thumbnails[0].querySelector("img")).toHaveAttribute(
      "src",
      THREE_IMAGES[0].thumbSrc,
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
    ).toHaveAttribute("src", THREE_IMAGES[1].src);

    // Hovering the frame raises the lens, and the magnified copy reads the
    // image's zoom source.
    const lens = canvas.getByRole("group", { name: /^Hover to magnify/ });
    await userEvent.pointer({ target: lens });
    await waitFor(() =>
      expect(
        canvasElement.querySelector<HTMLImageElement>(
          `[data-slot="lens-magnifier"] img[src="${THREE_IMAGES[1].zoomSrc}"]`,
        ),
      ).toBeInTheDocument(),
    );
    await userEvent.unhover(lens);
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="lens-magnifier"]'),
      ).not.toBeInTheDocument(),
    );
    expect(canvas.getByText("2 / 3")).toBeInTheDocument();
    expect(
      canvas.getByRole("img", { name: "Lot image 2, back" }),
    ).toHaveAttribute("src", THREE_IMAGES[1].src);

    const stageRegion = canvas.getByRole("region", { name: "Auction images" });
    stageRegion.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(canvas.getByText("3 / 3")).toBeInTheDocument();
    expect(
      canvas.getByRole("img", { name: "Lot image 3, detail" }),
    ).toHaveAttribute("src", THREE_IMAGES[2].src);

    // Focused, the lens answers arrow keys itself — they move the magnifier
    // and do not step the carousel.
    const activeLens = canvas.getByRole("group", {
      name: /^Hover to magnify/,
    });
    activeLens.focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(
        canvasElement.querySelector<HTMLImageElement>(
          `[data-slot="lens-magnifier"] img[src="${THREE_IMAGES[2].zoomSrc}"]`,
        ),
      ).toBeInTheDocument(),
    );
    expect(canvas.getByText("3 / 3")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        canvasElement.querySelector('[data-slot="lens-magnifier"]'),
      ).not.toBeInTheDocument(),
    );

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
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll('img[src*="?thumb="]'),
      ).toHaveLength(0),
    );
    expect(canvas.getByText("3 / 3")).toBeInTheDocument();
    expect(
      canvas.getByRole("img", { name: "Lot image 3, detail" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Previous image" }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Next image" }),
    ).not.toBeInTheDocument();

    gallery.style.width = "36rem";
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "Thumbnail: Lot image 3, detail" }),
      ).toHaveAttribute("aria-current", "true"),
    );
    await waitFor(() =>
      expect(
        canvasElement.querySelector(`img[src="${THREE_IMAGES[2].thumbSrc}"]`),
      ).toBeInTheDocument(),
    );
    expect(canvas.getByText("3 / 3")).toBeInTheDocument();
    expect(
      canvas.getByRole("img", { name: "Lot image 3, detail" }),
    ).toBeInTheDocument();
  },
};

export const StackedSeveralImages: Story = {
  parameters: {
    verification: { caseId: "vc_8c0187f3-0f7b-44c5-aeae-315a73720aa1" },
  },
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
    expect(canvasElement.querySelectorAll('img[src*="?thumb="]')).toHaveLength(
      0,
    );

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
  parameters: {
    verification: { caseId: "vc_a0807017-edc0-4801-b711-01d5bc1e3195" },
  },
  name: "Single image",
  args: {
    images: [{ src: source("detail", "single"), alt: "Lot image, front" }],
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
    // No zoom source was given — the magnified copy falls back to the main
    // source.
    const lens = canvas.getByRole("group", { name: /^Hover to magnify/ });
    await userEvent.pointer({ target: lens });
    await waitFor(() =>
      expect(
        canvasElement.querySelector<HTMLImageElement>(
          `[data-slot="lens-magnifier"] img[src="${source("detail", "single")}"]`,
        ),
      ).toBeInTheDocument(),
    );
  },
};

export const EmptyGallery: Story = {
  parameters: {
    verification: { caseId: "vc_f386087f-3814-4eb6-b659-834a1fd2acc3" },
  },
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
    expect(canvas.queryByRole("group")).not.toBeInTheDocument();
  },
};
