import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { PRESS_PAGE } from "./press-content";
import { PressPage } from "./press-page";

/**
 * The `/press-releases` surface: production chrome around the Figma Press
 * frame — the PRESS eyebrow, heading and intro beside the year filter,
 * then the releases grouped by year newest first. List content matches the
 * live grade10.com record; the frame's items are placeholders.
 */
const meta = {
  title: "Site/Press/Screens/Press",
  component: PressPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PressPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const heading = canvas.getByRole("heading", {
      level: 1,
      name: PRESS_PAGE.heading,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });

    expect(canvas.getByRole("banner")).toBeVisible();
    for (const group of PRESS_PAGE.groups) {
      const yearHeading = canvas.getByRole("heading", {
        level: 2,
        name: group.year,
      });
      await waitFor(() => expect(yearHeading).toBeVisible(), {
        timeout: 1500,
      });
    }
    expect(canvas.getByRole("contentinfo")).toBeVisible();

    // Every release links to its article surface.
    const first = PRESS_PAGE.groups[0].items[0];
    const firstLink = canvasElement.querySelector(`a[href="${first.href}"]`);
    expect(firstLink).toBeInTheDocument();
    expect(firstLink).toHaveTextContent(first.title);
    const total = PRESS_PAGE.groups.flatMap((group) => group.items).length;
    expect(
      canvasElement.querySelectorAll('a[href^="/press-releases/"]'),
    ).toHaveLength(total);

    // The filter rests on All Time: every year group shows.
    expect(
      canvas.getByRole("button", { name: PRESS_PAGE.allTime }),
    ).toBeVisible();
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile2" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: PRESS_PAGE.heading,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });
    expect(canvas.getByRole("contentinfo")).toBeVisible();
  },
};
