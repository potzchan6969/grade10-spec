import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ListingGalleryLoading } from "./fixtures";
import { ListingGallery } from "./listing-gallery";

const IMAGE = new URL(
  "../store-product-listing/product-card.fixture.png",
  import.meta.url,
).href;

const THUMB = `${IMAGE}#thumb`;
const DETAIL = `${IMAGE}#detail`;
const ZOOM = `${IMAGE}#zoom`;

const meta = {
  title: "Auction Listing/ListingGallery",
  component: ListingGallery,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      zoom: "Click to zoom",
      previous: "Previous image",
      next: "Next image",
    },
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
    expect(canvas.getByRole("button", { name: "front" })).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "back" })).toBeInTheDocument();
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("img")).toBeNull();
    expect(
      canvas.getByRole("button", { name: "Previous image" }),
    ).toBeDisabled();
    expect(canvas.getByRole("button", { name: "Next image" })).toBeDisabled();
  },
};

/** Scenario: Distinct sources are used in each slot. */
export const DistinctSources: Story = {
  args: {
    images: [
      {
        src: `${IMAGE}?slot=detail`,
        thumbSrc: `${IMAGE}?slot=thumb`,
        zoomSrc: `${IMAGE}?slot=zoom`,
        alt: "1999 Charizard, PSA 10",
        thumbLabel: "front",
      },
      {
        src: `${IMAGE}?slot=detail-back`,
        thumbSrc: `${IMAGE}?slot=thumb-back`,
        zoomSrc: `${IMAGE}?slot=zoom-back`,
        alt: "1999 Charizard, PSA 10 back",
        thumbLabel: "back",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const main = canvas.getByRole("img", { name: /Charizard, PSA 10$/ });
    expect(main).toHaveAttribute("src", `${IMAGE}?slot=detail`);
    const thumb = canvas
      .getByRole("button", { name: "front" })
      .querySelector("img");
    expect(thumb).toHaveAttribute("src", `${IMAGE}?slot=thumb`);
    await userEvent.click(main);
    const dialog = within(canvasElement.ownerDocument.body);
    const zoom = dialog.getByRole("dialog").querySelector("img");
    expect(zoom).toHaveAttribute("src", `${IMAGE}?slot=zoom`);
  },
};

/** Scenario: Omitted sources fall back to src. */
export const FallbackToSrc: Story = {
  args: {
    images: [
      {
        src: `${IMAGE}?slot=only`,
        alt: "1999 Charizard, PSA 10",
        thumbLabel: "front",
      },
      { src: `${IMAGE}?slot=only-back`, alt: "back", thumbLabel: "back" },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const main = canvas.getByRole("img", { name: /Charizard/ });
    expect(main).toHaveAttribute("src", `${IMAGE}?slot=only`);
    const thumb = canvas
      .getByRole("button", { name: "front" })
      .querySelector("img");
    expect(thumb).toHaveAttribute("src", `${IMAGE}?slot=only`);
    await userEvent.click(main);
    const dialog = within(canvasElement.ownerDocument.body);
    const zoom = dialog.getByRole("dialog").querySelector("img");
    expect(zoom).toHaveAttribute("src", `${IMAGE}?slot=only`);
  },
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

export const DistinctSources: Story = {
  args: {
    images: [
      {
        src: DETAIL,
        thumbSrc: THUMB,
        zoomSrc: ZOOM,
        alt: "1999 Charizard, PSA 10",
        thumbLabel: "front",
      },
      {
        src: DETAIL,
        thumbSrc: THUMB,
        zoomSrc: ZOOM,
        alt: "1999 Charizard, PSA 10 back",
        thumbLabel: "back",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const root = within(canvasElement);
    const main = root.getByRole("img", { name: /Charizard, PSA 10$/ });
    expect(main).toHaveAttribute("src", DETAIL);

    const frontThumb = root.getByRole("button", { name: "front" });
    expect(frontThumb.querySelector("img")).toHaveAttribute("src", THUMB);

    await userEvent.click(main);
    const dialog = within(document.body);
    const zoom = await dialog.findByRole("img", { name: /Charizard, PSA 10$/ });
    expect(zoom).toHaveAttribute("src", ZOOM);
  },
};

export const OmittedSourcesFallBack: Story = {
  args: {
    images: [
      { src: DETAIL, alt: "1999 Charizard, PSA 10", thumbLabel: "front" },
      { src: DETAIL, alt: "1999 Charizard, PSA 10 back", thumbLabel: "back" },
    ],
  },
  play: async ({ canvasElement }) => {
    const root = within(canvasElement);
    const main = root.getByRole("img", { name: /Charizard, PSA 10$/ });
    expect(main).toHaveAttribute("src", DETAIL);

    const frontThumb = root.getByRole("button", { name: "front" });
    expect(frontThumb.querySelector("img")).toHaveAttribute("src", DETAIL);

    await userEvent.click(main);
    const dialog = within(document.body);
    const zoom = await dialog.findByRole("img", { name: /Charizard, PSA 10$/ });
    expect(zoom).toHaveAttribute("src", DETAIL);
  },
};
