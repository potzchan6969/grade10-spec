import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { PRESS_ARTICLE } from "./press-article-content";
import { PressArticlePage } from "./press-article-page";

/**
 * The `/press-releases/{slug}` surface: production chrome around the Figma
 * Press Release Article frame — the Press breadcrumb, the release's title
 * with its date and location badges, the feature image, the body an editor
 * composes, and the fixed sidebar cards. The sample carries the live
 * CARDJOY x Grade10 Guangzhou release verbatim.
 */
const meta = {
  title: "Site/Press/Screens/Press Release",
  component: PressArticlePage,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    journeys: [
      "grade10-site-site-press-US-04",
      "grade10-site-site-press-US-05",
    ],
  },
} satisfies Meta<typeof PressArticlePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const heading = canvas.getByRole("heading", {
      level: 1,
      name: PRESS_ARTICLE.title,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });

    expect(canvas.getByRole("banner")).toBeVisible();

    // The Press crumb links back to the record; the current crumb does not.
    const backLink = canvas.getByRole("link", {
      name: PRESS_ARTICLE.breadcrumb.back.label,
    });
    expect(backLink).toHaveAttribute(
      "href",
      PRESS_ARTICLE.breadcrumb.back.href,
    );
    expect(canvas.getByText(PRESS_ARTICLE.breadcrumb.current)).toHaveAttribute(
      "aria-current",
      "page",
    );

    // The release's publish date and location badges.
    expect(canvas.getByText(PRESS_ARTICLE.date)).toBeVisible();
    expect(canvas.getByText(PRESS_ARTICLE.location)).toBeVisible();

    // The feature image doubles as the article's OG image.
    await waitFor(
      () =>
        expect(
          canvas.getByRole("img", { name: PRESS_ARTICLE.featureImage.alt }),
        ).toBeVisible(),
      { timeout: 1500 },
    );

    // The body's section headings and quotes.
    await waitFor(
      () => {
        for (const block of PRESS_ARTICLE.body) {
          if (block.type === "heading") {
            expect(
              canvas.getByRole("heading", {
                level: block.level,
                name: block.text,
              }),
            ).toBeVisible();
          }
        }
      },
      { timeout: 1500 },
    );
    expect(canvas.getAllByRole("blockquote")).toHaveLength(2);
    expect(canvas.getByText("Hanru Tang")).toBeVisible();

    // The fixed sidebar cards every article shares.
    await waitFor(
      () => expect(canvas.getByRole("complementary")).toBeVisible(),
      { timeout: 1500 },
    );
    for (const card of PRESS_ARTICLE.sidebar.cards) {
      expect(
        canvas.getByRole("heading", { level: 2, name: card.title }),
      ).toBeVisible();
    }
    expect(
      canvas.getByRole("link", {
        name: "media@memestrategy.com",
      }),
    ).toHaveAttribute("href", "mailto:media@memestrategy.com");

    // The role query maps every `<footer>` to contentinfo — including the
    // quotes' scoped attribution footers — so the page footer is found by
    // its slot instead.
    expect(canvasElement.querySelector('[data-slot="footer"]')).toBeVisible();
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile2" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: PRESS_ARTICLE.title,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });
    // The sidebar lands after the article on a narrow viewport.
    await waitFor(
      () => expect(canvas.getByRole("complementary")).toBeVisible(),
      { timeout: 1500 },
    );
    const articleEl = canvas.getByRole("article");
    const asideEl = canvas.getByRole("complementary");
    expect(
      articleEl.compareDocumentPosition(asideEl) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(canvasElement.querySelector('[data-slot="footer"]')).toBeVisible();
  },
};
