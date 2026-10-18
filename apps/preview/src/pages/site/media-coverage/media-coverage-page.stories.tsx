import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { MEDIA_COVERAGE_PAGE } from "./media-coverage-content";
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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const heading = canvas.getByRole("heading", {
      level: 1,
      name: MEDIA_COVERAGE_PAGE.heading,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });

    expect(canvas.getByRole("banner")).toBeVisible();
    expect(canvas.getByRole("contentinfo")).toBeVisible();

    // Every card links out to its story on the publisher's site.
    const first = MEDIA_COVERAGE_PAGE.items[0];
    const firstLink = canvasElement.querySelector(`a[href="${first.href}"]`);
    expect(firstLink).toBeInTheDocument();
    expect(firstLink).toHaveTextContent(first.title);
    expect(firstLink).toHaveTextContent(first.publication);
    const links = canvasElement.querySelectorAll("main li > a");
    expect(links).toHaveLength(MEDIA_COVERAGE_PAGE.items.length);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
    }
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile2" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: MEDIA_COVERAGE_PAGE.heading,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });
    expect(canvas.getByRole("contentinfo")).toBeVisible();
  },
};
