import { MediaCoverageGrid } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  MEDIA_COVERAGE_COPY,
  MEDIA_COVERAGE_PAGE,
} from "./media-coverage-content";
import { MediaCoveragePage } from "./media-coverage-page";

/**
 * The `/media-coverage` surface: production chrome around the Figma
 * Media Coverage frame — the IN THE NEWS eyebrow, heading and intro over
 * the coverage as a grid of media cards, each the external link to its
 * story. Card content matches the live grade10.com record; the frame's
 * items are placeholders.
 */
const meta = {
  title: "Site/Media Coverage/Screens/Media Coverage",
  component: MediaCoveragePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof MediaCoveragePage>;

export default meta;
type Story = StoryObj<typeof meta>;

const columnCount = (list: Element) =>
  getComputedStyle(list).gridTemplateColumns.split(" ").length;

const cardLinks = (canvasElement: HTMLElement) => [
  ...canvasElement.querySelectorAll<HTMLAnchorElement>("main li > a"),
];

/** Each card names its story's publication and title, in the content module's order. */
function expectCardsInPublishedOrder(canvasElement: HTMLElement) {
  const links = cardLinks(canvasElement);
  expect(links).toHaveLength(MEDIA_COVERAGE_PAGE.items.length);
  MEDIA_COVERAGE_PAGE.items.forEach((item, index) => {
    const link = links[index];
    expect(link).toHaveTextContent(item.publication);
    expect(link).toHaveTextContent(item.title);
    expect(link).toHaveAttribute("href", item.href);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(item.href).toMatch(/^https:\/\//);
    expect(link).toHaveTextContent(MEDIA_COVERAGE_COPY.readArticle);
  });
}

async function expectHeading(canvasElement: HTMLElement) {
  const heading = within(canvasElement).getByRole("heading", {
    level: 1,
    name: MEDIA_COVERAGE_PAGE.heading,
  });
  await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });
}

/**
 * Proves g10.site-media-coverage.SC-zem (heading block, then each card's
 * publication and title), SC-20b (four across), SC-ozy (each card one
 * external link, new tab) and SC-h4k (cards in the content module's order).
 */
export const Default: Story = {
  globals: { viewport: { value: "desktop" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expectHeading(canvasElement);
    expect(canvas.getByText(MEDIA_COVERAGE_PAGE.eyebrow)).toBeVisible();
    expect(canvas.getByText(MEDIA_COVERAGE_PAGE.intro)).toBeVisible();
    expect(canvas.getByRole("banner")).toBeVisible();
    expect(canvas.getByRole("contentinfo")).toBeVisible();

    expectCardsInPublishedOrder(canvasElement);

    // SC-20b: four across on a wide viewport.
    const list = canvasElement.querySelector("main ul");
    if (!list) throw new Error("media coverage grid not rendered");
    expect(columnCount(list)).toBe(4);
  },
};

/** Proves g10.site-media-coverage.SC-npo: one column, the same cards. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile2" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expectHeading(canvasElement);
    expect(canvas.getByRole("contentinfo")).toBeVisible();

    expectCardsInPublishedOrder(canvasElement);

    const list = canvasElement.querySelector("main ul");
    if (!list) throw new Error("media coverage grid not rendered");
    expect(columnCount(list)).toBe(1);
  },
};

/** Proves g10.site-media-coverage.SC-w2d: a story with a language marks it on its link. */
export const AnotherLanguage: Story = {
  render: () => (
    <main>
      <MediaCoverageGrid
        content={{
          ...MEDIA_COVERAGE_PAGE,
          items: [
            { ...MEDIA_COVERAGE_PAGE.items[0] },
            { ...MEDIA_COVERAGE_PAGE.items[6], lang: "zh-Hant" },
          ],
        }}
        copy={MEDIA_COVERAGE_COPY}
      />
    </main>
  ),
  play: async ({ canvasElement }) => {
    await expectHeading(canvasElement);
    const [plain, marked] = cardLinks(canvasElement);
    expect(marked).toHaveAttribute("lang", "zh-Hant");
    expect(marked).toHaveAttribute("hreflang", "zh-Hant");
    expect(plain).not.toHaveAttribute("lang");
  },
};
