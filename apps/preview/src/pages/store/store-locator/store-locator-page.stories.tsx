import { Footer } from "@grade10/design-system/components/layout/footer";
import { SiteHeader, StoreLocator } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import { STORE_LOCATOR_HREF } from "../../workbench-story-nav";
import {
  STORE_LOCATOR_COPY,
  STORE_LOCATOR_HOURS,
  STORE_LOCATOR_STORE,
} from "./store-locator-content";

/**
 * Store Locator as a store assembles it: `SiteHeader`, the shared
 * `StoreLocator` block (map, address and hours), and `Footer`. The map opens
 * Google Maps. One Hong Kong store, not a multi-store finder. Address and
 * hours match the free-pickup fixture.
 */
function StoreLocatorPage({ mapLoaded = true }: { mapLoaded?: boolean }) {
  return (
    <div className="@container flex min-h-svh w-full flex-col bg-background">
      <SiteHeader
        {...STORE_SITE_HEADER}
        navItems={STORE_SITE_HEADER.navItems.map((item) =>
          item.label === "Store Locator"
            ? { ...item, current: true }
            : { ...item, current: false },
        )}
      />
      <main className="flex w-full flex-1 justify-center px-8 py-12 @3xl:py-16">
        <StoreLocator
          addressLines={STORE_LOCATOR_STORE.addressLines}
          copy={STORE_LOCATOR_COPY}
          hours={STORE_LOCATOR_HOURS}
          mapEmbedSrc={
            mapLoaded ? STORE_LOCATOR_STORE.mapEmbedSrc : "about:blank"
          }
          mapsHref={STORE_LOCATOR_STORE.mapsHref}
          name={STORE_LOCATOR_STORE.name}
        />
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Store/Store Locator/Screens/Store Locator",
  component: StoreLocatorPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StoreLocatorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await Promise.all(
      canvasElement
        .getAnimations({ subtree: true })
        .filter(
          (animation) =>
            animation instanceof CSSAnimation &&
            animation.animationName === "enter",
        )
        .map((animation) => animation.finished.catch(() => undefined)),
    );
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: STORE_LOCATOR_COPY.heading,
      }),
    ).toBeVisible();
    expect(canvas.getByText(STORE_LOCATOR_STORE.name)).toBeVisible();
    expect(canvas.getByText(STORE_LOCATOR_STORE.addressLines[0])).toBeVisible();
    expect(
      canvas.getByRole("link", { name: STORE_LOCATOR_COPY.openMap }),
    ).toHaveAttribute("href", STORE_LOCATOR_STORE.mapsHref);
    const footer = canvasElement.querySelector<HTMLElement>(
      '[data-slot="footer"]',
    );
    expect(footer).not.toBeNull();
    if (footer === null) return;
    expect(
      within(footer).getByRole("link", { name: "Store Locator" }),
    ).toHaveAttribute("href", STORE_LOCATOR_HREF);
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};

/** The map has not loaded: its place still opens Google Maps and the box keeps its size, with no message. */
export const MapNotLoaded: Story = {
  args: { mapLoaded: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvasElement.querySelector("iframe")).toHaveAttribute(
      "src",
      "about:blank",
    );
    expect(
      canvas.getByRole("link", { name: STORE_LOCATOR_COPY.openMap }),
    ).toHaveAttribute("href", STORE_LOCATOR_STORE.mapsHref);
    expect(
      canvasElement.querySelector('[data-slot="store-locator-map"]'),
    ).not.toBeNull();
  },
};
