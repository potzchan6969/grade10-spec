import { BreadcrumbItem } from "@grade10/design-system/components/display/breadcrumb-item";
import { BreadcrumbSeparator } from "@grade10/design-system/components/display/breadcrumb-separator";
import { Breadcrumbs } from "@grade10/design-system/components/display/breadcrumbs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollectionBanner } from "./collection-banner";

const IMAGE = new URL("./collection-banner.fixture.png", import.meta.url).href;

const GRADE10_BREADCRUMBS = (
  <Breadcrumbs>
    <BreadcrumbItem href="#home">Home</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem href="#shop">Shop</BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem current>Pokémon</BreadcrumbItem>
  </Breadcrumbs>
);

const meta = {
  title: "Store Product Listing/CollectionBanner",
  component: CollectionBanner,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    breadcrumbs: GRADE10_BREADCRUMBS,
    collection: "Pokémon",
    description:
      "Japanese Pokémon sealed product for set builders, collectors, and opening nights.",
    imageSrc: IMAGE,
    imageAlt: "",
  },
} satisfies Meta<typeof CollectionBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A collection with no pack shot — copy still has to stand on its own. */
export const WithoutImage: Story = { args: { imageSrc: undefined } };

/** The same shell with another store's content. */
export const AnotherStore: Story = {
  args: {
    breadcrumbs: (
      <Breadcrumbs>
        <BreadcrumbItem href="#home">Home</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem current>New</BreadcrumbItem>
      </Breadcrumbs>
    ),
    collection: "New arrivals",
    description: "This week's drops.",
    imageSrc: undefined,
  },
};
