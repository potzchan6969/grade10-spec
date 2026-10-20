import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ABOUT_PAGE } from "./about-content";
import { AboutPage } from "./about-page";

/**
 * The `/about` surface: production chrome around the Figma About frame —
 * the brand heading and intro, the two-column statements, and the parent
 * company panel with its milestone timeline. Copy matches the Grade10-DS-2026
 * frames verbatim.
 */
const meta = {
  title: "Site/About/Screens/About",
  component: AboutPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AboutPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The heading is the last of the mount-revealed blocks to finish
    // entering; once it is visible the rest of the above-fold content is too.
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: ABOUT_PAGE.heading,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });

    expect(canvas.getByRole("banner")).toBeVisible();
    for (const name of [
      ABOUT_PAGE.whatWeDo.heading,
      ABOUT_PAGE.whereWeAreGoing.heading,
    ]) {
      const sectionHeading = canvas.getByRole("heading", {
        level: 2,
        name,
      });
      await waitFor(() => expect(sectionHeading).toBeVisible(), {
        timeout: 1500,
      });
    }
    // The parent-company panel enters last in the staggered reveal.
    const panelHeading = canvas.getByRole("heading", {
      level: 2,
      name: ABOUT_PAGE.parentCompany.label,
    });
    await waitFor(() => expect(panelHeading).toBeVisible(), {
      timeout: 1500,
    });
    expect(canvas.getByRole("contentinfo")).toBeVisible();

    const memeStrategy = canvas.getAllByRole("link", {
      name: "MemeStrategy",
    })[0];
    expect(memeStrategy).toHaveAttribute(
      "href",
      "https://memestrategy.com.hk/",
    );
    expect(memeStrategy).toHaveAttribute("target", "_blank");
    expect(memeStrategy).toHaveAttribute("rel", "noopener noreferrer");

    const nineGag = canvas.getAllByRole("link", { name: "9GAG" })[0];
    expect(nineGag).toHaveAttribute("href", "https://9gag.com/");
    expect(nineGag).toHaveAttribute("target", "_blank");
    expect(nineGag).toHaveAttribute("rel", "noopener noreferrer");

    const grade10Ai = canvas.getByRole("link", { name: "Grade10 AI" });
    expect(grade10Ai).toHaveAttribute("href", "https://app.grade10.com/");
    expect(grade10Ai).toHaveAttribute("target", "_blank");
    expect(grade10Ai).toHaveAttribute("rel", "noopener noreferrer");

    const indexesHeading = canvas.getByRole("heading", {
      level: 2,
      name: ABOUT_PAGE.marketIndexes.heading,
    });
    expect(indexesHeading).toBeVisible();
    const indexesSection = indexesHeading.closest("section");
    expect(indexesSection).not.toBeNull();
    const tablist = within(indexesSection as HTMLElement).getByRole("tablist");
    // Only the active tab's panel is in the accessibility tree, so each tab
    // is selected before its link is checked.
    for (const index of ABOUT_PAGE.marketIndexes.indexes) {
      await userEvent.click(
        within(tablist).getByRole("tab", { name: new RegExp(index.name) }),
      );
      const link = within(indexesSection as HTMLElement).getByRole("link", {
        name: `Visit the ${index.name}`,
      });
      expect(link).toHaveAttribute("href", index.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      // The selected preview crossfades in over 250ms; wait for it to settle.
      await waitFor(() =>
        expect(
          within(indexesSection as HTMLElement).getByText(index.description),
        ).toBeVisible(),
      );
    }
    // Leave the showcase on its resting state.
    await userEvent.click(
      within(tablist).getByRole("tab", {
        name: new RegExp(ABOUT_PAGE.marketIndexes.indexes[0].name),
      }),
    );

    // Neither surface is launched on day 1: both mentions stay plain text.
    for (const name of ["vaulting services", "Grade10 Finance"]) {
      expect(
        canvas.queryByRole("link", { name }),
        `${name} should not be a link`,
      ).toBeNull();
      expect(canvas.getByText(new RegExp(name))).toBeVisible();
    }

    for (const date of ABOUT_PAGE.milestones.map(
      (milestone) => milestone.date,
    )) {
      expect(canvas.getByText(date)).toBeVisible();
    }
    expect(canvas.getByText("Coming soon")).toBeVisible();
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile2" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: ABOUT_PAGE.heading,
    });
    await waitFor(() => expect(heading).toBeVisible(), { timeout: 1500 });
    expect(canvas.getByRole("contentinfo")).toBeVisible();
  },
};
