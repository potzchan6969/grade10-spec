import { Footer } from "@grade10/design-system/components/layout/footer";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import {
  STORE_LOCATOR_COPY,
  STORE_LOCATOR_HOURS,
  STORE_LOCATOR_STORE,
} from "./store-locator-content";

const meta = {
  title: "Store/Store Locator/Flows/Store Locator",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The map box: the whole box opens Google Maps, and the embed is drawn only once it has loaded. */
function MapBox({ loaded }: { loaded: boolean }) {
  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted"
      data-slot="store-locator-map"
    >
      {loaded && (
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
      )}
      <a
        className="absolute inset-0"
        href={STORE_LOCATOR_STORE.mapsHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="sr-only">{STORE_LOCATOR_COPY.openMap}</span>
      </a>
    </div>
  );
}

/** Location and hours: the one store's name, address and a row for each day. */
function LocationDetails() {
  return (
    <VStack className="w-full" gap="lg" hAlign="stretch">
      <h1 className="text-3xl font-bold text-foreground">
        {STORE_LOCATOR_COPY.title}
      </h1>
      <VStack className="w-full" gap="sm" hAlign="stretch">
        <p className="text-base font-medium text-foreground">
          {STORE_LOCATOR_STORE.name}
        </p>
        {STORE_LOCATOR_STORE.addressLines.map((line) => (
          <p className="text-sm leading-5 text-foreground" key={String(line)}>
            {line}
          </p>
        ))}
      </VStack>
      <VStack className="w-full" gap="sm" hAlign="stretch">
        <h2 className="text-sm font-medium text-secondary-foreground">
          {STORE_LOCATOR_COPY.hoursHeading}
        </h2>
        <VStack className="w-full max-w-xs" gap="xs" hAlign="stretch">
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
  );
}

const FIND_CASES: [string, "header" | "footer"][] = [
  ["Store Locator marked in the header", "header"],
  ["Store Locator leads the footer's Help", "footer"],
];

const MAP_CASES: [string, "details" | "map" | "map-not-loaded"][] = [
  ["Location and hours", "details"],
  ["Map opens Google Maps", "map"],
  ["Map not loaded yet", "map-not-loaded"],
];

const LOCATOR_NAV_ITEMS = STORE_SITE_HEADER.navItems.map((item) => ({
  ...item,
  current: item.label === "Store Locator",
}));

/** A collector finds the Hong Kong shop from the chrome: the header marks it and the footer leads with it. */
export const FindTheHongKongShop: Story = {
  parameters: {
    journeys: ["grade10-site-store-store-locator-US-01"],
  },
  render: () => (
    <FlowContainer
      cases={FIND_CASES}
      description={
        <p>
          The header marks Store Locator as the page being viewed, and the
          footer&rsquo;s Help column leads with it. One Hong Kong store is
          listed, not a finder.
        </p>
      }
    >
      {(step) =>
        step === "header" ? (
          <SiteHeader
            {...STORE_SITE_HEADER}
            navItems={LOCATOR_NAV_ITEMS}
            promo={null}
          />
        ) : (
          <Footer {...STORE_FOOTER} />
        )
      }
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas
        .getAllByRole("link", { name: "Store Locator" })
        .some((link) => link.getAttribute("aria-current") === "page"),
    ).toBe(true);
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(
      canvas.getAllByRole("link", { name: "Store Locator" })[0],
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      FIND_CASES.length,
    );
  },
};

/** A collector opens Google Maps from the page, and the place still opens while the map is not loaded. */
export const OpenGoogleMaps: Story = {
  parameters: {
    journeys: ["grade10-site-store-store-locator-US-02"],
  },
  render: () => (
    <FlowContainer
      cases={MAP_CASES}
      description={
        <p>
          The whole map is one link to Google Maps, opening in a new tab. The
          embedded map takes no focus. While the map has not loaded its box
          keeps its size and the place still opens Google Maps, with no message.
        </p>
      }
    >
      {(step) =>
        step === "details" ? (
          <LocationDetails />
        ) : (
          <MapBox loaded={step === "map"} />
        )
      }
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: STORE_LOCATOR_COPY.title,
      }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(
      canvas.getByRole("link", { name: STORE_LOCATOR_COPY.openMap }),
    ).toHaveAttribute("href", STORE_LOCATOR_STORE.mapsHref);
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvasElement.querySelector("iframe")).toBeNull();
    expect(
      canvas.getByRole("link", { name: STORE_LOCATOR_COPY.openMap }),
    ).toHaveAttribute("href", STORE_LOCATOR_STORE.mapsHref);
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      MAP_CASES.length,
    );
  },
};
