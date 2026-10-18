import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { SHOWS_PAGE } from "./shows-content";
import { ShowsPage } from "./shows-page";

/**
 * The `/shows` surface: production chrome around the Figma Shows frame —
 * the hero with the latest-shows card, the event-scale stats, the three
 * event-format chapters with carousels and in-place YouTube presentations,
 * and the event-records timeline. Copy matches the Grade10-DS-2026 frame
 * verbatim; media hotlinks the live grade10.com assets.
 */
const meta = {
  title: "Site/Shows/Screens/Shows",
  component: ShowsPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ShowsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The heading enters with the mount reveal; once it is visible the
    // rest of the above-fold hero content is too.
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: SHOWS_PAGE.hero.heading,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });

    expect(canvas.getByRole("banner")).toBeVisible();
    expect(canvas.getByRole("contentinfo")).toBeVisible();

    // Section headings: h2 for the three top-level sections, h3 for the
    // chapters and record titles, h4 for edition card titles.
    for (const name of [
      SHOWS_PAGE.eventScale.heading,
      SHOWS_PAGE.formats.heading,
      SHOWS_PAGE.records.heading,
    ]) {
      expect(
        canvas.getByRole("heading", { level: 2, name }),
      ).toBeInTheDocument();
    }
    for (const chapter of SHOWS_PAGE.formats.chapters) {
      expect(
        canvas.getByRole("heading", { level: 3, name: chapter.title }),
      ).toBeInTheDocument();
    }
    for (const record of SHOWS_PAGE.records.items) {
      expect(
        canvas.getByRole("heading", { level: 3, name: record.title }),
      ).toBeInTheDocument();
      expect(canvas.getAllByText(record.year).length).toBeGreaterThan(0);
    }
    for (const chapter of SHOWS_PAGE.formats.chapters) {
      for (const edition of chapter.editions) {
        expect(
          canvas.getByRole("heading", { level: 4, name: edition.title }),
        ).toBeInTheDocument();
      }
    }

    // Latest-shows card rows.
    for (const show of SHOWS_PAGE.hero.latestShows) {
      expect(canvas.getAllByText(show.title).length).toBeGreaterThan(0);
      expect(canvas.getAllByText(show.city).length).toBeGreaterThan(0);
    }

    // Stat values.
    for (const stat of SHOWS_PAGE.eventScale.stats) {
      expect(canvas.getAllByText(stat.value).length).toBeGreaterThan(0);
      expect(canvas.getAllByText(stat.detail).length).toBeGreaterThan(0);
    }

    // The chapter tab list is jump navigation — three tabs, first selected.
    const tabs = canvas.getByRole("tablist", {
      name: "Event format chapters",
    });
    const triggers = within(tabs).getAllByRole("tab");
    expect(triggers).toHaveLength(3);
    expect(triggers[0]).toHaveAttribute("aria-selected", "true");
    // Each trigger is a hash anchor to its chapter — jump navigation works
    // even without the click handler.
    for (const chapter of SHOWS_PAGE.formats.chapters) {
      const trigger = triggers.find((tab) => tab.textContent === chapter.tab);
      expect(trigger).toBeTruthy();
      expect(trigger).toHaveAttribute("href", `#${chapter.id}`);
    }

    // Press-release destinations: hero link and every edition/chapter link.
    // `Button` renders anchors with role="button" (Base UI), so assert href
    // on the button role.
    const heroPress = canvas.getByRole("button", {
      name: SHOWS_PAGE.hero.press,
    });
    expect(heroPress).toHaveAttribute("href", "/press-releases");
    const pressLinks = canvas.getAllByRole("button", { name: "Press Release" });
    const expectedHrefs = [
      ...SHOWS_PAGE.formats.chapters.flatMap((chapter) => [
        ...(chapter.pressRelease ? [chapter.pressRelease] : []),
        ...chapter.editions.map((edition) => edition.pressRelease),
      ]),
    ];
    expect(pressLinks).toHaveLength(expectedHrefs.length);
    for (const href of expectedHrefs) {
      expect(
        pressLinks.some((link) => link.getAttribute("href") === href),
      ).toBe(true);
    }

    // Video containers start poster-first; clicking play swaps in the
    // YouTube embed inside the same container.
    const playButtons = canvas.getAllByRole("button", { name: /^Play / });
    expect(playButtons).toHaveLength(2);
    await userEvent.click(playButtons[0]);
    const embed = await waitFor(
      () => {
        const frame = canvasElement.querySelector("iframe");
        expect(frame).not.toBeNull();
        return frame as HTMLIFrameElement;
      },
      { timeout: 1500 },
    );
    expect(embed.src).toContain(
      `youtube.com/embed/${SHOWS_PAGE.formats.chapters[0].video?.youtubeId}`,
    );
    expect(
      canvas.queryByRole("button", {
        name: `Play ${SHOWS_PAGE.formats.chapters[0].video?.badge} video`,
      }),
    ).toBeNull();

    // Carousel: next arrow advances the image and the active dot.
    const firstEdition = SHOWS_PAGE.formats.chapters[0].editions[0];
    const next = canvas.getAllByRole("button", {
      name: `Next ${firstEdition.title} photo`,
    })[0];
    const slidesNav = canvas.getAllByRole("navigation", {
      name: `${firstEdition.title} photos`,
    })[0];
    const dots = within(slidesNav).getAllByRole("button");
    expect(dots[0]).toHaveAttribute("aria-current", "true");
    const firstPhoto = canvas.getByRole("img", {
      name: `${firstEdition.title} — 1 of ${firstEdition.photos.length}`,
    });
    expect(firstPhoto).toHaveAttribute("src", firstEdition.photos[0]);
    await userEvent.click(next);
    await waitFor(() =>
      expect(dots[1]).toHaveAttribute("aria-current", "true"),
    );
    expect(
      canvas.getByRole("img", {
        name: `${firstEdition.title} — 2 of ${firstEdition.photos.length}`,
      }),
    ).toHaveAttribute("src", firstEdition.photos[1]);
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile2" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: SHOWS_PAGE.hero.heading,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });
    expect(canvas.getByRole("contentinfo")).toBeVisible();
  },
};
