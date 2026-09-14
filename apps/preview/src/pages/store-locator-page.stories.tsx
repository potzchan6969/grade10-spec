import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "./store-content";
import {
  STORE_LOCATOR_COPY,
  STORE_LOCATOR_HOURS,
  STORE_LOCATOR_STORE,
} from "./store-locator-content";

/**
 * Store Locator as a store assembles it: `SiteHeader`, Location & Hours
 * (map + address + hours + directions), and `Footer`. One Hong Kong store —
 * not a multi-store finder. Address and hours match the free-pickup fixture.
 */
function StoreLocatorPage() {
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
        <div
          className="grid w-full max-w-5xl grid-cols-1 gap-10 @3xl:grid-cols-2 @3xl:gap-12"
          data-slot="store-locator"
        >
          <div
            className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted"
            data-slot="store-locator-map"
          >
            <iframe
              allowFullScreen
              aria-hidden
              className="pointer-events-none size-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={STORE_LOCATOR_STORE.mapEmbedSrc}
              tabIndex={-1}
              title={STORE_LOCATOR_COPY.mapTitle}
            />
            <a
              aria-label={STORE_LOCATOR_COPY.openMap}
              className="absolute inset-0"
              href={STORE_LOCATOR_STORE.mapsHref}
              rel="noopener noreferrer"
              target="_blank"
            />
          </div>

          <VStack className="w-full" gap="lg" hAlign="stretch">
            <h1 className="text-3xl font-bold text-foreground @3xl:text-4xl">
              {STORE_LOCATOR_COPY.title}
            </h1>

            <VStack className="w-full" gap="sm" hAlign="stretch">
              <p className="text-base font-medium text-foreground">
                {STORE_LOCATOR_STORE.name}
              </p>
              {STORE_LOCATOR_STORE.addressLines.map((line) => (
                <p
                  className="text-sm leading-5 text-foreground"
                  key={String(line)}
                >
                  {line}
                </p>
              ))}
              {STORE_LOCATOR_STORE.openingHours != null ? (
                <p className="text-sm leading-5 text-secondary-foreground">
                  {STORE_LOCATOR_STORE.openingHours}
                </p>
              ) : null}
              <div className="pt-1">
                <Button
                  render={
                    <a
                      href={STORE_LOCATOR_STORE.mapsHref}
                      rel="noopener noreferrer"
                      target="_blank"
                    />
                  }
                  variant="secondary"
                >
                  {STORE_LOCATOR_COPY.getDirections}
                </Button>
              </div>
            </VStack>

            <VStack className="w-full" gap="sm" hAlign="stretch">
              <h2 className="text-sm font-medium text-secondary-foreground">
                {STORE_LOCATOR_COPY.hoursHeading}
              </h2>
              <VStack
                className="w-full max-w-xs"
                data-slot="store-locator-hours"
                gap="xs"
                hAlign="stretch"
              >
                {STORE_LOCATOR_HOURS.map((row) => (
                  <div
                    className="grid grid-cols-[minmax(0,1fr)_auto] gap-6 text-sm leading-5 text-foreground"
                    key={row.day}
                  >
                    <span>{row.day}</span>
                    <span className="tabular-nums">{row.hours}</span>
                  </div>
                ))}
              </VStack>
            </VStack>
          </VStack>
        </div>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Pages/Store Locator Page",
  component: StoreLocatorPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StoreLocatorPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: STORE_LOCATOR_COPY.title,
      }),
    ).toBeInTheDocument();
    expect(canvas.getByText(STORE_LOCATOR_STORE.name)).toBeInTheDocument();
    expect(
      canvas.getByText(STORE_LOCATOR_STORE.addressLines[0]),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: STORE_LOCATOR_COPY.getDirections }),
    ).toHaveAttribute("href", STORE_LOCATOR_STORE.mapsHref);
    expect(
      canvas.getByRole("link", { name: STORE_LOCATOR_COPY.openMap }),
    ).toHaveAttribute("href", STORE_LOCATOR_STORE.mapsHref);
    expect(
      canvas.getAllByRole("link", { name: "Store Locator" }).length,
    ).toBeGreaterThan(0);
    expect(
      canvas.getByRole("link", { name: "STORE LOCATOR" }),
    ).toHaveAttribute(
      "href",
      "?path=/story/pages-store-locator-page--default",
    );
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};
