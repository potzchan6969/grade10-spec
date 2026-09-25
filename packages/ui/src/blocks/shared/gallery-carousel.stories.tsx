import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { GalleryCarousel } from "./gallery-carousel";

const IMAGE = new URL(
  "../store-product-listing/product-card.fixture.png",
  import.meta.url,
).href;

const COPY = {
  previous: "Previous image",
  next: "Next image",
  images: "Product images",
};

const THREE_IMAGES = [
  { src: IMAGE, alt: "Image 1, front" },
  { src: IMAGE, alt: "Image 2, back" },
  { src: IMAGE, alt: "Image 3, detail" },
] as const;

const meta = {
  title: "Shared/GalleryCarousel",
  component: GalleryCarousel,
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
} satisfies Meta<typeof GalleryCarousel>;

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
      canvas.getByRole("navigation", { name: "Product images" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("region", { name: "Product images" }),
    ).toBeInTheDocument();
  },
};

export const SingleImage: Story = {
  name: "Single image",
  args: {
    images: [{ src: IMAGE, alt: "Image, front" }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("img", { name: "Image, front" }),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/\d+ \/ \d+/)).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Previous image" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("navigation", { name: "Product images" }),
    ).not.toBeInTheDocument();
  },
};
